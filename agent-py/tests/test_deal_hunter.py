"""Unit tests for the Deal Hunter domain layer.

Deterministic and offline: `find_deals` is exercised with `serp_search_api`
monkeypatched to return a canned Bright Data SERP payload, so no Bright Data
credentials or network access are needed. The live, credentialed path is
verified separately when the agent runs.
"""

import pytest

from kol_copilot import deal_hunter
from kol_copilot.deal_hunter import (
    Deal,
    DealResult,
    deals_from_serp,
    find_deals,
    voice_summary,
)

SAMPLE_SERP = {
    "query": "cheapest sony wh-1000xm5 price buy",
    "country": "us",
    "results": [
        {
            "title": "Sony WH-1000XM5 Headphones - $398.00",
            "url": "https://shop.example.com/xm5",
            "source": "ShopExample",
            "description": "In stock. Free shipping. Was $429.",
            "rank": 1,
        },
        {
            "title": "Sony WH-1000XM5 Wireless",
            "url": "https://deals.example.com/xm5",
            "source": "DealsExample",
            "description": "Lowest price today: $349.99 with coupon.",
            "rank": 2,
        },
        {
            "title": "Sony WH-1000XM5 Review",
            "url": "https://blog.example.com/review",
            "source": "BlogExample",
            "description": "Our hands-on review of Sony's flagship headphones.",
            "rank": 3,
        },
    ],
}


def test_deals_from_serp_extracts_and_ranks_by_price():
    result = deals_from_serp("Sony WH-1000XM5", "us", SAMPLE_SERP)
    assert isinstance(result, DealResult)
    # Three candidates; two carry a price, one (the review) does not.
    assert len(result.deals) == 3
    priced = [d for d in result.deals if d.price is not None]
    assert len(priced) == 2
    # Cheapest first.
    assert result.best is not None
    assert result.best.price == pytest.approx(349.99)
    assert result.deals[0].source == "DealsExample"
    assert result.deals[1].price == pytest.approx(398.00)
    # The priceless review sinks to the bottom but is retained.
    assert result.deals[-1].price is None
    assert "Review" in result.deals[-1].title


def test_extract_price_handles_formats():
    assert deal_hunter._extract_price("Now $1,299.00")[0] == pytest.approx(1299.00)
    assert deal_hunter._extract_price("USD 49.99")[0] == pytest.approx(49.99)
    assert deal_hunter._extract_price("just $79")[0] == pytest.approx(79.0)
    assert deal_hunter._extract_price("no price here") == (None, None)


@pytest.mark.asyncio
async def test_find_deals_uses_serp_and_returns_ranked(monkeypatch):
    captured = {}

    async def fake_serp(query, country=None, max_results=10):
        captured["query"] = query
        captured["max_results"] = max_results
        return SAMPLE_SERP

    monkeypatch.setattr(deal_hunter, "serp_search_api", fake_serp)

    result = await find_deals("Sony WH-1000XM5", max_results=8)

    # Query is biased toward buyable listings.
    assert "Sony WH-1000XM5" in captured["query"]
    assert "price" in captured["query"].lower()
    assert captured["max_results"] == 8
    # Ranked cheapest-first.
    assert result.best.price == pytest.approx(349.99)


def test_voice_summary_speaks_best_price_plainly():
    result = deals_from_serp("Sony WH-1000XM5", "us", SAMPLE_SERP)
    summary = voice_summary(result)
    # Cheapest price is spoken, no markdown/symbols in the number phrasing.
    assert "349.99 dollars" in summary
    assert "$" not in summary
    assert "watch this" in summary.lower()


def test_voice_summary_handles_no_results():
    empty = DealResult(query="unobtanium gadget", country="us", deals=[])
    summary = voice_summary(empty)
    assert "couldn't find" in summary.lower()
    assert "unobtanium gadget" in summary


def test_voice_summary_handles_priceless_results():
    result = DealResult(
        query="mystery item",
        country="us",
        deals=[Deal("Mystery Item listing", "https://x.example", "XSource", None, None, "no price")],
    )
    summary = voice_summary(result)
    assert "none showed a clear price" in summary.lower()
    assert "Mystery Item listing" in summary
