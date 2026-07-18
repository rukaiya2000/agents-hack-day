**Button** — the action control. Use one `primary` (teal) per surface; default everything else to `secondary` or `ghost`. `danger` is reserved for destructive/compliance-sensitive actions.

```jsx
<Button variant="primary" iconLeft={<MicIcon/>}>Start voice session</Button>
<Button variant="secondary" size="sm">View evidence</Button>
<Button variant="ghost">Dismiss</Button>
```

Variants: `primary | secondary | ghost | danger`. Sizes: `sm | md | lg`. Props: `iconLeft`, `iconRight`, `fullWidth`, `disabled`.
