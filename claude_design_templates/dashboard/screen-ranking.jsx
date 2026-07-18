// Ranking screen (explainable matrix) -> window.ScreensE
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge } = DS;
  const Icon = window.Icon;
  const { ScreenHead, Panel, Note, StatusBadge } = window.UI;
  const D = window.ORCH;

  const DIM_SHORT = {
    'Protocol match': 'Protocol\nmatch',
    'Trial investigator experience': 'Trial\nexperience',
    'Publication relevance': 'Publication\nrelevance',
    'Institution / site relevance': 'Institution /\nsite',
    'Guideline / congress influence': 'Guideline /\ncongress',
    'Recency': 'Recency',
  };
  const DIM_TONE = {
    'Protocol match': 'var(--accent)',
    'Trial investigator experience': 'var(--safe)',
    'Publication relevance': 'var(--evidence)',
    'Institution / site relevance': 'var(--slate-400)',
    'Guideline / congress influence': 'var(--evidence)',
    'Recency': 'var(--compliance)',
  };

  function Cell({ value, max, tone }) {
    const pct = Math.round((value / max) * 100);
    return (
      <span className="cell-score">
        <span className="bar"><i style={{ width: pct + '%', background: tone }} /></span>
        <span className="v">{value.toFixed(1)} <span style={{ color: 'var(--text-tertiary)' }}>/ {max}</span></span>
      </span>
    );
  }

  function Ranking({ openKol }) {
    const ranked = D.candidates.filter((c) => c.breakdown && c.breakdown.length);
    const dims = D.rankingDimensions;

    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Stage 06 · Ranked"
          title="Ranking"
          desc="Each expert's overall score is the weighted sum of six explainable dimensions. The matrix shows every component so a reviewer can see exactly why a candidate ranks where it does."
          actions={<>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="sliders" size={14} />}>Adjust weights</Button>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="download" size={14} />}>Export ranking</Button>
          </>}
        />

        <Note tone="info" icon="shield" >
          <span style={{ color: 'var(--text-secondary)' }}>Ranking weights scientific relevance only. <strong style={{ color: 'var(--text-primary)' }}>Prescribing volume, promotional value, and sales potential are excluded by policy</strong> and are never inputs to this score.</span>
        </Note>

        {/* weighting methodology */}
        <Panel eyebrow="Methodology" title="Scoring dimensions &amp; weights" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {dims.map((d) => (
              <div key={d.key}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.25, minHeight: 34 }}>{d.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 500, color: DIM_TONE[d.label] }}>{Math.round(d.weight * 100)}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>% weight</span>
                </div>
                <div className="cell-score" style={{ marginTop: 4 }}><span className="bar"><i style={{ width: (d.weight * 100 / 0.25 * 100 / 100) + '%', background: DIM_TONE[d.label] }} /></span></div>
              </div>
            ))}
          </div>
        </Panel>

        {/* the matrix */}
        <Panel noBody style={{ marginTop: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="matrix">
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, zIndex: 2 }} className="matrix__dim">Expert</th>
                  {dims.map((d) => (
                    <th key={d.key} style={{ minWidth: 92, whiteSpace: 'pre-line' }}>{DIM_SHORT[d.label] || d.label}<span className="wt">×{d.weight.toFixed(2)}</span></th>
                  ))}
                  <th>Flags</th>
                  <th className="num" style={{ textAlign: 'right' }}>Weighted<br />score</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((c) => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openKol(c.id)}>
                    <td className="matrix__dim" style={{ position: 'sticky', left: 0, zIndex: 1, minWidth: 188 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', width: 16 }}>{c.rank}</span>
                        <span>
                          <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>{c.name}</div>
                          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>{c.specialty} · {c.geo.split(' · ')[0]}</div>
                        </span>
                      </div>
                    </td>
                    {dims.map((d) => {
                      const b = c.breakdown.find((x) => x.label === d.label);
                      return <td key={d.key}>{b ? <Cell value={b.value} max={b.max} tone={DIM_TONE[d.label]} /> : <span className="muted">—</span>}</td>;
                    })}
                    <td>
                      {c.flags > 0
                        ? <Badge tone="risk" size="sm" dot>{c.flags}</Badge>
                        : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>0</span>}
                    </td>
                    <td className="num" style={{ textAlign: 'right' }}>
                      <span className="total" style={{ color: c.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)' }}>{c.score}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}><Icon name="chevron" size={14} color="var(--text-tertiary)" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* rationale strip for the top candidate */}
        <Panel eyebrow="Top rationale" title="Why Dr. Elena Marchetti ranks #1" style={{ marginTop: 16 }}
          actions={<Button variant="ghost" size="sm" iconRight={<Icon name="chevron" size={13} />} onClick={() => openKol('marchetti')}>Open profile</Button>}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { dim: 'Trial investigator experience', note: 'Coordinating PI across 14 EU sites for the pivotal Phase 3 prefusion-F efficacy cohort.', n: 2, tone: 'safe' },
              { dim: 'Publication relevance', note: 'First-author NEJM efficacy paper on the protocol\'s primary LRTD endpoint in adults ≥60.', n: 2, tone: 'evidence' },
              { dim: 'Protocol match', note: 'Direct overlap on intervention class, endpoint definition, and target population.', n: 3, tone: 'accent' },
            ].map((r) => (
              <div key={r.dim} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span className="ds-eyebrow" style={{ fontSize: 9 }}>{r.dim}</span>
                  <Badge tone="evidence" size="sm">{r.n} cited</Badge>
                </div>
                <div className="doc" style={{ fontSize: 'var(--text-sm)' }}>{r.note}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  window.ScreensE = { Ranking };
})();
