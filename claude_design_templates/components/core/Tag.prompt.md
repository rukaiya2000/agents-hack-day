**Tag** — protocol attribute chip (key→value). Use for abstracting a parsed protocol into scannable facts; lay them out in a `flex` wrap row with `gap`.

```jsx
<Tag label="Phase" value="3" />
<Tag label="Geography" value="US · EU · JP" />
<Tag label="Specialty" value="Vaccinology" tone="accent" />
```

Props: `label` (uppercase mono key, optional), `value`, `icon`, `tone` (`neutral | accent`).
