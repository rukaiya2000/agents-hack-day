// CopilotConversation — center working surface: transcript, answer stream,
// suggested prompts, voice control, and the generated brief.
function renderWithCitations(text, onCite) {
  const { Citation } = window.DS;
  const parts = String(text).split(/(\[\d+\])/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[(\d+)\]$/);
    if (m) return <Citation key={i} compact refId={m[1]} onClick={() => onCite(m[1])} />;
    return <span key={i}>{p}</span>;
  });
}

function UserMsg({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        maxWidth: '78%', padding: '11px 14px', borderRadius: '12px 12px 4px 12px',
        background: 'var(--accent-tint)', border: '1px solid var(--teal-100)',
        fontSize: 'var(--text-md)', color: 'var(--teal-700)', lineHeight: 1.5,
      }}>{text}</div>
    </div>
  );
}

function AssistantMsg({ text, onCite }) {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
      <img src="../../assets/logo-mark.svg" width="28" height="28" alt="" style={{ flex: 'none', marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>Copilot</div>
        <div style={{ fontSize: 'var(--text-md)', color: 'var(--text-primary)', lineHeight: 1.65 }}>
          {renderWithCitations(text, onCite)}
        </div>
      </div>
    </div>
  );
}

function CopilotConversation({
  transcript, suggested, voiceState, elapsed, onToggleVoice,
  brief, onCite, onSuggest,
}) {
  const { VoiceControl, Button } = window.DS;
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight;
  }, [transcript, brief]);

  return (
    <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--surface-canvas)' }}>
      {/* context bar */}
      <div style={{
        height: 44, flex: 'none', display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-card)',
      }}>
        <span className="ds-eyebrow">Copilot Session</span>
        <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Protocol-aware · evidence-cited</span>
        <span style={{ flex: 1 }} />
        <Button size="sm" variant="ghost">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}><path d="M3 12a9 9 0 1 0 9-9 9.7 9.7 0 0 0-6.7 2.7L3 8"/><path d="M3 3v5h5"/></svg>
          New session
        </Button>
      </div>

      {/* conversation */}
      <div ref={scrollRef} className="ds-scroll" style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {transcript.map((m, i) => (
            m.role === 'user'
              ? <UserMsg key={i} text={m.text} />
              : <AssistantMsg key={i} text={m.text} onCite={onCite} />
          ))}
          {brief ? <BriefDocument {...brief} /> : null}
        </div>
      </div>

      {/* suggested prompts */}
      {suggested && suggested.length ? (
        <div style={{ flex: 'none', padding: '0 20px 12px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {suggested.map((s, i) => (
              <button key={i} onClick={() => onSuggest(s)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px',
                background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7M12 5v14"/></svg>
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* voice control dock */}
      <div style={{ flex: 'none', padding: '12px 20px 16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <VoiceControl
            state={voiceState} elapsed={elapsed} onToggle={onToggleVoice}
            transcript={voiceState === 'listening' ? 'Draft a non-promotional brief for Dr. Marchetti' : ''}
          />
        </div>
      </div>
    </main>
  );
}
window.CopilotConversation = CopilotConversation;
