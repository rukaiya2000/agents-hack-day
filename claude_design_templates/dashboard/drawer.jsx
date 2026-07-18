// KOL profile drawer -> window.KolDrawer
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge, Avatar, ScoreBar } = DS;
  const Icon = window.Icon;
  const { StatusBadge, SecLabel, Note } = window.UI;
  const D = window.ORCH;

  const TYPE_ICON = { Publication: 'book', 'Trial registry': 'flask', Guideline: 'shield', Congress: 'users', Institutional: 'protocols' };
  // map evidence types onto the profile's evidence sections
  const SECTIONS = [
    { key: 'trial', label: 'Trial experience', icon: 'flask', types: ['Trial registry'] },
    { key: 'pub', label: 'Publication evidence', icon: 'book', types: ['Publication'] },
    { key: 'guide', label: 'Guideline / congress evidence', icon: 'shield', types: ['Guideline', 'Congress'] },
    { key: 'inst', label: 'Institution / site relevance', icon: 'protocols', types: ['Institutional'] },
  ];

  function EvidenceRow({ e }) {
    return (
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 11px', background: 'var(--surface-card)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
          <Icon name={TYPE_ICON[e.type]} size={14} color="var(--evidence)" style={{ marginTop: 2, flex: 'none' }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="doc" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3 }}>{e.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-tertiary)', marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span>{e.host}</span><span>·</span><span>{e.date}</span><span>·</span><span>{e.geo}</span>
            </div>
          </div>
          <Badge tone="evidence" size="sm">{e.score}</Badge>
        </div>
        <div className="doc" style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-700)', marginTop: 8, paddingLeft: 23 }}>"{e.snippet}"</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--evidence-ink)', marginTop: 7, paddingLeft: 23, wordBreak: 'break-all' }}>{e.url}</div>
      </div>
    );
  }

  function KolDrawer({ id, onClose }) {
    const c = D.candidates.find((k) => k.id === id);
    if (!c) return null;
    const ev = (c.evidence || []).map((eid) => D.evidence.find((e) => e.id === eid)).filter(Boolean);
    const flags = D.complianceFlags.filter((f) => f.kol === c.name);
    const TONE = { 'Protocol match': 'accent', 'Trial investigator experience': 'safe', 'Publication relevance': 'evidence', 'Institution / site relevance': 'neutral', 'Guideline / congress influence': 'evidence', 'Recency': 'compliance' };

    // ESC to close
    React.useEffect(() => {
      const h = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', h);
      return () => window.removeEventListener('keydown', h);
    }, [onClose]);

    return (
      <>
        <div className="scrim" onClick={onClose} />
        <aside className="drawer" role="dialog" aria-label={`Profile — ${c.name}`}>
          <div className="drawer__head">
            <Avatar name={c.name} size={42} tone="auto" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>RANK {String(c.rank).padStart(2, '0')}</span>
                <StatusBadge status={c.status} />
              </div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-snug)', marginTop: 3, lineHeight: 1.2 }}>{c.name}</h2>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>{c.title} · {c.institution}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>{c.specialty} · {c.location}</div>
            </div>
            <button className="iconbtn" onClick={onClose} title="Close" style={{ flex: 'none' }}><Icon name="x" size={16} /></button>
          </div>

          <div className="drawer__body">
            {/* score header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-inset)' }}>
              <div>
                <div className="ds-eyebrow">Overall protocol match</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', marginTop: 3 }}>Weighted across 6 dimensions</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-4xl)', fontWeight: 'var(--weight-medium)', lineHeight: 1, letterSpacing: '-0.02em', color: c.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)' }}>{c.score}</div>
            </div>

            {/* protocol match explanation */}
            <div className="drawer__sec">
              <SecLabel icon="target">Why this expert is relevant</SecLabel>
              <div className="doc" style={{ fontSize: 'var(--text-md)' }}>{c.rationale}</div>
            </div>

            {/* score breakdown */}
            {c.breakdown && c.breakdown.length ? (
              <div className="drawer__sec">
                <SecLabel icon="ranking">Score breakdown</SecLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {c.breakdown.map((b, i) => (
                    <ScoreBar key={i} label={b.label} value={b.value} max={b.max} tone={TONE[b.label] || 'evidence'} />
                  ))}
                </div>
              </div>
            ) : null}

            {/* compliance flags */}
            {flags.length ? (
              <div className="drawer__sec">
                <SecLabel icon="shield">Compliance &amp; conflict flags</SecLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {flags.map((f) => (
                    <Note key={f.id} tone={f.severity === 'high' ? 'risk' : 'compliance'} icon="flag">
                      <strong style={{ fontWeight: 600 }}>{f.type}.</strong> {f.detail}
                    </Note>
                  ))}
                </div>
              </div>
            ) : (
              <Note tone="safe" icon="check">No open compliance or transparency flags. Cleared for non-promotional scientific exchange.</Note>
            )}

            {/* evidence sections */}
            {SECTIONS.map((sec) => {
              const items = ev.filter((e) => sec.types.includes(e.type));
              if (!items.length) return null;
              return (
                <div className="drawer__sec" key={sec.key}>
                  <SecLabel icon={sec.icon}>{sec.label} · {items.length}</SecLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map((e) => <EvidenceRow key={e.id} e={e} />)}
                  </div>
                </div>
              );
            })}

            {!ev.length ? (
              <Note tone="compliance" icon="alert">Below the 2-source evidence threshold. Additional public evidence is required before this candidate can be recommended.</Note>
            ) : (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', textAlign: 'center', paddingTop: 4 }}>{c.sources} total public sources · {ev.length} shown · last activity {c.breakdown && c.breakdown.length ? '2025' : 'n/a'}</div>
            )}
          </div>

          <div className="drawer__foot">
            <Button variant="primary" size="sm" iconLeft={<Icon name="plus" size={14} />}>Add to shortlist</Button>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="flag" size={14} />}>Needs review</Button>
            <Button variant="ghost" size="sm" iconLeft={<Icon name="x" size={14} />} style={{ marginLeft: 'auto', color: 'var(--risk-ink)' }}>Exclude with reason</Button>
          </div>
        </aside>
      </>
    );
  }

  window.KolDrawer = KolDrawer;
})();
