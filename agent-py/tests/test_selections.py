"""Tests for the click-feedback loop: selections -> preference profile -> ranking.

The agent publishes a ranked list, the user clicks one, and that click is the
only signal in the system about which listing a shopper actually *wanted* as
opposed to which was merely cheapest. These tests pin the three stages:

1. the click is recorded with enough context to be interpretable later
   (which rank it sat at, and what the cheapest option was at the time),
2. a profile is only derived once there is enough evidence to be honest, and
3. preferences annotate the ranking without ever reordering it — `voice_summary`
   claims "the best price I found", so cheapest-first must stay literally true.
"""

from __future__ import annotations

from deal_hunter import store
from deal_hunter.finder import Deal, DealResult, annotate_preferences, voice_summary


def _deal(title: str, source: str | None, price: float | None) -> Deal:
    return Deal(
        title=title,
        url=f"https://{(source or 'x').lower().replace(' ', '')}.example/{title}",
        source=source,
        price=price,
        price_text=None,
        snippet=None,
    )


def _result(*deals: Deal) -> DealResult:
    return DealResult(query="Sony WH-1000XM5", country="us", deals=list(deals))


async def _record_bestbuy_habit(user_id: str = "u1", times: int = 3) -> None:
    """A user who repeatedly passes over the cheapest listing for Best Buy.

    Records a real URL alongside the display name: trust is decided on the
    listing's domain, never on the label, so a selection with no URL can never
    become a preference. See tests/test_trust.py.
    """
    for _ in range(times):
        await store.record_selection(
            user_id,
            product="Sony WH-1000XM5",
            title="Sony WH-1000XM5 at Best Buy",
            source="Best Buy",
            url="https://www.bestbuy.com/site/xm5",
            price=149.0,
            rank_shown=2,
            cheapest_price=121.0,
        )


# --- recording --------------------------------------------------------------


async def test_record_selection_captures_rank_and_cheapest():
    await store.record_selection(
        "u1",
        product="Sony WH-1000XM5",
        title="Sony WH-1000XM5 at Best Buy",
        source="Best Buy",
        url="https://www.bestbuy.com/site/xm5",
        price=149.0,
        rank_shown=2,
        cheapest_price=121.0,
    )

    rows = await store.list_selections("u1")
    assert len(rows) == 1
    assert rows[0]["source"] == "Best Buy"
    assert rows[0]["rank_shown"] == 2
    # Without the cheapest-at-the-time price, "paid a premium" is uncomputable.
    assert rows[0]["cheapest_price"] == 121.0
    # The label is kept for speech, but the domain is what gets trust-checked.
    assert rows[0]["domain"] == "bestbuy.com"


async def test_selections_are_scoped_per_user():
    await store.record_selection(
        "u1", product="A", title="A", source="Best Buy", price=1.0, rank_shown=0
    )
    await store.record_selection(
        "u2", product="B", title="B", source="eBay", price=2.0, rank_shown=0
    )

    assert [r["source"] for r in await store.list_selections("u1")] == ["Best Buy"]
    assert [r["source"] for r in await store.list_selections("u2")] == ["eBay"]


# --- profile ----------------------------------------------------------------


async def test_profile_withholds_judgement_without_enough_clicks():
    """Mirrors `verdict()`: stay quiet rather than invent a preference from n=1."""
    await store.record_selection(
        "u1", product="A", title="A", source="Best Buy", price=1.0, rank_shown=0
    )

    profile = await store.preference_profile("u1")
    assert profile["count"] == 1
    assert profile["confident"] is False
    assert profile["preferred_sources"] == []


async def test_profile_learns_a_preferred_source():
    await _record_bestbuy_habit()

    profile = await store.preference_profile("u1")
    assert profile["confident"] is True
    assert profile["preferred_sources"] == ["Best Buy"]


async def test_profile_detects_that_the_user_skips_the_cheapest():
    await _record_bestbuy_habit()

    profile = await store.preference_profile("u1")
    assert profile["skips_cheapest"] is True
    # 149 vs a 121 cheapest — the premium they consistently accept.
    assert profile["avg_premium"] == 28.0


async def test_profile_of_a_cheapest_first_shopper_reports_no_skipping():
    for _ in range(3):
        await store.record_selection(
            "u1",
            product="Widget",
            title="Widget",
            source="Cheap Shop",
            price=90.0,
            rank_shown=0,
            cheapest_price=90.0,
        )

    profile = await store.preference_profile("u1")
    assert profile["skips_cheapest"] is False
    assert profile["avg_premium"] == 0.0


async def test_a_one_off_source_does_not_become_a_preference():
    """Three clicks at three different stores is not a pattern."""
    for source, url in (
        ("Best Buy", "https://bestbuy.com/a"),
        ("eBay", "https://ebay.com/a"),
        ("Walmart", "https://walmart.com/a"),
    ):
        await store.record_selection(
            "u1",
            product="A",
            title="A",
            source=source,
            url=url,
            price=10.0,
            rank_shown=0,
        )

    profile = await store.preference_profile("u1")
    assert profile["confident"] is True
    assert profile["preferred_sources"] == []


