"""Tests for retailer trust assessment.

Cheapest-first ranking over open web results has an adversarial-selection
problem: a fraudulent storefront lists an implausible price *precisely so that
it sorts first*, so the naive ranking actively promotes the worst listings. The
agent then reads the domain aloud as though it were a real shop.

These tests pin the defence: classify the domain, cross it with the price
outlier signal already in `shopping.py`, and make the voice summary refuse to
present a high-risk listing as "the best price I found".
"""

from __future__ import annotations

from deal_hunter import store, trust
from deal_hunter.finder import Deal, DealResult, assess_deals, voice_summary


def _deal(url: str | None, price: float | None, *, title: str = "Sony WH-1000XM5"):
    source = None
    if url:
        source = url.split("//")[-1].split("/")[0]
    return Deal(
        title=title,
        url=url,
        source=source,
        price=price,
        price_text=None,
        snippet=None,
    )


def _pack(*deals: Deal) -> DealResult:
    return DealResult(query="Sony WH-1000XM5", country="us", deals=list(deals))


# --- domain classification --------------------------------------------------


def test_known_retailers_are_trusted():
    assert trust.tier("bestbuy.com") == "trusted"
    assert trust.tier("www.walmart.com") == "trusted"


def test_marketplaces_are_their_own_tier():
    """Real sites, but the seller behind a listing is not vetted."""
    assert trust.tier("ebay.com") == "marketplace"
    assert trust.tier("aliexpress.com") == "marketplace"


def test_unknown_domains_are_unknown_not_trusted():
    assert trust.tier("deals4u-electronics.shop") == "unknown"


def test_lookalike_domains_are_detected():
    """Impersonating a real retailer is the strongest single scam signal."""
    assert trust.lookalike_of("bestbuy-outlet.shop") == "bestbuy.com"
    assert trust.lookalike_of("www-walmart-deals.online") == "walmart.com"


def test_the_real_retailer_is_not_flagged_as_its_own_lookalike():
    assert trust.lookalike_of("bestbuy.com") is None
    assert trust.lookalike_of("www.bestbuy.com") is None


def test_a_subdomain_of_a_trusted_retailer_stays_trusted():
    assert trust.tier("shop.bestbuy.com") == "trusted"


# --- risk assessment --------------------------------------------------------


def test_a_trusted_retailer_on_a_deep_discount_is_not_flagged():
    """Real stores run real sales; a low price alone is not a fraud signal."""
    cheap = _deal("https://bestbuy.com/xm5", 120.0)
    others = [
        _deal("https://walmart.com/xm5", 300.0),
        _deal("https://target.com", 310.0),
    ]

    assert trust.assess(cheap, others).level == "ok"


def test_an_unknown_domain_at_a_plausible_price_is_only_a_caution():
    """Small legitimate retailers exist; unknown is not the same as fraudulent."""
    deal = _deal("https://hifi-corner.co.uk/xm5", 290.0)
    others = [
        _deal("https://walmart.com/xm5", 300.0),
        _deal("https://target.com", 310.0),
    ]

    assert trust.assess(deal, others).level == "caution"


def test_an_unknown_domain_at_an_implausible_price_is_high_risk():
    """The actual scam shape: a site nobody knows, undercutting everyone."""
    deal = _deal("https://deals4u-electronics.shop/xm5", 49.0)
    others = [
        _deal("https://walmart.com/xm5", 300.0),
        _deal("https://target.com", 310.0),
    ]

    assessment = trust.assess(deal, others)
    assert assessment.level == "high"
    assert any("recognize" in r for r in assessment.reasons)


def test_a_lookalike_domain_is_high_risk_even_at_a_normal_price():
    deal = _deal("https://bestbuy-outlet.shop/xm5", 299.0)
    others = [
        _deal("https://walmart.com/xm5", 300.0),
        _deal("https://target.com", 310.0),
    ]

    assessment = trust.assess(deal, others)
    assert assessment.level == "high"
    assert any("bestbuy.com" in r for r in assessment.reasons)


