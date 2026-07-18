**Citation** — an evidence reference. `compact` renders an inline mono `[ref]` pill for answer text; the full shape is a list row (serif title, mono source·year, relevance note).

```jsx
Answer text with a claim <Citation compact refId="3" onClick={open} />.

<Citation refId="NEJM 2024" title="Efficacy of a bivalent RSV prefusion F vaccine in older adults"
  source="N Engl J Med" year="2024"
  relevance="Directly supports the protocol's primary immunogenicity endpoint in adults ≥60." />
```

Props: `refId`, `title`, `source`, `year`, `relevance`, `compact`, `onClick`.