# --- ranking ----------------------------------------------------------------


async def test_annotation_flags_preferred_listings():
    await _record_bestbuy_habit()
    profile = await store.preference_profile("u1")

    result = _result(
        _deal("cheap one", "eBay", 121.0),
        _deal("the usual", "Best Buy", 149.0),
    )
    annotate_preferences(result, profile)

    assert [d.preferred for d in result.deals] == [False, True]


async def test_annotation_never_reorders_the_ranking():
    """`voice_summary` says "the best price I found" — that must stay true."""
    await _record_bestbuy_habit()
    profile = await store.preference_profile("u1")

    result = _result(
        _deal("cheap one", "eBay", 121.0),
        _deal("the usual", "Best Buy", 149.0),
    )
    annotate_preferences(result, profile)

    assert [d.price for d in result.deals] == [121.0, 149.0]


async def test_annotation_is_a_no_op_without_a_confident_profile():
    profile = await store.preference_profile("u1")

    result = _result(_deal("a", "Best Buy", 10.0))
    annotate_preferences(result, profile)

    assert result.deals[0].preferred is False


async def test_voice_summary_mentions_the_preferred_store_as_an_extra():
    await _record_bestbuy_habit()
    profile = await store.preference_profile("u1")

    result = _result(
        _deal("cheap one", "eBay", 121.0),
        _deal("the usual", "Best Buy", 149.0),
    )
    annotate_preferences(result, profile)
    said = voice_summary(result)

    # Still leads with the genuine cheapest...
    assert "121 dollars" in said
    assert said.index("121") < said.index("Best Buy")
    # ...and surfaces the learned preference as a secondary note.
    assert "Best Buy" in said
    assert "usually" in said


async def test_voice_summary_stays_silent_when_the_cheapest_is_already_preferred():
    """Nothing learned to report if their store already won on price."""
    await _record_bestbuy_habit()
    profile = await store.preference_profile("u1")

    result = _result(
        _deal("the usual", "Best Buy", 121.0),
        _deal("other", "eBay", 149.0),
    )
    annotate_preferences(result, profile)
    said = voice_summary(result)

    assert "usually" not in said


async def test_voice_summary_preference_line_is_tts_safe():
    await _record_bestbuy_habit()
    profile = await store.preference_profile("u1")

    result = _result(
        _deal("cheap one", "eBay", 121.0),
        _deal("the usual", "Best Buy", 149.0),
    )
    annotate_preferences(result, profile)
    said = voice_summary(result)

    assert not any(ch in said for ch in "$*#`|")


# --- the agent's click handler ----------------------------------------------


class _FakeRpc:
    """Stands in for LiveKit's RPC invocation object, which carries `.payload`."""

    def __init__(self, payload: str) -> None:
        self.payload = payload


async def _assistant_with_result():
    """An Assistant that has just published a ranked result, as after a search."""
    import json

    from agent import Assistant

    assistant = Assistant(user_id="u1")
    assistant._last_result = _result(
        _deal("cheap one", "eBay", 121.0),
        _deal("the usual", "Best Buy", 149.0),
    )
    return assistant, json


async def test_clicking_a_listing_is_persisted_with_its_rank():
    assistant, json = await _assistant_with_result()

    await assistant._on_deal_selected(
        _FakeRpc(
            json.dumps({"title": "the usual", "source": "Best Buy", "price": 149.0})
        )
    )

    rows = await store.list_selections("u1")
    assert len(rows) == 1
    # Rank and cheapest come from the published result, not the click payload —
    # the browser never sends them.
    assert rows[0]["rank_shown"] == 1
    assert rows[0]["cheapest_price"] == 121.0


async def test_clearing_a_selection_records_nothing():
    assistant, json = await _assistant_with_result()

    await assistant._on_deal_selected(_FakeRpc(json.dumps({"cleared": True})))

    assert await store.list_selections("u1") == []


async def test_a_click_still_resolves_pronouns_after_being_recorded():
    """Persistence is additive: the original in-session behavior must survive."""
    assistant, json = await _assistant_with_result()

    await assistant._on_deal_selected(
        _FakeRpc(
            json.dumps({"title": "the usual", "source": "Best Buy", "price": 149.0})
        )
    )

    note = assistant._selection_note()
    assert note is not None and "the usual" in note


async def test_a_click_without_a_prior_search_is_still_recorded():
    """The user can click a card from an earlier turn; rank is simply unknown."""
    import json

    from agent import Assistant

    assistant = Assistant(user_id="u1")
    await assistant._on_deal_selected(
        _FakeRpc(json.dumps({"title": "something", "source": "eBay", "price": 10.0}))
    )

    rows = await store.list_selections("u1")
    assert len(rows) == 1
    assert rows[0]["rank_shown"] is None
