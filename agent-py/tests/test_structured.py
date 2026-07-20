"""Tests for schema.org JSON-LD price extraction."""

from __future__ import annotations

import json

from deal_hunter.structured import extract_offers, price_matches_offers


def _page(*blocks: object) -> str:
    scripts = "".join(
        f'<script type="application/ld+json">{json.dumps(b)}</script>' for b in blocks
    )
    return f"<html><head>{scripts}</head><body>Some page text</body></html>"


def test_extracts_a_simple_product_offer():
    html = _page(
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sony WH-1000XM5",
            "offers": {
                "@type": "Offer",
                "price": "248.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition",
            },
        }
    )

    offers = extract_offers(html)

    assert len(offers) == 1
    assert offers[0].price == 248.0
    assert offers[0].currency == "USD"
    assert offers[0].availability == "in stock"
    assert offers[0].condition == "new"
    assert offers[0].product_name == "Sony WH-1000XM5"


def test_handles_numeric_and_comma_formatted_prices():
    html = _page(
        {"@type": "Product", "offers": {"@type": "Offer", "price": 1299}},
        {"@type": "Product", "offers": {"@type": "Offer", "price": "1,499.99"}},
    )

    assert [o.price for o in extract_offers(html)] == [1299.0, 1499.99]


def test_reads_the_low_end_of_an_aggregate_offer():
    """AggregateOffer quotes a range; the low end is what a shopper is offered."""
    html = _page(
        {
            "@type": "Product",
            "name": "RTX 4090",
            "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "1599.00",
                "highPrice": "2199.00",
                "priceCurrency": "USD",
            },
        }
    )

    offers = extract_offers(html)
    assert len(offers) == 1
    assert offers[0].price == 1599.0


def test_finds_offers_nested_in_a_graph():
    html = _page(
        {
            "@context": "https://schema.org",
            "@graph": [
                {"@type": "BreadcrumbList", "itemListElement": []},
                {
                    "@type": "Product",
                    "name": "AirPods Pro",
                    "offers": [
                        {"@type": "Offer", "price": "189.99"},
                        {"@type": "Offer", "price": "199.99"},
                    ],
                },
            ],
        }
    )

    assert [o.price for o in extract_offers(html)] == [189.99, 199.99]


def test_reads_a_price_specification():
    html = _page(
        {
            "@type": "Product",
            "offers": {
                "@type": "Offer",
                "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "79.95",
                    "priceCurrency": "USD",
                },
            },
        }
    )

    assert [o.price for o in extract_offers(html)] == [79.95]


def test_duplicate_offers_collapse():
    """The same offer is routinely repeated across several JSON-LD blocks."""
    block = {"@type": "Product", "offers": {"@type": "Offer", "price": "50.00"}}

    assert len(extract_offers(_page(block, block, block))) == 1


def test_malformed_blocks_do_not_lose_the_good_ones():
    html = (
        '<script type="application/ld+json">{ not json at all }</script>'
        '<script type="application/ld+json">'
        '{"@type":"Product","offers":{"@type":"Offer","price":"42.00"}}'
        "</script>"
    )

    assert [o.price for o in extract_offers(html)] == [42.0]


def test_pages_without_structured_data_yield_nothing():
    assert extract_offers("<html><body>$248 today only!</body></html>") == []
    assert extract_offers("") == []
    assert extract_offers(None) == []


def test_price_matching_confirms_and_denies():
    offers = extract_offers(
        _page({"@type": "Product", "offers": {"@type": "Offer", "price": "248.00"}})
    )

    assert price_matches_offers(248.0, offers) is True
    assert price_matches_offers(248.004, offers) is True  # within tolerance
    assert price_matches_offers(199.0, offers) is False


def test_no_offers_is_unknown_not_a_denial():
    """The distinction that keeps the fallback path honest."""
    assert price_matches_offers(248.0, []) is None
