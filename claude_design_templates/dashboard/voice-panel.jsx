// Live voice agent panel (scoped to selected protocol) -> window.VoicePanel
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { VoiceControl, Badge } = DS;
  const Icon = window.Icon;
  const D = window.ORCH;

  // render an answer string with [n] tokens as evidence citations
  function Answer({ text }) {
    const parts = String(text).split(/(\[\d+\])/g);
    return (
      <p className="qa__doc">
        {parts.map((p, i) => {
          const m = /^\[(\d+)\]$/.exec(p);
          return m ? <sup key={i} className="cite" title="Traced to source evidence">[{m[1]}]</sup> : <React.Fragment key={i}>{p}</React.Fragment>;
        })}
      </p>
    );
  }

  function fmt(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

  function VoicePanel({ currentId, onClose }) {
    const cfg = D.voice[currentId] || { suggestions: [], qa: [] };
    const det = D.protocolDetails[currentId];

    const seed = cfg.qa[0]
      ? [{ role: 'you', text: cfg.qa[0].q }, { role: 'ai', text: cfg.qa[0].a, chips: cfg.qa[0].chips }]
      : [];
    const [msgs, setMsgs] = React.useState(seed);
    const [vstate, setVstate] = React.useState('idle'); // idle | listening | thinking
    const [elapsed, setElapsed] = React.useState(12);
    const [pending, setPending] = React.useState(null); // question being processed
    const convoRef = React.useRef(null);
    const timers = React.useRef([]);
    const push = (t) => { timers.current.push(t); return t; };

    // reset when protocol changes
    React.useEffect(() => {
      const s = cfg.qa[0] ? [{ role: 'you', text: cfg.qa[0].q }, { role: 'ai', text: cfg.qa[0].a, chips: cfg.qa[0].chips }] : [];
      setMsgs(s); setVstate('idle'); setPending(null);
      // eslint-disable-next-line
    }, [currentId]);

    // elapsed timer + cleanup
    React.useEffect(() => {
      const id = setInterval(() => setElapsed((e) => e + 1), 1000);
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      return () => { clearInterval(id); window.removeEventListener('keydown', onKey); timers.current.forEach(clearTimeout); };
    }, [onClose]);

    // autoscroll
    React.useEffect(() => { if (convoRef.current) convoRef.current.scrollTop = convoRef.current.scrollHeight; }, [msgs, pending]);

    function ask(q) {
      if (vstate !== 'idle') return;
      const hit = cfg.qa.find((x) => x.q === q) || { a: `I can answer from whatever has been indexed for ${det.id} so far — try one of the suggested questions.`, chips: [{ label: 'Grounded in indexed data', tone: 'evidence' }] };
      setMsgs((m) => [...m, { role: 'you', text: q }]);
      setPending(q);
      setVstate('listening');
      push(setTimeout(() => setVstate('thinking'), 950));
      push(setTimeout(() => {
        setMsgs((m) => [...m, { role: 'ai', text: hit.a, chips: hit.chips }]);
        setPending(null);
        setVstate('idle');
      }, 2100));
    }

    const transcript = pending || (cfg.suggestions[0] || '');

    return (
      <>
        <div className="scrim" onClick={onClose} />
        <aside className="voicepanel" role="dialog" aria-label={`Voice copilot — ${det.id}`}>
          <div className="voicepanel__head">
            <span className="voicepanel__mark"><img src="../assets/logo-mark.svg" alt="" width="22" height="22" /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2>Voice copilot</h2>
              <div className="voicepanel__scope">Asking about <b>{det.id}</b> · grounded in indexed data</div>
            </div>
            <button className="iconbtn" onClick={onClose} title="Close"><Icon name="x" size={16} /></button>
          </div>

          <div className="voicepanel__control">
            <VoiceControl
              state={vstate}
              elapsed={fmt(elapsed)}
              transcript={vstate === 'idle' ? '' : transcript}
              onToggle={() => setVstate((s) => (s === 'idle' ? 'listening' : 'idle'))}
            />
          </div>

          <div className="voicepanel__convo ds-scroll" ref={convoRef}>
            <div className="qa">
              {msgs.map((m, i) => m.role === 'you' ? (
                <div className="qa__q" key={i}>
                  <span className="qa__role">You</span>
                  <p>{m.text}</p>
                </div>
              ) : (
                <div className="qa__a" key={i}>
                  <span className="qa__role qa__role--ai">
                    <span className="qa__avatar"><img src="../assets/logo-mark.svg" alt="" width="20" height="20" /></span>
                    KOL Copilot
                  </span>
                  <Answer text={m.text} />
                  {m.chips && m.chips.length ? (
                    <div className="qa__foot">
                      {m.chips.map((c, j) => (
                        <span key={j} className={'qa__chip' + (c.tone === 'safe' ? ' qa__chip--safe' : c.tone === 'risk' ? ' qa__chip--risk' : '')}>{c.label}</span>
                      ))}
                      <span className="qa__guard">Checked against Medical Affairs guardrails</span>
                    </div>
                  ) : null}
                </div>
              ))}
              {pending ? (
                <div className="qa__a qa__a--typing">
                  <span className="qa__role qa__role--ai">
                    <span className="qa__avatar"><img src="../assets/logo-mark.svg" alt="" width="20" height="20" /></span>
                    KOL Copilot
                  </span>
                  <span className="vtyping"><i /><i /><i /></span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="voicepanel__foot">
            <div className="vsuggest">
              {cfg.suggestions.map((s) => (
                <button key={s} className="vchip" disabled={vstate !== 'idle'} onClick={() => ask(s)}>{s}</button>
              ))}
            </div>
            <div className="vinput">
              <input placeholder={`Ask about ${det.id}…`} disabled />
              <button className="vinput__mic" aria-label="Hold to talk"
                onClick={() => setVstate((s) => (s === 'idle' ? 'listening' : 'idle'))}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
                </svg>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  window.VoicePanel = VoicePanel;
})();
