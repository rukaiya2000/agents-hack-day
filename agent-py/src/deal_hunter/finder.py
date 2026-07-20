"""Deal Hunter — voice-first price/deal finder on Bright Data web data.

This is the domain layer for the Deal Hunter pivot. It reuses the existing
Bright Data SERP helper (`serp_search_api`) to discover live product listings
for a shopping query, extracts candidate prices from the result text, and
returns a structured, price-ranked result plus a short spoken summary.

The voice agent (`src/agent.py`) calls `find_deals` from a `@function_tool` and
speaks `voice_summary(result)`. Keeping the logic here (pure, network-stubbable)
means it can be unit-tested without LiveKit or Bright Data credentials — see
`tests/test_deal_hunter.py`.
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
from dataclasses import dataclass, field
from typing import Any

from .structured import extract_offers, price_matches_offers
from .web_research import serp_search_api, unlock_url_api

logger = logging.getLogger(__name__)

# How many of the cheapest deals to confirm against their real listing page.
DEFAULT_VERIFY_TOP_N = 2
# Per-page ceiling, so one slow retailer can't consume the whole budget.
# Generous because verification runs in the background, after the spoken reply:
# retailer pages routinely take 10s+ through the Unlocker, and a premature
# timeout just means a confirmable price silently goes unconfirmed.
VERIFY_PAGE_TIMEOUT_SECONDS = 22.0
# Overall ceiling for a batch of verifications.
VERIFY_TIMEOUT_SECONDS = 30.0


def _env_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None or not raw.strip():
        return default
    try:
        return int(raw)
    except ValueError:
        logger.warning("Invalid integer for %s=%r; using %s", name, raw, default)
        return default


# Matches money like "$1,299.00", "$79", "USD 49.99". Group 1 is the number.
_PRICE_RE = re.compile(
    r"(?:\$|USD\s?|US\$)\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)",
    re.IGNORECASE,
)


@dataclass
class Deal:
    """One candidate offer discovered for a shopping query."""

    title: str
    url: str | None
    source: str | None
    price: float | None
    price_text: str | None
    snippet: str | None
    # True once the SERP price has been confirmed on the actual listing page
    # (via Bright Data Web Unlocker). None means "not checked".
    verified: bool | None = None
    # Read from the listing's structured data during verification, when it has
    # any: "in stock"/"out of stock", "new"/"refurbished"/"used".
    availability: str | None = None
    condition: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "title": self.title,
            "url": self.url,
            "source": self.source,
            "price": self.price,
            "price_text": self.price_text,
            "snippet": self.snippet,
            "verified": self.verified,
            "availability": self.availability,
            "condition": self.condition,
        }


@dataclass
class DealResult:
    """Price-ranked deals for a query, ready for voice + UI."""

    query: str
    country: str
    deals: list[Deal] = field(default_factory=list)

    @property
    def best(self) -> Deal | None:
        return self.deals[0] if self.deals else None

    def as_dict(self) -> dict[str, Any]:
        return {
            "query": self.query,
            "country": self.country,
            "count": len(self.deals),
            "deals": [d.as_dict() for d in self.deals],
        }


def all_prices(text: str | None) -> list[float]:
    """Every money-looking value in a block of text, as floats."""
    if not text:
        return []
    values: list[float] = []
    for match in _PRICE_RE.finditer(text):
        try:
            values.append(float(match.group(1).replace(",", "")))
        except ValueError:
            continue
    return values


def price_is_on_page(
    price: float, page_text: str | None, tolerance: float = 0.01
) -> bool:
    """True when `price` actually appears on the fetched listing page."""
    return any(
        abs(candidate - price) <= tolerance for candidate in all_prices(page_text)
    )


async def verify_deal(deal: Deal, *, max_chars: int = 30000) -> Deal:
    """Confirm a deal's SERP price against the real listing page.

    Two tiers, strongest first:

    1. schema.org JSON-LD. Retailers publish the price as an exact field, so
       this is a real comparison rather than a guess.
    2. Text search, only when the page ships no structured data. This is weak —
       any page with enough prices on it will match something — so it is the
       fallback, not the default.

    We only *confirm or deny*, deliberately never rewriting the price from a
    heuristic scrape: guessing the wrong number on a page full of prices
    (shipping, accessories, "was" prices) is worse than admitting uncertainty.

    Best-effort: any failure leaves `verified` as None ("not checked").
    """
    if not deal.url or deal.price is None:
        return deal
    try:
        # Per-page timeout: a slow retailer fails on its own rather than
        # cancelling the sibling verifications running alongside it.
        page = await asyncio.wait_for(
            unlock_url_api(deal.url, max_chars=max_chars, raw_html=True),
            timeout=VERIFY_PAGE_TIMEOUT_SECONDS,
        )
    except asyncio.TimeoutError:
        logger.info("Price verification timed out for %s", deal.url)
        return deal
    except Exception:
        logger.warning("Price verification failed for %s", deal.url, exc_info=True)
        return deal

    content = page.get("content")
    offers = extract_offers(content)
    structured = price_matches_offers(deal.price, offers)
    if structured is not None:
        deal.verified = structured
        # Carry through what the page actually declares, so the agent can warn
        # about a refurb or an out-of-stock "deal" instead of just a price.
        best = next((o for o in offers if o.price == deal.price), offers[0])
        deal.availability = best.availability
        deal.condition = best.condition
        logger.info("Verified %s from structured data: %s", deal.url, deal.verified)
        return deal

    deal.verified = price_is_on_page(deal.price, content)
    return deal


async def verify_top_deals(
    result: DealResult,
    *,
    top_n: int = DEFAULT_VERIFY_TOP_N,
    timeout: float = VERIFY_TIMEOUT_SECONDS,
) -> DealResult:
    """Confirm the cheapest `top_n` priced deals against their listing pages.

    Mutates and returns `result`. Safe to run in the background after the voice
    reply has already gone out — verification is slow (seconds per page), so
    blocking a turn on it makes the agent feel broken.
    """
    candidates = [d for d in result.deals if d.price is not None and d.url][:top_n]
    if not candidates:
        return result

    try:
        await asyncio.wait_for(
            asyncio.gather(
                *(verify_deal(d) for d in candidates), return_exceptions=True
            ),
            timeout=timeout,
        )
    except asyncio.TimeoutError:
        logger.warning("Price verification batch timed out after %ss", timeout)

    logger.info(
        "Verified %d/%d candidate deals",
        sum(1 for d in candidates if d.verified is not None),
        len(candidates),
    )
    return result


def _extract_price(*texts: str | None) -> tuple[float | None, str | None]:
    """Return the first plausible (value, raw_text) price found across texts."""
    for text in texts:
        if not text:
            continue
        match = _PRICE_RE.search(text)
        if match:
            raw = match.group(0).strip()
            number = match.group(1).replace(",", "")
            try:
                return float(number), raw
            except ValueError:
                continue
    return None, None


def deals_from_serp(query: str, country: str, serp: dict[str, Any]) -> DealResult:
    """Turn a raw Bright Data SERP payload into a price-ranked DealResult.

    Pure and synchronous so it can be unit-tested with a canned SERP payload.
    Deals with a detected price sort ascending (cheapest first); priceless
    candidates keep their SERP order and trail the priced ones.
    """
    result = DealResult(query=query, country=country)
    for item in serp.get("results", []) or []:
        title = (item.get("title") or "").strip()
        if not title:
            continue
        price, price_text = _extract_price(item.get("title"), item.get("description"))
        result.deals.append(
            Deal(
                title=title,
                url=item.get("url"),
                source=item.get("source"),
                price=price,
                price_text=price_text,
                snippet=(item.get("description") or "").strip() or None,
            )
        )

    # Cheapest first; unpriced results sink to the bottom but are retained.
    result.deals.sort(
        key=lambda d: (d.price is None, d.price if d.price is not None else 0.0)
    )
    return result


async def find_deals(
    query: str,
    *,
    country: str | None = None,
    max_results: int = 8,
    verify_top: int | None = None,
) -> DealResult:
    """Search live web data for a product and return price-ranked deals.

    Args:
        query: A shopping query, e.g. "cheapest RTX 4090" or "Sony WH-1000XM5".
        country: ISO country code for pricing/locale (defaults to BRIGHT_DATA_COUNTRY).
        max_results: Max SERP results to consider.
        verify_top: How many of the cheapest deals to confirm against their real
            listing page. Defaults to DEAL_VERIFY_TOP_N (0 = off), because
            opening pages costs seconds and the voice reply should not wait.
            The agent verifies in the background instead, via `verify_top_deals`.
    """
    # Bias the query toward buyable listings with prices.
    search_query = f"{query} price buy"
    serp = await serp_search_api(search_query, country=country, max_results=max_results)
    country_used = serp.get("country", country or "us")
    result = deals_from_serp(query, country_used, serp)

    if verify_top is None:
        verify_top = _env_int("DEAL_VERIFY_TOP_N", 0)

    if verify_top > 0:
        await verify_top_deals(result, top_n=verify_top)

    logger.info(
        "Deal Hunter: query=%r found=%d priced=%d verified=%d",
        query,
        len(result.deals),
        sum(1 for d in result.deals if d.price is not None),
        sum(1 for d in result.deals if d.verified),
    )
    return result


def _spell_price(deal: Deal) -> str:
    """Human/voice-friendly price phrase for a deal."""
    if deal.price is not None:
        # Whole dollars read cleaner in TTS than trailing .00
        if deal.price == int(deal.price):
            return f"{int(deal.price)} dollars"
        return f"{deal.price:.2f} dollars"
    if deal.price_text:
        return deal.price_text
    return "price not listed"


def voice_summary(result: DealResult, top_n: int = 3) -> str:
    """A short, TTS-friendly spoken summary of the best deals.

    Plain sentences only (no markdown/symbols) per the agent's voice rules.
    """
    if not result.deals:
        return (
            f"I couldn't find any current listings for {result.query}. "
            "Want me to try a different search?"
        )

    priced = [d for d in result.deals if d.price is not None]
    if not priced:
        first = result.deals[0]
        source = f" at {first.source}" if first.source else ""
        return (
            f"I found listings for {result.query}, but none showed a clear price. "
            f"The top result is {first.title}{source}. "
            "Want me to open one and read the details?"
        )

    best = priced[0]
    best_source = f" at {best.source}" if best.source else ""
    # Only claim confirmation when we actually opened the listing page.
    confirmation = ""
    if best.verified is True:
        confirmation = " I confirmed that on the listing page."
    elif best.verified is False:
        confirmation = " I couldn't confirm that on the page, so double-check it."
    lines = [
        f"The best price I found for {result.query} is "
        f"{_spell_price(best)}{best_source}.{confirmation}"
    ]
    others = priced[1:top_n]
    if others:
        extra = "; ".join(
            f"{_spell_price(d)}" + (f" at {d.source}" if d.source else "")
            for d in others
        )
        lines.append(f"Other options: {extra}.")
    lines.append("Want me to watch this and tell you if the price drops?")
    return " ".join(lines)
