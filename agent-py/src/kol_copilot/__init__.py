"""KOL Copilot workflow package.

The package is intentionally usable without LiveKit or FastAPI. LiveKit can call
``run_kol_query`` in-process for low-latency voice turns, while ``api.py`` exposes
the same runner through HTTP for protocol upload, non-voice chat, or debugging.
"""

from .runner import run_kol_query
from .schemas import KolQueryResult, ProtocolProfile

__all__ = [
    "KolQueryResult",
    "ProtocolProfile",
    "run_kol_query",
]
