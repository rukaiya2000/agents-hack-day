"""Read prices out of a listing page's schema.org markup.

Price verification used to ask "does this number appear anywhere in 8000
characters of page text?" On a retail page carrying shipping, tax, bundles,
financing, and "compare at" prices, that question answers yes almost always —
so a confirmed badge meant very little, and the agent would say "I confirmed
that on the listing page" about a number it had not really confirmed.

Most retailers publish a JSON-LD `Product`/`Offer` block: the price, currency,
availability, and condition as exact fields. Reading those turns verification
into an actual comparison. It is also the safe path for anything that feeds the
LLM later — typed fields, not attacker-controlled prose from the page.

Stdlib only: a dependency-free regex + json walk beats adding an HTML parser
for the handful of fields we need.
"""

from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass
from typing import Any

logger = logging.getLogger(__name__)

# JSON-LD lives in <script type="application/ld+json"> blocks.
_LD_JSON_RE = re.compile(
    r"<script[^>]*type\s*=\s*[\"']application/ld\+json[\"'][^>]*>(.*?)</script>",
    re.IGNORECASE | re.DOTALL,
)

_OFFER_TYPES = {"offer", "aggregateoffer"}
_PRODUCT_TYPES = {"product", "productmodel", "individualproduct"}

# schema.org availability values, normalized to a plain word for TTS.
_AVAILABILITY = {
    "instock": "in stock",
    "outofstock": "out of stock",
    "preorder": "pre-order",
    "backorder": "on backorder",
    "discontinued": "discontinued",
    "limitedavailability": "limited availability",
    "soldout": "sold out",
}

_CONDITION = {
    "newcondition": "new",
    "usedcondition": "used",
    "refurbishedcondition": "refurbished",
    "damagedcondition": "damaged",
}


@dataclass
class Offer:
    """One offer read from a page's structured data."""

    price: float | None
    currency: str | None = None
    availability: str | None = None
    condition: str | None = None
    product_name: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "price": self.price,
            "currency": self.currency,
            "availability": self.availability,
            "condition": self.condition,
            "product_name": self.product_name,
        }


def _to_float(value: Any) -> float | None:
    """schema.org prices arrive as numbers or strings like "1,299.00" / "$79"."""
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)
    if not isinstance(value, str):
        return None
    cleaned = re.sub(r"[^\d.]", "", value.replace(",", ""))
    if not cleaned or cleaned.count(".") > 1:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None


def _normalize_enum(value: Any, table: dict[str, str]) -> str | None:
    """Map "https://schema.org/InStock" or "InStock" onto a plain word."""
    if not isinstance(value, str):
        return None
    tail = value.rstrip("/").rsplit("/", 1)[-1].rsplit("#", 1)[-1]
    return table.get(tail.casefold())


def _types_of(node: dict) -> set[str]:
    raw = node.get("@type")
    values = raw if isinstance(raw, list) else [raw]
    return {v.casefold() for v in values if isinstance(v, str)}


def _walk(node: Any):
    """Yield every dict in an arbitrarily nested JSON-LD document."""
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from _walk(value)
    elif isinstance(node, list):
        for item in node:
            yield from _walk(item)


def _offer_from_node(node: dict, product_name: str | None) -> Offer | None:
    price = _to_float(node.get("price"))
    if price is None:
        # AggregateOffer carries a range instead of a single price; the low end
        # is the one a shopper is being quoted.
        price = _to_float(node.get("lowPrice"))
    if price is None:
        spec = node.get("priceSpecification")
        for candidate in _walk(spec):
            price = _to_float(candidate.get("price"))
            if price is not None:
                break
    if price is None:
        return None

    return Offer(
        price=price,
        currency=node.get("priceCurrency") or node.get("currency"),
        availability=_normalize_enum(node.get("availability"), _AVAILABILITY),
        condition=_normalize_enum(node.get("itemCondition"), _CONDITION),
        product_name=product_name,
    )


def extract_offers(html: str | None) -> list[Offer]:
    """Every offer declared in the page's JSON-LD, in document order.

    Malformed blocks are skipped rather than raising — retailer markup is
    frequently invalid, and one bad block must not lose the good ones.
    """
    if not html:
        return []

    offers: list[Offer] = []
    for raw in _LD_JSON_RE.findall(html):
        try:
            document = json.loads(raw.strip())
        except (json.JSONDecodeError, ValueError):
            logger.debug("Skipping malformed JSON-LD block")
            continue

        for node in _walk(document):
            if not isinstance(node, dict):
                continue
            types = _types_of(node)

            if types & _PRODUCT_TYPES:
                name = node.get("name") if isinstance(node.get("name"), str) else None
                # Only the direct children of `offers` are offers. Recursing
                # would also pick up each offer's own priceSpecification and
                # count the same price twice.
                raw = node.get("offers")
                candidates = raw if isinstance(raw, list) else [raw]
                for candidate in candidates:
                    if not isinstance(candidate, dict):
                        continue
                    if not (
                        _types_of(candidate) & _OFFER_TYPES
                        or "price" in candidate
                        or "lowPrice" in candidate
                    ):
                        continue
                    offer = _offer_from_node(candidate, name)
                    if offer:
                        offers.append(offer)
            elif types & _OFFER_TYPES:
                offer = _offer_from_node(node, None)
                if offer:
                    offers.append(offer)

    # The same offer often appears in several blocks; keep first occurrences.
    seen: set[tuple] = set()
    unique: list[Offer] = []
    for offer in offers:
        key = (offer.price, offer.currency, offer.condition)
        if key in seen:
            continue
        seen.add(key)
        unique.append(offer)
    return unique


def price_matches_offers(
    price: float, offers: list[Offer], tolerance: float = 0.01
) -> bool | None:
    """Whether `price` is one of the page's declared offer prices.

    Returns None when the page declares no offers at all — "no structured data"
    is not the same as "the price is wrong", and the caller should fall back
    rather than report a failed verification.
    """
    if not offers:
        return None
    return any(
        offer.price is not None and abs(offer.price - price) <= tolerance
        for offer in offers
    )
