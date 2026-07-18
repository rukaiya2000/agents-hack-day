// KolRail — right rail: ranked experts + a compact comparison view.
function KolRail({ experts, selectedId, onSelect, onViewEvidence, onGenerateBrief }) {
  const { KolCard, ScoreBar, Avatar, Badge, Button } = window.DS;
  const [mode, setMode] = React.useState('ranked');
  const top2 = experts.slice(0, 2);

  const Toggle = () => (
    <div style={{ display: 'inline-flex', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: 2 }}>
      {['ranked', 'compare'].map((m) => (
        <button key={m} onClick={() => setMode(m)} style={{
          height: 26, padding: '0 11px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
          textTransform: 'capitalize', background: mode === m ? 'var(--surface-card)' : 'transparent',
          color: mode === m ? 'var(--text-primary)' : 'var(--text-tertiary)',
          boxShadow: mode === m ? 'var(--shadow-xs)' : 'none',
        }}>{m}</button>
      ))}
    </div>
  );

  return (
    <aside className="ds-scroll" style={{
      width: 'var(--rail-right)', flex: 'none', background: 'var(--surface-canvas)',
      borderLeft: '1px solid var(--border-subtle)', overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 2, background: 'var(--surface-canvas)',
        padding: '14px 16px 12px', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
          <span className="ds-eyebrow">Ranked Experts</span>
          <Badge tone="neutral" size="sm">{experts.length}</Badge>
          <span style={{ flex: 1 }} />
          <Toggle />
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
          Sorted by scientific relevance to {`RSV-PreF-301`}
        </div>
      </div>

      {mode === 'ranked' ? (
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {experts.map((e) => (
            <KolCard
              key={e.id} {...e}
              breakdown={e.breakdown.map((b) => ({ label: b.label.split(' ')[0], value: b.value }))}
              selected={e.id === selectedId}
              onSelect={() => onSelect(e.id)}
              onViewEvidence={() => onViewEvidence(e.id)}
              onGenerateBrief={() => onGenerateBrief(e.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            {top2.map((e) => (
              <div key={e.id} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center' }}>
                <Avatar name={e.name} size={36} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', lineHeight: 1.2 }}>{e.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-medium)', color: 'var(--teal-700)', marginTop: 6 }}>{e.score}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 13 }}>
            {top2[0].breakdown.map((b, i) => (
              <div key={i}>
                <div style={{ fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>{b.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <ScoreBar label={top2[0].name.split(' ').slice(-1)} value={b.value} max={b.max} tone="accent" height={5} />
                  <ScoreBar label={top2[1].name.split(' ').slice(-1)} value={top2[1].breakdown[i].value} max={top2[1].breakdown[i].max} tone="evidence" height={5} />
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" fullWidth style={{ marginTop: 12 }} onClick={() => onGenerateBrief(top2[0].id)}>Generate brief for top match</Button>
        </div>
      )}
    </aside>
  );
}
window.KolRail = KolRail;
