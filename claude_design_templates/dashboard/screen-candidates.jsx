// KOL Candidates screen -> window.ScreensD
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const { Button, Badge } = DS;
  const Icon = window.Icon;
  const { ScreenHead, Panel, StatusBadge, MiniBar, Note } = window.UI;
  const D = window.ORCH;

  const TRIAL = {
    lead: ['safe', 'Lead PI'],
    investigator: ['accent', 'Investigator'],
    none: ['neutral', 'No trial role'],
  };

  // influence as a 3-step dot ramp
  function Influence({ level }) {
    const n = { high: 3, medium: 2, low: 1 }[level] || 0;
    const col = level === 'high' ? 'var(--evidence)' : level === 'medium' ? 'var(--evidence)' : 'var(--text-tertiary)';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ display: 'inline-flex', gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: 9, background: i < n ? col : 'var(--surface-sunken)', border: i < n ? 'none' : '1px solid var(--border-subtle)' }} />
          ))}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{level}</span>
      </span>
    );
  }

  function Candidates({ openKol }) {
    const [sortKey, setSortKey] = React.useState('score');
    const [dir, setDir] = React.useState('desc');
    const [trialF, setTrialF] = React.useState('All');
    const [geoF, setGeoF] = React.useState('All');

    const TRIAL_ORDER = { lead: 3, investigator: 2, none: 1 };
    const INF_ORDER = { high: 3, medium: 2, low: 1 };

    function sortBy(key) {
      if (key === sortKey) { setDir(dir === 'desc' ? 'asc' : 'desc'); }
      else { setSortKey(key); setDir('desc'); }
    }

    let rows = D.candidates.filter((c) =>
      (trialF === 'All' || (trialF === 'Trial experience' ? c.trial !== 'none' : c.trial === 'none')) &&
      (geoF === 'All' || c.geo.startsWith(geoF)));

    rows = [...rows].sort((a, b) => {
      const get = (c) => {
        switch (sortKey) {
          case 'name': return c.name.replace(/^(Dr\.|Prof\.)\s+/, '');
          case 'institution': return c.institution;
          case 'specialty': return c.specialty;
          case 'trial': return TRIAL_ORDER[c.trial];
          case 'pubRel': return c.pubRel;
          case 'influence': return INF_ORDER[c.influence];
          case 'sources': return c.sources;
          case 'flags': return c.flags;
          default: return c.score;
        }
      };
      const av = get(a), bv = get(b);
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return dir === 'desc' ? -cmp : cmp;
    });

    const Th = ({ k, children, num }) => (
      <th className={(num ? 'num ' : '') + 'sortable'} onClick={() => sortBy(k)}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: sortKey === k ? 'var(--accent)' : undefined }}>
          {children}
          {sortKey === k ? <Icon name={dir === 'desc' ? 'chevronDown' : 'chevron'} size={11} style={dir === 'desc' ? null : { transform: 'rotate(-90deg)' }} /> : null}
        </span>
      </th>
    );

    return (
      <div className="page page--wide">
        <ScreenHead
          eyebrow="Stage 05 · KOLs extracted"
          title="KOL candidates"
          desc="64 experts surfaced from the evidence set and scored for scientific relevance to RSV-PreF-301. Sort and filter to compare; open any candidate for the full evidence-backed profile."
          actions={<>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="filter" size={14} />}>18 shortlisted</Button>
            <Button variant="primary" size="sm" iconLeft={<Icon name="download" size={14} />}>Export candidates</Button>
          </>}
        />

        <div className="toolbar">
          <span className="fsearch"><Icon name="queries" size={14} /><input placeholder="Search name or institution…" /></span>
          <span className="fsep" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Trial</span>
          {['All', 'Trial experience', 'No trial role'].map((t) => (
            <button key={t} className="fbtn" aria-pressed={trialF === t} onClick={() => setTrialF(t)}>{t}</button>
          ))}
          <span className="fsep" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Region</span>
          {['All', 'US', 'EU', 'APAC', 'AU'].map((t) => (
            <button key={t} className="fbtn" aria-pressed={geoF === t} onClick={() => setGeoF(t)}>{t}</button>
          ))}
        </div>

        <Panel noBody>
          <table className="tbl">
            <thead><tr>
              <th style={{ width: 36 }} className="num">#</th>
              <Th k="name">Expert</Th>
              <Th k="specialty">Specialty</Th>
              <th>Geography</th>
              <Th k="trial">Trial experience</Th>
              <Th k="pubRel" num>Publication rel.</Th>
              <Th k="influence">Influence</Th>
              <Th k="sources" num>Sources</Th>
              <Th k="flags" num>Flags</Th>
              <Th k="score" num>Match score</Th>
              <th></th>
            </tr></thead>
            <tbody>
              {rows.map((c) => {
                const [tt, tl] = TRIAL[c.trial];
                return (
                  <tr key={c.id} onClick={() => openKol(c.id)}>
                    <td className="num mono muted" style={{ fontSize: 'var(--text-2xs)' }}>{c.rank}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 500 }}>{c.name}</div>
                      <div className="muted" style={{ fontSize: 'var(--text-2xs)' }}>{c.institution}</div>
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)' }}>{c.specialty}</td>
                    <td className="muted mono" style={{ fontSize: 'var(--text-2xs)', whiteSpace: 'nowrap' }}>{c.geo}</td>
                    <td><Badge tone={tt} size="sm" dot={c.trial !== 'none'}>{tl}</Badge></td>
                    <td className="num"><MiniBar value={c.pubRel} /></td>
                    <td><Influence level={c.influence} /></td>
                    <td className="num mono" style={{ color: 'var(--text-secondary)' }}>{c.sources}</td>
                    <td className="num">
                      {c.flags > 0
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--risk-ink)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}><Icon name="flag" size={12} color="var(--risk)" />{c.flags}</span>
                        : <span className="muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>0</span>}
                    </td>
                    <td className="num"><span className="scorepill" style={{ color: c.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)' }}>{c.score}</span></td>
                    <td style={{ textAlign: 'right' }}><Icon name="chevron" size={14} color="var(--text-tertiary)" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>Showing {rows.length} of 64 · ranked by scientific relevance, not prescribing volume</span>
          <Button variant="ghost" size="sm">Load remaining 56 candidates</Button>
        </div>
      </div>
    );
  }

  window.ScreensD = { Candidates };
})();
