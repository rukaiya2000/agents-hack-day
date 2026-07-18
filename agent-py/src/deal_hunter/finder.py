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

import logging
import re
from dataclasses import dataclass, field
from typing import Any

from .web_research import serp_search_api

logger = logging.getLogger(__name__)

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

    def as_dict(self) -> dict[str, Any]:
        return {
            "title": self.title,
            "url": self.url,
            "source": self.source,
            "price": self.price,
            "price_text": self.price_text,
            "snippet": self.snippet,
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
        price, price_text = _extract_price(
            item.get("title"), item.get("description")
        )
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
    result.deals.sort(key=lambda d: (d.price is None, d.price if d.price is not None else 0.0))
    return result


async def find_deals(
    query: str,
    *,
    country: str | None = None,
    max_results: int = 8,
) -> DealResult:
    """Search live web data for a product and return price-ranked deals.

    Args:
        query: A shopping query, e.g. "cheapest RTX 4090" or "Sony WH-1000XM5".
        country: ISO country code for pricing/locale (defaults to BRIGHT_DATA_COUNTRY).
        max_results: Max SERP results to consider.
    """
    # Bias the query toward buyable listings with prices.
    search_query = f"{query} price buy"
    serp = await serp_search_api(
        search_query, country=country, max_results=max_results
    )
    country_used = serp.get("country", country or "us")
    result = deals_from_serp(query, country_used, serp)
    logger.info(
        "Deal Hunter: query=%r found=%d priced=%d",
        query,
        len(result.deals),
        sum(1 for d in result.deals if d.price is not None),
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
    lines = [
        f"The best price I found for {result.query} is {_spell_price(best)}{best_source}."
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
