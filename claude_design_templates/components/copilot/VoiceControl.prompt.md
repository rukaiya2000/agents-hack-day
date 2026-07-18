**VoiceControl** — the ambient voice session bar. Quiet mic toggle + live waveform + state label + timer. Waveform animates only while `listening` (respects reduced-motion).

```jsx
<VoiceControl state="listening" elapsed="0:12"
  transcript="Find infectious disease KOLs for this protocol"
  onToggle={…} />
```

Props: `state` (`idle | listening | thinking`), `transcript`, `elapsed`, `onToggle`.
