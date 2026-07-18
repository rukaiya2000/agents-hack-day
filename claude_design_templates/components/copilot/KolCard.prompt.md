**KolCard** — a ranked expert card for the right-hand rail. Dense, comparison-first; composes Avatar, Badge, Button. Use `selected` for the active expert in a comparison.

```jsx
<KolCard
  rank={1} name="Dr. Elena Marchetti" institution="Karolinska Institutet"
  specialty="Vaccinology" geography="EU · Sweden" score={92.4} status="validated"
  citations={37}
  breakdown={[{label:'Trial exp.',value:30},{label:'Publications',value:24},{label:'Guidelines',value:18},{label:'Recency',value:12}]}
  rationale="Direct Phase 3 RSV prefusion-F trial leadership; authored evidence on the protocol's primary endpoint."
  onViewEvidence={…} onGenerateBrief={…}
/>
```

Props: `rank`, `name`, `institution`, `specialty`, `geography`, `score`, `status` (`validated|review|conflict`), `rationale`, `citations`, `breakdown[]`, `selected`, `onSelect`, `onViewEvidence`, `onGenerateBrief`.
