// App shell + router -> window.App
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Tag, Badge } = DS;
  const Icon = window.Icon;
  const D = window.ORCH;
  const A = window.ScreensA, B = window.ScreensB, C = window.ScreensC, E = window.ScreensD, F = window.ScreensE, G = window.ScreensF, H = window.ScreensG, I = window.ScreensH;
  const KolDrawer = window.KolDrawer;
  const UploadModal = window.UploadModal;
  const VoicePanel = window.VoicePanel;
  const Ctx = window.Ctx;

  const RSV = 'RSV-PreF-301';
  const SCREEN_LABEL = { brief: 'Protocol brief', queries: 'Search queries', evidence: 'Evidence', candidates: 'KOL candidates', ranking: 'Ranking', compliance: 'Compliance review', moss: 'Moss index', summary: 'Summary' };

  // nav model — grouped to mirror the workflow
  const NAV = [
    { group: 'Library', items: [
      { key: 'protocols', label: 'Protocols', icon: 'protocols' },
      { key: 'runs', label: 'Processing runs', icon: 'runs' },
    ]},
    { group: 'Pipeline', items: [
      { key: 'overview', label: 'Run overview', icon: 'ranking' },
      { key: 'brief', label: 'Protocol brief', icon: 'brief' },
      { key: 'queries', label: 'Search queries', icon: 'queries' },
      { key: 'evidence', label: 'Evidence', icon: 'evidence', count: '148' },
      { key: 'candidates', label: 'KOL candidates', icon: 'candidates', count: '64' },
      { key: 'ranking', label: 'Ranking', icon: 'sliders' },
    ]},
    { group: 'Governance', items: [
      { key: 'compliance', label: 'Compliance review', icon: 'shield', count: '2', ct: 'risk' },
      { key: 'moss', label: 'Moss index', icon: 'moss', count: '97%', ct: 'warn' },
      { key: 'summary', label: 'Summary / export', icon: 'summary' },
    ]},
  ];

  const LIBRARY = ['protocols', 'runs'];

  function App() {
    const [screen, setScreen] = React.useState('overview');
    const [protocolId, setProtocolId] = React.useState(RSV);
    const [voiceOpen, setVoiceOpen] = React.useState(false);
    const [kol, setKol] = React.useState(null);
    const [upload, setUpload] = React.useState(null); // null | {} | { file }
    const [veil, setVeil] = React.useState(false);
    const dragDepth = React.useRef(0);
    const contentRef = React.useRef(null);

    const openUpload = React.useCallback(() => setUpload({}), []);
    const closeUpload = React.useCallback(() => setUpload(null), []);

    // ---- drag a protocol anywhere over the app ----
    React.useEffect(() => {
      const hasFiles = (e) => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
      const onEnter = (e) => { if (!hasFiles(e)) return; e.preventDefault(); dragDepth.current++; if (!upload) setVeil(true); };
      const onOver = (e) => { if (hasFiles(e)) e.preventDefault(); };
      const onLeave = (e) => { if (!hasFiles(e)) return; dragDepth.current = Math.max(0, dragDepth.current - 1); if (dragDepth.current === 0) setVeil(false); };
      const onDrop = (e) => {
        if (!hasFiles(e)) return;
        e.preventDefault(); dragDepth.current = 0; setVeil(false);
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (f && !upload) setUpload({ file: { name: f.name, sizeMB: f.size / (1024 * 1024) } });
      };
      window.addEventListener('dragenter', onEnter);
      window.addEventListener('dragover', onOver);
      window.addEventListener('dragleave', onLeave);
      window.addEventListener('drop', onDrop);
      return () => {
        window.removeEventListener('dragenter', onEnter);
        window.removeEventListener('dragover', onOver);
        window.removeEventListener('dragleave', onLeave);
        window.removeEventListener('drop', onDrop);
      };
    }, [upload]);

    const go = React.useCallback((s) => {
      if (!s) return;
      setScreen(s);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, []);
    const openKol = React.useCallback((id) => setKol(id), []);
    const closeKol = React.useCallback(() => setKol(null), []);
    const selectProtocol = React.useCallback((id) => { setProtocolId(id); setScreen('overview'); if (contentRef.current) contentRef.current.scrollTop = 0; }, []);
    const toggleVoice = React.useCallback(() => setVoiceOpen((v) => !v), []);

    const isLibrary = LIBRARY.includes(screen);
    const isRSV = protocolId === RSV;

    function renderScreen() {
      if (screen === 'protocols') return <A.Protocols go={go} onUpload={openUpload} />;
      if (screen === 'runs') return <A.Runs go={go} />;
      if (screen === 'overview') return isRSV
        ? <A.Overview go={go} onUpload={openUpload} />
        : <Ctx.OverviewLite currentId={protocolId} go={go} onAsk={() => setVoiceOpen(true)} />;
      // pipeline / governance screens are gated when a non-RSV protocol is selected
      if (!isRSV && D.screenStage[screen]) {
        return <Ctx.StageGate currentId={protocolId} screen={screen} screenLabel={SCREEN_LABEL[screen]} onSwitchToRSV={() => selectProtocol(RSV)} />;
      }
      switch (screen) {
        case 'brief': return <B.Brief />;
        case 'queries': return <B.Queries />;
        case 'evidence': return <C.Evidence openKol={openKol} />;
        case 'candidates': return <E.Candidates openKol={openKol} />;
        case 'ranking': return <F.Ranking openKol={openKol} />;
        case 'compliance': return <G.Compliance openKol={openKol} />;
        case 'moss': return <H.Moss />;
        case 'summary': return <I.Summary openKol={openKol} />;
        default: return <A.Overview go={go} />;
      }
    }

    return (
      <div className="app">
        {/* sidebar */}
        <nav className="side">
          <div className="side__brand">
            <img src="../assets/logo-mark.svg" alt="" />
            <div>
              <div className="nm">Copilot</div>
              <div className="tg">Orchestrator</div>
            </div>
          </div>
          <div className="side__scroll ds-scroll">
            {NAV.map((grp) => (
              <div key={grp.group} className="side__group">
                <div className="side__label">{grp.group}</div>
                {grp.items.map((it) => (
                  <button key={it.key} className="navitem" aria-current={screen === it.key} onClick={() => go(it.key)}>
                    <Icon name={it.icon} size={16} />
                    <span>{it.label}</span>
                    {it.count && isRSV ? <span className={`ct ${it.ct ? 'ct--' + it.ct : ''}`}>{it.count}</span> : null}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="side__foot">
            Veritan Biologics<br />
            Medical Affairs · run_8f2a91
          </div>
        </nav>

        {/* main */}
        <div className="main">
          {!isLibrary ? <Ctx.ProtocolHeader currentId={protocolId} onSelect={selectProtocol} voiceOpen={voiceOpen} onToggleVoice={toggleVoice} /> : null}
          {!isLibrary ? <Ctx.StageRail currentId={protocolId} /> : null}
          <div className="content ds-scroll" ref={contentRef}>
            {renderScreen()}
          </div>
        </div>

        {/* drag-anywhere veil */}
        {veil ? (
          <div className="dragveil">
            <div className="dragveil__inner">
              <Icon name="upload" size={26} color="var(--accent)" />
              <h3>Drop protocol to start a run</h3>
              <p>PDF or DOCX · parsing begins immediately</p>
            </div>
          </div>
        ) : null}

        {/* drawer */}
        {kol ? <KolDrawer id={kol} onClose={closeKol} /> : null}

        {/* upload modal */}
        {upload ? (
          <UploadModal
            initialFile={upload.file}
            onClose={closeUpload}
            onComplete={() => { closeUpload(); go('brief'); }}
          />
        ) : null}

        {/* voice copilot */}
        {voiceOpen ? <VoicePanel currentId={protocolId} onClose={() => setVoiceOpen(false)} /> : null}
      </div>
    );
  }

  window.App = App;
})();
