"""Unit tests for the Deal Hunter domain layer.

Deterministic and offline: `find_deals` is exercised with `serp_search_api`
monkeypatched to return a canned Bright Data SERP payload, so no Bright Data
credentials or network access are needed. The live, credentialed path is
verified separately when the agent runs.
"""

import pytest

from deal_hunter import finder
from deal_hunter.finder import (
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
    assert finder._extract_price("Now $1,299.00")[0] == pytest.approx(1299.00)
    assert finder._extract_price("USD 49.99")[0] == pytest.approx(49.99)
    assert finder._extract_price("just $79")[0] == pytest.approx(79.0)
    assert finder._extract_price("no price here") == (None, None)


@pytest.mark.asyncio
async def test_find_deals_uses_serp_and_returns_ranked(monkeypatch):
    captured = {}

    async def fake_serp(query, country=None, max_results=10):
        captured["query"] = query
        captured["max_results"] = max_results
        return SAMPLE_SERP

    monkeypatch.setattr(finder, "serp_search_api", fake_serp)

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
        deals=[
            Deal(
                "Mystery Item listing",
                "https://x.example",
                "XSource",
                None,
                None,
                "no price",
            )
        ],
    )
    summary = voice_summary(result)
    assert "none showed a clear price" in summary.lower()
    assert "Mystery Item listing" in summary


# ---- Bright Data Web Unlocker price verification ----


def test_all_prices_and_price_is_on_page():
    page = "Now $147.26. Shipping $5.99. Protection plan $29.00."
    assert finder.all_prices(page) == [147.26, 5.99, 29.00]
    assert finder.price_is_on_page(147.26, page) is True
    assert finder.price_is_on_page(199.99, page) is False
    assert finder.price_is_on_page(147.26, None) is False


@pytest.mark.asyncio
async def test_verify_deal_confirms_matching_page_price(monkeypatch):
    deal = Deal(
        "XM5", "https://shop.example/xm5", "ShopExample", 147.26, "$147.26", None
    )

    async def fake_unlock(url, country=None, max_chars=16000, raw_html=False):
        return {"content": "Sony WH-1000XM5 — $147.26 today. Free shipping."}

    monkeypatch.setattr(finder, "unlock_url_api", fake_unlock)
    await finder.verify_deal(deal)
    assert deal.verified is True
    # Price is never rewritten by verification.
    assert deal.price == pytest.approx(147.26)


@pytest.mark.asyncio
async def test_verify_deal_denies_when_price_absent(monkeypatch):
    deal = Deal(
        "XM5", "https://shop.example/xm5", "ShopExample", 147.26, "$147.26", None
    )

    async def fake_unlock(url, country=None, max_chars=16000, raw_html=False):
        return {"content": "Sony WH-1000XM5 — $249.99. Add to cart."}

    monkeypatch.setattr(finder, "unlock_url_api", fake_unlock)
    await finder.verify_deal(deal)
    assert deal.verified is False
    # Still no silent correction — we only flag uncertainty.
    assert deal.price == pytest.approx(147.26)


def _ld_page(payload: str) -> str:
    return f'<html><script type="application/ld+json">{payload}</script></html>'


@pytest.mark.asyncio
async def test_structured_data_beats_the_text_heuristic(monkeypatch):
    """The page mentions 147.26 in prose, but its real offer is 249.99.

    This is the false confirm the old text-only check produced: a shipping
    threshold, a "was" price, or a related-item price is enough to "confirm"
    any number. JSON-LD is authoritative, so the claim must be denied.
    """
    deal = Deal(
        "XM5", "https://shop.example/xm5", "ShopExample", 147.26, "$147.26", None
    )

    async def fake_unlock(url, country=None, max_chars=16000, raw_html=False):
        return {
            "content": _ld_page(
                '{"@type":"Product","name":"Sony WH-1000XM5",'
                '"offers":{"@type":"Offer","price":"249.99","priceCurrency":"USD",'
                '"availability":"https://schema.org/InStock",'
                '"itemCondition":"https://schema.org/NewCondition"}}'
            )
            + "<p>Spend $147.26 more for free shipping. Was $147.26!</p>"
        }

    monkeypatch.setattr(finder, "unlock_url_api", fake_unlock)
    await finder.verify_deal(deal)

    assert deal.verified is False


@pytest.mark.asyncio
async def test_structured_verification_carries_condition_and_stock(monkeypatch):
    """A cheap price for a refurb or an out-of-stock unit is worth surfacing."""
    deal = Deal("XM5", "https://shop.example/xm5", "ShopExample", 99.0, "$99", None)

    async def fake_unlock(url, country=None, max_chars=16000, raw_html=False):
        return {
            "content": _ld_page(
                '{"@type":"Product","offers":{"@type":"Offer","price":"99.00",'
                '"availability":"https://schema.org/OutOfStock",'
                '"itemCondition":"https://schema.org/RefurbishedCondition"}}'
            )
        }

    monkeypatch.setattr(finder, "unlock_url_api", fake_unlock)
    await finder.verify_deal(deal)

    assert deal.verified is True
    assert deal.condition == "refurbished"
    assert deal.availability == "out of stock"
    assert deal.as_dict()["condition"] == "refurbished"


