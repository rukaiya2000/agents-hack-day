// App — composes the three-panel cockpit and owns interaction state.
function App() {
  const D = window.DS;
  const data = window.WS;
  const [selectedId, setSelectedId] = React.useState('marchetti');
  const [voiceState, setVoiceState] = React.useState('listening');
  const [elapsed, setElapsed] = React.useState('0:12');
  const [transcript, setTranscript] = React.useState(data.transcript);
  const [brief, setBrief] = React.useState(null);
  const [drawer, setDrawer] = React.useState({ open: false, id: 'marchetti' });

  const expertById = (id) => data.experts.find((e) => e.id === id);
  const evidenceFor = (id) => data.evidence[id] || data.evidence.marchetti;

  // live elapsed timer while listening
  React.useEffect(() => {
    if (voiceState !== 'listening') return;
    let s = 12;
    const t = setInterval(() => { s += 1; setElapsed(`0:${String(s).padStart(2, '0')}`); }, 1000);
    return () => clearInterval(t);
  }, [voiceState]);

  const toggleVoice = () => setVoiceState((v) => (v === 'listening' ? 'idle' : 'listening'));

  const openEvidence = (id) => { setSelectedId(id); setDrawer({ open: true, id }); };

  const generateBrief = (id) => {
    setSelectedId(id);
    setVoiceState('thinking');
    setBrief({ expert: expertById(id), evidence: evidenceFor(id), generating: true });
    setTimeout(() => {
      setVoiceState('idle');
      setBrief({ expert: expertById(id), evidence: evidenceFor(id), generating: false, onClose: () => setBrief(null) });
    }, 1700);
  };

  const onSuggest = (text) => {
    setTranscript((t) => [...t, { role: 'user', text }]);
    if (/brief/i.test(text)) {
      generateBrief('marchetti');
      setTimeout(() => setTranscript((t) => [...t, { role: 'assistant', text: 'Drafted a compliance-checked pre-call brief for Dr. Marchetti below — scientifically relevant topics only, with supporting evidence [1] [2]. No prescribing-volume or promotional content was included.', cites: ['1', '2'] }]), 700);
    } else if (/compare/i.test(text)) {
      setTimeout(() => setTranscript((t) => [...t, { role: 'assistant', text: 'On trial experience, Dr. Marchetti leads (direct Phase 3 prefusion-F leadership) while Prof. Tanaka scores highest on publication relevance [1]. Use the Compare view at right for the full breakdown.', cites: ['1'] }]), 600);
    } else {
      setTimeout(() => setTranscript((t) => [...t, { role: 'assistant', text: 'Both Dr. Marchetti and Dr. Okonkwo have protocol-relevant RSV-LRTD publications addressing the ≥60 population [1] [3]. Open evidence to inspect the underlying sources.', cites: ['1', '3'] }]), 600);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--surface-canvas)' }}>
      <TopBar protocol={data.protocol} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative' }}>
        <ProtocolPanel protocol={data.protocol} />
        <CopilotConversation
          transcript={transcript}
          suggested={data.suggested}
          voiceState={voiceState}
          elapsed={elapsed}
          onToggleVoice={toggleVoice}
          brief={brief}
          onCite={(ref) => openEvidence(selectedId)}
          onSuggest={onSuggest}
        />
        <KolRail
          experts={data.experts}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onViewEvidence={openEvidence}
          onGenerateBrief={generateBrief}
        />
        <EvidenceDrawer
          open={drawer.open}
          expert={expertById(drawer.id)}
          evidence={evidenceFor(drawer.id)}
          onClose={() => setDrawer((d) => ({ ...d, open: false }))}
        />
      </div>
    </div>
  );
}
window.App = App;
