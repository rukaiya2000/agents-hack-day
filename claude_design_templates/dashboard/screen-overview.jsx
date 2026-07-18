// Overview + Protocols + Processing Runs screens -> window.ScreensA
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge, Tag } = DS;
  const Icon = window.Icon;
  const { ScreenHead, Panel, Note, StatusBadge } = window.UI;
  const D = window.ORCH;

  // -------------------------------------------------- Overview
  function Overview({ go }) {
    return (
      <div className="page">
        <ScreenHead
          eyebrow="Processing run · run_8f2a91"
          title="Run overview"
          desc="Protocol-aware processing of RSV-PreF-301. Eight stages from parse to review — most complete; Moss indexing and compliance sign-off still need attention."
          actions={<>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="refresh" size={14} />}>Re-run</Button>
            <Button variant="primary" size="sm" iconLeft={<Icon name="download" size={14} />} onClick={() => go('summary')}>Export summary</Button>
          </>}
        />

        {/* status cards */}
        <div className="statgrid">
          {D.statusCards.map((c) => (
            <button key={c.key} className="stat" style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
              onClick={() => go({ kols: 'candidates', evidence: 'evidence', missing: 'brief', flags: 'compliance', moss: 'moss' }[c.key])}>
              <div className="stat__top">
                <span className={`stat__ic ic--${c.tone}`}><Icon name={c.icon} size={16} /></span>
                <span className="stat__lab">{c.label}</span>
              </div>
              <div className="stat__val">{c.value}</div>
              <div className="stat__sub">{c.sub}</div>
            </button>
          ))}
        </div>

        <div className="cols cols--2" style={{ marginTop: 16 }}>
          {/* workflow timeline */}
          <Panel eyebrow="Pipeline" title="Workflow stages" actions={<StatusBadge status="warn" label="2 items need attention" />}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {D.stages.map((s, i) => (
                <div key={s.key} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '9px 0', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span className={`stage stage--${s.state}`} style={{ flex: 'none', padding: 0, minWidth: 0 }}>
                    <span className="stage__dot">
                      {s.state === 'done' ? <Icon name="check" size={11} color="#fff" />
                        : s.state === 'warn' ? <Icon name="alert" size={10} color="#fff" />
                        : s.state === 'active' ? <span style={{ width: 6, height: 6, borderRadius: 9, background: '#fff' }} /> : null}
                    </span>
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: s.state === 'pending' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{s.detail}</div>
                  </div>
                  <span style={{ flex: 'none', paddingTop: 1 }}>
                    <StatusBadge status={s.state} label={s.state === 'done' ? 'Complete' : s.state === 'warn' ? 'Warnings' : s.state === 'active' ? 'In review' : 'Pending'} />
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Panel eyebrow="Attention" title="Needs your review">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <Note tone="risk" icon="shield">2 open compliance flags — a transparency note (Mwangi) and a sub-threshold evidence count (Delacroix). <button className="lk" onClick={() => go('compliance')}>Open compliance review →</button></Note>
                <Note tone="compliance" icon="database">3 KOL profiles failed to embed in Moss and are retrying. <button className="lk" onClick={() => go('moss')}>Inspect index →</button></Note>
                <Note tone="compliance" icon="alert">5 missing-data warnings in the brief; 2 affect ranking. <button className="lk" onClick={() => go('brief')}>Review brief →</button></Note>
              </div>
            </Panel>
            <Panel eyebrow="Governance" title="Active guardrails">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {D.guardrails.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 'var(--text-sm)', color: g.ok ? 'var(--text-primary)' : 'var(--compliance-ink)' }}>
                    <Icon name={g.ok ? 'check' : 'alert'} size={14} color={g.ok ? 'var(--safe)' : 'var(--compliance)'} />
                    {g.label}
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------- Protocols
  function Protocols({ go, onUpload }) {
    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Library"
          title="Protocols"
          desc="Select a protocol to open its processing run, or upload a new Phase 3 protocol to begin extraction."
          actions={<Button variant="primary" size="sm" iconLeft={<Icon name="upload" size={14} />} onClick={onUpload}>Upload protocol</Button>}
        />
        <Panel noBody>
          <table className="tbl">
            <thead><tr>
              <th>Protocol ID</th><th>Sponsor</th><th>Phase</th><th>Indication</th><th>Geography</th><th>Status</th><th className="num">Updated</th>
            </tr></thead>
            <tbody>
              {D.protocols.map((p) => (
                <tr key={p.id} aria-selected={p.active} onClick={() => p.active ? go('overview') : p.empty ? onUpload && onUpload() : null}>
                  <td className="mono" style={{ color: 'var(--text-accent)', fontWeight: 500 }}>{p.id}</td>
                  <td>{p.sponsor}</td>
                  <td className="mono">{p.phase}</td>
                  <td>{p.indication}</td>
                  <td className="muted mono" style={{ fontSize: 'var(--text-2xs)' }}>{p.geo}</td>
                  <td>{p.empty ? <Badge tone="neutral" size="sm">Queued</Badge> : <StatusBadge status={p.status === 'Ready for review' ? 'active' : 'active'} label={p.status} />}</td>
                  <td className="num muted">{p.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <div style={{ marginTop: 12 }}>
          <Note tone="info" icon="upload"><span>Drag a Phase 3 protocol PDF anywhere to start a run, or <button className="lk" onClick={onUpload}>upload one now →</button> Parsing begins on upload — no templates or manual tagging required.</span></Note>
        </div>
      </div>
    );
  }

  // -------------------------------------------------- Processing Runs
  function Runs({ go }) {
    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Activity"
          title="Processing runs"
          desc="Every orchestration run across the protocol library, with stage, duration, and outcome."
          actions={<Button variant="secondary" size="sm" iconLeft={<Icon name="refresh" size={14} />}>Refresh</Button>}
        />
        <Panel noBody>
          <table className="tbl">
            <thead><tr>
              <th>Run ID</th><th>Protocol</th><th>Started</th><th className="num">Duration</th><th>Stage</th><th>Status</th><th>Triggered by</th>
            </tr></thead>
            <tbody>
              {D.runs.map((r) => (
                <tr key={r.id} aria-selected={r.id === D.protocol.run} onClick={() => r.id === D.protocol.run ? go('overview') : null}>
                  <td className="mono" style={{ color: r.id === D.protocol.run ? 'var(--text-accent)' : 'var(--text-primary)', fontWeight: 500 }}>{r.id}</td>
                  <td className="mono" style={{ fontSize: 'var(--text-2xs)' }}>{r.protocol}</td>
                  <td className="muted mono" style={{ fontSize: 'var(--text-2xs)' }}>{r.started}</td>
                  <td className="num muted">{r.duration}</td>
                  <td>{r.stage}</td>
                  <td>{r.state === 'active'
                    ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span className="spinner" style={{ width: 12, height: 12 }} /><Badge tone="accent" size="sm">Running</Badge></span>
                    : <StatusBadge status={r.state} />}</td>
                  <td className="muted mono" style={{ fontSize: 'var(--text-2xs)' }}>{r.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    );
  }

  window.ScreensA = { Overview, Protocols, Runs };
})();