@pytest.mark.asyncio
async def test_text_fallback_still_runs_without_structured_data(monkeypatch):
    """Plenty of retailers ship no JSON-LD; those must not go unverified."""
    deal = Deal("XM5", "https://shop.example/xm5", "ShopExample", 147.26, None, None)

    async def fake_unlock(url, country=None, max_chars=16000, raw_html=False):
        return {"content": "<html><body>Sony WH-1000XM5 — $147.26</body></html>"}

    monkeypatch.setattr(finder, "unlock_url_api", fake_unlock)
    await finder.verify_deal(deal)

    assert deal.verified is True


@pytest.mark.asyncio
async def test_verification_requests_raw_html(monkeypatch):
    """JSON-LD lives in <script> tags that the markdown conversion strips."""
    deal = Deal("XM5", "https://shop.example/xm5", "ShopExample", 10.0, None, None)
    seen: dict = {}

    async def fake_unlock(url, country=None, max_chars=16000, raw_html=False):
        seen["raw_html"] = raw_html
        return {"content": ""}

    monkeypatch.setattr(finder, "unlock_url_api", fake_unlock)
    await finder.verify_deal(deal)

    assert seen["raw_html"] is True


@pytest.mark.asyncio
async def test_verify_deal_survives_unlocker_failure(monkeypatch):
    deal = Deal(
        "XM5", "https://shop.example/xm5", "ShopExample", 147.26, "$147.26", None
    )

    async def boom(url, country=None, max_chars=16000, raw_html=False):
        raise RuntimeError("unlocker down")

    monkeypatch.setattr(finder, "unlock_url_api", boom)
    await finder.verify_deal(deal)
    # Unchecked, not crashed.
    assert deal.verified is None


@pytest.mark.asyncio
async def test_find_deals_verifies_top_results(monkeypatch):
    async def fake_serp(query, country=None, max_results=10):
        return SAMPLE_SERP

    unlocked: list[str] = []

    async def fake_unlock(url, country=None, max_chars=16000, raw_html=False):
        unlocked.append(url)
        # Cheapest listing ($349.99) confirms; the other does not.
        return {"content": "price today $349.99"}

    monkeypatch.setattr(finder, "serp_search_api", fake_serp)
    monkeypatch.setattr(finder, "unlock_url_api", fake_unlock)

    result = await find_deals("Sony WH-1000XM5", verify_top=2)

    # Only the two cheapest priced deals get opened.
    assert len(unlocked) == 2
    assert result.deals[0].verified is True
    assert result.deals[1].verified is False
    # The unpriced review listing is never verified.
    assert result.deals[-1].verified is None


@pytest.mark.asyncio
async def test_find_deals_can_skip_verification(monkeypatch):
    async def fake_serp(query, country=None, max_results=10):
        return SAMPLE_SERP

    async def fail_unlock(url, country=None, max_chars=16000, raw_html=False):
        raise AssertionError("verification should be skipped")

    monkeypatch.setattr(finder, "serp_search_api", fake_serp)
    monkeypatch.setattr(finder, "unlock_url_api", fail_unlock)

    result = await find_deals("Sony WH-1000XM5", verify_top=0)
    assert all(d.verified is None for d in result.deals)


def test_voice_summary_mentions_confirmation():
    result = deals_from_serp("Sony WH-1000XM5", "us", SAMPLE_SERP)
    result.deals[0].verified = True
    assert "confirmed" in voice_summary(result).lower()

    result.deals[0].verified = False
    assert "couldn't confirm" in voice_summary(result).lower()


@pytest.mark.asyncio
async def test_find_deals_does_not_verify_by_default(monkeypatch):
    """The voice path must stay fast: no page opens unless asked."""

    async def fake_serp(query, country=None, max_results=10):
        return SAMPLE_SERP

    async def fail_unlock(url, country=None, max_chars=16000, raw_html=False):
        raise AssertionError("find_deals must not verify inline by default")

    monkeypatch.setattr(finder, "serp_search_api", fake_serp)
    monkeypatch.setattr(finder, "unlock_url_api", fail_unlock)
    monkeypatch.delenv("DEAL_VERIFY_TOP_N", raising=False)

    result = await find_deals("Sony WH-1000XM5")
    assert all(d.verified is None for d in result.deals)


@pytest.mark.asyncio
async def test_verify_top_deals_isolates_a_slow_page(monkeypatch):
    """One hanging retailer must not block its siblings from confirming."""
    import asyncio

    monkeypatch.setattr(finder, "VERIFY_PAGE_TIMEOUT_SECONDS", 0.05)

    async def fake_unlock(url, country=None, max_chars=16000, raw_html=False):
        if "slow" in url:
            await asyncio.sleep(5)
        return {"content": "price today $10.00"}

    monkeypatch.setattr(finder, "unlock_url_api", fake_unlock)

    slow = Deal("Slow", "https://slow.example/x", "Slow", 10.0, "$10", None)
    fast = Deal("Fast", "https://fast.example/x", "Fast", 10.0, "$10", None)
    result = DealResult(query="q", country="us", deals=[slow, fast])

    await finder.verify_top_deals(result, top_n=2, timeout=2)

    assert slow.verified is None  # timed out on its own
    assert fast.verified is True  # still confirmed
