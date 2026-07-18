**CompliancePanel** — the always-present guardrail module. Calm amber framing; states the active Medical Affairs rules. Keep item copy non-promotional ("Scientifically relevant", "Evidence-supported", "Medical/Commercial firewall active").

```jsx
<CompliancePanel
  mode="Medical Affairs"
  items={[
    {label:'Citation-required recommendations'},
    {label:'No prescribing-volume targeting'},
    {label:'No pre-approval promotional claims'},
    {label:'Medical/Commercial firewall active'},
  ]}
  auditAvailable
/>
```

Props: `mode`, `items[] ({label, ok})`, `auditAvailable`.
