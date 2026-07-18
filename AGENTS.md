# Deal Hunter — Project Brief

Deal Hunter is a hackathon MVP: a voice-first shopping copilot. The user asks
for a product out loud; the agent searches live web data for current listings,
ranks them cheapest-first, reads the best options back, and can remember items
to watch.

## The core idea

> Say what you want to buy, and hear the best current price — pulled live from
> the web, ranked cheapest-first, with the option to watch it for price drops.

## The stack (one job each)

- **LiveKit** — real-time voice. STT (speech→text), the LLM brain, and TTS
  (text→speech) all run on LiveKit Inference. The Python worker registers as
  `agent-py` and the frontend dispatches voice sessions to it.
- **Bright Data** — live web data. The `find_deals` tool searches Google via the
  Bright Data SERP API for current product listings; the Web Unlocker zone can
  read a full listing page on request.
- **Moss** — semantic retrieval + per-user memory. `remember_fact` / `recall_facts`
  store and recall the user's watch list, budget, and preferences (scoped by
  `user_id`); `search_knowledge` grounds "how does this work" questions.

## Demo flow

1. User: *"Find me the cheapest Sony WH-1000XM5."*
2. LiveKit transcribes → the LLM calls `find_deals`.
3. `find_deals` → Bright Data SERP → live listings → prices parsed and ranked.
4. The agent publishes a `deal_result` event → the browser shows ranked
   "Best Prices" cards, and speaks a short summary.
5. User: *"Watch it and tell me if it drops below 130."* → `remember_fact`
   saves the target to Moss memory.

## Where the code lives

- `agent-py/src/agent.py` — the voice agent + its tools.
- `agent-py/src/deal_hunter/finder.py` — price search, ranking, voice summary.
- `agent-py/src/deal_hunter/web_research.py` — Bright Data SERP + Unlocker helpers.
- `frontend/` — Next.js landing + live voice UI with deal cards.

## Notes

- No database is required; the app is stateless apart from Moss memory and an
  httpOnly cookie that carries a stable per-user id.
- Keep the voice output natural and brief (see the agent instructions), and
  never invent prices, retailers, or stock — only report what the tools return.
