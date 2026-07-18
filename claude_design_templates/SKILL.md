---
name: medical-affairs-copilot-design
description: Use this skill to generate well-branded interfaces and assets for Medical Affairs Copilot — a protocol-aware scientific-intelligence workspace for pharma Medical Affairs teams — for production or throwaway prototypes/mocks. Contains design guidelines, colors, type, fonts, the brand mark, and a UI-kit of components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill first — it covers the product
context, content (copy) fundamentals, visual foundations, and iconography — then
explore the other files:

- `styles.css` + `tokens/` — the CSS custom properties (colors, type, spacing,
  shadows) and the IBM Plex font imports. Reference tokens; do not invent colors.
- `components/` — reusable React primitives (`Button`, `Badge`, `Tag`, `Avatar`,
  `Card`, `ScoreBar`, `Citation`, `KolCard`, `CompliancePanel`, `VoiceControl`).
  Each has a `.d.ts` (props) and `.prompt.md` (what/when + example).
- `ui_kits/copilot-workspace/` — a full three-panel cockpit recreation showing
  how the primitives compose into the real product.
- `assets/` — the brand mark (also the copilot avatar).

If creating **visual artifacts** (slides, mocks, throwaway prototypes), copy the
assets and tokens you need and produce static HTML files for the user to view.
If working on **production code**, copy assets and follow the rules here to
become an expert in designing with this brand.

Hold the line on the brand: calm, clinical, high-trust; one teal accent + four
semantic accents that carry meaning; borders over shadows; IBM Plex (Sans/Mono/
Serif); compliance-aware, non-promotional copy; **no emoji, no gradients, no AI
sparkle.**

If the user invokes this skill without other guidance, ask what they want to
build, ask a few focused questions, and act as an expert designer who outputs
HTML artifacts _or_ production code, depending on the need.
