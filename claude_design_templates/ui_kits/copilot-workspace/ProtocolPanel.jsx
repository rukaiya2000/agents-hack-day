// ProtocolPanel — left rail: a clean clinical abstraction of the parsed protocol.
function ProtocolPanel({ protocol }) {
  const { Tag, Badge, CompliancePanel } = window.DS;

  const Section = ({ label, children }) => (
    <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="ds-eyebrow" style={{ marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );

  const Field = ({ k, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 11 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{k}</span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.45 }}>{children}</span>
    </div>
  );

  return (
    <aside className="ds-scroll" style={{
      width: 'var(--rail-left)', flex: 'none', background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-subtle)', overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* header */}
      <div style={{ padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <span className="ds-eyebrow">Protocol Intelligence</span>
          <span style={{ flex: 1 }} />
          <Badge tone="safe" size="sm" dot>Parsed</Badge>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--teal-700)', marginBottom: 6 }}>
          {protocol.id} <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>· {protocol.nct}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-md)', lineHeight: 1.4, color: 'var(--text-primary)' }}>
          {protocol.title}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          <Tag label="Phase" value={protocol.phase} tone="accent" />
          <Tag label="Enroll" value={protocol.enrollment} />
        </div>
      </div>

      <Section label="Indication">
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>{protocol.indication}</div>
      </Section>

      <Section label="Intervention">
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>{protocol.intervention}</div>
      </Section>

      <Section label="Population & Geography">
        <Field k="Patient population">{protocol.population}</Field>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {protocol.geographies.map((g) => <Tag key={g} value={g} />)}
        </div>
      </Section>

      <Section label="Endpoints">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {protocol.endpoints.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Badge tone={e.type === 'Primary' ? 'accent' : 'neutral'} size="sm" style={{ flex: 'none', marginTop: 1 }}>{e.type}</Badge>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.4 }}>{e.text}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Relevant specialties">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {protocol.specialties.map((s) => <Tag key={s} value={s} />)}
        </div>
      </Section>

      <Section label="Key inclusion / exclusion">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {protocol.inclusion.map((t, i) => <Criterion key={'i' + i} ok text={t} />)}
          {protocol.exclusion.map((t, i) => <Criterion key={'e' + i} text={t} />)}
        </div>
      </Section>

      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
        <CompliancePanel
          mode="Medical Affairs"
          items={[
            { label: 'Citation-required recommendations' },
            { label: 'No prescribing-volume targeting' },
            { label: 'No pre-approval promotional claims' },
            { label: 'Medical / Commercial firewall active' },
          ]}
          auditAvailable
        />
      </div>
    </aside>
  );
}

function Criterion({ ok, text }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <span style={{ flex: 'none', marginTop: 2, color: ok ? 'var(--safe)' : 'var(--risk)' }}>
        {ok ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        )}
      </span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-700)', lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}
window.ProtocolPanel = ProtocolPanel;
