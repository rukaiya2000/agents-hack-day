import React from 'react';

/**
 * VoiceControl — the ambient voice session control for the copilot. A subtle
 * live waveform, a state label, an elapsed timer, and a quiet mic toggle.
 * Professional and instrument-like — deliberately NOT a giant microphone.
 */
const BAR_COUNT = 28;

export function VoiceControl({
  state = 'idle',          // 'idle' | 'listening' | 'thinking'
  transcript = '',
  elapsed = '',            // e.g. "0:12"
  onToggle,
  style,
  ...rest
}) {
  const listening = state === 'listening';
  const thinking = state === 'thinking';
  const label = listening ? 'Listening' : thinking ? 'Thinking' : 'Tap to ask';
  const accent = listening ? 'var(--accent)' : thinking ? 'var(--evidence)' : 'var(--slate-400)';

  const bars = Array.from({ length: BAR_COUNT });

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 14px', borderRadius: 'var(--radius-lg)',
        border: `1px solid ${listening ? 'color-mix(in srgb, var(--accent) 35%, var(--border-subtle))' : 'var(--border-subtle)'}`,
        background: listening ? 'color-mix(in srgb, var(--accent-tint) 45%, var(--surface-card))' : 'var(--surface-card)',
        transition: 'background .25s ease, border-color .25s ease', ...style,
      }}
      {...rest}
    >
      <style>{`
        @keyframes mac-wave { 0%,100%{transform:scaleY(.28)} 50%{transform:scaleY(1)} }
        .mac-bar { transform-origin:center; transform:scaleY(.28); border-radius:999px; }
        .mac-live .mac-bar { animation: mac-wave 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .mac-live .mac-bar{ animation:none; transform:scaleY(.6) } }
      `}</style>

      {/* mic toggle */}
      <button
        type="button" onClick={onToggle} aria-pressed={listening}
        style={{
          width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${listening ? 'var(--accent)' : 'var(--border-strong)'}`,
          background: listening ? 'var(--accent)' : 'var(--surface-card)',
          color: listening ? 'var(--white)' : 'var(--text-secondary)',
          boxShadow: listening ? '0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent)' : 'none',
          transition: 'all .2s ease',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
        </svg>
      </button>

      {/* waveform + label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: accent, boxShadow: listening ? `0 0 0 3px color-mix(in srgb, ${accent} 22%, transparent)` : 'none' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: listening ? 'var(--teal-700)' : 'var(--text-secondary)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            {label}
          </span>
          {elapsed ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{elapsed}</span> : null}
        </div>
        <div className={listening ? 'mac-live' : ''} style={{ display: 'flex', alignItems: 'center', gap: 3, height: 22 }}>
          {bars.map((_, i) => {
            const h = listening ? 22 : 6 + (Math.sin(i * 1.7) + 1) * 4;
            return (
              <span key={i} className="mac-bar" style={{
                width: 3, height: h, background: listening ? 'var(--accent)' : 'var(--slate-300)',
                animationDelay: `${(i % 7) * 0.09 + (i * 0.013)}s`,
              }} />
            );
          })}
        </div>
      </div>

      {transcript ? (
        <div style={{ flex: 'none', maxWidth: 220, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'right', lineHeight: 1.35 }}>
          “{transcript}”
        </div>
      ) : null}
    </div>
  );
}
