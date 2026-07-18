import React from 'react';

/**
 * Tag — protocol attribute chip. A compact key→value token used to abstract
 * a clinical protocol into scannable facts (Phase · Indication · Geography…).
 */
export function Tag({ label, value, icon = null, tone = 'neutral', style, ...rest }) {
  const tones = {
    neutral: { label: 'var(--text-tertiary)', value: 'var(--text-primary)', bd: 'var(--border-subtle)', bg: 'var(--surface-inset)' },
    accent:  { label: 'var(--teal-700)', value: 'var(--teal-700)', bd: 'var(--teal-300)', bg: 'var(--accent-tint)' },
  };
  const tn = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 24, padding: '0 9px', borderRadius: 'var(--radius-sm)',
        background: tn.bg, border: `1px solid ${tn.bd}`,
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', lineHeight: 1,
        whiteSpace: 'nowrap', maxWidth: '100%', ...style,
      }}
      {...rest}
    >
      {icon ? <span style={{ display: 'inline-flex', flex: 'none', color: tn.label }}>{icon}</span> : null}
      {label ? (
        <span style={{ color: tn.label, fontWeight: 'var(--weight-medium)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)' }}>
          {label}
        </span>
      ) : null}
      <span style={{ color: tn.value, fontWeight: 'var(--weight-medium)' }}>
        {value}
      </span>
    </span>
  );
}
