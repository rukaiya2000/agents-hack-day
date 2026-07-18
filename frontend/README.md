# Deal Hunter Frontend

The Next.js frontend for Deal Hunter. Users start a LiveKit voice session, ask
for a product, and watch ranked "Best Prices" cards update live as the Python
agent publishes structured data events.

## Responsibilities

- Start a LiveKit voice session and mint a per-user access token (`app/api/token`).
- Render the Deal Hunter landing page (`components/app/welcome-view.tsx`).
- Show live, price-ranked deal cards from the agent's `deal_result` events
  (`hooks/useDealResultEvents.ts` + `components/app/deal-results-panel.tsx`).

## Environment

LiveKit values are written by the LiveKit CLI:

```bash
lk app env -w frontend
```

Confirm `AGENT_NAME=agent-py` in `.env.local` so browser sessions dispatch to
the Deal Hunter worker. No database is required.

## Develop

Run from the repository root so the agent and frontend start together:

```bash
pnpm dev
```

Or just the frontend:

```bash
pnpm --dir frontend dev
```

Then open http://localhost:3000 and click **Start voice demo**.
