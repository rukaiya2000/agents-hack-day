# KOL Copilot Python Agent

This directory contains the Python LiveKit voice agent and the protocol-aware KOL Copilot workflow.

The agent handles realtime voice sessions, exposes Moss retrieval tools, calls the KOL Copilot runner in-process, and streams structured KOL result events back to the frontend.

## Responsibilities

- Connect to LiveKit as the `agent-py` worker.
- Support voice turns through LiveKit Inference.
- Retrieve evidence from Moss indexes.
- Run protocol-aware KOL discovery through `kol_copilot.runner`.
- Publish structured `kol_result` events for ranked KOL cards, citations, score breakdowns, and compliance notes.
- Optionally expose the same KOL runner over FastAPI at `POST /kol/query`.

## Key Files

```text
agent-py/
├── src/agent.py             # LiveKit agent entrypoint and tools
├── src/create_index.py      # Moss index creation/seeding
├── src/kol_copilot/
│   ├── runner.py            # main KOL query workflow
│   ├── api.py               # optional FastAPI endpoint
│   ├── agents.py            # OpenAI Agents definitions
│   ├── tools.py             # retrieval/workflow tools
│   ├── schemas.py           # structured result schemas
│   └── web_research.py      # supporting research helpers
├── tests/                   # pytest suite
└── .env.example             # local configuration template
```

## Environment

LiveKit values should be written by the LiveKit CLI:

```bash
lk app env -w agent-py
```

Add Moss and optional OpenAI credentials in `agent-py/.env.local`:

```dotenv
MOSS_PROJECT_ID=your_moss_project_id
MOSS_PROJECT_KEY=your_moss_project_key
MOSS_INDEX_NAME=knowledge
MOSS_MEMORY_INDEX_NAME=memory
MOSS_PROTOCOL_INDEX_NAME=protocols
MOSS_EXPERT_INDEX_NAME=kol_experts
MOSS_MODEL_ID=moss-minilm
OPENAI_API_KEY=optional_openai_api_key_for_kol_copilot
```

If `OPENAI_API_KEY` is not set, the KOL workflow can use deterministic synthetic evidence so the demo UI still renders ranked KOL cards and compliance notes.

## Commands

Run from the repository root:

```bash
pnpm install:agent-py
pnpm moss:index
pnpm dev:agent-py
pnpm agent:py:console
pnpm agent:py:api
pnpm test:agent-py
pnpm lint:agent-py
```

Or run directly inside this directory:

```bash
uv sync
uv run src/agent.py dev
uv run src/agent.py console
uv run uvicorn kol_copilot.api:app --reload --port 8000
uv run pytest
```

## Compliance Defaults

Keep the agent framed as Medical Affairs software. Recommendations must be citation-backed and should avoid pre-approval promotional claims, prescribing-volume targeting, and sales language. Generated briefs should include non-promotional scientific questions and a compliance warning section.
