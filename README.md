# KOL Copilot

<p align="center">
  <a href="https://www.moss.dev">
    <img src="https://www.moss.dev/Favicon.svg" alt="Moss logo" height="56" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://brightdata.com">
    <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/favicon.png" alt="Bright Data logo" height="56" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://livekit.io">
    <img src="./frontend/public/lk-logo.svg" alt="LiveKit logo" height="56" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://openai.com">
    <img src="https://avatars.githubusercontent.com/u/14957082?s=200&amp;v=4" alt="OpenAI logo" height="56" />
  </a>
</p>

KOL Copilot is an example project for showing how [Moss.dev](https://www.moss.dev) works with [Bright Data](https://brightdata.com), [LiveKit](https://livekit.io), and the [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) in a realtime agent app.

The sample domain is pharma Medical Affairs: given a Phase 3 clinical trial protocol, the app finds relevant external experts, cites the supporting evidence, ranks the experts, and drafts a compliant MSL pre-call brief. The domain is intentionally specific so the retrieval workflow feels concrete, but the main point of the repo is the Moss + Bright Data pattern.

## What This Demonstrates

- **Bright Data for public evidence discovery:** SERP and Unlocker tools help the research agent find and read public sources such as ClinicalTrials.gov, PubMed, congress pages, institutional bios, guideline pages, and transparency records.
- **Moss for realtime semantic retrieval:** protocol chunks, expert profiles, evidence snippets, ranking metadata, citations, and generated briefs are written into Moss indexes for fast agent retrieval.
- **OpenAI Agents SDK for orchestration:** the agentic research workflow plans searches, synthesizes evidence, returns structured KOL rankings, and drafts MSL-ready briefs.
- **A voice-first copilot loop:** LiveKit runs the realtime conversation, while the frontend updates KOL cards, citations, score breakdowns, and compliance notes from agent events.
- **An evidence-backed UI:** every recommendation is designed to carry a source URL, evidence type, snippet, score rationale, and Medical Affairs compliance note.

## How The Pieces Fit Together

```text
Protocol PDF
  -> parsed protocol profile
  -> OpenAI research agent
       -> Bright Data SERP for source discovery
       -> Bright Data Unlocker for public page reads
  -> structured KOL evidence, rankings, citations, and briefs
  -> Moss protocol and expert indexes
  -> LiveKit voice agent retrieves from Moss
  -> Next.js UI renders ranked cards and citations
```

Bright Data is used for the research side of the workflow. Moss is used for the semantic retrieval and memory layer that the realtime agent can query quickly during the demo.

## Demo Flow

1. Upload or select a Phase 3 protocol PDF.
2. Extract indication, intervention, phase, patient population, endpoints, geography, and relevant specialties.
3. Run protocol-aware KOL research.
4. Use Bright Data-backed tools, when configured, to discover public evidence.
5. Store the resulting protocol assets, KOL profiles, citations, and ranking metadata in Moss.
6. Ask a voice question such as:

   > Find the top infectious disease KOLs for this protocol. Prioritize vaccine trial experience, immunogenicity publications, and adult COVID study relevance.

7. Watch the UI update with ranked KOL cards, evidence snippets, and compliance-safe next actions.

## Project Structure

```text
frontend/
  Next.js app, protocol upload, dashboard, LiveKit voice UI

agent-py/
  Python LiveKit agent, OpenAI research workflow, Bright Data tools,
  Moss indexing, KOL ranking, MSL brief generation

Moss indexes
  protocols, kol_experts, knowledge, memory

Bright Data
  SERP discovery and Unlocker page reads for public research sources
```

## Key Files

```text
agent-py/src/kol_copilot/analysis.py       # agentic research workflow
agent-py/src/kol_copilot/web_research.py   # Bright Data SERP and Unlocker tools
agent-py/src/kol_copilot/moss_indexer.py   # writes structured assets into Moss
agent-py/src/kol_copilot/tools.py          # KOL retrieval, ranking, compliance, briefs
agent-py/src/agent.py                      # LiveKit voice agent and Moss retrieval tools
frontend/app/api/protocols/                # protocol upload and analysis routes
frontend/components/dashboard/             # protocol pipeline and KOL dashboard UI
```

## Prerequisites

- Python 3.10+ and [uv](https://docs.astral.sh/uv/).
- Node.js 22+ and [pnpm](https://pnpm.io) 10+.
- [LiveKit CLI](https://docs.livekit.io/reference/developer-tools/livekit-cli/) authenticated to a LiveKit Cloud project.
- Moss project credentials.
- Optional Bright Data API token and zones for live public web research.
- Optional OpenAI API key for the agentic research path. Without it, the app can still render deterministic demo data.

## Setup

Install dependencies and create local env files:

```bash
pnpm setup
```

Write LiveKit credentials into both apps:

```bash
lk app env -w agent-py
lk app env -w frontend
```

Add Moss credentials to `agent-py/.env.local`:

```dotenv
MOSS_PROJECT_ID=your_moss_project_id
MOSS_PROJECT_KEY=your_moss_project_key
MOSS_INDEX_NAME=knowledge
MOSS_MEMORY_INDEX_NAME=memory
MOSS_PROTOCOL_INDEX_NAME=protocols
MOSS_EXPERT_INDEX_NAME=kol_experts
MOSS_MODEL_ID=moss-minilm
```

To enable Bright Data-backed research, also add:

```dotenv
BRIGHT_DATA_API_TOKEN=your_bright_data_api_token
BRIGHT_DATA_SERP_ZONE=your_serp_zone
BRIGHT_DATA_UNLOCKER_ZONE=your_unlocker_zone
BRIGHT_DATA_COUNTRY=us
```

To enable the full OpenAI Agents research path:

```dotenv
OPENAI_API_KEY=your_openai_api_key
OPENAI_KOL_MODEL=gpt-5.2
```

## Build Moss Indexes

```bash
pnpm moss:index
```

This seeds the starter `knowledge` and `memory` Moss indexes. The dashboard analysis flow can also write structured protocol and KOL assets into the `protocols` and `kol_experts` indexes through `agent-py/src/kol_copilot/moss_indexer.py`.

## Run

Start the Python voice agent and the Next.js frontend together:

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- Python LiveKit agent: `agent-py`

Terminal smoke test:

```bash
pnpm agent:py:console
```

Optional HTTP API for the KOL runner:

```bash
pnpm agent:py:api
```

Then POST to `http://localhost:8000/kol/query`:

```json
{
  "user_text": "Find the top infectious disease KOLs for this protocol.",
  "user_id": "demo-user"
}
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm setup` | Install frontend dependencies, sync the Python agent, and create local env files. |
| `pnpm dev` | Run the Python LiveKit agent and Next.js frontend together. |
| `pnpm moss:index` | Seed the starter Moss indexes. |
| `pnpm agent:py:console` | Run the voice agent in terminal console mode. |
| `pnpm agent:py:api` | Start the optional FastAPI KOL endpoint on port 8000. |
| `pnpm test` | Run Python tests. |
| `pnpm lint` | Run Python and frontend lint commands. |
| `pnpm format` | Format frontend and Python code. |

## Demo Notes

The reference protocol is the Pfizer/BioNTech BNT162b2 Phase 3 COVID-19 vaccine protocol in `Prot_000.pdf`. `Tirzepatide Protocol.pdf` is also included for a second protocol-style input.

KOL Copilot is framed as Medical Affairs software. The example avoids prescribing-volume targeting, sales language, and pre-approval promotional claims. Suggested actions should stay scientific, citation-backed, and non-promotional.

## License

MIT. See [LICENSE](./LICENSE).
