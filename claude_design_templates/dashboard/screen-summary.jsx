// Summary / Export screen -> window.ScreensH
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge, Avatar } = DS;
  const Icon = window.Icon;
  const { ScreenHead, Panel, Note, StatusBadge } = window.UI;
  const D = window.ORCH;

  const FMT_TONE = { PDF: { bg: 'var(--risk-tint)', c: 'var(--risk-ink)' }, CSV: { bg: 'var(--safe-tint)', c: 'var(--safe-ink)' }, JSON: { bg: 'var(--evidence-tint)', c: 'var(--evidence-ink)' }, PKT: { bg: 'var(--accent-tint)', c: 'var(--teal-700)' } };

  function Summary({ openKol }) {
    const P = D.protocol;
    const top = D.topKols.map((id) => D.candidates.find((c) => c.id === id));

    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Stage 09 · Ready for review"
          title="Processing summary"
          desc="The complete, evidence-backed output of this run — ready to export or route for Medical Affairs approval. Every figure below traces to a source artifact in the index."
          actions={<>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="flag" size={14} />}>Request changes</Button>
            <Button variant="primary" size="sm" iconLeft={<Icon name="check" size={14} />}>Approve summary</Button>
          </>}
        />

        <div className="cols" style={{ gridTemplateColumns: '1fr 360px', alignItems: 'start' }}>
          {/* main summary column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* brief summary */}
            <Panel eyebrow="Protocol brief" title={P.id}>
              <div className="doc" style={{ fontSize: 'var(--text-md)', marginBottom: 14 }}>{P.title}</div>
              <dl className="kv">
                <dt>Sponsor</dt><dd>{P.sponsor}</dd>
                <dt>Phase</dt><dd>Phase {P.phase}</dd>
                <dt>Indication</dt><dd>{P.indication}</dd>
                <dt>Intervention</dt><dd>{P.intervention}</dd>
                <dt>Population</dt><dd>{P.population}</dd>
                <dt>Geography</dt><dd>{P.geographies.join(' · ')}</dd>
                <dt>Specialties</dt><dd>{P.specialties.join(' · ')}</dd>
              </dl>
            </Panel>

            {/* top ranked KOLs */}
            <Panel eyebrow="Top ranked" title="Evidence-backed expert recommendations"
              actions={<Button variant="ghost" size="sm" iconRight={<Icon name="chevron" size={13} />}>All 64</Button>} noBody>
              <div>
                {top.map((c, i) => (
                  <button key={c.id} onClick={() => openKol(c.id)} style={{ display: 'flex', gap: 13, width: '100%', textAlign: 'left', font: 'inherit', cursor: 'pointer', background: 'transparent', border: 'none', padding: 16, borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', color: 'var(--text-tertiary)', fontWeight: 500, flex: 'none', width: 22 }}>{c.rank}</span>
                    <Avatar name={c.name} size={38} tone="auto" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{c.name}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', marginTop: 3 }}>{c.institution} · {c.specialty} · {c.geo}</div>
                      <p className="doc" style={{ fontSize: 'var(--text-sm)', marginTop: 7 }}>{c.rationale}</p>
                      <div style={{ marginTop: 7 }}><Badge tone="evidence" size="sm" icon={<Icon name="link" size={11} />}>{c.sources} supporting sources</Badge></div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: c.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)', flex: 'none' }}>{c.score}</span>
                  </button>
                ))}
              </div>
            </Panel>

            {/* warnings */}
            <Panel eyebrow="Quality" title="Missing data &amp; warnings"
              actions={<Badge tone="compliance" size="sm" dot>{D.warnings.length}</Badge>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {D.warnings.map((w, i) => (
                  <Note key={i} tone={w.tone} icon={w.tone === 'risk' ? 'flag' : 'alert'}>{w.text}</Note>
                ))}
              </div>
            </Panel>
          </div>

          {/* export + status rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Panel eyebrow="Run status" title="Processing complete">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[
                  ['KOLs found', '64', 'safe'],
                  ['Shortlisted', '18', 'accent'],
                  ['Evidence sources', '148', 'evidence'],
                  ['Open compliance flags', '2', 'risk'],
                  ['Moss index', '97%', 'compliance'],
                ].map(([l, v, t]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{l}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 500, color: `var(--${t === 'accent' ? 'text-accent' : t + '-ink'})` }}>{v}</span>
                  </div>
                ))}
              </div>
              <Note tone="compliance" icon="shield" >Summary can be exported now. Final approval is blocked until the 2 open compliance flags are cleared.</Note>
            </Panel>

            <Panel eyebrow="Export" title="Download &amp; share">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {D.exports.map((e) => {
                  const t = FMT_TONE[e.fmt];
                  return (
                    <button key={e.fmt} className="expcard">
                      <span className="expcard__fmt" style={{ background: t.bg, color: t.c }}>{e.fmt}</span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-sm)' }}>{e.label}</span>
                        <span style={{ display: 'block', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', marginTop: 3, lineHeight: 1.4 }}>{e.desc}</span>
                      </span>
                      <Icon name="download" size={15} color="var(--text-tertiary)" style={{ flex: 'none', marginTop: 2 }} />
                    </button>
                  );
                })}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    );
  }

  window.ScreensH = { Summary };
})();
