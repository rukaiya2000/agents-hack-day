/* Live product fragments used as the landing page's "imagery".
   These are the actual design-system components, not screenshots. */
const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
const { KolCard, VoiceControl, CompliancePanel, Badge, Avatar } = DS;

/* ---- Hero cockpit fragment ---------------------------------------------- */
function HeroCockpit() {
  const [listening, setListening] = React.useState(true);
  return (
    <div className="device">
      <div className="device__bar">
        <span className="device__dot" />
        <span className="device__title">
          RSV-PreF-301
          <span className="device__sub"> · Phase 3 · adults ≥60</span>
        </span>
        <Badge tone="evidence" size="sm" dot>Indexed</Badge>
      </div>
      <div className="device__body">
        <VoiceControl
          state={listening ? 'listening' : 'idle'}
          elapsed="0:12"
          transcript="Find infectious-disease KOLs for this protocol"
          onToggle={() => setListening((v) => !v)}
        />
        <KolCard
          rank={1}
          name="Dr. Elena Marchetti"
          institution="Karolinska Institutet"
          specialty="Vaccinology"
          geography="EU · Sweden"
          score={92.4}
          status="validated"
          citations={37}
          breakdown={[
            { label: 'Trial', value: 30 },
            { label: 'Pubs', value: 24 },
            { label: 'Guidelines', value: 18 },
            { label: 'Recency', value: 12 },
          ]}
          rationale="Led Phase 3 prefusion-F efficacy work directly relevant to the protocol's primary endpoint."
          selected
        />
        <CompliancePanel
          mode="Medical Affairs"
          items={[
            { label: 'Citation-required recommendations' },
            { label: 'No prescribing-volume targeting' },
          ]}
          auditAvailable
        />
      </div>
    </div>
  );
}

/* ---- Voice Q&A fragment -------------------------------------------------- */
function Cite({ n }) {
  return (
    <sup className="cite" title="Traced to source evidence">
      [{n}]
    </sup>
  );
}

function VoiceCopilot() {
  const [state, setState] = React.useState('listening');
  // gentle cycle: listening -> thinking -> idle -> listening
  React.useEffect(() => {
    const order = ['listening', 'thinking', 'idle'];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % order.length;
      setState(order[i]);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="voice">
      <VoiceControl
        state={state}
        elapsed="0:41"
        transcript="Why is Dr. Chen ranked above Dr. Patel?"
        onToggle={() => setState((s) => (s === 'idle' ? 'listening' : 'idle'))}
      />

      <div className="qa">
        <div className="qa__q">
          <span className="qa__role">You</span>
          <p>Why is Dr. Chen ranked above Dr. Patel?</p>
        </div>
        <div className="qa__a">
          <span className="qa__role qa__role--ai">
            <span className="qa__avatar">
              <img src="../assets/logo-mark.svg" alt="" width="20" height="20" />
            </span>
            KOL Copilot
          </span>
          <p>
            Dr. Chen contributed direct Phase 3 trial experience on the protocol's primary
            endpoint<Cite n={1} /> and authored two guideline statements in the disease
            state<Cite n={2} />. Dr. Patel's record is strong but weighted toward adjacent
            indications<Cite n={3} />, so trial relevance separates them.
          </p>
          <div className="qa__foot">
            <span className="qa__chip">3 citations</span>
            <span className="qa__guard">Reviewed against Medical Affairs guardrails · audit-logged</span>
          </div>
        </div>

        <div className="qa__q">
          <span className="qa__role">You</span>
          <p>Draft a compliant MSL pre-call brief.</p>
        </div>
        <div className="qa__a qa__a--brief">
          <span className="qa__role qa__role--ai">
            <span className="qa__avatar">
              <img src="../assets/logo-mark.svg" alt="" width="20" height="20" />
            </span>
            KOL Copilot
          </span>
          <p className="qa__doc">
            Generated a non-promotional pre-call brief — background, related trial
            experience, recent publications, and suggested scientific-exchange topics —
            with every claim traced to source<Cite n={4} />.
          </p>
          <div className="qa__foot">
            <span className="qa__chip qa__chip--safe">Guardrail check passed</span>
            <span className="qa__guard">No prescribing-volume or promotional content</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- mount -------------------------------------------------------------- */
const heroEl = document.getElementById('hero-visual');
if (heroEl) ReactDOM.createRoot(heroEl).render(<HeroCockpit />);

const voiceEl = document.getElementById('voice-visual');
if (voiceEl) ReactDOM.createRoot(voiceEl).render(<VoiceCopilot />);
