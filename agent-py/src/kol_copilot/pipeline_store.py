from __future__ import annotations

import json
import os
from pathlib import Path

from .schemas import AgenticAnalysisResult


def _default_analysis_dir() -> Path:
    repo_root = Path(__file__).resolve().parents[3]
    return repo_root / "frontend" / "storage" / "agentic-analysis"


def analysis_dir() -> Path:
    configured = os.getenv("KOL_COPILOT_ANALYSIS_DIR")
    return Path(configured).expanduser() if configured else _default_analysis_dir()


def analysis_path(protocol_id: str) -> Path:
    safe_id = "".join(
        char if char.isalnum() or char in {"-", "_", "."} else "-"
        for char in protocol_id
    )
    return analysis_dir() / f"{safe_id}.json"


def fallback_analysis_allowed() -> bool:
    return os.getenv("KOL_COPILOT_ALLOW_FALLBACK_ANALYSIS") == "1"


def is_fallback_analysis(analysis: AgenticAnalysisResult) -> bool:
    audit = " ".join(analysis.audit_trail)
    return (
        analysis.is_fallback
        or "fallback" in analysis.analysis_source.lower()
        or "fallback" in audit.lower()
        or "seed dataset" in audit.lower()
        or "deterministic" in audit.lower()
    )


def visible_analysis(analysis: AgenticAnalysisResult) -> AgenticAnalysisResult | None:
    if is_fallback_analysis(analysis) and not fallback_analysis_allowed():
        return None
    return analysis


def load_agentic_analysis(protocol_id: str) -> AgenticAnalysisResult | None:
    path = analysis_path(protocol_id)
    if not path.exists():
        return None

    try:
        return visible_analysis(
            AgenticAnalysisResult.model_validate_json(path.read_text())
        )
    except Exception:
        return None


def load_latest_agentic_analysis() -> AgenticAnalysisResult | None:
    root = analysis_dir()
    if not root.exists():
        return None

    candidates = sorted(
        root.glob("*.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
    for path in candidates:
        try:
            analysis = AgenticAnalysisResult.model_validate(
                json.loads(path.read_text())
            )
            if visible := visible_analysis(analysis):
                return visible
        except Exception:
            continue
    return None
