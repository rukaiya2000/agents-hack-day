// Compliance Review screen -> window.ScreensF
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge } = DS;
  const Icon = window.Icon;
  const { ScreenHead, Panel, Note, StatusBadge } = window.UI;
  const D = window.ORCH;

  const SEV = { high: ['risk', 'High'], medium: ['compliance', 'Medium'], low: ['neutral', 'Low'] };

  function Compliance({ openKol }) {
    const open = D.complianceFlags.filter((f) => f.status === 'open');
    const resolved = D.complianceFlags.filter((f) => f.status !== 'open');

    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Stage 07 · Compliance review"
          title="Compliance review"
          desc="Every recommendation is screened against Medical Affairs guardrails before sign-off. Flagged language, unsupported claims, missing citations, and transparency notes are surfaced here with a full audit trail."
          actions={<>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="download" size={14} />}>Export audit log</Button>
            <Button variant="primary" size="sm" iconLeft={<Icon name="check" size={14} />}>Sign off review</Button>
          </>}
        />

        {/* guardrails */}
        <Panel eyebrow="Guardrails" title="Active Medical Affairs guardrails"
          actions={<Badge tone="compliance" size="sm" dot>1 not yet satisfied</Badge>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {D.guardrails.map((g, i) => (
              <div key={i} className="guard" style={{ borderColor: g.ok ? 'color-mix(in srgb, var(--safe) 28%, white)' : 'color-mix(in srgb, var(--compliance) 32%, white)', background: g.ok ? 'var(--safe-tint)' : 'var(--compliance-tint)' }}>
                <Icon name={g.ok ? 'check' : 'alert'} size={16} color={g.ok ? 'var(--safe)' : 'var(--compliance)'} />
                <span className="gt" style={{ color: g.ok ? 'var(--safe-ink)' : 'var(--compliance-ink)' }}>{g.label}</span>
              </div>
            ))}
          </div>
          <Note tone="compliance" icon="alert" >
            <strong style={{ fontWeight: 600 }}>"Every recommendation carries supporting evidence" is not yet satisfied.</strong> One candidate (Delacroix) falls below the 2-source threshold and must be resolved before the packet can be approved.
          </Note>
        </Panel>

        {/* open flags */}
        <Panel eyebrow={`${open.length} open`} title="Flags requiring review" style={{ marginTop: 16 }} noBody>
          <div>
            {open.map((f, i) => {
              const [tone, lab] = SEV[f.severity];
              const k = D.candidates.find((c) => c.name === f.kol);
              return (
                <div key={f.id} style={{ display: 'flex', gap: 14, padding: 16, borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ flex: 'none', width: 34, height: 34, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: tone === 'risk' ? 'var(--risk-tint)' : 'var(--compliance-tint)', color: tone === 'risk' ? 'var(--risk)' : 'var(--compliance)' }}>
                    <Icon name="flag" size={16} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{f.type}</span>
                      <Badge tone={tone} size="sm" dot>{lab} severity</Badge>
                      <StatusBadge status="open" />
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>Candidate · {f.kol}</div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 8, maxWidth: '70ch', lineHeight: 1.5 }}>{f.detail}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <Button variant="secondary" size="sm" iconLeft={<Icon name="check" size={13} />}>Mark reviewed</Button>
                      {k ? <Button variant="ghost" size="sm" iconLeft={<Icon name="eye" size={13} />} onClick={() => openKol(k.id)}>View candidate</Button> : null}
                      <Button variant="ghost" size="sm">Route to reviewer</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="cols cols--2" style={{ marginTop: 16 }}>
          {/* resolved */}
          <Panel eyebrow="Resolved" title="Auto-resolved &amp; cleared">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {resolved.map((f) => (
                <div key={f.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="check" size={15} color="var(--safe)" style={{ marginTop: 2, flex: 'none' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{f.type} · <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{f.kol}</span></div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.45 }}>{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* audit trail */}
          <Panel eyebrow="Audit trail" title="Processing audit log"
            actions={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>run_8f2a91</span>}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {D.audit.map((a, i) => (
                <div key={i} className="review-row" style={{ borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', flex: 'none', width: 64, paddingTop: 1 }}>{a.time}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.45 }}>{a.text}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-tertiary)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{a.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* approval workflow */}
        <Panel eyebrow="Sign-off" title="Reviewer approval workflow" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
            {[
              { label: 'Automated scan', who: 'system', done: true },
              { label: 'Guardrail check', who: '2 open flags', done: false, active: true },
              { label: 'Medical Affairs sign-off', who: 'a.okoye', done: false },
              { label: 'Release packet', who: 'pending', done: false },
            ].map((s, i, arr) => (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 'var(--radius-pill)', flex: 'none', display: 'grid', placeItems: 'center', background: s.done ? 'var(--safe)' : s.active ? 'var(--accent)' : 'var(--surface-card)', border: s.done || s.active ? 'none' : '1.5px solid var(--border-strong)', color: s.done || s.active ? '#fff' : 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>
                    {s.done ? <Icon name="check" size={13} color="#fff" /> : i + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: s.done || s.active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 2 }}>{s.who}</div>
                  </div>
                </div>
                {i < arr.length - 1 ? <span style={{ flex: 1, minWidth: 24, height: 1, background: 'var(--border-strong)', margin: '0 14px' }} /> : null}
              </React.Fragment>
            ))}
          </div>
          <Note tone="info" icon="shield" >Sign-off is blocked until all guardrails pass. Approving records your identity, timestamp, and the exact artifact hash to the audit log.</Note>
        </Panel>
      </div>
    );
  }

  window.ScreensF = { Compliance };
})();
