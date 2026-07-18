from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parents[3]
AGENT_ENV_PATH = REPO_ROOT / "agent-py" / ".env.local"
FRONTEND_ENV_PATH = REPO_ROOT / "frontend" / ".env"


def load_project_env() -> None:
    """Load agent and dashboard env files without overriding real env vars."""
    load_dotenv(AGENT_ENV_PATH, override=False)
    load_dotenv(FRONTEND_ENV_PATH, override=False)
