import React from 'react';
import { Avatar } from '../core/Avatar.jsx';
import { Badge } from '../core/Badge.jsx';
import { Button } from '../core/Button.jsx';

/**
 * KolCard — a ranked expert card. Dense but elegant: rank, identity, total
 * score, score breakdown, top rationale, citation count, compliance status,
 * and the two primary actions (View evidence / Generate brief). Built for
 * quick comparison under time pressure, NOT a social profile.
 */
function StatusBadge({ status }) {
  const map = {
    validated: { tone: 'safe', label: 'Validated', dot: true },
    review:    { tone: 'compliance', label: 'Review pending', dot: true },
    conflict:  { tone: 'risk', label: 'Conflict flagged', dot: true },
  };
  const s = map[status] || map.validated;
  return <Badge tone={s.tone} size="sm" dot={s.dot}>{s.label}</Badge>;
}

export function KolCard({
  rank,
  name,
  institution,
  specialty,
  geography,
  score,
  scoreMax = 100,
  status = 'validated',
  rationale,
  citations = 0,
  breakdown = [],        // [{ label, value }] for the segmented mini-bar
  selected = false,
  onSelect,
  onViewEvidence,
  onGenerateBrief,
  style,
  ...rest
}) {
  const segColors = ['var(--accent)', 'var(--evidence)', 'var(--safe)', 'var(--slate-400)'];
  const segTotal = breakdown.reduce((a, b) => a + b.value, 0) || 1;

  return (
    <div
      onClick={onSelect}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${selected ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
        boxShadow: selected ? '0 0 0 1px var(--border-accent), var(--shadow-sm)' : 'var(--shadow-xs)',
        borderRadius: 'var(--radius-lg)', padding: 14, cursor: onSelect ? 'pointer' : 'default',
        transition: 'box-shadow .15s ease, border-color .15s ease',
        display: 'flex', flexDirection: 'column', gap: 11, ...style,
      }}
      {...rest}
    >
      {/* header */}
      <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
          color: 'var(--text-tertiary)', width: 22, flex: 'none', paddingTop: 2,
        }}>{String(rank).padStart(2, '0')}</span>
        <Avatar name={name} size={40} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', letterSpacing: 'var(--tracking-snug)', lineHeight: 1.2 }}>
            {name}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {institution}
          </div>
        </div>
        <div style={{ textAlign: 'right', flex: 'none' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-medium)', color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.01em' }}>
            {Number.isInteger(score) ? score : score.toFixed(1)}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', marginTop: 3, letterSpacing: '.08em' }}>
            / {scoreMax} SCORE
          </div>
        </div>
      </div>

      {/* meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--weight-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {specialty}{geography ? <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{'  ·  ' + geography}</span> : null}
        </span>
        <span style={{ flex: 'none' }}><StatusBadge status={status} /></span>
      </div>

      {/* segmented breakdown bar */}
      {breakdown.length ? (
        <div>
          <div style={{ display: 'flex', height: 6, borderRadius: 'var(--radius-pill)', overflow: 'hidden', background: 'var(--surface-sunken)' }}>
            {breakdown.map((b, i) => (
              <div key={i} title={`${b.label}: ${b.value}`} style={{ width: `${(b.value / segTotal) * 100}%`, background: segColors[i % segColors.length] }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 7, flexWrap: 'wrap' }}>
            {breakdown.map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: segColors[i % segColors.length] }} />
                {b.label}
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{b.value}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* rationale */}
      {rationale ? (
        <div style={{
          fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5,
          paddingLeft: 10, borderLeft: '2px solid var(--accent-tint-2)',
        }}>
          {rationale}
        </div>
      ) : null}

      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 3 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--evidence-ink)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--evidence)' }} />
          {citations} citations
        </span>
        <span style={{ flex: 1 }} />
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onViewEvidence?.(); }}>View evidence</Button>
        <Button size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); onGenerateBrief?.(); }}>Generate brief</Button>
      </div>
    </div>
  );
}
