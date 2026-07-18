import React from 'react';

/**
 * Avatar — KOL / expert monogram. Initials on a calm tinted disc. Deliberately
 * NOT a photo: this is a scientific tool, not a social profile.
 */
export function Avatar({ name = '', size = 36, tone = 'auto', style, ...rest }) {
  const initials = name
    .replace(/^(Dr|Prof)\.?\s+/i, '')
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((w) => w[0]?.toUpperCase()).join('');

  const palette = [
    { bg: 'var(--accent-tint)', fg: 'var(--teal-700)', bd: 'var(--teal-100)' },
    { bg: 'var(--evidence-tint)', fg: 'var(--evidence-ink)', bd: 'color-mix(in srgb, var(--evidence) 22%, white)' },
    { bg: 'var(--surface-sunken)', fg: 'var(--slate-700)', bd: 'var(--border-strong)' },
    { bg: 'var(--safe-tint)', fg: 'var(--safe-ink)', bd: 'color-mix(in srgb, var(--safe) 26%, white)' },
  ];
  let p;
  if (tone === 'accent') p = palette[0];
  else if (tone === 'evidence') p = palette[1];
  else if (tone === 'neutral') p = palette[2];
  else {
    const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    p = palette[sum % palette.length];
  }

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, flex: 'none',
        borderRadius: 'var(--radius-md)',
        background: p.bg, color: p.fg, border: `1px solid ${p.bd}`,
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)',
        fontSize: Math.round(size * 0.36), letterSpacing: '.01em', userSelect: 'none',
        ...style,
      }}
      aria-label={name}
      {...rest}
    >
      {initials || '—'}
    </span>
  );
}
