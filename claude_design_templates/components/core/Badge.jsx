import React from 'react';

/**
 * Badge — compact status / label pill. Tone maps to the semantic palette.
 * Used for compliance status, evidence flags, phase labels, etc.
 */
export function Badge({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  icon = null,
  children,
  style,
  ...rest
}) {
  const tones = {
    neutral:    { c: 'var(--slate-700)', t: 'var(--surface-sunken)',  b: 'var(--border-strong)', s: 'var(--slate-500)' },
    accent:     { c: 'var(--teal-700)',  t: 'var(--accent-tint)',     b: 'var(--teal-300)',      s: 'var(--accent)' },
    evidence:   { c: 'var(--evidence-ink)', t: 'var(--evidence-tint)',b: 'color-mix(in srgb, var(--evidence) 35%, white)', s: 'var(--evidence)' },
    compliance: { c: 'var(--compliance-ink)', t: 'var(--compliance-tint)', b: 'color-mix(in srgb, var(--compliance) 40%, white)', s: 'var(--compliance)' },
    risk:       { c: 'var(--risk-ink)',  t: 'var(--risk-tint)',       b: 'color-mix(in srgb, var(--risk) 38%, white)', s: 'var(--risk)' },
    safe:       { c: 'var(--safe-ink)',  t: 'var(--safe-tint)',       b: 'color-mix(in srgb, var(--safe) 38%, white)', s: 'var(--safe)' },
  };
  const sizes = {
    sm: { h: 18, px: 6, fs: 'var(--text-2xs)', gap: 4 },
    md: { h: 22, px: 8, fs: 'var(--text-xs)', gap: 5 },
  };
  const tn = tones[tone] || tones.neutral;
  const sz = sizes[size] || sizes.md;

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: sz.gap,
    height: sz.h, padding: `0 ${sz.px}px`, borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-sans)', fontSize: sz.fs, fontWeight: 'var(--weight-medium)',
    letterSpacing: 'var(--tracking-snug)', lineHeight: 1, whiteSpace: 'nowrap',
  };
  const variants = {
    soft:    { background: tn.t, color: tn.c, border: `1px solid ${tn.b}` },
    solid:   { background: tn.s, color: 'var(--white)', border: `1px solid ${tn.s}` },
    outline: { background: 'transparent', color: tn.c, border: `1px solid ${tn.b}` },
  };

  return (
    <span style={{ ...base, ...(variants[variant] || variants.soft), ...style }} {...rest}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: variant === 'solid' ? 'rgba(255,255,255,.9)' : tn.s, flex: 'none' }} /> : null}
      {icon ? <span style={{ display: 'inline-flex', flex: 'none' }}>{icon}</span> : null}
      {children}
    </span>
  );
}
