# Deal Hunter — Demo Script

A voice shopping copilot: ask for a product out loud, get live prices ranked
cheapest-first, and put items on a watchlist that remembers your target price.

---

## 0. Pre-flight (do this BEFORE you present)

Five minutes before, run through this. Most demo failures are here, not in the code.

- [ ] **Servers running** — `pnpm dev` from `deals/`. Wait for both:
      `✓ Ready in …` (frontend) and `registered worker` (agent).
- [ ] **Mic permission granted** for `localhost:3000` in Chrome.
      *This is the #1 thing that breaks the demo.* Open the site, click
      **Start voice demo**, allow the mic prompt, then **End call**. Now it's warm.
- [ ] **Do one throwaway search** ("cheapest AirPods") so the first real one is fast.
- [ ] **Sound on**, output volume up. You need to hear the agent talk.
- [ ] **Close other tabs** — the page is at `http://localhost:3000`.
- [ ] Optional: pick a product you've tested. Sony WH-1000XM5 works well.

---

## 1. The hook (20 seconds — before touching anything)

> "Finding the best price means opening ten tabs and comparing them yourself.
> I wanted to do it by just asking. This is Deal Hunter — a voice shopping
> copilot that searches the live web, ranks what it finds cheapest-first, and
> remembers what you're watching."

Have the landing page up while you say this. Don't read it out — let it sit there.

---

## 2. The live demo (about 2 minutes)

### Beat 1 — Ask for a price

Click **Start voice demo**, then say:

> **"Find me the cheapest Sony WH-1000XM5."**

**What happens:** it immediately says *"Let me check the latest prices"* (so
there's no dead air), then ~2 seconds later speaks the best price and the
runners-up. The **Best Prices** panel fills in on the right.

**Point out:**
- "That price is live — it came from a web search run the second I asked, not
  from the model's memory."
- The cards are **clickable** — that's the real listing.

### Beat 2 — The verification (the technical beat)

Wait a few seconds and watch the cards. A ✓ **verified** badge appears on the
top result(s).

**Say:**
> "In the background it just opened those listing pages and checked that the
> price it quoted actually appears on the page. Confirmed ones get a checkmark.
> If it can't confirm one, it says so rather than pretending."

> ⚠️ Verification is best-effort — retailer pages are slow and sometimes time
> out. If no badge appears, don't wait for it. Say the line above as a design
> point ("it confirms when it can, and admits when it can't") and move on.

### Beat 3 — Memory (the Moss beat)

> **"Watch it and tell me if it drops below two hundred dollars."**

**What happens:** it confirms by name — *"Added Sony WH-1000XM5 to your
watchlist with a target of 200 dollars"* — and a **Watching** card appears.

Then:

> **"What am I watching?"**

**What happens:** it says *"Let me check where those stand"*, re-checks the
live price of each watched item, and the card updates to show **current price
vs. target**, how far it has to fall, and a 🔻 **Target hit** badge if it's
already under.

**Say:**
> "That watchlist lives in Moss, scoped to me. It survives the conversation —
> and when I ask, it re-checks the live price against my target."

### Beat 4 (optional, if you have time) — Ask it about itself

> **"How do you know the price is real?"**

It answers from a Moss knowledge index describing its own behaviour, rather
than improvising.

---

## 3. The close (30 seconds)

> "Three technologies, one job each. **LiveKit** runs the real-time voice —
> speech in, the LLM, speech out. **Bright Data** is the live web data: its SERP
> API finds the listings, its Web Unlocker opens the pages to confirm prices.
> **Moss** is the memory — the watchlist and my target price, scoped to me.
> No database; the only state is the memory."

---

## The 30-second version (if you're cut short)

1. Click **Start voice demo**
2. *"Find me the cheapest Sony WH-1000XM5."* → live prices, spoken
3. *"Watch it below two hundred."* → watchlist card appears
4. One line: *"Live web prices via Bright Data, voice via LiveKit, memory via Moss."*

---

## If something breaks

| Problem | What to do |
|---|---|
| **Mic won't unmute / it can't hear you** | Grant mic permission for `localhost:3000` and reload. Do this in pre-flight so it never happens live. |
| **No verified badges appear** | Expected sometimes — pages time out. Frame it as "it confirms when it can". Don't stand there waiting. |
| **Search returns no clear price** | It will say so honestly. Say *"that's the honest-failure path"* and try a more specific product. |
| **The agent talks over you** | Pause, let it finish, then speak. Or click **End call** and restart the session. |
| **Everything dies** | Have the landing page open — walk through the "How it works" section and the example card instead. |

---

## Be honest about these (judges will ask)

- **The watch does not alert you on its own.** Nothing polls in the background.
  It re-checks when you ask. Say *"it tracks and reports when you ask"* — not
  *"it'll notify you"*.
- **The hero card on the landing page is an illustrative example**, and it's
  labelled as such. The real data appears once you start the voice demo.
- **Prices can be imperfect** — a snippet may show a starting-at price or a
  different variant. That's exactly why the Unlocker verification exists, and
  why unconfirmed prices are marked.

---

## Likely questions, and answers

**"Is this actually live or hardcoded?"**
Live. Every price comes from a Bright Data SERP call made at the moment of the
question. Ask it for any product — it's not a fixed list.

**"How do you handle Google blocking scrapers?"**
That's what Bright Data handles: proxy rotation, geolocation, and unblocking,
plus it returns the SERP already parsed into JSON.

**"What's Moss doing that a database wouldn't?"**
Semantic recall scoped per user. I ask "what am I watching" in whatever words I
like and it retrieves by meaning, filtered to my user id.

**"Why voice?"**
Price comparison is the exact task where you're holding several numbers in your
head across tabs. Speaking is faster, and the answer is one sentence.

**"What would you build next?"**
A real background price monitor so the watchlist can actually notify you, and
direct product-vs-product comparison in one turn.
