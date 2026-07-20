"""Tests for the vague-query heuristic that gates the clarifier task."""

from __future__ import annotations

import pytest

from deal_hunter.query import is_vague_query


@pytest.mark.parametrize(
    "query",
    [
        "headphones",
        "a tv",
        "find me a laptop",
        "wireless headphones",
        "gaming laptop",
        "cheap sneakers",
        "the best noise cancelling headphones",
        "find me a good deal",
        "",
        "   ",
    ],
)
def test_category_only_requests_are_vague(query: str) -> None:
    assert is_vague_query(query) is True


@pytest.mark.parametrize(
    "query",
    [
        # A model number is the strongest signal the user knows what they want.
        "Sony WH-1000XM5",
        "RTX 4090",
        "iPhone 15 Pro",
        "AirPods Pro 2",
        # A brand or product name alongside the category is specific enough.
        "Sony headphones",
        "MacBook Air",
        "Dyson vacuum",
        "Herman Miller chair",
        "Nintendo Switch",
    ],
)
def test_named_products_are_not_vague(query: str) -> None:
    assert is_vague_query(query) is False


def test_heuristic_is_case_and_spacing_insensitive() -> None:
    assert is_vague_query("  HEADPHONES  ") is True
    assert is_vague_query("sOnY wh-1000xm5") is False


def test_hyphenated_model_numbers_count_as_specific() -> None:
    """ "WH-1000XM5" must survive tokenization as one digit-bearing token."""
    assert is_vague_query("WH-1000XM5") is False
