"""Tests for the SQLite watch + price-history store.

Every test points DEAL_HUNTER_DB at a tmp file, so nothing touches the real db.
"""

from __future__ import annotations

import pytest

from deal_hunter import store
from deal_hunter.finder import Deal


@pytest.fixture(autouse=True)
def tmp_db(tmp_path, monkeypatch):
    monkeypatch.setenv("DEAL_HUNTER_DB", str(tmp_path / "test.db"))
    yield


async def test_add_and_list_watch():
    await store.add_watch("u1", "Sony WH-1000XM5", 300.0)
    watches = await store.list_watches("u1")

    assert len(watches) == 1
    assert watches[0]["product"] == "Sony WH-1000XM5"
    assert watches[0]["target_price"] == 300.0


async def test_watches_are_scoped_per_user():
    await store.add_watch("u1", "RTX 4090", None)
    await store.add_watch("u2", "AirPods Pro", None)

    assert [w["product"] for w in await store.list_watches("u1")] == ["RTX 4090"]
    assert [w["product"] for w in await store.list_watches("u2")] == ["AirPods Pro"]


async def test_rewatching_updates_target_instead_of_duplicating():
    await store.add_watch("u1", "Sony WH-1000XM5", 300.0)
    # Same product, different casing/spacing, new target.
    await store.add_watch("u1", "  sony   wh-1000xm5 ", 250.0)

    watches = await store.list_watches("u1")
    assert len(watches) == 1
    assert watches[0]["target_price"] == 250.0


async def test_remove_watch():
    await store.add_watch("u1", "RTX 4090", None)

    assert await store.remove_watch("u1", "rtx 4090") is True
    assert await store.list_watches("u1") == []
    # Removing something that isn't watched reports failure rather than raising.
    assert await store.remove_watch("u1", "RTX 4090") is False


async def test_a_long_watchlist_is_returned_in_full():
    """The failure the old Moss-backed watchlist had: silent top_k truncation."""
    for i in range(40):
        await store.add_watch("u1", f"Product {i}", float(i))

    assert len(await store.list_watches("u1")) == 40


async def test_price_stats_are_empty_without_history():
    stats = await store.price_stats("Unknown Thing")
    assert stats["count"] == 0


async def test_record_price_and_stats():
    for price in (100.0, 200.0, 150.0):
        await store.record_price("Widget", price, "shop.example", "https://x")

    stats = await store.price_stats("Widget")
    assert stats["count"] == 3
    assert stats["low"] == 100.0
    assert stats["high"] == 200.0
    assert stats["average"] == 150.0
    # Latest is the most recently observed, not the cheapest.
    assert stats["latest"] == 150.0


async def test_record_prices_logs_only_the_cheapest_deal():
    deals = [
        Deal(
            title="a", url="u1", source="s1", price=120.0, price_text=None, snippet=None
        ),
        Deal(
            title="b", url="u2", source="s2", price=90.0, price_text=None, snippet=None
        ),
        Deal(
            title="c", url=None, source=None, price=None, price_text=None, snippet=None
        ),
    ]
    await store.record_prices("Widget", deals)

    stats = await store.price_stats("Widget")
    assert stats["count"] == 1
    assert stats["latest"] == 90.0
    assert stats["latest_source"] == "s2"


async def test_record_prices_ignores_a_priceless_result_set():
    deals = [
        Deal(
            title="a", url=None, source=None, price=None, price_text=None, snippet=None
        )
    ]
    await store.record_prices("Widget", deals)

    assert (await store.price_stats("Widget"))["count"] == 0


async def test_verdict_stays_quiet_without_enough_history():
    await store.record_price("Widget", 100.0)
    await store.record_price("Widget", 110.0)

    assert store.verdict(await store.price_stats("Widget")) is None


async def test_verdict_flags_a_low_price():
    for price in (200.0, 180.0, 190.0, 100.0):
        await store.record_price("Widget", price)

    said = store.verdict(await store.price_stats("Widget"))
    assert said is not None and "as low as I have seen" in said


async def test_verdict_flags_a_high_price():
    for price in (100.0, 110.0, 105.0, 200.0):
        await store.record_price("Widget", price)

    said = store.verdict(await store.price_stats("Widget"))
    assert said is not None and "worth waiting" in said


async def test_verdict_is_plain_text_for_tts():
    """Voice output rules: no markdown, no currency symbols to mispronounce."""
    for price in (200.0, 180.0, 190.0, 100.0):
        await store.record_price("Widget", price)

    said = store.verdict(await store.price_stats("Widget"))
    assert said is not None
    assert not any(ch in said for ch in "$*#`|")
