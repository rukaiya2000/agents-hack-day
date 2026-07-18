// BriefDocument — the compliant MSL pre-call brief (serif "clinical document" voice).
function BriefDocument({ expert, evidence = [], generating, onClose }) {
  const { Badge, Button, Citation } = window.DS;
  if (!expert) return null;

  const DocSection = ({ title, children }) => (
    <div style={{ marginTop: 20 }}>
      <div className="ds-eyebrow" style={{ color: 'var(--teal-700)', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );

  const topics = [
    'Scientifically relevant data on RSV-confirmed LRTD efficacy in adults ≥60.',
    'Evidence-supported discussion of day-30 neutralizing immunogenicity.',
    'Related trial experience in subunit RSV vaccine safety & reactogenicity.',
  ];

  return (
    <div style={{
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px',
        borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-inset)',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>MSL Pre-Call Brief</span>
        <Badge tone="safe" size="sm" dot>Compliance-checked</Badge>
        <span style={{ flex: 1 }} />
        {generating ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--evidence-ink)' }}>
            <span className="brief-pulse" style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--evidence)' }} />
            Generating
          </span>
        ) : (
          <>
            <Button size="sm" variant="ghost">Export PDF</Button>
            <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>
          </>
        )}
      </div>

      <div style={{ padding: '22px 26px', fontFamily: 'var(--font-serif)' }}>
        <style>{`@keyframes brief-pulse{0%,100%{opacity:.35}50%{opacity:1}} .brief-pulse{animation:brief-pulse 1.1s ease-in-out infinite}
          @keyframes brief-rise{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
          .brief-rise{animation:brief-rise .5s ease both}`}</style>

        <div className="brief-rise">
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{expert.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 5, letterSpacing: '.03em' }}>
            {expert.institution} · {expert.specialty} · {expert.geography}
          </div>
        </div>

        <DocSection title="Scientific summary">
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)', color: 'var(--slate-700)' }}>
            {expert.name.split(' ').slice(-1)} has <b style={{ color: 'var(--text-primary)' }}>direct Phase 3 trial experience</b> relevant to RSV-PreF-301 and has authored evidence directly supporting the protocol&rsquo;s primary efficacy endpoint. Engagement should center on <b style={{ color: 'var(--text-primary)' }}>non-promotional scientific exchange</b>, not product positioning.
          </p>
        </DocSection>

        <DocSection title="Scientifically relevant discussion topics">
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {topics.map((t, i) => (
              <li key={i} style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, color: 'var(--slate-700)' }}>{t}</li>
            ))}
          </ul>
        </DocSection>

        <DocSection title="Supporting evidence">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-sans)' }}>
            {evidence.map((c) => <Citation key={c.refId} {...c} />)}
          </div>
        </DocSection>

        <div style={{
          marginTop: 22, paddingTop: 14, borderTop: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--compliance)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
          Reviewed against Medical Affairs guardrails · no prescribing-volume or promotional content · audit-logged
        </div>
      </div>
    </div>
  );
}
window.BriefDocument = BriefDocument;
