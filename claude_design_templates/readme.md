# Medical Affairs Copilot — Design System

A protocol-aware AI workspace for pharma **Medical Affairs** teams. The product
turns a Phase 3 clinical trial protocol into compliant expert intelligence:
upload/select a protocol, ask voice-driven questions, discover and compare
relevant KOLs/KEEs, inspect evidence, and generate compliant MSL pre-call briefs.

**Design north star:** a *protocol-aware scientific intelligence cockpit* —
calm, clinical, high-trust. It feels expensive because it is **organised**, not
because it is flashy. *Protocol in → compliant expert intelligence out.*

It must communicate: trust · speed · scientific rigor · explainability ·
compliance safety · workflow usefulness.

> **Sources.** Authored from a written product brief — no external codebase or
> Figma was provided. All visual decisions are original to this system. See
> **Caveats** at the end.

---

## Content Fundamentals — how we write

The product speaks like a **scientific colleague**, not a salesperson and not a
chirpy chatbot. Precise, evidence-first, quietly confident.

- **Voice:** third-person and declarative about findings ("Dr. Marchetti led
  Phase 3 prefusion-F efficacy work…"). Address the user as **you** sparingly,
  in actions ("Generate brief"). The copilot refers to itself as **I** only in
  answer streams, briefly.
- **Casing:** Sentence case for everything in the UI. Mono **UPPERCASE** is
  reserved for overlines/eyebrows and metadata labels (`PROTOCOL`, `SCORE`,
  `ENDPOINTS`).
- **Numbers are first-class.** Scores, counts, titers, IDs, timestamps are set
  in mono so they line up and compare. Never round away meaning (92.4, not ~92).
- **Compliance language is deliberate.** Always use the *scientific-exchange*
  register and never commercial language:
  - ✅ "Scientifically relevant" · "Evidence-supported" · "Related trial
    experience" · "Non-promotional scientific exchange" · "Citation required"
  - ⛔ "target" · "drive adoption" · "likely to prescribe" · "sales
    opportunity" · "high-value account"
- **No hype, no emoji, no exclamation marks.** Iconography carries affect, not
  punctuation. Tone is measured even in empty/loading states.
- **Citations accompany claims.** Recommendations reference evidence (`[1]`),
  and briefs end with a stated guardrail check.

Examples in use:
> "I ranked experts by **scientific relevance** to RSV-PreF-301 — weighting
> direct Phase 3 trial experience, publication relevance, and guideline
> authorship."
> "Reviewed against Medical Affairs guardrails · no prescribing-volume or
> promotional content · audit-logged."

---

## Visual Foundations

**Overall feel.** Clinical document meets instrument panel. Dense, aligned,
authoritative. Whitespace and hairlines do the work that shadows and gradients
do in consumer SaaS.

- **Color.** Cool clinical off-white canvas (`--surface-canvas #f4f7f8`), white
  surfaces, charcoal ink (`--slate-950`), slate secondary text. A **single**
  brand accent — deep teal (`--accent #0e7178`) — used sparingly for primary
  action and focus. Four calm **semantic** accents that always carry meaning,
  never decoration: **evidence** (indigo), **compliance** (amber), **risk**
  (muted brick red), **validated** (clinical green). ~90% of any screen is
  neutral; color appears only to signal state. No bluish-purple gradients, no
  neon, no "AI sparkle".
- **Type.** The **IBM Plex** superfamily — engineered and scientific without
  being cold. **Sans** for UI/body (13px default — enterprise-dense), **Mono**
  for any number a user compares or cites (scores, IDs, refs, audit times), and
  **Serif** for the "clinical document" voice (protocol abstractions, generated
  briefs). Display is tightly tracked (`-0.02em`); eyebrows are mono, uppercase,
  wide-tracked.
- **Spacing.** 4px base grid. Compact by default; generous only where it aids
  scanning (between ranked cards, around the brief document).
- **Radii.** Small and clinical — 7px default control/card, 10px panels/drawers,
  pill only for tracks and status dots. Nothing bubbly.
- **Borders over shadows.** 1px hairlines (`--border-subtle`) define structure.
  Shadows are whisper-quiet (`--shadow-xs/sm`) and full elevation
  (`--shadow-overlay`) is reserved for true overlays (evidence drawer, dialogs).
- **Cards.** White, hairline border, near-flat. The *selected* state is a 1px
  teal ring, not a heavy lift. KOL cards are dense (rank, identity, score,
  segmented breakdown, rationale, actions) and built for side-by-side scanning.
- **Backgrounds.** Flat off-white. No imagery, no texture, no full-bleed photos
  — this is an instrument, not a marketing page. (If photography were ever
  added it would be cool-toned and restrained; default is none.)
- **Motion.** Minimal and functional. Fades and short eased slides
  (`cubic-bezier(.2,.7,.2,1)`, 200–260ms). The voice waveform is the only
  ambient animation, and it animates **only while listening** and respects
  `prefers-reduced-motion`. No bounce, no infinite decorative loops.
- **Hover / press.** Hover = a small step on the same hue (primary → teal-700;
  secondary/ghost → sunken fill). Focus = a soft 3px teal ring
  (`--focus-ring`). No scale/press bounce; state is communicated by value, not
  motion.
- **Transparency / blur.** Used only for the drawer scrim (`rgba(19,26,28,.28)`).
  No frosted glass elsewhere.

---

## Iconography

- **System:** [Lucide](https://lucide.dev) — a clean 24×24, ~2px-stroke,
  rounded-cap line set that matches the precise-but-warm character of IBM Plex.
  Icons are drawn inline as SVG with `stroke="currentColor"` so they inherit the
  semantic text color (a check is `--safe` green, a caution glyph is
  `--compliance` amber, etc.). **Flag:** Lucide is a *chosen* substitute (no icon
  set was supplied with the brief) — swap if the brand later standardises on
  another line set. When consuming this system, link Lucide from CDN or paste
  the few glyphs you need; keep stroke width and rounded caps consistent.
- **Affect via icon, not emoji.** No emoji anywhere. No unicode pictographs as
  icons. The only non-icon glyphs used as separators are the middot (·) and
  arrows already present in the font.
- **The brand mark** (`assets/logo-mark.svg`) is a teal rounded square holding a
  precise "focus aperture / scan" reticle with a center evidence node and an
  ascending sweep — reading as *precision + scanning for experts*. It doubles as
  the copilot's avatar in the conversation. Keep ≥ mark-height clear space.

---

## Index — what's in here

| Path | What |
|------|------|
| `styles.css` | **Global entry point** (consumers link this). `@import`s everything below. |
| `tokens/colors.css` | Neutrals, teal primary, semantic accents + semantic aliases |
| `tokens/typography.css` | Families, weights, type scale, leading, tracking |
| `tokens/spacing.css` | Spacing grid, radii, borders, shadows, layout rails |
| `tokens/fonts.css` | IBM Plex `@import` (see Caveats) |
| `tokens/base.css` | Light reset + base element styles + `.ds-eyebrow`, `.ds-scroll` |
| `guidelines/*.html` | Foundation specimen cards (Design System tab) |
| `assets/logo-mark.svg` | Brand mark / copilot avatar |
| **Components** | |
| `components/core/` | `Button`, `Badge`, `Tag`, `Avatar`, `Card` |
| `components/evidence/` | `ScoreBar`, `Citation` |
| `components/copilot/` | `KolCard`, `CompliancePanel`, `VoiceControl` |
| **UI kit** | |
| `ui_kits/copilot-workspace/` | The three-panel cockpit (see its README) |
| `SKILL.md` | Agent-Skill manifest for downloaded use |

**Namespace.** Components are exposed at
`window.MedicalAffairsCopilotDesignSystem_2d0005.<Name>` after loading
`_ds_bundle.js`.

**Starting points.** `Button` (Core), `KolCard` (Copilot), and the Cockpit
Workspace screen.

---

## Caveats

- **Fonts are Google-hosted.** IBM Plex is loaded via `@import` from Google
  Fonts in `tokens/fonts.css` rather than self-hosted woff2 — so the design-tab
  "Fonts" count reads 0 even though type renders correctly. If you have licensed
  IBM Plex binaries, drop them in `assets/fonts/` and swap the `@import` for
  local `@font-face` rules. **Please confirm whether to self-host.**
- **Iconography is a substitution** (Lucide) — see above.
- The product brand, palette, and mark were **designed from scratch** for this
  brief. If there is an existing Medical Affairs Copilot brand, share it and I
  will reconcile.

---

### 🔎 Help me make this perfect

1. **Fonts:** self-host IBM Plex, or is the Google-Fonts import fine for now?
2. **Brand:** is the teal/charcoal direction right, or do you have existing brand
   colors, a logo, and an icon set I should match?
3. **Scope:** want more components (audit-trail item, expert comparison as a
   full screen, dialog/toast, empty/loading states) or additional product
   surfaces (protocol upload/parse screen, KOL profile detail)?
