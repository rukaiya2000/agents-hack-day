import React from 'react';

/**
 * Button — primary action control for Medical Affairs Copilot.
 * Quiet, precise, enterprise. Borders over shadows.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: { height: 28, padding: '0 10px', fontSize: 'var(--text-sm)', gap: 6, radius: 'var(--radius-sm)' },
    md: { height: 34, padding: '0 14px', fontSize: 'var(--text-base)', gap: 7, radius: 'var(--radius-md)' },
    lg: { height: 40, padding: '0 18px', fontSize: 'var(--text-md)', gap: 8, radius: 'var(--radius-md)' },
  };
  const variants = {
    primary: {
      background: 'var(--accent)', color: 'var(--text-on-accent)',
      border: '1px solid var(--accent)',
    },
    secondary: {
      background: 'var(--surface-card)', color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)',
    },
    ghost: {
      background: 'transparent', color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'var(--surface-card)', color: 'var(--risk-ink)',
      border: '1px solid color-mix(in srgb, var(--risk) 40%, var(--border-subtle))',
    },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  const btnStyle = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: s.gap, height: s.height, padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans)', fontSize: s.fontSize, fontWeight: 'var(--weight-medium)',
    letterSpacing: 'var(--tracking-snug)', lineHeight: 1,
    borderRadius: s.radius, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background .15s ease, border-color .15s ease, color .15s ease',
    whiteSpace: 'nowrap', userSelect: 'none',
    ...v, ...style,
  };

  const onEnter = (e) => {
    if (disabled) return;
    if (variant === 'primary') e.currentTarget.style.background = 'var(--accent-hover)', e.currentTarget.style.borderColor = 'var(--accent-hover)';
    else if (variant === 'secondary') e.currentTarget.style.background = 'var(--surface-sunken)';
    else if (variant === 'ghost') e.currentTarget.style.background = 'var(--surface-sunken)', e.currentTarget.style.color = 'var(--text-primary)';
    else if (variant === 'danger') e.currentTarget.style.background = 'var(--risk-tint)';
  };
  const onLeave = (e) => {
    e.currentTarget.style.background = v.background;
    e.currentTarget.style.borderColor = v.border.split(' ').slice(2).join(' ');
    e.currentTarget.style.color = v.color;
  };

  return (
    <button
      type={type} disabled={disabled} onClick={onClick} style={btnStyle}
      onMouseEnter={onEnter} onMouseLeave={onLeave} {...rest}
    >
      {iconLeft ? <span style={{ display: 'inline-flex', flex: 'none' }}>{iconLeft}</span> : null}
      {children ? <span>{children}</span> : null}
      {iconRight ? <span style={{ display: 'inline-flex', flex: 'none' }}>{iconRight}</span> : null}
    </button>
  );
}
