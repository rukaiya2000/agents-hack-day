**ScoreBar** — one line of a KOL score breakdown. Stack several so a total score reads as the sum of explainable parts.

```jsx
<ScoreBar label="Phase 3 trial experience" value={28} max={30} weight="× 0.30" tone="accent" />
<ScoreBar label="Publication relevance" value={24} max={25} tone="evidence" />
<ScoreBar label="Guideline authorship" value={12} max={20} tone="neutral" />
```

Props: `label`, `value`, `max`, `tone`, `weight` (contribution note), `height`.
