"""Deal Hunter — voice shopping domain package.

`finder` holds the price-search logic (Bright Data SERP -> ranked deals ->
voice summary); `web_research` holds the Bright Data SERP/Unlocker helpers.
The LiveKit voice agent (``src/agent.py``) calls ``find_deals`` in-process for
low-latency voice turns.
"""

from .finder import Deal, DealResult, find_deals, voice_summary

__all__ = [
    "Deal",
    "DealResult",
    "find_deals",
    "voice_summary",
]
