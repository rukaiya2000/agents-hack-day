// Protocol Brief + Search Queries screens -> window.ScreensB
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge, Tag } = DS;
  const Icon = window.Icon;
  const { ScreenHead, Panel, Confidence, Chunk, Note, StatusBadge } = window.UI;
  const D = window.ORCH;

  // -------------------------------------------------- Protocol Brief
  function Brief() {
    const [active, setActive] = React.useState(D.brief[5]); // mechanism (a review item)
    const lowConf = D.brief.filter((b) => b.confidence < 85).length;
    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Stage 02 · Brief extracted"
          title="Protocol brief"
          desc="Structured extraction of RSV-PreF-301. Each field shows extraction confidence and the source protocol chunk it was drawn from. Review and edit before the brief drives query generation."
          actions={<>
            <Badge tone="compliance" size="sm" dot>{lowConf} fields below 85%</Badge>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="check" size={14} />}>Approve all</Button>
          </>}
        />
        <div className="cols cols--brief">
          <Panel noBody>
            <table className="tbl">
              <thead><tr>
                <th>Field</th><th>Extracted value</th><th>Confidence</th><th>Source</th><th>Status</th><th></th>
              </tr></thead>
              <tbody>
                {D.brief.map((b, i) => (
                  <tr key={i} aria-selected={active === b} onClick={() => setActive(b)}>
                    <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {b.section}
                      {b.derived ? <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 3, padding: '0 4px' }}>DERIVED</span> : null}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 320 }}>{b.value}</td>
                    <td><Confidence value={b.confidence} /></td>
                    <td><Chunk>{b.chunk}</Chunk></td>
                    <td><StatusBadge status={b.status} /></td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button className="iconbtn" title="Edit" onClick={(e) => { e.stopPropagation(); setActive(b); }}><Icon name="edit" size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* inspector */}
          <Panel eyebrow="Inspector" title={active.section}
            actions={<StatusBadge status={active.status} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div className="ds-eyebrow" style={{ marginBottom: 6 }}>Extracted value</div>
                <div className="doc" style={{ fontSize: 'var(--text-md)' }}>{active.value}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div>
                  <div className="ds-eyebrow" style={{ marginBottom: 6 }}>Confidence</div>
                  <Confidence value={active.confidence} />
                </div>
                <div>
                  <div className="ds-eyebrow" style={{ marginBottom: 6 }}>Source chunk</div>
                  <Chunk>{active.chunk}</Chunk>
                </div>
              </div>
              {active.confidence < 85 ? (
                <Note tone="compliance" icon="alert">
                  {active.derived
                    ? 'This field was inferred from the protocol, not stated verbatim. Confirm before it influences ranking.'
                    : 'Confidence is below the 85% review threshold. Verify against the source chunk before approval.'}
                </Note>
              ) : (
                <Note tone="safe" icon="check">High-confidence extraction with a located source chunk. Safe to approve.</Note>
              )}
              <div className="panel" style={{ boxShadow: 'none', background: 'var(--surface-inset)' }}>
                <div className="panel__body" style={{ padding: 12 }}>
                  <div className="ds-eyebrow" style={{ marginBottom: 7 }}>Source excerpt · {active.chunk}</div>
                  <div className="doc" style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-700)' }}>
                    “…{active.value.toLowerCase().slice(0, 90)}… as specified in the study protocol, consistent with the stated objectives for the ≥60 population.”
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="primary" size="sm" iconLeft={<Icon name="check" size={14} />}>Approve</Button>
                <Button variant="secondary" size="sm" iconLeft={<Icon name="edit" size={14} />}>Edit value</Button>
                <Button variant="ghost" size="sm">Flag for reviewer</Button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  // -------------------------------------------------- Search Queries
  function Queries() {
    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Stage 03 · Queries generated"
          title="Search queries"
          desc="Query groups generated from the protocol brief, mapped to public source coverage. Approve, edit, disable, or regenerate before evidence collection runs."
          actions={<>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="refresh" size={14} />}>Regenerate all</Button>
            <Button variant="primary" size="sm" iconLeft={<Icon name="check" size={14} />}>Approve & run</Button>
          </>}
        />

        {/* source coverage */}
        <Panel eyebrow="Coverage" title="Search source coverage" style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {D.querySources.map((s) => {
              const map = { ok: ['safe', 'Indexed'], partial: ['compliance', 'Partial'], running: ['accent', 'Running'], off: ['neutral', 'Not used'] };
              const [tone, lab] = map[s.state];
              return (
                <div key={s.name} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 11px', background: s.state === 'off' ? 'var(--surface-inset)' : 'var(--surface-card)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.2, minHeight: 32 }}>{s.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 500, color: s.state === 'off' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{s.count}</span>
                    <StatusBadge status={tone === 'safe' ? 'done' : tone === 'accent' ? 'active' : tone === 'compliance' ? 'warn' : 'pending'} label={lab} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* query groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {D.queryGroups.map((g) => (
            <section key={g.id} className="panel" style={{ opacity: g.status === 'disabled' ? 0.6 : 1 }}>
              <div className="panel__head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>{g.id.toUpperCase()}</span>
                  <span className="panel__title">{g.name}</span>
                  <StatusBadge status={g.status} />
                </div>
                <div className="panel__actions">
                  {g.results != null ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>{g.results} hits</span> : null}
                  <button className="iconbtn" title="Edit"><Icon name="edit" size={14} /></button>
                  <button className="iconbtn" title="Regenerate"><Icon name="refresh" size={14} /></button>
                  <button className="iconbtn" title={g.status === 'disabled' ? 'Enable' : 'Disable'}><Icon name={g.status === 'disabled' ? 'play' : 'pause'} size={14} /></button>
                </div>
              </div>
              <div className="panel__body" style={{ paddingTop: 12, paddingBottom: 12 }}>
                {g.status === 'regenerating' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    <span className="spinner" style={{ width: 14, height: 14 }} /> Regenerating queries from updated brief…
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {g.queries.map((q, i) => (
                      <code key={i} style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', background: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '7px 10px' }}>{q}</code>
                    ))}
                  </div>
                )}
                <div className="pillrow" style={{ marginTop: 10 }}>
                  {g.sources.map((s) => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '2px 7px' }}>
                      <span style={{ width: 5, height: 5, borderRadius: 9, background: 'var(--evidence)' }} />{s}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  window.ScreensB = { Brief, Queries };
})();
