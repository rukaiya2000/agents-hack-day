"""Shared test fixtures.

The watch/price store is a real SQLite file on disk. Without this, any test
that exercises a watch tool writes into the developer's actual database and
leaks state into later tests — which is exactly how a stale "AirPods Pro" watch
turned up in an unrelated assertion.
"""

from __future__ import annotations

import pytest


@pytest.fixture(autouse=True)
def isolated_store(tmp_path, monkeypatch):
    """Point every test at a throwaway database."""
    monkeypatch.setenv("DEAL_HUNTER_DB", str(tmp_path / "deal_hunter_test.db"))
    yield
