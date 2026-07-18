# KOL Copilot Frontend

This directory contains the Next.js frontend for the KOL Copilot hackathon demo.

The UI is the realtime Medical Affairs workspace: users start a LiveKit voice session, discuss a Phase 3 protocol, and watch ranked KOL cards, citations, rationale, and compliance notes update as the Python agent publishes structured data events.

## Responsibilities

- Provide the browser voice interface for LiveKit sessions.
- Mint LiveKit tokens through the local token route.
- Dispatch sessions to the `agent-py` worker.
- Render protocol-aware KOL results from agent data events.
- Show evidence context and compliance guardrails.
- Provide the dashboard and branded Medical Affairs landing surface.

## Key Files

```text
frontend/
├── app/
│   ├── page.tsx              # main app route
│   ├── dashboard/page.tsx    # dashboard/demo route
│   └── api/token/route.ts    # LiveKit token and agent dispatch route
├── components/app/
│   ├── app.tsx               # app shell
│   ├── welcome-view.tsx      # pre-session view
│   ├── view-controller.tsx   # session state routing
│   └── moss-results-panel.tsx
├── hooks/
│   └── useMossContextEvents.ts
├── app-config.ts             # app branding and agent name
└── .env.example
```

## Environment

Write LiveKit credentials with the CLI:

```bash
lk app env -w frontend
```

The frontend does not need Moss credentials. Moss access stays in the Python agent.

Confirm `AGENT_NAME=agent-py` in `.env.local` so browser sessions dispatch to the KOL Copilot worker.

## Commands

Run from the repository root:

```bash
pnpm install:frontend
pnpm dev:frontend
pnpm build
pnpm start:frontend
pnpm lint:frontend
```

Or run directly inside this directory:

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Demo UX

The first screen should be the usable KOL Copilot experience, not a generic starter landing page. Keep the interface focused on Medical Affairs workflows:

- protocol context
- live voice interaction
- ranked KOL cards
- evidence citations
- score rationale
- compliance notes
- MSL-ready brief generation
