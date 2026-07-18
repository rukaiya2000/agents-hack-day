// Evidence screen -> window.ScreensC
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge } = DS;
  const Icon = window.Icon;
  const { ScreenHead, Panel, Note, StatusBadge, SecLabel } = window.UI;
  const D = window.ORCH;

  const STRENGTH = { strong: ['safe', 'Strong'], moderate: ['compliance', 'Moderate'], weak: ['neutral', 'Weak'] };
  const TYPE_ICON = { Publication: 'book', 'Trial registry': 'flask', Guideline: 'shield', Congress: 'users', Institutional: 'protocols' };

  function Evidence({ openKol }) {
    const [type, setType] = React.useState('All');
    const [strength, setStrength] = React.useState('All');
    const [sel, setSel] = React.useState(D.evidence[0]);

    const rows = D.evidence.filter((e) =>
      (type === 'All' || e.type === type) && (strength === 'All' || e.strength === strength));

    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Stage 04 · Evidence retrieved"
          title="Evidence"
          desc="Public sources collected for the protocol — trials, publications, guidelines, congress, and institutional pages. Every source is scored for relevance against protocol endpoints and linked to candidate experts."
          actions={<Button variant="secondary" size="sm" iconLeft={<Icon name="download" size={14} />}>Export evidence</Button>}
        />

        <div className="toolbar">
          <span className="fsearch"><Icon name="queries" size={14} /><input placeholder="Search title, entity, or source…" /></span>
          <span className="fsep" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Type</span>
          {['All', ...D.evidenceFilters.type].map((t) => (
            <button key={t} className="fbtn" aria-pressed={type === t} onClick={() => setType(t)}>{t}</button>
          ))}
          <span className="fsep" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Strength</span>
          {['All', ...D.evidenceFilters.strength].map((t) => (
            <button key={t} className="fbtn" aria-pressed={strength === t} onClick={() => setStrength(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        <div className="cols cols--ev">
          <Panel noBody>
            <table className="tbl">
              <thead><tr>
                <th>Source</th><th>Title</th><th>Date</th><th className="num">Relevance</th><th>Strength</th><th>Linked KOLs</th>
              </tr></thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id} aria-selected={sel === e} onClick={() => setSel(e)}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                        <Icon name={TYPE_ICON[e.type]} size={14} color="var(--evidence)" />
                        <span style={{ fontSize: 'var(--text-2xs)' }}>
                          <div style={{ fontWeight: 500 }}>{e.type}</div>
                          <div className="muted mono" style={{ fontSize: 9 }}>{e.host}</div>
                        </span>
                      </span>
                    </td>
                    <td style={{ maxWidth: 300 }}>{e.title}</td>
                    <td className="muted mono" style={{ fontSize: 'var(--text-2xs)' }}>{e.date}</td>
                    <td className="num"><span style={{ color: e.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)', fontWeight: 500 }}>{e.score}</span></td>
                    <td><StatusBadge status={STRENGTH[e.strength][0] === 'safe' ? 'done' : STRENGTH[e.strength][0] === 'compliance' ? 'warn' : 'pending'} label={STRENGTH[e.strength][1]} /></td>
                    <td className="mono" style={{ fontSize: 'var(--text-2xs)' }}>{e.kols.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* preview panel */}
          <Panel eyebrow="Source preview" title={sel.type}
            actions={<a href="#" onClick={(e) => e.preventDefault()} className="iconbtn" title="Open source"><Icon name="external" size={14} /></a>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div className="doc" style={{ fontSize: 'var(--text-md)', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.35 }}>{sel.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span>{sel.host}</span><span>·</span><span>{sel.date}</span><span>·</span><span>{sel.geo}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--evidence-ink)', marginTop: 6, wordBreak: 'break-all' }}>{sel.url}</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Badge tone="evidence" size="sm">Relevance {sel.score}</Badge>
                <StatusBadge status={STRENGTH[sel.strength][0] === 'safe' ? 'done' : STRENGTH[sel.strength][0] === 'compliance' ? 'warn' : 'pending'} label={STRENGTH[sel.strength][1] + ' evidence'} />
              </div>

              <div>
                <SecLabel icon="book">Supporting snippet</SecLabel>
                <div className="note note--evidence" style={{ alignItems: 'flex-start' }}>
                  <Icon name="dot" size={4} style={{ opacity: 0 }} />
                  <span className="doc" style={{ color: 'var(--slate-700)', fontSize: 'var(--text-sm)' }}>“{sel.snippet}”</span>
                </div>
              </div>

              <div>
                <SecLabel icon="target">Extracted entities</SecLabel>
                <div className="pillrow">
                  {sel.entities.map((en) => (
                    <span key={en} style={{ fontSize: 'var(--text-2xs)', background: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '3px 8px', color: 'var(--text-secondary)' }}>{en}</span>
                  ))}
                </div>
              </div>

              <div>
                <SecLabel icon="link">Linked KOL candidates</SecLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {sel.kols.map((kid) => {
                    const k = D.candidates.find((c) => c.id === kid);
                    return (
                      <button key={kid} className="rowlink" onClick={() => openKol(kid)}>
                        <span style={{ fontWeight: 500 }}>{k.name}</span>
                        <span className="muted" style={{ fontSize: 'var(--text-2xs)' }}>{k.institution}</span>
                        <Icon name="chevron" size={13} color="var(--text-tertiary)" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  window.ScreensC = { Evidence };
})();
