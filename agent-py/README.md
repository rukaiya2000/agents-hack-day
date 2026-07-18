# Deal Hunter — Python voice agent

The Python LiveKit voice agent for Deal Hunter. It runs real-time voice
sessions, exposes Bright Data price search and Moss retrieval/memory as tools,
and streams live `deal_result` events to the frontend.

## Responsibilities

- Connect to LiveKit as the `agent-py` worker.
- Run voice turns through LiveKit Inference (STT / LLM / TTS).
- Search live product prices via Bright Data (`find_deals`).
- Retrieve and store per-user memory via Moss (`remember_fact`, `recall_facts`).
- Publish structured `deal_result` events for the ranked "Best Prices" cards.

## Key files

```text
agent-py/
├── src/agent.py                # LiveKit agent entrypoint and tools
├── src/create_index.py         # Moss index creation/seeding
├── src/deal_hunter/
│   ├── finder.py               # price search -> ranked deals -> voice summary
│   └── web_research.py         # Bright Data SERP + Unlocker helpers
├── tests/                      # pytest suite
└── .env.example                # local configuration template
```

## Environment

LiveKit values are written by the LiveKit CLI:

```bash
lk app env -w agent-py
```

Add Moss + Bright Data credentials to `agent-py/.env.local` (see `.env.example`):

```dotenv
MOSS_PROJECT_ID=your_moss_project_id
MOSS_PROJECT_KEY=your_moss_project_key
BRIGHT_DATA_API_TOKEN=your_bright_data_token
BRIGHT_DATA_SERP_ZONE=your_serp_zone
BRIGHT_DATA_UNLOCKER_ZONE=your_unlocker_zone
```

## Commands

Run from the repository root:

```bash
pnpm install:agent-py
pnpm run moss:index
pnpm dev:agent-py
pnpm run agent:py:console
pnpm test:agent-py
pnpm lint:agent-py
```

Or directly inside this directory:

```bash
uv sync
uv run src/agent.py dev
uv run src/agent.py console
uv run pytest
```
