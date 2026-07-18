# Deal Hunter

A voice-first shopping copilot. Ask for a product out loud and Deal Hunter
searches live web data for current listings, ranks them cheapest-first, reads
the best options back to you, and remembers items you want to watch.

Built on three technologies, one job each:

- **[LiveKit](https://livekit.io)** — real-time voice (speech-to-text, the LLM
  brain, and text-to-speech) via LiveKit Inference.
- **[Bright Data](https://brightdata.com)** — live web search (SERP + Web
  Unlocker) for real, current product prices.
- **[Moss](https://www.moss.dev)** — semantic retrieval and per-user memory
  (your watch list, budget, and preferences).

## How it works

```text
You speak
  -> LiveKit STT (speech -> text)
  -> LLM decides to call a tool
       -> find_deals      -> Bright Data SERP -> live listings -> ranked cheapest-first
       -> remember_fact   -> Moss memory (watch this / my budget)
       -> recall_facts    -> Moss memory (scoped to you)
  -> LiveKit TTS (spoken summary)  +  live "Best Prices" cards in the browser
```

## Project structure

```text
agent-py/                 # Python LiveKit voice agent
  src/agent.py            # agent entrypoint + tools (find_deals, memory, knowledge)
  src/deal_hunter/
    finder.py             # price search: Bright Data SERP -> ranked deals -> voice summary
    web_research.py       # Bright Data SERP + Unlocker helpers
  src/create_index.py     # seeds the Moss knowledge + memory indexes
  tests/                  # pytest suite
frontend/                 # Next.js app: landing + live voice UI with deal cards
```

## Prerequisites

- Python 3.10+ and [uv](https://docs.astral.sh/uv/)
- Node.js 22+ and [pnpm](https://pnpm.io) 10+
- A [LiveKit Cloud](https://cloud.livekit.io) project
- Moss project credentials
- A Bright Data account with a SERP zone and a Web Unlocker zone

## Setup

```bash
pnpm run setup          # install frontend deps, sync the Python agent, create env files
lk app env -w agent-py  # write LiveKit creds into the agent
lk app env -w frontend  # write LiveKit creds into the frontend
```

Add Moss + Bright Data credentials to `agent-py/.env.local` (see
`agent-py/.env.example` for the full list):

```dotenv
MOSS_PROJECT_ID=your_moss_project_id
MOSS_PROJECT_KEY=your_moss_project_key
BRIGHT_DATA_API_TOKEN=your_bright_data_token
BRIGHT_DATA_SERP_ZONE=your_serp_zone
BRIGHT_DATA_UNLOCKER_ZONE=your_unlocker_zone
```

## Run

```bash
pnpm run moss:index   # seed the Moss knowledge + memory indexes (once)
pnpm dev              # start the voice agent + frontend together
```

- Frontend: http://localhost:3000 → **Start voice demo**
- Try: *"Find me the cheapest Sony WH-1000XM5"* then *"Watch it and tell me if it drops below 130."*

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm run setup` | Install deps and create local env files |
| `pnpm dev` | Run the Python voice agent and Next.js frontend together |
| `pnpm run moss:index` | Seed the Moss indexes |
| `pnpm run agent:py:console` | Run the voice agent in terminal console mode |
| `pnpm test` | Run the Python tests |
| `pnpm lint` | Lint the agent and frontend |

---

Built at AI Hack Day. Inspired by the LiveKit + Moss + Bright Data starter,
reworked into a voice shopping use case.
