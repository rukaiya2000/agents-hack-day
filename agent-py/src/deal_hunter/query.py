"""Deciding when a shopping request is too vague to search.

"Find me headphones" is unsearchable — every retailer has hundreds, and the
cheapest is always junk. "Sony WH-1000XM5" is searchable. This module draws
that line with a deterministic heuristic rather than an LLM call, so the
decision is fast, free, and unit-testable.

Deliberately conservative: it only reports vague when the query is *entirely*
generic. A wrong "not vague" costs one mediocre search; a wrong "vague" makes
the agent interrogate a user who already said exactly what they wanted.
"""

from __future__ import annotations

import re

# Words that describe a whole product category rather than a product.
GENERIC_CATEGORIES = frozenset(
    {
        "headphones",
        "headphone",
        "earbuds",
        "earphones",
        "headset",
        "tv",
        "television",
        "televisions",
        "monitor",
        "monitors",
        "laptop",
        "laptops",
        "computer",
        "computers",
        "pc",
        "desktop",
        "phone",
        "phones",
        "smartphone",
        "smartphones",
        "tablet",
        "tablets",
        "camera",
        "cameras",
        "lens",
        "drone",
        "drones",
        "speaker",
        "speakers",
        "soundbar",
        "subwoofer",
        "watch",
        "watches",
        "smartwatch",
        "smartwatches",
        "shoes",
        "sneakers",
        "boots",
        "jacket",
        "backpack",
        "console",
        "keyboard",
        "keyboards",
        "mouse",
        "mice",
        "printer",
        "vacuum",
        "blender",
        "microwave",
        "fridge",
        "refrigerator",
        "chair",
        "desk",
        "mattress",
        "sofa",
        "gpu",
        "cpu",
        "ssd",
        "router",
        "charger",
    }
)

# Words that add no identifying information to a product query.
FILLER = frozenset(
    {
        "a",
        "an",
        "the",
        "some",
        "any",
        "me",
        "my",
        "i",
        "want",
        "need",
        "find",
        "get",
        "buy",
        "shop",
        "for",
        "on",
        "with",
        "of",
        "to",
        "cheap",
        "cheapest",
        "best",
        "good",
        "great",
        "nice",
        "top",
        "new",
        "deal",
        "deals",
        "price",
        "prices",
        "priced",
        "cost",
        "under",
        "around",
        "wireless",
        "bluetooth",
        "noise",
        "cancelling",
        "canceling",
        "cancellation",
        "gaming",
        "smart",
        "portable",
        "quality",
        "decent",
        "affordable",
    }
)

_WORD_RE = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")


def is_vague_query(query: str) -> bool:
    """True when the query names a category but no particular product.

    A digit anywhere (model numbers like "WH-1000XM5", "4090", "iPhone 15")
    is treated as specific — those are the strongest signal that the user knows
    what they want.
    """
    tokens = _WORD_RE.findall((query or "").casefold())
    if not tokens:
        return True

    if any(any(ch.isdigit() for ch in token) for token in tokens):
        return False

    meaningful = [t for t in tokens if t not in FILLER]
    if not meaningful:
        # Nothing but filler: "find me a good deal".
        return True

    # Vague only if every remaining word is a bare category noun. One unknown
    # word (a brand, a model name, a distinguishing feature) makes it specific.
    return all(token in GENERIC_CATEGORIES for token in meaningful)
