// Shared dashboard UI -> window.UI
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Badge } = DS;
  const Icon = window.Icon;

  // ---- screen header ----
  function ScreenHead({ eyebrow, title, desc, actions }) {
    return (
      <div className="shead">
        <div>
          {eyebrow ? <div className="shead__ey">{eyebrow}</div> : null}
          <h1>{title}</h1>
          {desc ? <p>{desc}</p> : null}
        </div>
        {actions ? <div className="shead__actions">{actions}</div> : null}
      </div>
    );
  }

  // ---- panel ----
  function Panel({ eyebrow, title, actions, children, bodyStyle, noBody }) {
    return (
      <section className="panel">
        {(title || actions) ? (
          <div className="panel__head">
            <div>
              {eyebrow ? <div className="panel__eyebrow">{eyebrow}</div> : null}
              {title ? <div className="panel__title">{title}</div> : null}
            </div>
            {actions ? <div className="panel__actions">{actions}</div> : null}
          </div>
        ) : null}
        {noBody ? children : <div className="panel__body" style={bodyStyle}>{children}</div>}
      </section>
    );
  }

  // ---- confidence chip ----
  function Confidence({ value }) {
    const cls = value >= 90 ? 'conf--hi' : value >= 78 ? 'conf--mid' : 'conf--lo';
    return (
      <span className={`conf ${cls}`} title={`Extraction confidence ${value}%`}>
        <span className="conf__track"><span className="conf__fill" style={{ width: value + '%' }} /></span>
        {value}%
      </span>
    );
  }

  // ---- chunk ref ----
  function Chunk({ children, onClick }) {
    return (
      <button className="chunk" onClick={onClick}>
        <Icon name="file" size={10} /> {children}
      </button>
    );
  }

  // ---- mini bar ----
  function MiniBar({ value, max = 100, tone = 'var(--evidence)' }) {
    return (
      <span className="mbar">
        <span className="mbar__track"><span className="mbar__fill" style={{ width: (value / max * 100) + '%', background: tone }} /></span>
        <span className="mbar__v">{value}</span>
      </span>
    );
  }

  // ---- note / callout ----
  function Note({ tone = 'info', icon = 'alert', children }) {
    return <div className={`note note--${tone}`}><Icon name={icon} size={16} />{<div>{children}</div>}</div>;
  }

  // ---- empty / loading / error ----
  function State({ kind = 'empty', icon = 'inbox', title, children, action }) {
    return (
      <div className="estate">
        {kind === 'loading'
          ? <div className="spinner" />
          : <div className="estate__ic"><Icon name={icon} size={22} /></div>}
        {title ? <h3>{title}</h3> : null}
        {children ? <p>{children}</p> : null}
        {action || null}
      </div>
    );
  }

  // ---- status -> badge tone ----
  const STATUS = {
    validated: { tone: 'safe', label: 'Validated', dot: true },
    review:    { tone: 'compliance', label: 'Review', dot: true },
    conflict:  { tone: 'risk', label: 'Conflict', dot: true },
    approved:  { tone: 'safe', label: 'Approved', dot: true },
    edited:    { tone: 'evidence', label: 'Edited', dot: true },
    disabled:  { tone: 'neutral', label: 'Disabled', dot: false },
    regenerating: { tone: 'accent', label: 'Regenerating', dot: true },
    done:    { tone: 'safe', label: 'Done', dot: true },
    warn:    { tone: 'compliance', label: 'Warning', dot: true },
    active:  { tone: 'accent', label: 'Running', dot: true },
    error:   { tone: 'risk', label: 'Error', dot: true },
    open:    { tone: 'risk', label: 'Open', dot: true },
    resolved:{ tone: 'safe', label: 'Resolved', dot: true },
    pending: { tone: 'neutral', label: 'Pending', dot: false },
  };
  function StatusBadge({ status, label, size = 'sm' }) {
    const s = STATUS[status] || STATUS.pending;
    return <Badge tone={s.tone} size={size} dot={s.dot}>{label || s.label}</Badge>;
  }

  // ---- section label inside drawers/panels ----
  function SecLabel({ icon, children }) {
    return <div className="drawer__sectitle">{icon ? <Icon name={icon} size={12} /> : null}{children}</div>;
  }

  window.UI = { ScreenHead, Panel, Confidence, Chunk, MiniBar, Note, State, StatusBadge, SecLabel, STATUS };
})();
