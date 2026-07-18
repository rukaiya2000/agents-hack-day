import React from 'react';

/**
 * ScoreBar — a single line of a KOL score breakdown. Label, contribution
 * track, and a mono value. Explainability is the point: every score is shown
 * as the sum of legible parts.
 */
export function ScoreBar({
  label,
  value,            // 0–100
  max = 100,
  tone = 'accent',
  weight = null,    // optional "× 0.30" style contribution note
  height = 6,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const tones = {
    accent:   'var(--accent)',
    evidence: 'var(--evidence)',
    safe:     'var(--safe)',
    compliance:'var(--compliance)',
    neutral:  'var(--slate-400)',
  };
  const fill = tones[tone] || tones.accent;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <span style={{
          fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
          fontWeight: 'var(--weight-medium)', flex: 1, minWidth: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }} title={typeof label === 'string' ? label : undefined}>{label}</span>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, flex: 'none' }}>
          {weight ? (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>{weight}</span>
          ) : null}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--weight-medium)' }}>
            {Number.isInteger(value) ? value : value.toFixed(1)}
          </span>
        </span>
      </div>
      <div style={{ height, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: fill,
          borderRadius: 'var(--radius-pill)', transition: 'width .4s cubic-bezier(.2,.7,.2,1)',
        }} />
      </div>
    </div>
  );
}
