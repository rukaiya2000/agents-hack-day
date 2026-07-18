import React from 'react';

/**
 * CompliancePanel — the persistent guardrail module. Compliance is present but
 * calm: a quiet amber-keyed panel that states the active Medical Affairs rules.
 * Never alarming unless something is actually wrong.
 */
function Check({ ok }) {
  return ok ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--safe)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: 1 }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--compliance)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: 1 }}>
      <path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

export function CompliancePanel({
  mode = 'Medical Affairs',
  items = [],          // [{ label, ok }]
  auditAvailable = true,
  style,
  ...rest
}) {
  return (
    <div
      style={{
        border: '1px solid color-mix(in srgb, var(--compliance) 28%, var(--border-subtle))',
        background: 'color-mix(in srgb, var(--compliance-tint) 50%, var(--surface-card))',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden', ...style,
      }}
      {...rest}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px',
        borderBottom: '1px solid color-mix(in srgb, var(--compliance) 22%, var(--border-subtle))',
      }}>
        <span style={{ display: 'inline-flex', flex: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--compliance-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
          </svg>
        </span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--compliance-ink)', flex: 1, minWidth: 0 }}>
          {mode} mode enabled
        </span>
        <span style={{
          width: 7, height: 7, borderRadius: 999, background: 'var(--safe)',
          boxShadow: '0 0 0 3px color-mix(in srgb, var(--safe) 22%, transparent)',
        }} />
      </div>

      <div style={{ padding: '10px 13px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Check ok={it.ok !== false} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-700)', lineHeight: 1.4, flex: 1, minWidth: 0 }}>{it.label}</span>
          </div>
        ))}
      </div>

      {auditAvailable ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '9px 13px',
          borderTop: '1px solid color-mix(in srgb, var(--compliance) 18%, var(--border-subtle))',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: '.04em',
          color: 'var(--text-tertiary)', textTransform: 'uppercase',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" /></svg>
          Full audit trail available
        </div>
      ) : null}
    </div>
  );
}
