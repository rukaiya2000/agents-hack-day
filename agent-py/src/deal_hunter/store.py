"""Durable structured storage for watches and observed prices.

Watches and price history are *exact-recall* data: "what am I watching" and
"what did this cost last Tuesday" have single correct answers. They previously
lived in the Moss memory index, retrieved with a semantic query capped at
`top_k` — which silently drops watches once a user accumulates enough memory
docs, and offers nowhere to put a time series. Moss stays the home for fuzzy
preference recall ("what brands do I like"); this module owns the facts.

SQLite because it needs no infrastructure and the access pattern is a handful
of rows per user. The synchronous core is wrapped in `asyncio.to_thread` so the
voice loop never blocks on disk.
"""

from __future__ import annotations

import asyncio
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

DEFAULT_DB_PATH = Path(__file__).resolve().parents[2] / "data" / "deal_hunter.db"

_SCHEMA = """
CREATE TABLE IF NOT EXISTS watches (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      TEXT NOT NULL,
    product      TEXT NOT NULL,
    product_key  TEXT NOT NULL,
    target_price REAL,
    created_at   TEXT NOT NULL,
    UNIQUE (user_id, product_key)
);

CREATE TABLE IF NOT EXISTS price_observations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    product_key TEXT NOT NULL,
    product     TEXT NOT NULL,
    price       REAL NOT NULL,
    source      TEXT,
    url         TEXT,
    observed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_obs_product_time
    ON price_observations (product_key, observed_at);
"""


def product_key(product: str) -> str:
    """Normalized key so "Sony WH-1000XM5" and "sony wh-1000xm5 " match."""
    return " ".join(product.split()).casefold()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def db_path() -> Path:
    """Where the database lives. `DEAL_HUNTER_DB` overrides (tests use tmp)."""
    raw = os.getenv("DEAL_HUNTER_DB")
    return Path(raw) if raw else DEFAULT_DB_PATH


@contextmanager
def _connect():
    path = db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    try:
        conn.executescript(_SCHEMA)
        yield conn
        conn.commit()
    finally:
        conn.close()


# --- watches ---------------------------------------------------------------


def _add_watch_sync(user_id: str, product: str, target_price: float | None) -> None:
    """Upsert, so re-watching a product updates the target instead of duplicating.

    The stored `product` text is deliberately left alone on conflict: STT
    casing varies between turns ("Sony WH-1000XM5" then "sony wh-1000xm5"), and
    letting the newest transcription win makes the on-screen list flicker
    between spellings of the same item.
    """
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO watches (user_id, product, product_key, target_price, created_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (user_id, product_key) DO UPDATE SET
                target_price = excluded.target_price
            """,
            (user_id, product.strip(), product_key(product), target_price, _now()),
        )


def _remove_watch_sync(user_id: str, product: str) -> bool:
    with _connect() as conn:
        cur = conn.execute(
            "DELETE FROM watches WHERE user_id = ? AND product_key = ?",
            (user_id, product_key(product)),
        )
        return cur.rowcount > 0


def _list_watches_sync(user_id: str) -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute(
            """
            SELECT product, target_price, created_at
            FROM watches WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,),
        ).fetchall()
    return [
        {
            "product": row["product"],
            "target_price": row["target_price"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


async def add_watch(
    user_id: str, product: str, target_price: float | None = None
) -> None:
    await asyncio.to_thread(_add_watch_sync, user_id, product, target_price)


async def remove_watch(user_id: str, product: str) -> bool:
    return await asyncio.to_thread(_remove_watch_sync, user_id, product)


async def list_watches(user_id: str) -> list[dict[str, Any]]:
    return await asyncio.to_thread(_list_watches_sync, user_id)


# --- price history ---------------------------------------------------------


def _record_price_sync(
    product: str, price: float, source: str | None, url: str | None
) -> None:
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO price_observations
                (product_key, product, price, source, url, observed_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (product_key(product), product.strip(), price, source, url, _now()),
        )


def _price_stats_sync(product: str, days: int) -> dict[str, Any]:
    """Summary stats over the observation window, newest observation included."""
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    with _connect() as conn:
        row = conn.execute(
            """
            SELECT COUNT(*) AS n, MIN(price) AS low, MAX(price) AS high,
                   AVG(price) AS avg
            FROM price_observations
            WHERE product_key = ? AND observed_at >= ?
            """,
            (product_key(product), since),
        ).fetchone()
        latest = conn.execute(
            """
            SELECT price, source, url, observed_at
            FROM price_observations
            WHERE product_key = ? AND observed_at >= ?
            ORDER BY observed_at DESC, id DESC LIMIT 1
            """,
            (product_key(product), since),
        ).fetchone()

    count = row["n"] if row else 0
    if not count:
        return {"product": product, "count": 0, "days": days}

    return {
        "product": product,
        "count": count,
        "days": days,
        "low": row["low"],
        "high": row["high"],
        "average": round(row["avg"], 2) if row["avg"] is not None else None,
        "latest": latest["price"] if latest else None,
        "latest_source": latest["source"] if latest else None,
        "latest_at": latest["observed_at"] if latest else None,
    }


async def record_price(
    product: str, price: float, source: str | None = None, url: str | None = None
) -> None:
    await asyncio.to_thread(_record_price_sync, product, price, source, url)


async def record_prices(product: str, deals: list[Any]) -> None:
    """Log every priced deal from a search as one observation batch."""
    priced = [d for d in deals if getattr(d, "price", None) is not None]
    if not priced:
        return
    # The cheapest is the number a shopper would actually pay, so that's the
    # series we track. Storing all of them would make "low" reflect whichever
    # junk listing was cheapest, not the real market price.
    best = min(priced, key=lambda d: d.price)
    await record_price(product, best.price, best.source, best.url)


async def price_stats(product: str, days: int = 90) -> dict[str, Any]:
    return await asyncio.to_thread(_price_stats_sync, product, days)


def verdict(stats: dict[str, Any]) -> str | None:
    """Turn stats into the judgement a shopper actually wants: buy now or wait?

    Returns None when there's too little history to say anything honest — the
    agent should stay quiet rather than manufacture confidence from two points.
    """
    if stats.get("count", 0) < 3 or stats.get("latest") is None:
        return None

    latest = stats["latest"]
    low = stats["low"]
    high = stats["high"]
    average = stats["average"]

    if high == low:
        return None

    # Where in the observed range does today's price sit?
    position = (latest - low) / (high - low)
    if position <= 0.1:
        return (
            f"That is about as low as I have seen it. It has ranged from "
            f"{low:g} to {high:g} dollars, averaging {average:g}."
        )
    if position >= 0.75:
        return (
            f"That is on the high side. I have seen it as low as {low:g} dollars, "
            f"averaging {average:g}, so it may be worth waiting."
        )
    return f"That is around the middle of its usual range, {low:g} to {high:g} dollars."
