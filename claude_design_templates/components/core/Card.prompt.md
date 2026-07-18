**Card** — the base surface. White, hairline border, optional header rail. Use `selected` for the active item in a comparison; `interactive` for clickable cards.

```jsx
<Card eyebrow="Protocol" title="RSV-PreF-301" actions={<Button size="sm" variant="ghost">Edit</Button>}>
  …body…
</Card>
<Card selected interactive>…</Card>
```

Props: `eyebrow`, `title`, `actions`, `selected`, `interactive`, `padding`.
