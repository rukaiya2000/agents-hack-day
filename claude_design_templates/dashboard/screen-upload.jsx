// Upload protocol modal (drag & drop) -> window.UploadModal
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge } = DS;
  const Icon = window.Icon;
  const { Note } = window.UI;
  const D = window.ORCH;

  const ACCEPT = ['pdf', 'docx', 'doc'];
  const MAX_MB = 50;

  // sample protocol the user can drop or pick
  const SAMPLE = { name: 'RSV-PreF-301_Protocol_Amendment-4.pdf', sizeMB: 4.2, ext: 'pdf' };

  const PARSE_STEPS = [
    { lab: 'Parsing document structure', ct: '312 chunks' },
    { lab: 'Extracting protocol brief', ct: '12 sections' },
    { lab: 'Detecting endpoints & population', ct: '2 endpoints' },
    { lab: 'Classifying specialties & themes', ct: '4 specialties' },
  ];

  function fmtSize(mb) { return mb >= 1 ? mb.toFixed(1) + ' MB' : Math.round(mb * 1024) + ' KB'; }

  // phase: idle | invalid | uploading | parsing | ready
  function UploadModal({ initialDrag, initialFile, onClose, onComplete }) {
    const [phase, setPhase] = React.useState('idle');
    const [drag, setDrag] = React.useState(!!initialDrag);
    const [file, setFile] = React.useState(null);
    const [err, setErr] = React.useState('');
    const [progress, setProgress] = React.useState(0);
    const [stepIdx, setStepIdx] = React.useState(0);
    const inputRef = React.useRef(null);
    const timers = React.useRef([]);

    const push = (t) => { timers.current.push(t); return t; };
    React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

    // a file handed in from the drag-anywhere veil auto-starts
    React.useEffect(() => { if (initialFile) accept(initialFile); /* eslint-disable-next-line */ }, []);

    // ESC closes
    React.useEffect(() => {
      const h = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', h);
      return () => window.removeEventListener('keydown', h);
    }, [onClose]);

    function accept(f) {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      if (!ACCEPT.includes(ext)) {
        setErr(`"${f.name}" isn't a supported format. Upload a PDF or Word protocol.`);
        setPhase('invalid');
        return;
      }
      if (f.sizeMB > MAX_MB) {
        setErr(`"${f.name}" is ${fmtSize(f.sizeMB)} — over the ${MAX_MB} MB limit.`);
        setPhase('invalid');
        return;
      }
      setErr('');
      setFile({ name: f.name, sizeMB: f.sizeMB, ext });
      startUpload();
    }

    function startUpload() {
      setPhase('uploading');
      setProgress(0);
      let p = 0;
      const tick = () => {
        p += Math.random() * 18 + 8;
        if (p >= 100) {
          setProgress(100);
          push(setTimeout(startParse, 360));
        } else {
          setProgress(Math.round(p));
          push(setTimeout(tick, 180));
        }
      };
      push(setTimeout(tick, 200));
    }

    function startParse() {
      setPhase('parsing');
      setStepIdx(0);
      const advance = (i) => {
        if (i >= PARSE_STEPS.length) { push(setTimeout(() => setPhase('ready'), 450)); return; }
        setStepIdx(i);
        push(setTimeout(() => advance(i + 1), 720));
      };
      advance(0);
    }

    // drag handlers
    function onDrop(e) {
      e.preventDefault(); setDrag(false);
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) accept({ name: f.name, sizeMB: f.size / (1024 * 1024) });
      else accept(SAMPLE); // demo fallback
    }
    function onPick(e) {
      const f = e.target.files && e.target.files[0];
      if (f) accept({ name: f.name, sizeMB: f.size / (1024 * 1024) });
    }

    const P = D.protocol;

    return (
      <div className="umodal-scrim" onClick={onClose}>
        <div className="umodal" role="dialog" aria-label="Upload protocol" onClick={(e) => e.stopPropagation()}>
          <div className="umodal__head">
            <span className="umi"><Icon name="upload" size={17} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2>Upload protocol</h2>
              <div className="sub">{phase === 'ready' ? 'Parsed · ready to start run' : phase === 'parsing' ? 'Extracting protocol intelligence…' : phase === 'uploading' ? 'Uploading…' : 'Phase 3 clinical protocol · PDF or DOCX'}</div>
            </div>
            <button className="iconbtn" onClick={onClose} title="Close"><Icon name="x" size={16} /></button>
          </div>

          <div className="umodal__body">
            {/* ----- idle / invalid : dropzone ----- */}
            {(phase === 'idle' || phase === 'invalid') && (
              <>
                <div
                  className={'dropzone' + (drag ? ' is-drag' : '') + (phase === 'invalid' ? ' is-error' : '')}
                  onClick={() => inputRef.current && inputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDrag(false); }}
                  onDrop={onDrop}
                >
                  <span className="dropzone__ic"><Icon name={phase === 'invalid' ? 'alert' : 'upload'} size={22} color={phase === 'invalid' ? 'var(--risk)' : 'var(--accent)'} /></span>
                  <h3>{drag ? 'Drop to begin parsing' : <>Drag &amp; drop, or <b>browse</b></>}</h3>
                  <p>Parsing starts on upload — no templates or manual tagging.</p>
                  <div className="formats">PDF · DOCX · max {MAX_MB} MB · single file</div>
                  <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={onPick} />
                </div>

                {phase === 'invalid' && <div style={{ marginTop: 12 }}><Note tone="risk" icon="alert">{err}</Note></div>}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 6px' }}>
                  <span style={{ height: 1, flex: 1, background: 'var(--border-subtle)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.1em' }}>or</span>
                  <span style={{ height: 1, flex: 1, background: 'var(--border-subtle)' }} />
                </div>
                <button className="rowlink" onClick={() => accept(SAMPLE)}>
                  <Icon name="file" size={15} color="var(--evidence)" />
                  <span style={{ textAlign: 'left' }}>
                    <span style={{ display: 'block', fontWeight: 500 }}>Use sample protocol</span>
                    <span className="muted" style={{ fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)' }}>{SAMPLE.name} · {fmtSize(SAMPLE.sizeMB)}</span>
                  </span>
                  <Icon name="chevron" size={14} color="var(--text-tertiary)" />
                </button>
              </>
            )}

            {/* ----- uploading ----- */}
            {phase === 'uploading' && file && (
              <>
                <div className="ufile">
                  <span className="ufile__ic">{file.ext.toUpperCase().slice(0, 3)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ufile__nm">{file.name}</div>
                    <div className="ufile__meta">{fmtSize(file.sizeMB)} · uploading {progress}%</div>
                  </div>
                  <span className="spinner" />
                </div>
                <div className="uprog"><i style={{ width: progress + '%' }} /></div>
              </>
            )}

            {/* ----- parsing ----- */}
            {phase === 'parsing' && file && (
              <>
                <div className="ufile">
                  <span className="ufile__ic">{file.ext.toUpperCase().slice(0, 3)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ufile__nm">{file.name}</div>
                    <div className="ufile__meta">{fmtSize(file.sizeMB)} · uploaded</div>
                  </div>
                  <Badge tone="safe" size="sm" dot>Uploaded</Badge>
                </div>
                <div className="usteps">
                  {PARSE_STEPS.map((s, i) => {
                    const state = i < stepIdx ? 'done' : i === stepIdx ? 'active' : 'pending';
                    return (
                      <div key={i} className={'ustep ustep--' + state}>
                        <span className="ustep__dot">
                          {state === 'done' ? <Icon name="check" size={12} color="#fff" />
                            : state === 'active' ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : null}
                        </span>
                        <span className="ustep__lab">{s.lab}</span>
                        {state === 'done' ? <span className="ustep__ct">{s.ct}</span> : null}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ----- ready ----- */}
            {phase === 'ready' && (
              <>
                <Note tone="safe" icon="check">Protocol parsed into 312 chunks. Brief extracted with 12 sections — review confidence on the next screen.</Note>
                <div className="uprev">
                  <div className="full"><dt>Study title</dt><dd>{P.title}</dd></div>
                  <div><dt>Sponsor</dt><dd>{P.sponsor}</dd></div>
                  <div><dt>Phase</dt><dd>Phase {P.phase}</dd></div>
                  <div><dt>Indication</dt><dd>RSV — LRTD</dd></div>
                  <div><dt>Population</dt><dd>Adults aged ≥60</dd></div>
                  <div className="full"><dt>Geography</dt><dd>{P.geographies.join(' · ')}</dd></div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Note tone="compliance" icon="alert">2 fields parsed below 80% confidence (modality, specialties). Flagged for review in the protocol brief.</Note>
                </div>
              </>
            )}
          </div>

          <div className="umodal__foot">
            {phase === 'ready' ? (
              <>
                <Icon name="shield" size={14} color="var(--text-tertiary)" />
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Indexed to Moss on run start · audit-logged</span>
                <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} onClick={onClose}>Cancel</Button>
                <Button variant="primary" size="sm" iconLeft={<Icon name="play" size={13} />} onClick={() => onComplete && onComplete()}>Start processing run</Button>
              </>
            ) : (phase === 'uploading' || phase === 'parsing') ? (
              <>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{phase === 'uploading' ? 'Transferring…' : 'Working…'}</span>
                <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} onClick={onClose}>Cancel</Button>
              </>
            ) : (
              <>
                <Icon name="shield" size={14} color="var(--text-tertiary)" />
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>Non-promotional · protocol stays within your workspace</span>
                <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} onClick={onClose}>Cancel</Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  window.UploadModal = UploadModal;
})();
