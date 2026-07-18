import React from 'react';

/**
 * Card — the fundamental surface. White, hairline border, quiet. Optional
 * header rail (eyebrow + title + actions). Premium through structure, not shadow.
 */
export function Card({
  eyebrow = null,
  title = null,
  actions = null,
  selected = false,
  interactive = false,
  padding = 16,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const hasHeader = eyebrow || title || actions;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${selected ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
        boxShadow: selected
          ? '0 0 0 1px var(--border-accent), var(--shadow-sm)'
          : (interactive && hover ? 'var(--shadow-md)' : 'var(--shadow-xs)'),
        borderRadius: 'var(--radius-lg)',
        transition: 'box-shadow .15s ease, border-color .15s ease',
        cursor: interactive ? 'pointer' : 'default',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {hasHeader ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            {eyebrow ? (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase',
                color: 'var(--text-tertiary)', fontWeight: 'var(--weight-medium)', marginBottom: title ? 3 : 0,
              }}>{eyebrow}</div>
            ) : null}
            {title ? (
              <div style={{
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)',
                fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)',
                letterSpacing: 'var(--tracking-snug)', lineHeight: 1.25,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{title}</div>
            ) : null}
          </div>
          {actions ? <div style={{ display: 'flex', gap: 6, flex: 'none' }}>{actions}</div> : null}
        </div>
      ) : null}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
