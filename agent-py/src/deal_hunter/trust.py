"""Is this listing somewhere a shopper should actually hand over a card?

`finder` ranks by price, which on open web results is an adversarial signal: a
fraudulent storefront picks an implausible number *specifically* so that it
sorts first, so cheapest-first selects for the worst listings rather than the
best. `shopping.is_price_outlier` already spots the implausible number; this
module supplies the other half — who is behind the domain — and combines them.

Three deliberate stances:

- **Unknown is not guilty.** Small legitimate retailers exist and often are the
  cheapest. An unrecognised domain earns a caveat, not an accusation.
- **Nothing is ever hidden.** Assessment annotates; it never drops a listing.
  Silently suppressing a result is its own kind of lying to the user, and it
  would also mask our own false positives.
- **The list is a floor, not a moat.** `TRUSTED_RETAILERS` cannot be complete,
  so nothing depends on it being complete — an absent retailer degrades to
  "caution", which is the honest answer for a domain we have no opinion on.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from urllib.parse import urlsplit

# Majors whose own domain we are willing to vouch for by name. Kept small and
# obvious on purpose: every entry is a claim that the user's card is safe there.
TRUSTED_RETAILERS = {
    "amazon.com",
    "apple.com",
    "argos.co.uk",
    "bestbuy.com",
    "bhphotovideo.com",
    "costco.com",
    "currys.co.uk",
    "dell.com",
    "homedepot.com",
    "johnlewis.com",
    "kohls.com",
    "lowes.com",
    "macys.com",
    "microcenter.com",
    "newegg.com",
    "nike.com",
    "rei.com",
    "samsung.com",
    "sony.com",
    "staples.com",
    "target.com",
    "walmart.com",
    "wayfair.com",
}

# Real platforms, but the *seller* behind any given listing is not vetted, so a
# price here carries a different caveat than a first-party retailer.
MARKETPLACES = {
    "alibaba.com",
    "aliexpress.com",
    "backmarket.com",
    "ebay.co.uk",
    "ebay.com",
    "etsy.com",
    "facebook.com",
    "mercari.com",
    "poshmark.com",
    "temu.com",
    "wish.com",
}

# Cheap, high-churn TLDs disproportionately used for throwaway storefronts.
# Only ever a contributing signal — never enough on its own to call fraud.
_RISKY_TLDS = {
    ".buzz",
    ".cfd",
    ".click",
    ".icu",
    ".loan",
    ".online",
    ".rest",
    ".shop",
    ".site",
    ".store",
    ".top",
    ".xyz",
}

# How far below the pack a price sits before it stops reading as a sale.
OUTLIER_RATIO = 0.6


def domain_of(url: str | None, fallback: str | None = None) -> str | None:
    """The hostname for a listing, lowercased and stripped of `www.`."""
    host = ""
    if url:
        host = urlsplit(url if "//" in url else f"//{url}").netloc
    if not host and fallback:
        host = urlsplit(f"//{fallback}").netloc or fallback
    host = host.strip().lower().split(":")[0]
    if not host:
        return None
    return host[4:] if host.startswith("www.") else host


def _registrable(domain: str) -> str:
    """Best-effort eTLD+1. Handles the `.co.uk`-style two-part suffixes we list."""
    parts = domain.split(".")
    if len(parts) <= 2:
        return domain
    if parts[-2] in {"co", "com", "org", "net", "ac", "gov"} and len(parts[-1]) == 2:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:])


def tier(domain: str | None) -> str:
    """`trusted`, `marketplace`, or `unknown`.

    Subdomains inherit their parent (`shop.bestbuy.com` is Best Buy), which is
    safe because we match the registrable domain rather than a substring.
    """
    if not domain:
        return "unknown"
    base = _registrable(domain_of(domain) or domain)
    if base in TRUSTED_RETAILERS:
        return "trusted"
    if base in MARKETPLACES:
        return "marketplace"
    return "unknown"


def lookalike_of(domain: str | None) -> str | None:
    """The retailer this domain appears to be impersonating, if any.

    `bestbuy-outlet.shop` carries a real brand's name without being that brand.
    Deliberately checks the *whole* host with separators removed, so
    `www-walmart-deals.online` is caught while `walmart.com` itself is not.
    """
    if not domain:
        return None
    normalized = domain_of(domain) or domain
    if tier(normalized) != "unknown":
        return None

    flattened = normalized.replace("-", "").replace("_", "").replace(".", "")
    for retailer in sorted(TRUSTED_RETAILERS | MARKETPLACES):
        brand = _registrable(retailer).split(".")[0]
        if len(brand) >= 4 and brand in flattened:
            return retailer
    return None


@dataclass
class Risk:
    """How much caution a listing warrants, and why."""

    level: str = "ok"  # ok | caution | high
    reasons: list[str] = field(default_factory=list)

    @property
    def is_high(self) -> bool:
        return self.level == "high"

    def voice_caveat(self) -> str:
        """One plain sentence for TTS, or empty when there is nothing to say."""
        if not self.reasons:
            return ""
        return " ".join(self.reasons)


def _is_outlier(price: float | None, others: list) -> bool:
    prices = sorted(
        p for p in (getattr(d, "price", None) for d in others) if p is not None
    )
    if len(prices) < 2 or price is None:
        return False
    median = prices[len(prices) // 2]
    return price < median * OUTLIER_RATIO


def assess(deal, others: list) -> Risk:
    """Grade one listing against the rest of the pack.

    The escalation that matters: an unrecognised domain is a caution on its own,
    but an unrecognised domain *undercutting the entire market* is the actual
    shape of a scam storefront, and gets called out as one.
    """
    domain = domain_of(getattr(deal, "url", None), getattr(deal, "source", None))
    if not domain:
        return Risk(
            "caution",
            [
                "I couldn't tell which store that listing is from, so treat it carefully."
            ],
        )

    impersonating = lookalike_of(domain)
    if impersonating:
        return Risk(
            "high",
            [
                f"That address looks like it is imitating {impersonating} "
                "rather than being it, which is a common scam pattern."
            ],
        )

    domain_tier = tier(domain)
    outlier = _is_outlier(getattr(deal, "price", None), others)

    if domain_tier == "trusted":
        # A real store running a real sale. Price alone proves nothing here.
        return Risk("ok", [])

    if domain_tier == "marketplace":
        if outlier:
            return Risk(
                "caution",
                [
                    "That one is a marketplace listing well below the going rate, "
                    "so check the seller's rating before buying."
                ],
            )
        return Risk("ok", [])

    # Unknown domain from here down.
    reasons = [f"I don't recognize the store at {domain}."]
    risky_tld = any(domain.endswith(t) for t in _RISKY_TLDS)

    if outlier:
        reasons.append(
            "It is also far below every other price I found, which is more often "
            "a fake storefront than a real bargain."
        )
        return Risk("high", reasons)

    if risky_tld:
        reasons.append("Worth checking it out before entering card details.")
        return Risk("caution", reasons)

    return Risk("caution", reasons)
