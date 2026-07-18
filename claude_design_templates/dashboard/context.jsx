// Protocol switcher + stage rail + stage gating + overview-lite -> window.Ctx
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Badge, Button, Tag } = DS;
  const Icon = window.Icon;
  const { Panel, Note, State, StatusBadge } = window.UI;
  const D = window.ORCH;

  // ---------------------------------------------------------------- protocol switcher
  function ProtocolSwitcher({ currentId, onSelect }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    const cur = D.protocolDetails[currentId];

    React.useEffect(() => {
      if (!open) return;
      const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('mousedown', onDoc);
      window.addEventListener('keydown', onKey);
      return () => { document.removeEventListener('mousedown', onDoc); window.removeEventListener('keydown', onKey); };
    }, [open]);

    return (
      <div className="pswitch" ref={ref}>
        <button className="pswitch__btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span className="phead__id">{cur.id}</span>
          <Icon name="chevronDown" size={13} color="var(--text-tertiary)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s ease' }} />
        </button>
        {open ? (
          <div className="pmenu" role="menu">
            <div className="pmenu__head">Switch protocol</div>
            {D.protocols.map((p) => {
              const det = D.protocolDetails[p.id];
              const sel = p.id === currentId;
              return (
                <button key={p.id} className="pmenu__item" aria-current={sel} role="menuitemradio" aria-checked={sel}
                  onClick={() => { onSelect(p.id); setOpen(false); }}>
                  <span className="pmenu__tick">{sel ? <Icon name="check" size={14} color="var(--accent)" /> : null}</span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span className="pmenu__id">{p.id}</span>
                    <span className="pmenu__meta">{p.sponsor} · Ph {p.phase} · {p.indication}</span>
                  </span>
                  <StatusBadge status={det.statusTone === 'neutral' ? 'pending' : det.statusTone === 'accent' ? 'active' : 'active'} label={p.status} />
                </button>
              );
            })}
            <div className="pmenu__foot">
              <Icon name="upload" size={12} color="var(--text-tertiary)" />
              <span>Drag a protocol anywhere to add a new run</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // ---------------------------------------------------------------- header
  function ProtocolHeader({ currentId, onSelect, voiceOpen, onToggleVoice }) {
    const P = D.protocolDetails[currentId];
    return (
      <div className="phead">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ProtocolSwitcher currentId={currentId} onSelect={onSelect} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>{P.nct}</span>
          </div>
          <div className="phead__title">{P.title}</div>
          <div className="phead__meta">
            <Tag label="SPONSOR" value={P.sponsor} />
            <Tag label="PHASE" value={P.phase} tone="accent" />
            <Tag label="INDICATION" value={P.indication} />
            <Tag label="GEO" value={P.geo.join(' · ')} />
            <Tag label="ENROLL" value={P.enrollment} />
          </div>
        </div>
        <div className="phead__right">
          <button className={'voicebtn' + (voiceOpen ? ' is-on' : '')} onClick={onToggleVoice} aria-pressed={voiceOpen}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
            </svg>
            {voiceOpen ? 'Voice on' : 'Ask copilot'}
          </button>
          <Badge tone={P.statusTone} variant="soft" size="md" dot>{P.status}</Badge>
          <div className="phead__ts">Updated {P.updated}</div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- stage rail
  function StageRail({ currentId }) {
    const stages = D.protocolDetails[currentId].stages;
    return (
      <div className="stages ds-scroll">
        {stages.map((s) => (
          <div key={s.key} className={`stage stage--${s.state}`}>
            <span className="stage__dot">
              {s.state === 'done' ? <Icon name="check" size={11} color="#fff" />
                : s.state === 'warn' ? <Icon name="alert" size={10} color="#fff" />
                : s.state === 'active' ? <span style={{ width: 6, height: 6, borderRadius: 9, background: '#fff' }} /> : null}
            </span>
            <span className="stage__txt">
              <span className="stage__name">{s.label}</span>
              <span className="stage__detail">{s.detail}</span>
            </span>
            <span className="stage__line" />
          </div>
        ))}
      </div>
    );
  }

  // ---------------------------------------------------------------- stage gate (non-RSV pipeline screens)
  function StageGate({ currentId, screen, screenLabel, onSwitchToRSV }) {
    const det = D.protocolDetails[currentId];
    const stageKey = D.screenStage[screen];
    const stage = det.stages.find((s) => s.key === stageKey) || {};

    if (stage.state === 'active') {
      return (
        <div className="page">
          <Panel>
            <State kind="loading" title={`${stage.label} is running`}>
              The orchestrator is processing this stage for <b>{det.id}</b> — {stage.detail}. {screenLabel} will populate automatically when it completes.
            </State>
          </Panel>
        </div>
      );
    }
    if (stage.state === 'pending') {
      return (
        <div className="page">
          <Panel>
            <State kind="empty" icon="clock" title={`${screenLabel} not available yet`}>
              {det.id} hasn’t reached the <b>{stage.label}</b> stage. Earlier pipeline stages must finish first — track progress in the stage bar above.
            </State>
          </Panel>
        </div>
      );
    }
    // done / warn but no demo data wired for this protocol
    return (
      <div className="page">
        <Panel>
          <State kind="empty" icon="database" title={`${stage.label} complete for ${det.id}`}
            action={<Button variant="primary" size="sm" iconLeft={<Icon name="refresh" size={14} />} onClick={onSwitchToRSV}>Open RSV-PreF-301</Button>}>
            This stage finished for {det.id}. Detailed {screenLabel.toLowerCase()} in this prototype is fully wired for <b>RSV-PreF-301</b> — switch to it to explore the complete, evidence-backed pipeline.
          </State>
        </Panel>
      </div>
    );
  }

  // ---------------------------------------------------------------- overview-lite (non-RSV run state)
  function OverviewLite({ currentId, go, onAsk }) {
    const det = D.protocolDetails[currentId];
    const done = det.stages.filter((s) => s.state === 'done' || s.state === 'warn').length;
    const active = det.stages.find((s) => s.state === 'active');
    const queued = det.run == null;

    return (
      <div className="page">
        <div className="shead">
          <div>
            <div className="shead__ey">{det.run ? `Processing run · ${det.run}` : 'Not started'}</div>
            <h1>Run overview</h1>
            <p>{queued
              ? `${det.id} is queued. Start the run from the Protocols list to begin protocol-aware processing.`
              : `Protocol-aware processing of ${det.id} is underway — ${active ? active.label.toLowerCase() : 'in progress'}. Stages complete automatically and re-scope every screen for this protocol.`}</p>
          </div>
          <div className="shead__actions">
            <Button variant="secondary" size="sm" iconLeft={<Icon name="mic" size={14} />} onClick={onAsk}>Ask copilot</Button>
            {queued
              ? <Button variant="primary" size="sm" iconLeft={<Icon name="play" size={14} />} onClick={() => go('protocols')}>Start run</Button>
              : <Button variant="secondary" size="sm" iconLeft={<Icon name="refresh" size={14} />}>Refresh</Button>}
          </div>
        </div>

        <div className="statgrid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { lab: 'Stages complete', val: `${done}/8`, sub: queued ? 'not started' : 'of the pipeline', tone: 'accent', icon: 'ranking' },
            { lab: 'Current stage', val: active ? active.label.split(' ')[0] : (queued ? 'Queued' : 'Done'), sub: active ? active.detail : '—', tone: 'evidence', icon: 'refresh' },
            { lab: 'Sponsor', val: det.phase === '3' ? 'Ph 3' : 'Ph 2', sub: det.sponsor, tone: 'compliance', icon: 'protocols' },
            { lab: 'Enrollment', val: det.enrollment, sub: det.geo.join(' · '), tone: 'safe', icon: 'users' },
          ].map((c) => (
            <div key={c.lab} className="stat">
              <div className="stat__top"><span className={`stat__ic ic--${c.tone}`}><Icon name={c.icon} size={16} /></span><span className="stat__lab">{c.lab}</span></div>
              <div className="stat__val">{c.val}</div>
              <div className="stat__sub">{c.sub}</div>
            </div>
          ))}
        </div>

        <Panel eyebrow="Pipeline" title="Workflow stages" style={{ marginTop: 16 }}
          actions={<StatusBadge status={queued ? 'pending' : 'active'} label={queued ? 'Queued' : 'Running'} />}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {det.stages.map((s, i) => (
              <div key={s.key} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 0', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
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
                <StatusBadge status={s.state === 'done' ? 'done' : s.state === 'warn' ? 'warn' : s.state === 'active' ? 'active' : 'pending'}
                  label={s.state === 'done' ? 'Complete' : s.state === 'warn' ? 'Warnings' : s.state === 'active' ? 'Running' : 'Pending'} />
              </div>
            ))}
          </div>
        </Panel>

        <div style={{ marginTop: 16 }}>
          <Note tone="info" icon="mic">Ask the voice copilot about <b>{det.id}</b> at any time — it answers from whatever has been indexed so far, with citations and guardrail checks. <button className="lk" onClick={onAsk}>Open voice copilot →</button></Note>
        </div>
      </div>
    );
  }

  window.Ctx = { ProtocolHeader, StageRail, StageGate, OverviewLite };
})();
