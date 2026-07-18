# Copilot Workspace — UI Kit

A high-fidelity, click-through recreation of the **Medical Affairs Copilot**
product surface: the three-panel cockpit.

> **protocol in → compliant expert intelligence out**

## Layout

| Region | File | Contents |
|--------|------|----------|
| Top bar | `TopBar.jsx` | Logo lockup, parsed-protocol context, Medical Affairs mode, audit, user |
| Left rail | `ProtocolPanel.jsx` | Clinical abstraction of the parsed protocol + persistent `CompliancePanel` |
| Center | `CopilotConversation.jsx` | Transcript, cited answer stream, suggested prompts, `VoiceControl` dock |
| Center (on request) | `BriefDocument.jsx` | The compliant MSL pre-call brief (serif document) |
| Right rail | `KolRail.jsx` | Ranked `KolCard`s + a two-expert Compare view |
| Overlay | `EvidenceDrawer.jsx` | Slide-over of protocol-relevant citations |
| Shell | `App.jsx` | Composes the panels, owns interaction state |
| Data | `data.js` | Demo protocol, experts, evidence, transcript (`window.WS`) |

## How it loads

`index.html` links the design-system bundle and reads components off the
namespace:

```html
<link rel="stylesheet" href="../../styles.css">
<script src="../../_ds_bundle.js"></script>
<script>window.DS = window.MedicalAffairsCopilotDesignSystem_2d0005 || {};</script>
```

Every panel pulls its primitives from `window.DS` (`Button`, `Badge`, `Tag`,
`Avatar`, `Card`, `ScoreBar`, `Citation`, `KolCard`, `CompliancePanel`,
`VoiceControl`) — the kit composes the system, it does not re-implement it.

## Demo-ready interactions

- A Phase 3 protocol (`RSV-PreF-301`) is already parsed (left rail).
- The voice control sits in an active **listening** state.
- Ranked KOL cards are visible; click one to select it.
- **View evidence** opens the evidence drawer for that expert.
- **Generate brief** streams a compliance-checked MSL pre-call brief into the
  center surface.
- The right-rail **Compare** toggle shows a two-expert score breakdown.
- Suggested prompts append a user turn + a cited assistant answer.
