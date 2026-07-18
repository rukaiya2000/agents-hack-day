// Moss Index screen -> window.ScreensG
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge } = DS;
  const Icon = window.Icon;
  const { ScreenHead, Panel, Note, StatusBadge } = window.UI;
  const D = window.ORCH;

  const ASSET_ICON = { protocol: 'file', evidence: 'evidence', profiles: 'candidates', ranking: 'ranking', cites: 'link' };

  function Moss() {
    const totalChunks = D.mossAssets.reduce((s, a) => s + a.chunks, 0);
    const totalEmbedded = D.mossAssets.reduce((s, a) => s + a.embedded, 0);
    const totalFailed = D.mossAssets.reduce((s, a) => s + a.failed, 0);
    const pct = Math.round((totalEmbedded / totalChunks) * 100);

    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Stage 08 · Indexed in Moss"
          title="Moss index"
          desc="Protocol-aware knowledge base. Every artifact — protocol chunks, evidence, KOL profiles, ranking metadata, and citations — is embedded and indexed in Moss so the copilot can answer with traceable, protocol-scoped retrieval."
          actions={<>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="refresh" size={14} />}>Retry failed ({totalFailed})</Button>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="external" size={14} />}>Open in Moss</Button>
          </>}
        />

        {/* summary header */}
        <div className="statgrid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { lab: 'Index status', val: '97%', sub: `${pct}% embedded · 3 pending`, tone: 'accent', icon: 'database' },
            { lab: 'Total chunks', val: totalChunks, sub: `${D.mossAssets.length} asset types`, tone: 'evidence', icon: 'file' },
            { lab: 'Embedded', val: totalEmbedded, sub: 'vectors written', tone: 'safe', icon: 'check' },
            { lab: 'Failed items', val: totalFailed, sub: 'retrying with backoff', tone: 'compliance', icon: 'alert' },
          ].map((c) => (
            <div key={c.lab} className="stat">
              <div className="stat__top">
                <span className={`stat__ic ic--${c.tone}`}><Icon name={c.icon} size={16} /></span>
                <span className="stat__lab">{c.lab}</span>
              </div>
              <div className="stat__val">{c.val}</div>
              <div className="stat__sub">{c.sub}</div>
            </div>
          ))}
        </div>

        <Panel eyebrow="Embedding" title="Indexed assets" style={{ marginTop: 16 }}
          actions={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>Last sync · {D.mossSync}</span>} noBody>
          <table className="tbl">
            <thead><tr>
              <th>Asset</th><th className="num">Chunks</th><th className="num">Embedded</th><th className="num">Failed</th><th style={{ width: 220 }}>Progress</th><th>Status</th>
            </tr></thead>
            <tbody>
              {D.mossAssets.map((a) => {
                const p = Math.round((a.embedded / a.chunks) * 100);
                const cls = a.failed > 0 ? 'is-error' : 'is-done';
                return (
                  <tr key={a.key} style={{ cursor: 'default' }}>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                        <Icon name={ASSET_ICON[a.key]} size={15} color="var(--evidence)" />
                        <span style={{ fontWeight: 500 }}>{a.label}</span>
                      </span>
                    </td>
                    <td className="num mono">{a.chunks}</td>
                    <td className="num mono" style={{ color: 'var(--safe-ink)' }}>{a.embedded}</td>
                    <td className="num mono" style={{ color: a.failed ? 'var(--risk-ink)' : 'var(--text-tertiary)' }}>{a.failed}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span className={`meter ${cls}`} style={{ flex: 1 }}><i style={{ width: p + '%' }} /></span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', width: 32, textAlign: 'right' }}>{p}%</span>
                      </span>
                    </td>
                    <td><StatusBadge status={a.state === 'done' ? 'done' : a.state === 'error' ? 'error' : 'active'} label={a.state === 'done' ? 'Indexed' : a.state === 'error' ? 'Partial' : 'Embedding'} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        {/* failed items + retry */}
        <Panel eyebrow="Errors" title="Failed items" style={{ marginTop: 16 }}
          actions={<Button variant="secondary" size="sm" iconLeft={<Icon name="refresh" size={14} />}>Retry all</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {D.mossFailed.map((f) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', border: '1px solid color-mix(in srgb, var(--risk) 26%, white)', borderRadius: 'var(--radius-md)', background: 'var(--risk-tint)' }}>
                <Icon name="alert" size={16} color="var(--risk)" style={{ flex: 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{f.asset}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--risk-ink)', marginTop: 3 }}>{f.reason} · {f.attempts} attempt{f.attempts > 1 ? 's' : ''}</div>
                </div>
                <Button variant="secondary" size="sm" iconLeft={<Icon name="refresh" size={13} />}>Retry</Button>
                <Button variant="ghost" size="sm">Skip</Button>
              </div>
            ))}
          </div>
          <Note tone="info" icon="clock" >Failed embeddings retry automatically with exponential backoff. Items still failing after 5 attempts are held for manual review and excluded from copilot retrieval until resolved.</Note>
        </Panel>
      </div>
    );
  }

  window.ScreensG = { Moss };
})();