def test_a_deal_with_no_url_cannot_be_vouched_for():
    assert trust.assess(_deal(None, 49.0), []).level != "ok"


# --- integration with the ranking -------------------------------------------


def test_assess_deals_annotates_every_listing():
    result = _pack(
        _deal("https://deals4u-electronics.shop/xm5", 49.0),
        _deal("https://bestbuy.com/xm5", 299.0),
        _deal("https://walmart.com/xm5", 310.0),
    )
    assess_deals(result)

    assert result.deals[0].risk == "high"
    assert result.deals[1].risk == "ok"


def test_assessment_does_not_drop_listings():
    """Warn, never silently hide: a suppressed result is its own dishonesty."""
    result = _pack(
        _deal("https://deals4u-electronics.shop/xm5", 49.0),
        _deal("https://bestbuy.com/xm5", 299.0),
        _deal("https://walmart.com/xm5", 310.0),
    )
    assess_deals(result)

    assert len(result.deals) == 3


def test_voice_summary_headlines_the_trustworthy_price_not_the_bait():
    result = _pack(
        _deal("https://deals4u-electronics.shop/xm5", 49.0),
        _deal("https://bestbuy.com/xm5", 299.0),
        _deal("https://walmart.com/xm5", 310.0),
    )
    assess_deals(result)
    said = voice_summary(result)

    # The 49 is mentioned first, but explicitly as something to skip — the
    # price presented as the recommendation is the trustworthy one.
    assert "would skip it" in said
    assert "best price I trust is 299 dollars" in said
    assert "best price I found" not in said


def test_voice_summary_still_discloses_the_cheap_listing_with_a_warning():
    result = _pack(
        _deal("https://deals4u-electronics.shop/xm5", 49.0),
        _deal("https://bestbuy.com/xm5", 299.0),
        _deal("https://walmart.com/xm5", 310.0),
    )
    assess_deals(result)
    said = voice_summary(result)

    assert "49" in said
    assert "don't recognize" in said or "do not recognize" in said


def test_voice_summary_is_unchanged_when_everything_is_trustworthy():
    result = _pack(
        _deal("https://bestbuy.com/xm5", 120.0),
        _deal("https://walmart.com/xm5", 300.0),
    )
    assess_deals(result)
    said = voice_summary(result)

    assert "120 dollars" in said
    assert "recognize" not in said


def test_voice_summary_warning_is_tts_safe():
    result = _pack(
        _deal("https://deals4u-electronics.shop/xm5", 49.0),
        _deal("https://bestbuy.com/xm5", 299.0),
        _deal("https://walmart.com/xm5", 310.0),
    )
    assess_deals(result)
    said = voice_summary(result)

    assert not any(ch in said for ch in "$*#`|")


def test_every_listing_being_untrusted_still_yields_an_answer():
    """Degrade to a caveat, not to silence — the user still asked a question."""
    result = _pack(
        _deal("https://shop-a.example/xm5", 100.0),
        _deal("https://shop-b.example/xm5", 110.0),
    )
    assess_deals(result)
    said = voice_summary(result)

    assert "100 dollars" in said


# --- the learning loop must not launder an untrusted domain -----------------


async def test_an_untrusted_domain_never_becomes_a_preferred_source():
    """Otherwise the agent ends up vouching for a scam site it never vetted."""
    for _ in range(4):
        await store.record_selection(
            "u1",
            product="Sony WH-1000XM5",
            title="Sony WH-1000XM5",
            source="deals4u-electronics.shop",
            price=49.0,
            rank_shown=0,
            cheapest_price=49.0,
        )

    profile = await store.preference_profile("u1")
    assert profile["preferred_sources"] == []


async def test_a_trusted_domain_still_becomes_a_preferred_source():
    for _ in range(4):
        await store.record_selection(
            "u1",
            product="Sony WH-1000XM5",
            title="Sony WH-1000XM5",
            source="bestbuy.com",
            price=149.0,
            rank_shown=2,
            cheapest_price=121.0,
        )

    profile = await store.preference_profile("u1")
    assert profile["preferred_sources"] == ["bestbuy.com"]
