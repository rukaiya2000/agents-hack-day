import React from 'react';

/**
 * Citation — an evidence reference. Two shapes:
 *  • compact: a small mono [ref] pill for inline use in answer text
 *  • full: a list row with title, source · year, and a relevance note
 * Evidence is always indigo-accented and always quotable.
 */
export function Citation({
  refId,
  title,
  source,
  year,
  relevance = null,
  compact = false,
  onClick,
  style,
  ...rest
}) {
  if (compact) {
    return (
      <button
        type="button" onClick={onClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, height: 18,
          padding: '0 6px', borderRadius: 'var(--radius-xs)', cursor: 'pointer',
          background: 'var(--evidence-tint)', border: '1px solid color-mix(in srgb, var(--evidence) 22%, white)',
          color: 'var(--evidence-ink)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
          fontWeight: 'var(--weight-medium)', lineHeight: 1, verticalAlign: 'baseline', ...style,
        }}
        {...rest}
      >
        {refId}
      </button>
    );
  }

  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', gap: 10, padding: '10px 12px',
        borderRadius: 'var(--radius-md)', cursor: onClick ? 'pointer' : 'default',
        border: '1px solid var(--border-subtle)',
        background: hover && onClick ? 'var(--surface-inset)' : 'var(--surface-card)',
        borderLeft: '2.5px solid var(--evidence)',
        transition: 'background .15s ease', ...style,
      }}
      {...rest}
    >
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)',
        color: 'var(--evidence-ink)', background: 'var(--evidence-tint)', borderRadius: 'var(--radius-xs)',
        padding: '2px 5px', height: 'fit-content', flex: 'none', letterSpacing: '.02em',
      }}>{refId}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-medium)',
          color: 'var(--text-primary)', lineHeight: 1.3,
        }}>{title}</div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 3,
        }}>
          {source}{source && year ? ' · ' : ''}{year}
        </div>
        {relevance ? (
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.45 }}>
            {relevance}
          </div>
        ) : null}
      </div>
    </div>
  );
}
