/* @ds-bundle: {"format":3,"namespace":"MedicalAffairsCopilotDesignSystem_2d0005","components":[{"name":"CompliancePanel","sourcePath":"components/copilot/CompliancePanel.jsx"},{"name":"KolCard","sourcePath":"components/copilot/KolCard.jsx"},{"name":"VoiceControl","sourcePath":"components/copilot/VoiceControl.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Citation","sourcePath":"components/evidence/Citation.jsx"},{"name":"ScoreBar","sourcePath":"components/evidence/ScoreBar.jsx"}],"sourceHashes":{"components/copilot/CompliancePanel.jsx":"a56e2fdf664e","components/copilot/KolCard.jsx":"01241719eb6f","components/copilot/VoiceControl.jsx":"fca1e71bd017","components/core/Avatar.jsx":"e981e7203bee","components/core/Badge.jsx":"97948b361f08","components/core/Button.jsx":"2ef289b7ea9a","components/core/Card.jsx":"a4b123381ebe","components/core/Tag.jsx":"a414613380c3","components/evidence/Citation.jsx":"a5dc3201d848","components/evidence/ScoreBar.jsx":"3f0c7831e601","dashboard/app.jsx":"191968dd8c1f","dashboard/context.jsx":"1af99a2e1306","dashboard/data.js":"ecd57301700d","dashboard/drawer.jsx":"35a631766e57","dashboard/icons.jsx":"c005a4b40f6b","dashboard/screen-brief-queries.jsx":"eab58aae9069","dashboard/screen-candidates.jsx":"1cbcdfac6daf","dashboard/screen-compliance.jsx":"c5a6355eac95","dashboard/screen-evidence.jsx":"0a31ef426570","dashboard/screen-moss.jsx":"856f1838b318","dashboard/screen-overview.jsx":"0f932474f39c","dashboard/screen-ranking.jsx":"bff561ad82c8","dashboard/screen-summary.jsx":"4b5c9af7e792","dashboard/screen-upload.jsx":"2fee3591af82","dashboard/shared.jsx":"24ab34e50001","dashboard/voice-panel.jsx":"00c34275e79b","landing/showcase.jsx":"e5b78bcadb67","ui_kits/copilot-workspace/App.jsx":"9ef24ea1d4a6","ui_kits/copilot-workspace/BriefDocument.jsx":"18036b2c7b0f","ui_kits/copilot-workspace/CopilotConversation.jsx":"b10b4b8684b1","ui_kits/copilot-workspace/EvidenceDrawer.jsx":"9127aa149dd3","ui_kits/copilot-workspace/KolRail.jsx":"db38fa7d9b3f","ui_kits/copilot-workspace/ProtocolPanel.jsx":"e29b20049e6c","ui_kits/copilot-workspace/TopBar.jsx":"981c6a85c501","ui_kits/copilot-workspace/data.js":"ed0abee8db70"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MedicalAffairsCopilotDesignSystem_2d0005 = window.MedicalAffairsCopilotDesignSystem_2d0005 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/copilot/CompliancePanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CompliancePanel — the persistent guardrail module. Compliance is present but
 * calm: a quiet amber-keyed panel that states the active Medical Affairs rules.
 * Never alarming unless something is actually wrong.
 */
function Check({
  ok
}) {
  return ok ? /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--safe)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: 'none',
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--compliance)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: 'none',
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4M12 17h.01"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
  }));
}
function CompliancePanel({
  mode = 'Medical Affairs',
  items = [],
  // [{ label, ok }]
  auditAvailable = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      border: '1px solid color-mix(in srgb, var(--compliance) 28%, var(--border-subtle))',
      background: 'color-mix(in srgb, var(--compliance-tint) 50%, var(--surface-card))',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 13px',
      borderBottom: '1px solid color-mix(in srgb, var(--compliance) 22%, var(--border-subtle))'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--compliance-ink)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--compliance-ink)',
      flex: 1,
      minWidth: 0
    }
  }, mode, " mode enabled"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--safe)',
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--safe) 22%, transparent)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 13px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Check, {
    ok: it.ok !== false
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--slate-700)',
      lineHeight: 1.4,
      flex: 1,
      minWidth: 0
    }
  }, it.label)))), auditAvailable ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '9px 13px',
      borderTop: '1px solid color-mix(in srgb, var(--compliance) 18%, var(--border-subtle))',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: '.04em',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4l3 2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  })), "Full audit trail available") : null);
}
Object.assign(__ds_scope, { CompliancePanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/copilot/CompliancePanel.jsx", error: String((e && e.message) || e) }); }

// components/copilot/VoiceControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * VoiceControl — the ambient voice session control for the copilot. A subtle
 * live waveform, a state label, an elapsed timer, and a quiet mic toggle.
 * Professional and instrument-like — deliberately NOT a giant microphone.
 */
const BAR_COUNT = 28;
function VoiceControl({
  state = 'idle',
  // 'idle' | 'listening' | 'thinking'
  transcript = '',
  elapsed = '',
  // e.g. "0:12"
  onToggle,
  style,
  ...rest
}) {
  const listening = state === 'listening';
  const thinking = state === 'thinking';
  const label = listening ? 'Listening' : thinking ? 'Thinking' : 'Tap to ask';
  const accent = listening ? 'var(--accent)' : thinking ? 'var(--evidence)' : 'var(--slate-400)';
  const bars = Array.from({
    length: BAR_COUNT
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 14px',
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${listening ? 'color-mix(in srgb, var(--accent) 35%, var(--border-subtle))' : 'var(--border-subtle)'}`,
      background: listening ? 'color-mix(in srgb, var(--accent-tint) 45%, var(--surface-card))' : 'var(--surface-card)',
      transition: 'background .25s ease, border-color .25s ease',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("style", null, `
        @keyframes mac-wave { 0%,100%{transform:scaleY(.28)} 50%{transform:scaleY(1)} }
        .mac-bar { transform-origin:center; transform:scaleY(.28); border-radius:999px; }
        .mac-live .mac-bar { animation: mac-wave 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .mac-live .mac-bar{ animation:none; transform:scaleY(.6) } }
      `), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onToggle,
    "aria-pressed": listening,
    style: {
      width: 40,
      height: 40,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${listening ? 'var(--accent)' : 'var(--border-strong)'}`,
      background: listening ? 'var(--accent)' : 'var(--surface-card)',
      color: listening ? 'var(--white)' : 'var(--text-secondary)',
      boxShadow: listening ? '0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent)' : 'none',
      transition: 'all .2s ease'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "2",
    width: "6",
    height: "12",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: accent,
      boxShadow: listening ? `0 0 0 3px color-mix(in srgb, ${accent} 22%, transparent)` : 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: listening ? 'var(--teal-700)' : 'var(--text-secondary)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-mono)'
    }
  }, label), elapsed ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-tertiary)'
    }
  }, elapsed) : null), /*#__PURE__*/React.createElement("div", {
    className: listening ? 'mac-live' : '',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      height: 22
    }
  }, bars.map((_, i) => {
    const h = listening ? 22 : 6 + (Math.sin(i * 1.7) + 1) * 4;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "mac-bar",
      style: {
        width: 3,
        height: h,
        background: listening ? 'var(--accent)' : 'var(--slate-300)',
        animationDelay: `${i % 7 * 0.09 + i * 0.013}s`
      }
    });
  }))), transcript ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      maxWidth: 220,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      fontStyle: 'italic',
      textAlign: 'right',
      lineHeight: 1.35
    }
  }, "\u201C", transcript, "\u201D") : null);
}
Object.assign(__ds_scope, { VoiceControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/copilot/VoiceControl.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — KOL / expert monogram. Initials on a calm tinted disc. Deliberately
 * NOT a photo: this is a scientific tool, not a social profile.
 */
function Avatar({
  name = '',
  size = 36,
  tone = 'auto',
  style,
  ...rest
}) {
  const initials = name.replace(/^(Dr|Prof)\.?\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  const palette = [{
    bg: 'var(--accent-tint)',
    fg: 'var(--teal-700)',
    bd: 'var(--teal-100)'
  }, {
    bg: 'var(--evidence-tint)',
    fg: 'var(--evidence-ink)',
    bd: 'color-mix(in srgb, var(--evidence) 22%, white)'
  }, {
    bg: 'var(--surface-sunken)',
    fg: 'var(--slate-700)',
    bd: 'var(--border-strong)'
  }, {
    bg: 'var(--safe-tint)',
    fg: 'var(--safe-ink)',
    bd: 'color-mix(in srgb, var(--safe) 26%, white)'
  }];
  let p;
  if (tone === 'accent') p = palette[0];else if (tone === 'evidence') p = palette[1];else if (tone === 'neutral') p = palette[2];else {
    const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    p = palette[sum % palette.length];
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      background: p.bg,
      color: p.fg,
      border: `1px solid ${p.bd}`,
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: Math.round(size * 0.36),
      letterSpacing: '.01em',
      userSelect: 'none',
      ...style
    },
    "aria-label": name
  }, rest), initials || '—');
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — compact status / label pill. Tone maps to the semantic palette.
 * Used for compliance status, evidence flags, phase labels, etc.
 */
function Badge({
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
    neutral: {
      c: 'var(--slate-700)',
      t: 'var(--surface-sunken)',
      b: 'var(--border-strong)',
      s: 'var(--slate-500)'
    },
    accent: {
      c: 'var(--teal-700)',
      t: 'var(--accent-tint)',
      b: 'var(--teal-300)',
      s: 'var(--accent)'
    },
    evidence: {
      c: 'var(--evidence-ink)',
      t: 'var(--evidence-tint)',
      b: 'color-mix(in srgb, var(--evidence) 35%, white)',
      s: 'var(--evidence)'
    },
    compliance: {
      c: 'var(--compliance-ink)',
      t: 'var(--compliance-tint)',
      b: 'color-mix(in srgb, var(--compliance) 40%, white)',
      s: 'var(--compliance)'
    },
    risk: {
      c: 'var(--risk-ink)',
      t: 'var(--risk-tint)',
      b: 'color-mix(in srgb, var(--risk) 38%, white)',
      s: 'var(--risk)'
    },
    safe: {
      c: 'var(--safe-ink)',
      t: 'var(--safe-tint)',
      b: 'color-mix(in srgb, var(--safe) 38%, white)',
      s: 'var(--safe)'
    }
  };
  const sizes = {
    sm: {
      h: 18,
      px: 6,
      fs: 'var(--text-2xs)',
      gap: 4
    },
    md: {
      h: 22,
      px: 8,
      fs: 'var(--text-xs)',
      gap: 5
    }
  };
  const tn = tones[tone] || tones.neutral;
  const sz = sizes[size] || sizes.md;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: sz.gap,
    height: sz.h,
    padding: `0 ${sz.px}px`,
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-sans)',
    fontSize: sz.fs,
    fontWeight: 'var(--weight-medium)',
    letterSpacing: 'var(--tracking-snug)',
    lineHeight: 1,
    whiteSpace: 'nowrap'
  };
  const variants = {
    soft: {
      background: tn.t,
      color: tn.c,
      border: `1px solid ${tn.b}`
    },
    solid: {
      background: tn.s,
      color: 'var(--white)',
      border: `1px solid ${tn.s}`
    },
    outline: {
      background: 'transparent',
      color: tn.c,
      border: `1px solid ${tn.b}`
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...(variants[variant] || variants.soft),
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: variant === 'solid' ? 'rgba(255,255,255,.9)' : tn.s,
      flex: 'none'
    }
  }) : null, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none'
    }
  }, icon) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary action control for Medical Affairs Copilot.
 * Quiet, precise, enterprise. Borders over shadows.
 */
function Button({
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
    sm: {
      height: 28,
      padding: '0 10px',
      fontSize: 'var(--text-sm)',
      gap: 6,
      radius: 'var(--radius-sm)'
    },
    md: {
      height: 34,
      padding: '0 14px',
      fontSize: 'var(--text-base)',
      gap: 7,
      radius: 'var(--radius-md)'
    },
    lg: {
      height: 40,
      padding: '0 18px',
      fontSize: 'var(--text-md)',
      gap: 8,
      radius: 'var(--radius-md)'
    }
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--text-on-accent)',
      border: '1px solid var(--accent)'
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    danger: {
      background: 'var(--surface-card)',
      color: 'var(--risk-ink)',
      border: '1px solid color-mix(in srgb, var(--risk) 40%, var(--border-subtle))'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans)',
    fontSize: s.fontSize,
    fontWeight: 'var(--weight-medium)',
    letterSpacing: 'var(--tracking-snug)',
    lineHeight: 1,
    borderRadius: s.radius,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background .15s ease, border-color .15s ease, color .15s ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...v,
    ...style
  };
  const onEnter = e => {
    if (disabled) return;
    if (variant === 'primary') e.currentTarget.style.background = 'var(--accent-hover)', e.currentTarget.style.borderColor = 'var(--accent-hover)';else if (variant === 'secondary') e.currentTarget.style.background = 'var(--surface-sunken)';else if (variant === 'ghost') e.currentTarget.style.background = 'var(--surface-sunken)', e.currentTarget.style.color = 'var(--text-primary)';else if (variant === 'danger') e.currentTarget.style.background = 'var(--risk-tint)';
  };
  const onLeave = e => {
    e.currentTarget.style.background = v.background;
    e.currentTarget.style.borderColor = v.border.split(' ').slice(2).join(' ');
    e.currentTarget.style.color = v.color;
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: btnStyle,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave
  }, rest), iconLeft ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none'
    }
  }, iconLeft) : null, children ? /*#__PURE__*/React.createElement("span", null, children) : null, iconRight ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none'
    }
  }, iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/copilot/KolCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * KolCard — a ranked expert card. Dense but elegant: rank, identity, total
 * score, score breakdown, top rationale, citation count, compliance status,
 * and the two primary actions (View evidence / Generate brief). Built for
 * quick comparison under time pressure, NOT a social profile.
 */
function StatusBadge({
  status
}) {
  const map = {
    validated: {
      tone: 'safe',
      label: 'Validated',
      dot: true
    },
    review: {
      tone: 'compliance',
      label: 'Review pending',
      dot: true
    },
    conflict: {
      tone: 'risk',
      label: 'Conflict flagged',
      dot: true
    }
  };
  const s = map[status] || map.validated;
  return /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: s.tone,
    size: "sm",
    dot: s.dot
  }, s.label);
}
function KolCard({
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
  breakdown = [],
  // [{ label, value }] for the segmented mini-bar
  selected = false,
  onSelect,
  onViewEvidence,
  onGenerateBrief,
  style,
  ...rest
}) {
  const segColors = ['var(--accent)', 'var(--evidence)', 'var(--safe)', 'var(--slate-400)'];
  const segTotal = breakdown.reduce((a, b) => a + b.value, 0) || 1;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onSelect,
    style: {
      background: 'var(--surface-card)',
      border: `1px solid ${selected ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
      boxShadow: selected ? '0 0 0 1px var(--border-accent), var(--shadow-sm)' : 'var(--shadow-xs)',
      borderRadius: 'var(--radius-lg)',
      padding: 14,
      cursor: onSelect ? 'pointer' : 'default',
      transition: 'box-shadow .15s ease, border-color .15s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: 11,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-tertiary)',
      width: 22,
      flex: 'none',
      paddingTop: 2
    }
  }, String(rank).padStart(2, '0')), /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)',
      letterSpacing: 'var(--tracking-snug)',
      lineHeight: 1.2
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      marginTop: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, institution)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-primary)',
      lineHeight: 1,
      letterSpacing: '-0.01em'
    }
  }, Number.isInteger(score) ? score : score.toFixed(1)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-tertiary)',
      marginTop: 3,
      letterSpacing: '.08em'
    }
  }, "/ ", scoreMax, " SCORE"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
      fontWeight: 'var(--weight-medium)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, specialty, geography ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      fontWeight: 400
    }
  }, '  ·  ' + geography) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: status
  }))), breakdown.length ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: 6,
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden',
      background: 'var(--surface-sunken)'
    }
  }, breakdown.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    title: `${b.label}: ${b.value}`,
    style: {
      width: `${b.value / segTotal * 100}%`,
      background: segColors[i % segColors.length]
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 7,
      flexWrap: 'wrap'
    }
  }, breakdown.map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 2,
      background: segColors[i % segColors.length]
    }
  }), b.label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-tertiary)'
    }
  }, b.value))))) : null, rationale ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      lineHeight: 1.5,
      paddingLeft: 10,
      borderLeft: '2px solid var(--accent-tint-2)'
    }
  }, rationale) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      paddingTop: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--evidence-ink)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--evidence)'
    }
  }), citations, " citations"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: "ghost",
    onClick: e => {
      e.stopPropagation();
      onViewEvidence?.();
    }
  }, "View evidence"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: "primary",
    onClick: e => {
      e.stopPropagation();
      onGenerateBrief?.();
    }
  }, "Generate brief")));
}
Object.assign(__ds_scope, { KolCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/copilot/KolCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the fundamental surface. White, hairline border, quiet. Optional
 * header rail (eyebrow + title + actions). Premium through structure, not shadow.
 */
function Card({
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
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: `1px solid ${selected ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
      boxShadow: selected ? '0 0 0 1px var(--border-accent), var(--shadow-sm)' : interactive && hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      borderRadius: 'var(--radius-lg)',
      transition: 'box-shadow .15s ease, border-color .15s ease',
      cursor: interactive ? 'pointer' : 'default',
      overflow: 'hidden',
      ...style
    }
  }, rest), hasHeader ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      fontWeight: 'var(--weight-medium)',
      marginBottom: title ? 3 : 0
    }
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)',
      letterSpacing: 'var(--tracking-snug)',
      lineHeight: 1.25,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title) : null), actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flex: 'none'
    }
  }, actions) : null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — protocol attribute chip. A compact key→value token used to abstract
 * a clinical protocol into scannable facts (Phase · Indication · Geography…).
 */
function Tag({
  label,
  value,
  icon = null,
  tone = 'neutral',
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      label: 'var(--text-tertiary)',
      value: 'var(--text-primary)',
      bd: 'var(--border-subtle)',
      bg: 'var(--surface-inset)'
    },
    accent: {
      label: 'var(--teal-700)',
      value: 'var(--teal-700)',
      bd: 'var(--teal-300)',
      bg: 'var(--accent-tint)'
    }
  };
  const tn = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 9px',
      borderRadius: 'var(--radius-sm)',
      background: tn.bg,
      border: `1px solid ${tn.bd}`,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      maxWidth: '100%',
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none',
      color: tn.label
    }
  }, icon) : null, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: tn.label,
      fontWeight: 'var(--weight-medium)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      fontSize: 'var(--text-2xs)',
      fontFamily: 'var(--font-mono)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: tn.value,
      fontWeight: 'var(--weight-medium)'
    }
  }, value));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/evidence/Citation.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Citation — an evidence reference. Two shapes:
 *  • compact: a small mono [ref] pill for inline use in answer text
 *  • full: a list row with title, source · year, and a relevance note
 * Evidence is always indigo-accented and always quotable.
 */
function Citation({
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
    return /*#__PURE__*/React.createElement("button", _extends({
      type: "button",
      onClick: onClick,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 18,
        padding: '0 6px',
        borderRadius: 'var(--radius-xs)',
        cursor: 'pointer',
        background: 'var(--evidence-tint)',
        border: '1px solid color-mix(in srgb, var(--evidence) 22%, white)',
        color: 'var(--evidence-ink)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--weight-medium)',
        lineHeight: 1,
        verticalAlign: 'baseline',
        ...style
      }
    }, rest), refId);
  }
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      cursor: onClick ? 'pointer' : 'default',
      border: '1px solid var(--border-subtle)',
      background: hover && onClick ? 'var(--surface-inset)' : 'var(--surface-card)',
      borderLeft: '2.5px solid var(--evidence)',
      transition: 'background .15s ease',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--evidence-ink)',
      background: 'var(--evidence-tint)',
      borderRadius: 'var(--radius-xs)',
      padding: '2px 5px',
      height: 'fit-content',
      flex: 'none',
      letterSpacing: '.02em'
    }
  }, refId), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-primary)',
      lineHeight: 1.3
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-tertiary)',
      marginTop: 3
    }
  }, source, source && year ? ' · ' : '', year), relevance ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      marginTop: 6,
      lineHeight: 1.45
    }
  }, relevance) : null));
}
Object.assign(__ds_scope, { Citation });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/Citation.jsx", error: String((e && e.message) || e) }); }

// components/evidence/ScoreBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ScoreBar — a single line of a KOL score breakdown. Label, contribution
 * track, and a mono value. Explainability is the point: every score is shown
 * as the sum of legible parts.
 */
function ScoreBar({
  label,
  value,
  // 0–100
  max = 100,
  tone = 'accent',
  weight = null,
  // optional "× 0.30" style contribution note
  height = 6,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const tones = {
    accent: 'var(--accent)',
    evidence: 'var(--evidence)',
    safe: 'var(--safe)',
    compliance: 'var(--compliance)',
    neutral: 'var(--slate-400)'
  };
  const fill = tones[tone] || tones.accent;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      fontWeight: 'var(--weight-medium)',
      flex: 1,
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    title: typeof label === 'string' ? label : undefined
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      flex: 'none'
    }
  }, weight ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-tertiary)'
    }
  }, weight) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
      fontWeight: 'var(--weight-medium)'
    }
  }, Number.isInteger(value) ? value : value.toFixed(1)))), /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      background: fill,
      borderRadius: 'var(--radius-pill)',
      transition: 'width .4s cubic-bezier(.2,.7,.2,1)'
    }
  })));
}
Object.assign(__ds_scope, { ScoreBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/ScoreBar.jsx", error: String((e && e.message) || e) }); }

// dashboard/app.jsx
try { (() => {
// App shell + router -> window.App
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Tag,
    Badge
  } = DS;
  const Icon = window.Icon;
  const D = window.ORCH;
  const A = window.ScreensA,
    B = window.ScreensB,
    C = window.ScreensC,
    E = window.ScreensD,
    F = window.ScreensE,
    G = window.ScreensF,
    H = window.ScreensG,
    I = window.ScreensH;
  const KolDrawer = window.KolDrawer;
  const UploadModal = window.UploadModal;
  const VoicePanel = window.VoicePanel;
  const Ctx = window.Ctx;
  const RSV = 'RSV-PreF-301';
  const SCREEN_LABEL = {
    brief: 'Protocol brief',
    queries: 'Search queries',
    evidence: 'Evidence',
    candidates: 'KOL candidates',
    ranking: 'Ranking',
    compliance: 'Compliance review',
    moss: 'Moss index',
    summary: 'Summary'
  };

  // nav model — grouped to mirror the workflow
  const NAV = [{
    group: 'Library',
    items: [{
      key: 'protocols',
      label: 'Protocols',
      icon: 'protocols'
    }, {
      key: 'runs',
      label: 'Processing runs',
      icon: 'runs'
    }]
  }, {
    group: 'Pipeline',
    items: [{
      key: 'overview',
      label: 'Run overview',
      icon: 'ranking'
    }, {
      key: 'brief',
      label: 'Protocol brief',
      icon: 'brief'
    }, {
      key: 'queries',
      label: 'Search queries',
      icon: 'queries'
    }, {
      key: 'evidence',
      label: 'Evidence',
      icon: 'evidence',
      count: '148'
    }, {
      key: 'candidates',
      label: 'KOL candidates',
      icon: 'candidates',
      count: '64'
    }, {
      key: 'ranking',
      label: 'Ranking',
      icon: 'sliders'
    }]
  }, {
    group: 'Governance',
    items: [{
      key: 'compliance',
      label: 'Compliance review',
      icon: 'shield',
      count: '2',
      ct: 'risk'
    }, {
      key: 'moss',
      label: 'Moss index',
      icon: 'moss',
      count: '97%',
      ct: 'warn'
    }, {
      key: 'summary',
      label: 'Summary / export',
      icon: 'summary'
    }]
  }];
  const LIBRARY = ['protocols', 'runs'];
  function App() {
    const [screen, setScreen] = React.useState('overview');
    const [protocolId, setProtocolId] = React.useState(RSV);
    const [voiceOpen, setVoiceOpen] = React.useState(false);
    const [kol, setKol] = React.useState(null);
    const [upload, setUpload] = React.useState(null); // null | {} | { file }
    const [veil, setVeil] = React.useState(false);
    const dragDepth = React.useRef(0);
    const contentRef = React.useRef(null);
    const openUpload = React.useCallback(() => setUpload({}), []);
    const closeUpload = React.useCallback(() => setUpload(null), []);

    // ---- drag a protocol anywhere over the app ----
    React.useEffect(() => {
      const hasFiles = e => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
      const onEnter = e => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        dragDepth.current++;
        if (!upload) setVeil(true);
      };
      const onOver = e => {
        if (hasFiles(e)) e.preventDefault();
      };
      const onLeave = e => {
        if (!hasFiles(e)) return;
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setVeil(false);
      };
      const onDrop = e => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        dragDepth.current = 0;
        setVeil(false);
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (f && !upload) setUpload({
          file: {
            name: f.name,
            sizeMB: f.size / (1024 * 1024)
          }
        });
      };
      window.addEventListener('dragenter', onEnter);
      window.addEventListener('dragover', onOver);
      window.addEventListener('dragleave', onLeave);
      window.addEventListener('drop', onDrop);
      return () => {
        window.removeEventListener('dragenter', onEnter);
        window.removeEventListener('dragover', onOver);
        window.removeEventListener('dragleave', onLeave);
        window.removeEventListener('drop', onDrop);
      };
    }, [upload]);
    const go = React.useCallback(s => {
      if (!s) return;
      setScreen(s);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, []);
    const openKol = React.useCallback(id => setKol(id), []);
    const closeKol = React.useCallback(() => setKol(null), []);
    const selectProtocol = React.useCallback(id => {
      setProtocolId(id);
      setScreen('overview');
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, []);
    const toggleVoice = React.useCallback(() => setVoiceOpen(v => !v), []);
    const isLibrary = LIBRARY.includes(screen);
    const isRSV = protocolId === RSV;
    function renderScreen() {
      if (screen === 'protocols') return /*#__PURE__*/React.createElement(A.Protocols, {
        go: go,
        onUpload: openUpload
      });
      if (screen === 'runs') return /*#__PURE__*/React.createElement(A.Runs, {
        go: go
      });
      if (screen === 'overview') return isRSV ? /*#__PURE__*/React.createElement(A.Overview, {
        go: go,
        onUpload: openUpload
      }) : /*#__PURE__*/React.createElement(Ctx.OverviewLite, {
        currentId: protocolId,
        go: go,
        onAsk: () => setVoiceOpen(true)
      });
      // pipeline / governance screens are gated when a non-RSV protocol is selected
      if (!isRSV && D.screenStage[screen]) {
        return /*#__PURE__*/React.createElement(Ctx.StageGate, {
          currentId: protocolId,
          screen: screen,
          screenLabel: SCREEN_LABEL[screen],
          onSwitchToRSV: () => selectProtocol(RSV)
        });
      }
      switch (screen) {
        case 'brief':
          return /*#__PURE__*/React.createElement(B.Brief, null);
        case 'queries':
          return /*#__PURE__*/React.createElement(B.Queries, null);
        case 'evidence':
          return /*#__PURE__*/React.createElement(C.Evidence, {
            openKol: openKol
          });
        case 'candidates':
          return /*#__PURE__*/React.createElement(E.Candidates, {
            openKol: openKol
          });
        case 'ranking':
          return /*#__PURE__*/React.createElement(F.Ranking, {
            openKol: openKol
          });
        case 'compliance':
          return /*#__PURE__*/React.createElement(G.Compliance, {
            openKol: openKol
          });
        case 'moss':
          return /*#__PURE__*/React.createElement(H.Moss, null);
        case 'summary':
          return /*#__PURE__*/React.createElement(I.Summary, {
            openKol: openKol
          });
        default:
          return /*#__PURE__*/React.createElement(A.Overview, {
            go: go
          });
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "app"
    }, /*#__PURE__*/React.createElement("nav", {
      className: "side"
    }, /*#__PURE__*/React.createElement("div", {
      className: "side__brand"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../assets/logo-mark.svg",
      alt: ""
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "nm"
    }, "Copilot"), /*#__PURE__*/React.createElement("div", {
      className: "tg"
    }, "Orchestrator"))), /*#__PURE__*/React.createElement("div", {
      className: "side__scroll ds-scroll"
    }, NAV.map(grp => /*#__PURE__*/React.createElement("div", {
      key: grp.group,
      className: "side__group"
    }, /*#__PURE__*/React.createElement("div", {
      className: "side__label"
    }, grp.group), grp.items.map(it => /*#__PURE__*/React.createElement("button", {
      key: it.key,
      className: "navitem",
      "aria-current": screen === it.key,
      onClick: () => go(it.key)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 16
    }), /*#__PURE__*/React.createElement("span", null, it.label), it.count && isRSV ? /*#__PURE__*/React.createElement("span", {
      className: `ct ${it.ct ? 'ct--' + it.ct : ''}`
    }, it.count) : null))))), /*#__PURE__*/React.createElement("div", {
      className: "side__foot"
    }, "Veritan Biologics", /*#__PURE__*/React.createElement("br", null), "Medical Affairs \xB7 run_8f2a91")), /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, !isLibrary ? /*#__PURE__*/React.createElement(Ctx.ProtocolHeader, {
      currentId: protocolId,
      onSelect: selectProtocol,
      voiceOpen: voiceOpen,
      onToggleVoice: toggleVoice
    }) : null, !isLibrary ? /*#__PURE__*/React.createElement(Ctx.StageRail, {
      currentId: protocolId
    }) : null, /*#__PURE__*/React.createElement("div", {
      className: "content ds-scroll",
      ref: contentRef
    }, renderScreen())), veil ? /*#__PURE__*/React.createElement("div", {
      className: "dragveil"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dragveil__inner"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 26,
      color: "var(--accent)"
    }), /*#__PURE__*/React.createElement("h3", null, "Drop protocol to start a run"), /*#__PURE__*/React.createElement("p", null, "PDF or DOCX \xB7 parsing begins immediately"))) : null, kol ? /*#__PURE__*/React.createElement(KolDrawer, {
      id: kol,
      onClose: closeKol
    }) : null, upload ? /*#__PURE__*/React.createElement(UploadModal, {
      initialFile: upload.file,
      onClose: closeUpload,
      onComplete: () => {
        closeUpload();
        go('brief');
      }
    }) : null, voiceOpen ? /*#__PURE__*/React.createElement(VoicePanel, {
      currentId: protocolId,
      onClose: () => setVoiceOpen(false)
    }) : null);
  }
  window.App = App;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/app.jsx", error: String((e && e.message) || e) }); }

// dashboard/context.jsx
try { (() => {
// Protocol switcher + stage rail + stage gating + overview-lite -> window.Ctx
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Badge,
    Button,
    Tag
  } = DS;
  const Icon = window.Icon;
  const {
    Panel,
    Note,
    State,
    StatusBadge
  } = window.UI;
  const D = window.ORCH;

  // ---------------------------------------------------------------- protocol switcher
  function ProtocolSwitcher({
    currentId,
    onSelect
  }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    const cur = D.protocolDetails[currentId];
    React.useEffect(() => {
      if (!open) return;
      const onDoc = e => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      const onKey = e => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onDoc);
      window.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        window.removeEventListener('keydown', onKey);
      };
    }, [open]);
    return /*#__PURE__*/React.createElement("div", {
      className: "pswitch",
      ref: ref
    }, /*#__PURE__*/React.createElement("button", {
      className: "pswitch__btn",
      "aria-expanded": open,
      onClick: () => setOpen(v => !v)
    }, /*#__PURE__*/React.createElement("span", {
      className: "phead__id"
    }, cur.id), /*#__PURE__*/React.createElement(Icon, {
      name: "chevronDown",
      size: 13,
      color: "var(--text-tertiary)",
      style: {
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform .15s ease'
      }
    })), open ? /*#__PURE__*/React.createElement("div", {
      className: "pmenu",
      role: "menu"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pmenu__head"
    }, "Switch protocol"), D.protocols.map(p => {
      const det = D.protocolDetails[p.id];
      const sel = p.id === currentId;
      return /*#__PURE__*/React.createElement("button", {
        key: p.id,
        className: "pmenu__item",
        "aria-current": sel,
        role: "menuitemradio",
        "aria-checked": sel,
        onClick: () => {
          onSelect(p.id);
          setOpen(false);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "pmenu__tick"
      }, sel ? /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 14,
        color: "var(--accent)"
      }) : null), /*#__PURE__*/React.createElement("span", {
        style: {
          minWidth: 0,
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "pmenu__id"
      }, p.id), /*#__PURE__*/React.createElement("span", {
        className: "pmenu__meta"
      }, p.sponsor, " \xB7 Ph ", p.phase, " \xB7 ", p.indication)), /*#__PURE__*/React.createElement(StatusBadge, {
        status: det.statusTone === 'neutral' ? 'pending' : det.statusTone === 'accent' ? 'active' : 'active',
        label: p.status
      }));
    }), /*#__PURE__*/React.createElement("div", {
      className: "pmenu__foot"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 12,
      color: "var(--text-tertiary)"
    }), /*#__PURE__*/React.createElement("span", null, "Drag a protocol anywhere to add a new run"))) : null);
  }

  // ---------------------------------------------------------------- header
  function ProtocolHeader({
    currentId,
    onSelect,
    voiceOpen,
    onToggleVoice
  }) {
    const P = D.protocolDetails[currentId];
    return /*#__PURE__*/React.createElement("div", {
      className: "phead"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(ProtocolSwitcher, {
      currentId: currentId,
      onSelect: onSelect
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, P.nct)), /*#__PURE__*/React.createElement("div", {
      className: "phead__title"
    }, P.title), /*#__PURE__*/React.createElement("div", {
      className: "phead__meta"
    }, /*#__PURE__*/React.createElement(Tag, {
      label: "SPONSOR",
      value: P.sponsor
    }), /*#__PURE__*/React.createElement(Tag, {
      label: "PHASE",
      value: P.phase,
      tone: "accent"
    }), /*#__PURE__*/React.createElement(Tag, {
      label: "INDICATION",
      value: P.indication
    }), /*#__PURE__*/React.createElement(Tag, {
      label: "GEO",
      value: P.geo.join(' · ')
    }), /*#__PURE__*/React.createElement(Tag, {
      label: "ENROLL",
      value: P.enrollment
    }))), /*#__PURE__*/React.createElement("div", {
      className: "phead__right"
    }, /*#__PURE__*/React.createElement("button", {
      className: 'voicebtn' + (voiceOpen ? ' is-on' : ''),
      onClick: onToggleVoice,
      "aria-pressed": voiceOpen
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "2",
      width: "6",
      height: "12",
      rx: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"
    })), voiceOpen ? 'Voice on' : 'Ask copilot'), /*#__PURE__*/React.createElement(Badge, {
      tone: P.statusTone,
      variant: "soft",
      size: "md",
      dot: true
    }, P.status), /*#__PURE__*/React.createElement("div", {
      className: "phead__ts"
    }, "Updated ", P.updated)));
  }

  // ---------------------------------------------------------------- stage rail
  function StageRail({
    currentId
  }) {
    const stages = D.protocolDetails[currentId].stages;
    return /*#__PURE__*/React.createElement("div", {
      className: "stages ds-scroll"
    }, stages.map(s => /*#__PURE__*/React.createElement("div", {
      key: s.key,
      className: `stage stage--${s.state}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "stage__dot"
    }, s.state === 'done' ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 11,
      color: "#fff"
    }) : s.state === 'warn' ? /*#__PURE__*/React.createElement(Icon, {
      name: "alert",
      size: 10,
      color: "#fff"
    }) : s.state === 'active' ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 9,
        background: '#fff'
      }
    }) : null), /*#__PURE__*/React.createElement("span", {
      className: "stage__txt"
    }, /*#__PURE__*/React.createElement("span", {
      className: "stage__name"
    }, s.label), /*#__PURE__*/React.createElement("span", {
      className: "stage__detail"
    }, s.detail)), /*#__PURE__*/React.createElement("span", {
      className: "stage__line"
    }))));
  }

  // ---------------------------------------------------------------- stage gate (non-RSV pipeline screens)
  function StageGate({
    currentId,
    screen,
    screenLabel,
    onSwitchToRSV
  }) {
    const det = D.protocolDetails[currentId];
    const stageKey = D.screenStage[screen];
    const stage = det.stages.find(s => s.key === stageKey) || {};
    if (stage.state === 'active') {
      return /*#__PURE__*/React.createElement("div", {
        className: "page"
      }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(State, {
        kind: "loading",
        title: `${stage.label} is running`
      }, "The orchestrator is processing this stage for ", /*#__PURE__*/React.createElement("b", null, det.id), " \u2014 ", stage.detail, ". ", screenLabel, " will populate automatically when it completes.")));
    }
    if (stage.state === 'pending') {
      return /*#__PURE__*/React.createElement("div", {
        className: "page"
      }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(State, {
        kind: "empty",
        icon: "clock",
        title: `${screenLabel} not available yet`
      }, det.id, " hasn\u2019t reached the ", /*#__PURE__*/React.createElement("b", null, stage.label), " stage. Earlier pipeline stages must finish first \u2014 track progress in the stage bar above.")));
    }
    // done / warn but no demo data wired for this protocol
    return /*#__PURE__*/React.createElement("div", {
      className: "page"
    }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(State, {
      kind: "empty",
      icon: "database",
      title: `${stage.label} complete for ${det.id}`,
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "refresh",
          size: 14
        }),
        onClick: onSwitchToRSV
      }, "Open RSV-PreF-301")
    }, "This stage finished for ", det.id, ". Detailed ", screenLabel.toLowerCase(), " in this prototype is fully wired for ", /*#__PURE__*/React.createElement("b", null, "RSV-PreF-301"), " \u2014 switch to it to explore the complete, evidence-backed pipeline.")));
  }

  // ---------------------------------------------------------------- overview-lite (non-RSV run state)
  function OverviewLite({
    currentId,
    go,
    onAsk
  }) {
    const det = D.protocolDetails[currentId];
    const done = det.stages.filter(s => s.state === 'done' || s.state === 'warn').length;
    const active = det.stages.find(s => s.state === 'active');
    const queued = det.run == null;
    return /*#__PURE__*/React.createElement("div", {
      className: "page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "shead"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "shead__ey"
    }, det.run ? `Processing run · ${det.run}` : 'Not started'), /*#__PURE__*/React.createElement("h1", null, "Run overview"), /*#__PURE__*/React.createElement("p", null, queued ? `${det.id} is queued. Start the run from the Protocols list to begin protocol-aware processing.` : `Protocol-aware processing of ${det.id} is underway — ${active ? active.label.toLowerCase() : 'in progress'}. Stages complete automatically and re-scope every screen for this protocol.`)), /*#__PURE__*/React.createElement("div", {
      className: "shead__actions"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "mic",
        size: 14
      }),
      onClick: onAsk
    }, "Ask copilot"), queued ? /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "play",
        size: 14
      }),
      onClick: () => go('protocols')
    }, "Start run") : /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "refresh",
        size: 14
      })
    }, "Refresh"))), /*#__PURE__*/React.createElement("div", {
      className: "statgrid",
      style: {
        gridTemplateColumns: 'repeat(4, 1fr)'
      }
    }, [{
      lab: 'Stages complete',
      val: `${done}/8`,
      sub: queued ? 'not started' : 'of the pipeline',
      tone: 'accent',
      icon: 'ranking'
    }, {
      lab: 'Current stage',
      val: active ? active.label.split(' ')[0] : queued ? 'Queued' : 'Done',
      sub: active ? active.detail : '—',
      tone: 'evidence',
      icon: 'refresh'
    }, {
      lab: 'Sponsor',
      val: det.phase === '3' ? 'Ph 3' : 'Ph 2',
      sub: det.sponsor,
      tone: 'compliance',
      icon: 'protocols'
    }, {
      lab: 'Enrollment',
      val: det.enrollment,
      sub: det.geo.join(' · '),
      tone: 'safe',
      icon: 'users'
    }].map(c => /*#__PURE__*/React.createElement("div", {
      key: c.lab,
      className: "stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat__top"
    }, /*#__PURE__*/React.createElement("span", {
      className: `stat__ic ic--${c.tone}`
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 16
    })), /*#__PURE__*/React.createElement("span", {
      className: "stat__lab"
    }, c.lab)), /*#__PURE__*/React.createElement("div", {
      className: "stat__val"
    }, c.val), /*#__PURE__*/React.createElement("div", {
      className: "stat__sub"
    }, c.sub)))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Pipeline",
      title: "Workflow stages",
      style: {
        marginTop: 16
      },
      actions: /*#__PURE__*/React.createElement(StatusBadge, {
        status: queued ? 'pending' : 'active',
        label: queued ? 'Queued' : 'Running'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, det.stages.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.key,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '9px 0',
        borderTop: i ? '1px solid var(--border-subtle)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: `stage stage--${s.state}`,
      style: {
        flex: 'none',
        padding: 0,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "stage__dot"
    }, s.state === 'done' ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 11,
      color: "#fff"
    }) : s.state === 'warn' ? /*#__PURE__*/React.createElement(Icon, {
      name: "alert",
      size: 10,
      color: "#fff"
    }) : s.state === 'active' ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 9,
        background: '#fff'
      }
    }) : null)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-medium)',
        color: s.state === 'pending' ? 'var(--text-tertiary)' : 'var(--text-primary)'
      }
    }, s.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, s.detail)), /*#__PURE__*/React.createElement(StatusBadge, {
      status: s.state === 'done' ? 'done' : s.state === 'warn' ? 'warn' : s.state === 'active' ? 'active' : 'pending',
      label: s.state === 'done' ? 'Complete' : s.state === 'warn' ? 'Warnings' : s.state === 'active' ? 'Running' : 'Pending'
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(Note, {
      tone: "info",
      icon: "mic"
    }, "Ask the voice copilot about ", /*#__PURE__*/React.createElement("b", null, det.id), " at any time \u2014 it answers from whatever has been indexed so far, with citations and guardrail checks. ", /*#__PURE__*/React.createElement("button", {
      className: "lk",
      onClick: onAsk
    }, "Open voice copilot \u2192"))));
  }
  window.Ctx = {
    ProtocolHeader,
    StageRail,
    StageGate,
    OverviewLite
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/context.jsx", error: String((e && e.message) || e) }); }

// dashboard/data.js
try { (() => {
// Medical Affairs Copilot — Orchestrator demo data (plain script -> window.ORCH)
window.ORCH = {
  // ---------------------------------------------------------------- protocol
  protocol: {
    id: 'RSV-PreF-301',
    nct: 'NCT05••••421',
    title: 'A Phase 3 Study of a Bivalent RSV Prefusion-F Vaccine in Adults Aged ≥60',
    sponsor: 'Veritan Biologics',
    phase: '3',
    indication: 'Respiratory Syncytial Virus — lower respiratory tract disease (LRTD)',
    intervention: 'Bivalent RSV prefusion-F subunit vaccine · single intramuscular dose',
    modality: 'Recombinant subunit (stabilized prefusion F antigen, AS01-adjuvanted)',
    population: 'Community-dwelling, immunocompetent adults aged ≥60',
    enrollment: '24,800',
    geographies: ['US', 'EU', 'JP', 'AU'],
    specialties: ['Vaccinology', 'Infectious Disease', 'Geriatric Medicine', 'Pulmonology'],
    themes: ['Prefusion-F immunogenicity', 'Older-adult LRTD prevention', 'Reactogenicity in ≥60', 'Durability of protection'],
    status: 'Ready for review',
    updated: '2026-06-06 09:42 UTC',
    run: 'run_8f2a91'
  },
  // ---------------------------------------------------------------- stages
  stages: [{
    key: 'parsed',
    label: 'Parsed',
    state: 'done',
    detail: '312 chunks'
  }, {
    key: 'brief',
    label: 'Brief Extracted',
    state: 'done',
    detail: '12 sections'
  }, {
    key: 'queries',
    label: 'Queries Generated',
    state: 'done',
    detail: '7 groups'
  }, {
    key: 'evidence',
    label: 'Evidence Retrieved',
    state: 'done',
    detail: '148 sources'
  }, {
    key: 'kols',
    label: 'KOLs Extracted',
    state: 'done',
    detail: '64 candidates'
  }, {
    key: 'ranked',
    label: 'Ranked',
    state: 'done',
    detail: '64 scored'
  }, {
    key: 'moss',
    label: 'Indexed in Moss',
    state: 'warn',
    detail: '3 retrying'
  }, {
    key: 'review',
    label: 'Ready for Review',
    state: 'active',
    detail: 'Awaiting sign-off'
  }],
  // ---------------------------------------------------------------- status cards
  statusCards: [{
    key: 'kols',
    label: 'KOLs found',
    value: '64',
    sub: '18 shortlisted',
    tone: 'accent',
    icon: 'users'
  }, {
    key: 'evidence',
    label: 'Evidence sources',
    value: '148',
    sub: 'across 6 source types',
    tone: 'evidence',
    icon: 'evidence'
  }, {
    key: 'missing',
    label: 'Missing-data warnings',
    value: '5',
    sub: '2 affect ranking',
    tone: 'compliance',
    icon: 'alert'
  }, {
    key: 'flags',
    label: 'Compliance flags',
    value: '2',
    sub: 'open · reviewer required',
    tone: 'risk',
    icon: 'shield'
  }, {
    key: 'moss',
    label: 'Moss index',
    value: '97%',
    sub: '3 chunks retrying',
    tone: 'compliance',
    icon: 'database'
  }],
  // ---------------------------------------------------------------- protocol brief
  brief: [{
    section: 'Study title',
    value: 'A Phase 3 Study of a Bivalent RSV Prefusion-F Vaccine in Adults Aged ≥60',
    confidence: 99,
    chunk: '§1.1 / p.1',
    status: 'validated'
  }, {
    section: 'Sponsor',
    value: 'Veritan Biologics',
    confidence: 98,
    chunk: 'Title page',
    status: 'validated'
  }, {
    section: 'Phase',
    value: 'Phase 3',
    confidence: 99,
    chunk: '§1.2 / p.2',
    status: 'validated'
  }, {
    section: 'Indication',
    value: 'Respiratory Syncytial Virus — lower respiratory tract disease (LRTD)',
    confidence: 96,
    chunk: '§2.1 / p.4',
    status: 'validated'
  }, {
    section: 'Intervention',
    value: 'Bivalent RSV prefusion-F subunit vaccine, single intramuscular dose',
    confidence: 95,
    chunk: '§3.2 / p.9',
    status: 'validated'
  }, {
    section: 'Mechanism / modality',
    value: 'Recombinant subunit; stabilized prefusion F antigen, AS01-adjuvanted',
    confidence: 81,
    chunk: '§3.3 / p.10',
    status: 'review'
  }, {
    section: 'Patient population',
    value: 'Community-dwelling, immunocompetent adults aged ≥60',
    confidence: 94,
    chunk: '§4.1 / p.13',
    status: 'validated'
  }, {
    section: 'Inclusion criteria',
    value: 'Age ≥60; medically stable per investigator; able to consent',
    confidence: 92,
    chunk: '§4.2 / p.14',
    status: 'validated',
    list: true
  }, {
    section: 'Exclusion criteria',
    value: 'Prior RSV vaccination; immunocompromise; acute febrile illness ≤72h',
    confidence: 90,
    chunk: '§4.3 / p.15',
    status: 'validated',
    list: true
  }, {
    section: 'Primary endpoint',
    value: 'Vaccine efficacy against RSV-confirmed LRTD (≥2 lower-respiratory signs)',
    confidence: 97,
    chunk: '§6.1 / p.22',
    status: 'validated'
  }, {
    section: 'Secondary endpoints',
    value: 'Neutralizing titers at day 30; safety & reactogenicity through 6 months',
    confidence: 88,
    chunk: '§6.2 / p.23',
    status: 'review'
  }, {
    section: 'Geography',
    value: 'United States, European Union, Japan, Australia',
    confidence: 86,
    chunk: '§5.4 / p.19',
    status: 'validated'
  }, {
    section: 'Relevant specialties',
    value: 'Vaccinology · Infectious Disease · Geriatric Medicine · Pulmonology',
    confidence: 72,
    chunk: 'Derived',
    status: 'review',
    derived: true
  }, {
    section: 'Scientific themes',
    value: 'Prefusion-F immunogenicity · older-adult LRTD prevention · reactogenicity · durability',
    confidence: 68,
    chunk: 'Derived',
    status: 'review',
    derived: true
  }],
  // ---------------------------------------------------------------- search queries
  queryGroups: [{
    id: 'g1',
    name: 'Disease state + trial investigator',
    status: 'approved',
    results: 41,
    sources: ['ClinicalTrials.gov', 'PubMed'],
    queries: ['"RSV" AND "lower respiratory tract disease" AND principal investigator', 'RSV prefusion vaccine trial investigator adults ≥60']
  }, {
    id: 'g2',
    name: 'Disease state + Phase 3 investigator',
    status: 'approved',
    results: 28,
    sources: ['ClinicalTrials.gov'],
    queries: ['RSV vaccine "Phase 3" investigator older adults', 'respiratory syncytial virus Phase III site PI']
  }, {
    id: 'g3',
    name: 'Intervention class + publication author',
    status: 'edited',
    results: 53,
    sources: ['PubMed'],
    queries: ['prefusion F subunit vaccine author[full]', 'AS01 adjuvant RSV immunogenicity author']
  }, {
    id: 'g4',
    name: 'Endpoint keywords + expert',
    status: 'approved',
    results: 34,
    sources: ['PubMed', 'Congress pages'],
    queries: ['"neutralizing titers" RSV day 30 expert', 'RSV-confirmed LRTD efficacy endpoint author']
  }, {
    id: 'g5',
    name: 'Guideline authors',
    status: 'approved',
    results: 12,
    sources: ['Society / guidelines'],
    queries: ['ACIP RSV older adults recommendation author', 'WHO / national RSV immunization guideline contributor']
  }, {
    id: 'g6',
    name: 'Congress speakers',
    status: 'regenerating',
    results: null,
    sources: ['Congress pages'],
    queries: ['IDWeek RSV session speaker 2024–2025', 'ESWI RSV symposium faculty']
  }, {
    id: 'g7',
    name: 'Institution leaders',
    status: 'disabled',
    results: 0,
    sources: ['Institutional bios'],
    queries: ['vaccinology department chair RSV program', 'infectious disease division head clinical trials']
  }],
  querySources: [{
    name: 'ClinicalTrials.gov',
    count: 38,
    state: 'ok'
  }, {
    name: 'PubMed',
    count: 71,
    state: 'ok'
  }, {
    name: 'Institutional bios',
    count: 14,
    state: 'partial'
  }, {
    name: 'Society / guidelines',
    count: 9,
    state: 'ok'
  }, {
    name: 'Congress pages',
    count: 16,
    state: 'running'
  }, {
    name: 'Transparency / payments',
    count: 0,
    state: 'off'
  }],
  // ---------------------------------------------------------------- evidence
  evidence: [{
    id: 'e1',
    type: 'Publication',
    title: 'Efficacy of a bivalent RSV prefusion F vaccine in older adults',
    host: 'N Engl J Med',
    url: 'nejm.org/doi/10.1056/NEJMoa24•••',
    date: '2024-03',
    score: 96,
    geo: 'EU',
    specialty: 'Vaccinology',
    strength: 'strong',
    snippet: 'A single dose conferred 82.6% efficacy against RSV-confirmed LRTD with ≥2 signs in adults aged 60 years or older.',
    entities: ['E. Marchetti', 'RSV-PreF', 'LRTD'],
    kols: ['marchetti']
  }, {
    id: 'e2',
    type: 'Publication',
    title: 'Neutralizing antibody responses to RSV prefusion F immunization',
    host: 'Lancet Infect Dis',
    url: 'thelancet.com/journals/laninf/•••',
    date: '2023-11',
    score: 91,
    geo: 'APAC',
    specialty: 'Infectious Disease',
    strength: 'strong',
    snippet: 'Day-30 neutralizing titers rose 14.2-fold against RSV-A and 10.7-fold against RSV-B subgroups.',
    entities: ['H. Tanaka', 'neutralizing titers', 'day 30'],
    kols: ['tanaka', 'marchetti']
  }, {
    id: 'e3',
    type: 'Trial registry',
    title: 'Phase 3 RSV prefusion-F efficacy study — site investigators',
    host: 'ClinicalTrials.gov',
    url: 'clinicaltrials.gov/study/NCT04•••',
    date: '2022-08',
    score: 89,
    geo: 'US',
    specialty: 'Vaccinology',
    strength: 'strong',
    snippet: 'Listed as coordinating principal investigator across 14 EU sites for the pivotal efficacy cohort.',
    entities: ['E. Marchetti', 'PI', 'Phase 3'],
    kols: ['marchetti']
  }, {
    id: 'e4',
    type: 'Guideline',
    title: 'Immunization of older adults against RSV — advisory statement',
    host: 'ACIP / society',
    url: 'cdc.gov/vaccines/acip/•••',
    date: '2024-06',
    score: 84,
    geo: 'US',
    specialty: 'Geriatric Medicine',
    strength: 'moderate',
    snippet: 'Contributing author to the working group recommendation on RSV vaccination for adults ≥60.',
    entities: ['A. Okonkwo', 'guideline', '≥60'],
    kols: ['okonkwo']
  }, {
    id: 'e5',
    type: 'Congress',
    title: 'IDWeek 2025 — RSV in the aging immune system (symposium)',
    host: 'IDWeek',
    url: 'idweek.org/program/•••',
    date: '2025-10',
    score: 78,
    geo: 'US',
    specialty: 'Infectious Disease',
    strength: 'moderate',
    snippet: 'Invited faculty; presented on immunosenescence and prefusion-F durability in older adults.',
    entities: ['H. Tanaka', 'symposium', 'durability'],
    kols: ['tanaka']
  }, {
    id: 'e6',
    type: 'Publication',
    title: 'Safety and reactogenicity of subunit RSV vaccines in the elderly',
    host: 'Clin Infect Dis',
    url: 'academic.oup.com/cid/•••',
    date: '2022-05',
    score: 80,
    geo: 'US',
    specialty: 'Geriatric Medicine',
    strength: 'moderate',
    snippet: 'Local and systemic reactogenicity were transient; no safety signal in the ≥70 subgroup.',
    entities: ['A. Okonkwo', 'reactogenicity', 'safety'],
    kols: ['okonkwo']
  }, {
    id: 'e7',
    type: 'Institutional',
    title: 'Karolinska Institutet — Department of Vaccinology faculty bio',
    host: 'ki.se',
    url: 'ki.se/en/people/•••',
    date: '2025-01',
    score: 64,
    geo: 'EU',
    specialty: 'Vaccinology',
    strength: 'weak',
    snippet: 'Professor of Vaccinology; leads the respiratory virus immunology group.',
    entities: ['E. Marchetti', 'Karolinska'],
    kols: ['marchetti']
  }, {
    id: 'e8',
    type: 'Publication',
    title: 'Durability of prefusion-F immune responses over 24 months',
    host: 'Vaccine',
    url: 'sciencedirect.com/vaccine/•••',
    date: '2025-02',
    score: 87,
    geo: 'EU',
    specialty: 'Vaccinology',
    strength: 'strong',
    snippet: 'Titers remained above baseline at 24 months, informing booster-interval modeling.',
    entities: ['L. Andersson', 'durability', 'booster'],
    kols: ['andersson']
  }, {
    id: 'e9',
    type: 'Trial registry',
    title: 'Adult RSV vaccine immunogenicity study — Japan cohort',
    host: 'ClinicalTrials.gov',
    url: 'clinicaltrials.gov/study/NCT05•••',
    date: '2023-03',
    score: 83,
    geo: 'APAC',
    specialty: 'Infectious Disease',
    strength: 'moderate',
    snippet: 'National coordinating investigator for the Japanese immunogenicity sub-study.',
    entities: ['H. Tanaka', 'Japan', 'immunogenicity'],
    kols: ['tanaka']
  }, {
    id: 'e10',
    type: 'Publication',
    title: 'Pulmonary outcomes after RSV-LRTD in community-dwelling seniors',
    host: 'Am J Respir Crit Care Med',
    url: 'atsjournals.org/•••',
    date: '2024-09',
    score: 79,
    geo: 'US',
    specialty: 'Pulmonology',
    strength: 'moderate',
    snippet: 'Characterized lower-respiratory sequelae relevant to the protocol primary endpoint definition.',
    entities: ['M. Delacroix', 'LRTD', 'pulmonary'],
    kols: ['delacroix']
  }],
  evidenceFilters: {
    type: ['Publication', 'Trial registry', 'Guideline', 'Congress', 'Institutional'],
    geo: ['US', 'EU', 'APAC'],
    strength: ['strong', 'moderate', 'weak']
  },
  // ---------------------------------------------------------------- candidates
  candidates: [{
    id: 'marchetti',
    rank: 1,
    name: 'Dr. Elena Marchetti',
    institution: 'Karolinska Institutet',
    specialty: 'Vaccinology',
    geo: 'EU · Sweden',
    trial: 'lead',
    pubRel: 96,
    influence: 'high',
    sources: 37,
    flags: 0,
    status: 'validated',
    score: 92.4,
    title: 'Professor of Vaccinology',
    location: 'Stockholm, Sweden',
    breakdown: [{
      label: 'Protocol match',
      value: 19.2,
      max: 20
    }, {
      label: 'Trial investigator experience',
      value: 24.0,
      max: 25
    }, {
      label: 'Publication relevance',
      value: 18.5,
      max: 20
    }, {
      label: 'Institution / site relevance',
      value: 9.4,
      max: 10
    }, {
      label: 'Guideline / congress influence',
      value: 12.8,
      max: 15
    }, {
      label: 'Recency',
      value: 8.5,
      max: 10
    }],
    rationale: 'Direct Phase 3 prefusion-F trial leadership; authored evidence on the protocol’s primary efficacy endpoint in adults ≥60.',
    evidence: ['e1', 'e3', 'e7', 'e2']
  }, {
    id: 'tanaka',
    rank: 2,
    name: 'Prof. Hideo Tanaka',
    institution: 'University of Tokyo',
    specialty: 'Infectious Disease',
    geo: 'APAC · Japan',
    trial: 'investigator',
    pubRel: 94,
    influence: 'high',
    sources: 29,
    flags: 1,
    status: 'review',
    score: 88.1,
    title: 'Professor of Infectious Diseases',
    location: 'Tokyo, Japan',
    breakdown: [{
      label: 'Protocol match',
      value: 18.1,
      max: 20
    }, {
      label: 'Trial investigator experience',
      value: 20.0,
      max: 25
    }, {
      label: 'Publication relevance',
      value: 19.0,
      max: 20
    }, {
      label: 'Institution / site relevance',
      value: 8.6,
      max: 10
    }, {
      label: 'Guideline / congress influence',
      value: 13.4,
      max: 15
    }, {
      label: 'Recency',
      value: 9.0,
      max: 10
    }],
    rationale: 'Related Phase 3 trial experience in adult RSV; strong recent publication record on the immunogenicity endpoint.',
    evidence: ['e2', 'e5', 'e9']
  }, {
    id: 'okonkwo',
    rank: 3,
    name: 'Dr. Amara Okonkwo',
    institution: 'Johns Hopkins',
    specialty: 'Geriatric Medicine',
    geo: 'US',
    trial: 'investigator',
    pubRel: 88,
    influence: 'high',
    sources: 22,
    flags: 0,
    status: 'validated',
    score: 84.6,
    title: 'Associate Professor of Medicine',
    location: 'Baltimore, USA',
    breakdown: [{
      label: 'Protocol match',
      value: 17.4,
      max: 20
    }, {
      label: 'Trial investigator experience',
      value: 17.5,
      max: 25
    }, {
      label: 'Publication relevance',
      value: 17.6,
      max: 20
    }, {
      label: 'Institution / site relevance',
      value: 9.0,
      max: 10
    }, {
      label: 'Guideline / congress influence',
      value: 14.1,
      max: 15
    }, {
      label: 'Recency',
      value: 9.0,
      max: 10
    }],
    rationale: 'Authored geriatric immunization guidance directly relevant to the ≥60 population; active in related LRTD research.',
    evidence: ['e4', 'e6']
  }, {
    id: 'andersson',
    rank: 4,
    name: 'Dr. Lars Andersson',
    institution: 'Lund University',
    specialty: 'Vaccinology',
    geo: 'EU · Sweden',
    trial: 'investigator',
    pubRel: 85,
    influence: 'medium',
    sources: 19,
    flags: 0,
    status: 'validated',
    score: 81.2,
    title: 'Senior Lecturer, Vaccinology',
    location: 'Lund, Sweden',
    breakdown: [{
      label: 'Protocol match',
      value: 16.8,
      max: 20
    }, {
      label: 'Trial investigator experience',
      value: 16.0,
      max: 25
    }, {
      label: 'Publication relevance',
      value: 18.0,
      max: 20
    }, {
      label: 'Institution / site relevance',
      value: 8.0,
      max: 10
    }, {
      label: 'Guideline / congress influence',
      value: 11.4,
      max: 15
    }, {
      label: 'Recency',
      value: 11.0,
      max: 15
    }],
    rationale: 'Authored durability and booster-interval modeling for prefusion-F responses relevant to the protocol.',
    evidence: ['e8']
  }, {
    id: 'delacroix',
    rank: 5,
    name: 'Prof. Marie Delacroix',
    institution: 'Institut Pasteur',
    specialty: 'Pulmonology',
    geo: 'EU · France',
    trial: 'none',
    pubRel: 79,
    influence: 'medium',
    sources: 14,
    flags: 1,
    status: 'review',
    score: 76.8,
    title: 'Professor of Respiratory Medicine',
    location: 'Paris, France',
    breakdown: [{
      label: 'Protocol match',
      value: 15.0,
      max: 20
    }, {
      label: 'Trial investigator experience',
      value: 12.0,
      max: 25
    }, {
      label: 'Publication relevance',
      value: 16.5,
      max: 20
    }, {
      label: 'Institution / site relevance',
      value: 7.8,
      max: 10
    }, {
      label: 'Guideline / congress influence',
      value: 10.5,
      max: 15
    }, {
      label: 'Recency',
      value: 8.0,
      max: 10
    }],
    rationale: 'Characterized lower-respiratory sequelae relevant to the primary endpoint definition; no direct trial role found.',
    evidence: ['e10']
  }, {
    id: 'reyes',
    rank: 6,
    name: 'Dr. Sofia Reyes',
    institution: 'Hospital Clínic Barcelona',
    specialty: 'Infectious Disease',
    geo: 'EU · Spain',
    trial: 'investigator',
    pubRel: 74,
    influence: 'medium',
    sources: 12,
    flags: 0,
    status: 'validated',
    score: 73.5,
    title: 'Attending, Infectious Diseases',
    location: 'Barcelona, Spain',
    breakdown: [],
    rationale: 'Site investigator on adjacent adult RSV immunogenicity work in the EU region.',
    evidence: []
  }, {
    id: 'nakamura',
    rank: 7,
    name: 'Dr. Kenji Nakamura',
    institution: 'Osaka University',
    specialty: 'Vaccinology',
    geo: 'APAC · Japan',
    trial: 'none',
    pubRel: 71,
    influence: 'low',
    sources: 9,
    flags: 0,
    status: 'validated',
    score: 69.9,
    title: 'Associate Professor',
    location: 'Osaka, Japan',
    breakdown: [],
    rationale: 'Publication relevance to subunit adjuvant systems; limited recent trial activity.',
    evidence: []
  }, {
    id: 'mwangi',
    rank: 8,
    name: 'Dr. Grace Mwangi',
    institution: 'University of Melbourne',
    specialty: 'Geriatric Medicine',
    geo: 'AU',
    trial: 'investigator',
    pubRel: 68,
    influence: 'low',
    sources: 8,
    flags: 2,
    status: 'conflict',
    score: 66.2,
    title: 'Senior Research Fellow',
    location: 'Melbourne, Australia',
    breakdown: [],
    rationale: 'Related geriatric immunization research; transparency record requires reviewer attention.',
    evidence: []
  }],
  // ---------------------------------------------------------------- ranking
  rankingDimensions: [{
    key: 'match',
    label: 'Protocol match',
    weight: 0.20
  }, {
    key: 'trial',
    label: 'Trial investigator experience',
    weight: 0.25
  }, {
    key: 'pub',
    label: 'Publication relevance',
    weight: 0.20
  }, {
    key: 'inst',
    label: 'Institution / site relevance',
    weight: 0.10
  }, {
    key: 'influence',
    label: 'Guideline / congress influence',
    weight: 0.15
  }, {
    key: 'recency',
    label: 'Recency',
    weight: 0.10
  }],
  // ---------------------------------------------------------------- compliance
  guardrails: [{
    label: 'No promotional language',
    ok: true
  }, {
    label: 'Do not rank by prescribing volume',
    ok: true
  }, {
    label: 'No investigational safety / efficacy claims',
    ok: true
  }, {
    label: 'Frame outreach as non-promotional scientific exchange',
    ok: true
  }, {
    label: 'Every recommendation carries supporting evidence',
    ok: false
  }],
  complianceFlags: [{
    id: 'c1',
    severity: 'high',
    kol: 'Dr. Grace Mwangi',
    type: 'Transparency / payment note',
    detail: 'Open Payments record indicates a consulting relationship in the indication area. Disclose and route to reviewer before any outreach.',
    status: 'open'
  }, {
    id: 'c2',
    severity: 'medium',
    kol: 'Prof. Marie Delacroix',
    type: 'Missing source citation',
    detail: 'Ranking rationale references trial sequelae but the linked evidence count is 1 — below the 2-source threshold for an evidence-backed recommendation.',
    status: 'open'
  }, {
    id: 'c3',
    severity: 'low',
    kol: 'Prof. Hideo Tanaka',
    type: 'Unsupported phrasing',
    detail: 'Draft brief used "leading expert" — rewritten to "scientifically relevant, evidence-supported" per scientific-exchange register.',
    status: 'resolved'
  }],
  audit: [{
    time: '09:42:11',
    actor: 'system',
    text: 'Compliance scan completed — 2 open flags, 1 auto-resolved.'
  }, {
    time: '09:41:03',
    actor: 'orchestrator',
    text: 'Ranking generated for 64 candidates; prescribing-volume signals excluded by policy.'
  }, {
    time: '09:38:54',
    actor: 'system',
    text: 'Promotional-language filter applied to all generated rationales.'
  }, {
    time: '09:30:22',
    actor: 'a.okoye (reviewer)',
    text: 'Approved protocol brief sections 1–9.'
  }],
  // ---------------------------------------------------------------- moss index
  mossAssets: [{
    key: 'protocol',
    label: 'Protocol chunks',
    chunks: 312,
    embedded: 312,
    failed: 0,
    state: 'done'
  }, {
    key: 'evidence',
    label: 'Evidence chunks',
    chunks: 148,
    embedded: 148,
    failed: 0,
    state: 'done'
  }, {
    key: 'profiles',
    label: 'KOL profiles',
    chunks: 64,
    embedded: 61,
    failed: 3,
    state: 'error'
  }, {
    key: 'ranking',
    label: 'Ranking metadata',
    chunks: 64,
    embedded: 64,
    failed: 0,
    state: 'done'
  }, {
    key: 'cites',
    label: 'Source citations',
    chunks: 148,
    embedded: 148,
    failed: 0,
    state: 'done'
  }],
  mossFailed: [{
    id: 'f1',
    asset: 'KOL profile · Dr. Grace Mwangi',
    reason: 'Embedding timeout (provider 504)',
    attempts: 2
  }, {
    id: 'f2',
    asset: 'KOL profile · Dr. Sofia Reyes',
    reason: 'Source bio fetch blocked (robots)',
    attempts: 1
  }, {
    id: 'f3',
    asset: 'KOL profile · Dr. Kenji Nakamura',
    reason: 'Embedding timeout (provider 504)',
    attempts: 2
  }],
  mossSync: '2026-06-06 09:40 UTC',
  // ---------------------------------------------------------------- summary
  topKols: ['marchetti', 'tanaka', 'okonkwo'],
  warnings: [{
    text: 'Mechanism / modality extracted at 81% confidence — verify adjuvant detail against §3.3.',
    tone: 'compliance'
  }, {
    text: 'Relevant specialties and scientific themes are derived, not stated in protocol.',
    tone: 'compliance'
  }, {
    text: '3 KOL profiles not yet indexed in Moss (retrying).',
    tone: 'compliance'
  }, {
    text: '1 candidate (Delacroix) below the 2-source evidence threshold.',
    tone: 'risk'
  }, {
    text: '1 transparency / payment flag open (Mwangi).',
    tone: 'risk'
  }],
  exports: [{
    fmt: 'PDF',
    label: 'Review packet (PDF)',
    desc: 'Brief, top KOLs, evidence appendix, compliance notes.'
  }, {
    fmt: 'CSV',
    label: 'Candidates (CSV)',
    desc: 'All 64 candidates with scores and source counts.'
  }, {
    fmt: 'JSON',
    label: 'Structured export (JSON)',
    desc: 'Brief, queries, evidence, ranking, audit trail.'
  }, {
    fmt: 'PKT',
    label: 'Internal review packet',
    desc: 'Bundled artifacts for Medical Affairs sign-off.'
  }],
  // ---------------------------------------------------------------- protocols list
  protocols: [{
    id: 'RSV-PreF-301',
    sponsor: 'Veritan Biologics',
    phase: '3',
    indication: 'RSV — LRTD',
    geo: 'US · EU · JP · AU',
    status: 'Ready for review',
    updated: '2 min ago',
    active: true
  }, {
    id: 'ONC-KRAS-204',
    sponsor: 'Helix Oncology',
    phase: '2',
    indication: 'NSCLC (KRAS G12C)',
    geo: 'US · EU',
    status: 'Ranking',
    updated: '1 h ago',
    active: false
  }, {
    id: 'NEU-AD-118',
    sponsor: 'Cortexa Therapeutics',
    phase: '2',
    indication: 'Early Alzheimer’s',
    geo: 'US',
    status: 'Evidence retrieval',
    updated: '3 h ago',
    active: false
  }, {
    id: 'IMM-PSO-330',
    sponsor: 'Aurelia Bio',
    phase: '3',
    indication: 'Plaque psoriasis',
    geo: 'EU · JP',
    status: 'Queued',
    updated: 'yesterday',
    active: false,
    empty: true
  }],
  runs: [{
    id: 'run_8f2a91',
    protocol: 'RSV-PreF-301',
    started: '2026-06-06 09:12',
    duration: '30m',
    stage: 'Ready for review',
    state: 'warn',
    by: 'a.okoye'
  }, {
    id: 'run_8f2a44',
    protocol: 'RSV-PreF-301',
    started: '2026-06-04 14:03',
    duration: '28m',
    stage: 'Completed',
    state: 'done',
    by: 'system'
  }, {
    id: 'run_7c1e08',
    protocol: 'ONC-KRAS-204',
    started: '2026-06-06 08:20',
    duration: '—',
    stage: 'Ranking',
    state: 'active',
    by: 'm.singh'
  }, {
    id: 'run_6b9d77',
    protocol: 'NEU-AD-118',
    started: '2026-06-06 06:55',
    duration: '—',
    stage: 'Evidence retrieval',
    state: 'active',
    by: 'system'
  }, {
    id: 'run_5a4c12',
    protocol: 'RSV-PreF-301',
    started: '2026-05-29 11:40',
    duration: '31m',
    stage: 'Failed — parse error',
    state: 'error',
    by: 'a.okoye'
  }],
  // ---------------------------------------------------------------- per-protocol header + stages
  // The selected protocol re-scopes the header, stage rail and every pipeline/governance screen.
  // Full demo data is wired for RSV-PreF-301; the others show their real in-flight run state.
  protocolDetails: {
    'RSV-PreF-301': {
      id: 'RSV-PreF-301',
      nct: 'NCT05••••421',
      run: 'run_8f2a91',
      title: 'A Phase 3 Study of a Bivalent RSV Prefusion-F Vaccine in Adults Aged ≥60',
      sponsor: 'Veritan Biologics',
      phase: '3',
      indication: 'RSV · LRTD',
      geo: ['US', 'EU', 'JP', 'AU'],
      enrollment: '24,800',
      status: 'Ready for review',
      statusTone: 'accent',
      updated: '2026-06-06 09:42 UTC',
      stages: [{
        key: 'parsed',
        label: 'Parsed',
        state: 'done',
        detail: '312 chunks'
      }, {
        key: 'brief',
        label: 'Brief Extracted',
        state: 'done',
        detail: '12 sections'
      }, {
        key: 'queries',
        label: 'Queries Generated',
        state: 'done',
        detail: '7 groups'
      }, {
        key: 'evidence',
        label: 'Evidence Retrieved',
        state: 'done',
        detail: '148 sources'
      }, {
        key: 'kols',
        label: 'KOLs Extracted',
        state: 'done',
        detail: '64 candidates'
      }, {
        key: 'ranked',
        label: 'Ranked',
        state: 'done',
        detail: '64 scored'
      }, {
        key: 'moss',
        label: 'Indexed in Moss',
        state: 'warn',
        detail: '3 retrying'
      }, {
        key: 'review',
        label: 'Ready for Review',
        state: 'active',
        detail: 'Awaiting sign-off'
      }]
    },
    'ONC-KRAS-204': {
      id: 'ONC-KRAS-204',
      nct: 'NCT06••••118',
      run: 'run_7c1e08',
      title: 'A Phase 2 Study of a KRAS G12C Inhibitor in Previously Treated NSCLC',
      sponsor: 'Helix Oncology',
      phase: '2',
      indication: 'NSCLC · KRAS G12C',
      geo: ['US', 'EU'],
      enrollment: '410',
      status: 'Ranking in progress',
      statusTone: 'evidence',
      updated: '14 min ago',
      stages: [{
        key: 'parsed',
        label: 'Parsed',
        state: 'done',
        detail: '268 chunks'
      }, {
        key: 'brief',
        label: 'Brief Extracted',
        state: 'done',
        detail: '12 sections'
      }, {
        key: 'queries',
        label: 'Queries Generated',
        state: 'done',
        detail: '6 groups'
      }, {
        key: 'evidence',
        label: 'Evidence Retrieved',
        state: 'done',
        detail: '96 sources'
      }, {
        key: 'kols',
        label: 'KOLs Extracted',
        state: 'done',
        detail: '41 candidates'
      }, {
        key: 'ranked',
        label: 'Ranked',
        state: 'active',
        detail: 'Scoring 41…'
      }, {
        key: 'moss',
        label: 'Indexed in Moss',
        state: 'pending',
        detail: 'Queued'
      }, {
        key: 'review',
        label: 'Ready for Review',
        state: 'pending',
        detail: 'Pending'
      }]
    },
    'NEU-AD-118': {
      id: 'NEU-AD-118',
      nct: 'NCT06••••552',
      run: 'run_6b9d77',
      title: 'A Phase 2 Study of an Anti-Amyloid Antibody in Early Alzheimer’s Disease',
      sponsor: 'Cortexa Therapeutics',
      phase: '2',
      indication: 'Early Alzheimer’s',
      geo: ['US'],
      enrollment: '720',
      status: 'Retrieving evidence',
      statusTone: 'evidence',
      updated: '3 h ago',
      stages: [{
        key: 'parsed',
        label: 'Parsed',
        state: 'done',
        detail: '301 chunks'
      }, {
        key: 'brief',
        label: 'Brief Extracted',
        state: 'done',
        detail: '12 sections'
      }, {
        key: 'queries',
        label: 'Queries Generated',
        state: 'done',
        detail: '7 groups'
      }, {
        key: 'evidence',
        label: 'Evidence Retrieved',
        state: 'active',
        detail: '52 / ~110…'
      }, {
        key: 'kols',
        label: 'KOLs Extracted',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'ranked',
        label: 'Ranked',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'moss',
        label: 'Indexed in Moss',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'review',
        label: 'Ready for Review',
        state: 'pending',
        detail: 'Pending'
      }]
    },
    'IMM-PSO-330': {
      id: 'IMM-PSO-330',
      nct: 'NCT06••••907',
      run: null,
      title: 'A Phase 3 Study of an IL-23 Inhibitor in Moderate-to-Severe Plaque Psoriasis',
      sponsor: 'Aurelia Bio',
      phase: '3',
      indication: 'Plaque psoriasis',
      geo: ['EU', 'JP'],
      enrollment: '1,150',
      status: 'Queued',
      statusTone: 'neutral',
      updated: 'yesterday',
      stages: [{
        key: 'parsed',
        label: 'Parsed',
        state: 'pending',
        detail: 'Queued'
      }, {
        key: 'brief',
        label: 'Brief Extracted',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'queries',
        label: 'Queries Generated',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'evidence',
        label: 'Evidence Retrieved',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'kols',
        label: 'KOLs Extracted',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'ranked',
        label: 'Ranked',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'moss',
        label: 'Indexed in Moss',
        state: 'pending',
        detail: 'Pending'
      }, {
        key: 'review',
        label: 'Ready for Review',
        state: 'pending',
        detail: 'Pending'
      }]
    }
  },
  // maps a sidebar screen to the stage that must be reached before it has data
  screenStage: {
    brief: 'brief',
    queries: 'queries',
    evidence: 'evidence',
    candidates: 'kols',
    ranking: 'ranked',
    compliance: 'review',
    moss: 'moss',
    summary: 'review'
  },
  // ---------------------------------------------------------------- voice agent (scoped per protocol)
  // Answers use [n] tokens that render as evidence citations. Grounded in the indexed data for RSV;
  // the in-flight protocols answer honestly from their current run state.
  voice: {
    'RSV-PreF-301': {
      suggestions: ['Why is Dr. Marchetti ranked #1?', 'Which KOLs have direct Phase 3 trial experience?', 'Draft a compliant MSL pre-call brief for Dr. Tanaka', 'What compliance flags are open?'],
      qa: [{
        q: 'Why is Dr. Marchetti ranked #1?',
        a: 'Dr. Elena Marchetti scores 92.4. She was coordinating principal investigator across 14 EU sites for the pivotal prefusion-F efficacy cohort[1] and first-authored the NEJM efficacy paper on the protocol’s primary LRTD endpoint in adults ≥60[2]. Trial experience (24/25) and protocol match (19.2/20) separate her from the field.',
        chips: [{
          label: '3 citations',
          tone: 'evidence'
        }, {
          label: 'Guardrail check passed',
          tone: 'safe'
        }]
      }, {
        q: 'Which KOLs have direct Phase 3 trial experience?',
        a: 'Two candidates hold a lead or investigator role on Phase 3 prefusion-F work: Dr. Marchetti (coordinating PI, 14 EU sites)[1] and Prof. Tanaka (national coordinating investigator, Japan immunogenicity sub-study)[2]. Dr. Okonkwo contributed to related guideline work but no pivotal trial role was found.',
        chips: [{
          label: '2 citations',
          tone: 'evidence'
        }, {
          label: 'Ranked by scientific relevance only',
          tone: 'safe'
        }]
      }, {
        q: 'Draft a compliant MSL pre-call brief for Dr. Tanaka',
        a: 'Generated a non-promotional pre-call brief for Prof. Hideo Tanaka — background, related Phase 3 trial experience[1], recent immunogenicity publications[2], and suggested scientific-exchange topics. Every claim is traced to source; no prescribing-volume or promotional content was included.',
        chips: [{
          label: 'Guardrail check passed',
          tone: 'safe'
        }, {
          label: 'Non-promotional',
          tone: 'safe'
        }]
      }, {
        q: 'What compliance flags are open?',
        a: 'Two open flags. High: a transparency / payment note on Dr. Grace Mwangi — an Open Payments consulting relationship in the indication that must be disclosed before outreach. Medium: Prof. Delacroix is below the 2-source evidence threshold for an evidence-backed recommendation. Both block final sign-off.',
        chips: [{
          label: '2 open flags',
          tone: 'risk'
        }, {
          label: 'Audit-logged',
          tone: 'evidence'
        }]
      }]
    },
    'ONC-KRAS-204': {
      suggestions: ['How many candidates so far?', 'When will ranking finish?', 'Show top evidence sources'],
      qa: [{
        q: 'How many candidates so far?',
        a: 'The run for ONC-KRAS-204 has extracted 41 KRAS G12C / NSCLC candidates from 96 evidence sources. Ranking is in progress now — I can give evidence-backed rationale once scoring completes.',
        chips: [{
          label: 'Run in progress',
          tone: 'evidence'
        }]
      }, {
        q: 'When will ranking finish?',
        a: 'Ranking is actively scoring all 41 candidates across the six relevance dimensions. The Moss index and review stages are queued behind it; nothing is held for manual review yet.',
        chips: [{
          label: 'Ranking · active',
          tone: 'evidence'
        }]
      }, {
        q: 'Show top evidence sources',
        a: 'Evidence retrieval completed with 96 sources across ClinicalTrials.gov, PubMed and congress pages. Detailed per-source views in this prototype are wired for RSV-PreF-301 — switch protocols to explore them.',
        chips: [{
          label: 'Evidence · complete',
          tone: 'evidence'
        }]
      }]
    },
    'NEU-AD-118': {
      suggestions: ['What stage is this run at?', 'How much evidence is collected?'],
      qa: [{
        q: 'What stage is this run at?',
        a: 'NEU-AD-118 is mid-evidence-retrieval — about 52 of an estimated 110 sources collected for early-Alzheimer’s anti-amyloid research. KOL extraction and ranking start once retrieval finishes.',
        chips: [{
          label: 'Evidence · active',
          tone: 'evidence'
        }]
      }, {
        q: 'How much evidence is collected?',
        a: '52 sources indexed so far and climbing. I’ll surface candidate experts and evidence-backed ranking as soon as the retrieval stage completes for this protocol.',
        chips: [{
          label: 'Run in progress',
          tone: 'evidence'
        }]
      }]
    },
    'IMM-PSO-330': {
      suggestions: ['Has processing started?'],
      qa: [{
        q: 'Has processing started?',
        a: 'IMM-PSO-330 is queued — parsing hasn’t begun, so there’s no protocol brief, evidence or KOL data to query yet. Start the run from the Protocols list and I’ll be able to answer once it’s indexed.',
        chips: [{
          label: 'Queued',
          tone: 'neutral'
        }]
      }]
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/data.js", error: String((e && e.message) || e) }); }

// dashboard/drawer.jsx
try { (() => {
// KOL profile drawer -> window.KolDrawer
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge,
    Avatar,
    ScoreBar
  } = DS;
  const Icon = window.Icon;
  const {
    StatusBadge,
    SecLabel,
    Note
  } = window.UI;
  const D = window.ORCH;
  const TYPE_ICON = {
    Publication: 'book',
    'Trial registry': 'flask',
    Guideline: 'shield',
    Congress: 'users',
    Institutional: 'protocols'
  };
  // map evidence types onto the profile's evidence sections
  const SECTIONS = [{
    key: 'trial',
    label: 'Trial experience',
    icon: 'flask',
    types: ['Trial registry']
  }, {
    key: 'pub',
    label: 'Publication evidence',
    icon: 'book',
    types: ['Publication']
  }, {
    key: 'guide',
    label: 'Guideline / congress evidence',
    icon: 'shield',
    types: ['Guideline', 'Congress']
  }, {
    key: 'inst',
    label: 'Institution / site relevance',
    icon: 'protocols',
    types: ['Institutional']
  }];
  function EvidenceRow({
    e
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 11px',
        background: 'var(--surface-card)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: TYPE_ICON[e.type],
      size: 14,
      color: "var(--evidence)",
      style: {
        marginTop: 2,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "doc",
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        fontWeight: 500,
        lineHeight: 1.3
      }
    }, e.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-tertiary)',
        marginTop: 4,
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", null, e.host), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, e.date), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, e.geo))), /*#__PURE__*/React.createElement(Badge, {
      tone: "evidence",
      size: "sm"
    }, e.score)), /*#__PURE__*/React.createElement("div", {
      className: "doc",
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--slate-700)',
        marginTop: 8,
        paddingLeft: 23
      }
    }, "\"", e.snippet, "\""), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--evidence-ink)',
        marginTop: 7,
        paddingLeft: 23,
        wordBreak: 'break-all'
      }
    }, e.url));
  }
  function KolDrawer({
    id,
    onClose
  }) {
    const c = D.candidates.find(k => k.id === id);
    if (!c) return null;
    const ev = (c.evidence || []).map(eid => D.evidence.find(e => e.id === eid)).filter(Boolean);
    const flags = D.complianceFlags.filter(f => f.kol === c.name);
    const TONE = {
      'Protocol match': 'accent',
      'Trial investigator experience': 'safe',
      'Publication relevance': 'evidence',
      'Institution / site relevance': 'neutral',
      'Guideline / congress influence': 'evidence',
      'Recency': 'compliance'
    };

    // ESC to close
    React.useEffect(() => {
      const h = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', h);
      return () => window.removeEventListener('keydown', h);
    }, [onClose]);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("aside", {
      className: "drawer",
      role: "dialog",
      "aria-label": `Profile — ${c.name}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "drawer__head"
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.name,
      size: 42,
      tone: "auto"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, "RANK ", String(c.rank).padStart(2, '0')), /*#__PURE__*/React.createElement(StatusBadge, {
      status: c.status
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-semibold)',
        letterSpacing: 'var(--tracking-snug)',
        marginTop: 3,
        lineHeight: 1.2
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        marginTop: 2
      }
    }, c.title, " \xB7 ", c.institution), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        marginTop: 4
      }
    }, c.specialty, " \xB7 ", c.location)), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      onClick: onClose,
      title: "Close",
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "drawer__body"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-inset)'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "ds-eyebrow"
    }, "Overall protocol match"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        marginTop: 3
      }
    }, "Weighted across 6 dimensions")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-4xl)',
        fontWeight: 'var(--weight-medium)',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        color: c.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)'
      }
    }, c.score)), /*#__PURE__*/React.createElement("div", {
      className: "drawer__sec"
    }, /*#__PURE__*/React.createElement(SecLabel, {
      icon: "target"
    }, "Why this expert is relevant"), /*#__PURE__*/React.createElement("div", {
      className: "doc",
      style: {
        fontSize: 'var(--text-md)'
      }
    }, c.rationale)), c.breakdown && c.breakdown.length ? /*#__PURE__*/React.createElement("div", {
      className: "drawer__sec"
    }, /*#__PURE__*/React.createElement(SecLabel, {
      icon: "ranking"
    }, "Score breakdown"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }
    }, c.breakdown.map((b, i) => /*#__PURE__*/React.createElement(ScoreBar, {
      key: i,
      label: b.label,
      value: b.value,
      max: b.max,
      tone: TONE[b.label] || 'evidence'
    })))) : null, flags.length ? /*#__PURE__*/React.createElement("div", {
      className: "drawer__sec"
    }, /*#__PURE__*/React.createElement(SecLabel, {
      icon: "shield"
    }, "Compliance & conflict flags"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, flags.map(f => /*#__PURE__*/React.createElement(Note, {
      key: f.id,
      tone: f.severity === 'high' ? 'risk' : 'compliance',
      icon: "flag"
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontWeight: 600
      }
    }, f.type, "."), " ", f.detail)))) : /*#__PURE__*/React.createElement(Note, {
      tone: "safe",
      icon: "check"
    }, "No open compliance or transparency flags. Cleared for non-promotional scientific exchange."), SECTIONS.map(sec => {
      const items = ev.filter(e => sec.types.includes(e.type));
      if (!items.length) return null;
      return /*#__PURE__*/React.createElement("div", {
        className: "drawer__sec",
        key: sec.key
      }, /*#__PURE__*/React.createElement(SecLabel, {
        icon: sec.icon
      }, sec.label, " \xB7 ", items.length), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }
      }, items.map(e => /*#__PURE__*/React.createElement(EvidenceRow, {
        key: e.id,
        e: e
      }))));
    }), !ev.length ? /*#__PURE__*/React.createElement(Note, {
      tone: "compliance",
      icon: "alert"
    }, "Below the 2-source evidence threshold. Additional public evidence is required before this candidate can be recommended.") : /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        textAlign: 'center',
        paddingTop: 4
      }
    }, c.sources, " total public sources \xB7 ", ev.length, " shown \xB7 last activity ", c.breakdown && c.breakdown.length ? '2025' : 'n/a')), /*#__PURE__*/React.createElement("div", {
      className: "drawer__foot"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 14
      })
    }, "Add to shortlist"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "flag",
        size: 14
      })
    }, "Needs review"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "x",
        size: 14
      }),
      style: {
        marginLeft: 'auto',
        color: 'var(--risk-ink)'
      }
    }, "Exclude with reason"))));
  }
  window.KolDrawer = KolDrawer;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/drawer.jsx", error: String((e && e.message) || e) }); }

// dashboard/icons.jsx
try { (() => {
// Lucide-style inline icons (24x24, 2px stroke, rounded). window.Icon
(function () {
  const P = {
    protocols: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z|M14 2v5h5|M9 13h6|M9 17h4',
    runs: 'M3 12a9 9 0 1 0 9-9|M12 7v5l3 2|M3 12H1m2 0 1-4',
    brief: 'M4 4h16v16H4z|M8 8h8|M8 12h8|M8 16h5',
    queries: 'M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z|M20 20l-4.35-4.35',
    evidence: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z|M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
    candidates: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8|M22 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75',
    ranking: 'M4 20V10|M10 20V4|M16 20v-7|M22 20H2',
    compliance: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z|m9 12 2 2 4-4',
    moss: 'M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3z|M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5|M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3',
    summary: 'M9 17H7A5 5 0 0 1 7 7h2|M15 7h2a5 5 0 0 1 0 10h-2|M8 12h8',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8|M22 21v-2a4 4 0 0 0-3-3.87',
    alert: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z|M12 9v4|M12 17h.01',
    shield: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    database: 'M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3z|M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5|M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3',
    check: 'M20 6 9 17l-5-5',
    x: 'M18 6 6 18M6 6l12 12',
    upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M17 8l-5-5-5 5|M12 3v12',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3',
    edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z',
    refresh: 'M3 2v6h6|M21 12A9 9 0 0 0 6 5.3L3 8|M21 22v-6h-6|M3 12a9 9 0 0 0 15 6.7l3-2.7',
    filter: 'M22 3H2l8 9.46V19l4 2v-8.54z',
    external: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6|M15 3h6v6|M10 14 21 3',
    chevron: 'M9 18l6-6-6-6',
    chevronDown: 'M6 9l6 6 6-6',
    play: 'M5 3l14 9-14 9V3z',
    pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 6v6l4 2',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z|M14 2v5h5',
    flask: 'M9 3h6|M10 3v6.5L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-8.5V3|M7.5 14h9',
    link: 'M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71|M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20|M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z|M19 10a7 7 0 0 1-14 0|M12 19v3',
    sliders: 'M4 21v-7|M4 10V3|M12 21v-9|M12 8V3|M20 21v-5|M20 12V3|M1 14h6|M9 8h6|M17 16h6',
    inbox: 'M22 12h-6l-2 3h-4l-2-3H2|M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
    dot: 'M12 12h.01',
    plus: 'M12 5v14M5 12h14',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z|M4 22v-7',
    minus: 'M5 12h14',
    target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z|M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
  };
  function Icon({
    name,
    size = 16,
    color = 'currentColor',
    strokeWidth = 2,
    style
  }) {
    const d = P[name] || P.dot;
    return React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style
    }, d.split('|').map((p, i) => React.createElement('path', {
      key: i,
      d: p
    })));
  }
  window.Icon = Icon;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/icons.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-brief-queries.jsx
try { (() => {
// Protocol Brief + Search Queries screens -> window.ScreensB
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge,
    Tag
  } = DS;
  const Icon = window.Icon;
  const {
    ScreenHead,
    Panel,
    Confidence,
    Chunk,
    Note,
    StatusBadge
  } = window.UI;
  const D = window.ORCH;

  // -------------------------------------------------- Protocol Brief
  function Brief() {
    const [active, setActive] = React.useState(D.brief[5]); // mechanism (a review item)
    const lowConf = D.brief.filter(b => b.confidence < 85).length;
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Stage 02 \xB7 Brief extracted",
      title: "Protocol brief",
      desc: "Structured extraction of RSV-PreF-301. Each field shows extraction confidence and the source protocol chunk it was drawn from. Review and edit before the brief drives query generation.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Badge, {
        tone: "compliance",
        size: "sm",
        dot: true
      }, lowConf, " fields below 85%"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 14
        })
      }, "Approve all"))
    }), /*#__PURE__*/React.createElement("div", {
      className: "cols cols--brief"
    }, /*#__PURE__*/React.createElement(Panel, {
      noBody: true
    }, /*#__PURE__*/React.createElement("table", {
      className: "tbl"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Field"), /*#__PURE__*/React.createElement("th", null, "Extracted value"), /*#__PURE__*/React.createElement("th", null, "Confidence"), /*#__PURE__*/React.createElement("th", null, "Source"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, D.brief.map((b, i) => /*#__PURE__*/React.createElement("tr", {
      key: i,
      "aria-selected": active === b,
      onClick: () => setActive(b)
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500,
        whiteSpace: 'nowrap'
      }
    }, b.section, b.derived ? /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-tertiary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 3,
        padding: '0 4px'
      }
    }, "DERIVED") : null), /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--text-secondary)',
        maxWidth: 320
      }
    }, b.value), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Confidence, {
      value: b.confidence
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chunk, null, b.chunk)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
      status: b.status
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      title: "Edit",
      onClick: e => {
        e.stopPropagation();
        setActive(b);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 13
    })))))))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Inspector",
      title: active.section,
      actions: /*#__PURE__*/React.createElement(StatusBadge, {
        status: active.status
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "ds-eyebrow",
      style: {
        marginBottom: 6
      }
    }, "Extracted value"), /*#__PURE__*/React.createElement("div", {
      className: "doc",
      style: {
        fontSize: 'var(--text-md)'
      }
    }, active.value)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "ds-eyebrow",
      style: {
        marginBottom: 6
      }
    }, "Confidence"), /*#__PURE__*/React.createElement(Confidence, {
      value: active.confidence
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "ds-eyebrow",
      style: {
        marginBottom: 6
      }
    }, "Source chunk"), /*#__PURE__*/React.createElement(Chunk, null, active.chunk))), active.confidence < 85 ? /*#__PURE__*/React.createElement(Note, {
      tone: "compliance",
      icon: "alert"
    }, active.derived ? 'This field was inferred from the protocol, not stated verbatim. Confirm before it influences ranking.' : 'Confidence is below the 85% review threshold. Verify against the source chunk before approval.') : /*#__PURE__*/React.createElement(Note, {
      tone: "safe",
      icon: "check"
    }, "High-confidence extraction with a located source chunk. Safe to approve."), /*#__PURE__*/React.createElement("div", {
      className: "panel",
      style: {
        boxShadow: 'none',
        background: 'var(--surface-inset)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "panel__body",
      style: {
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ds-eyebrow",
      style: {
        marginBottom: 7
      }
    }, "Source excerpt \xB7 ", active.chunk), /*#__PURE__*/React.createElement("div", {
      className: "doc",
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--slate-700)'
      }
    }, "\u201C\u2026", active.value.toLowerCase().slice(0, 90), "\u2026 as specified in the study protocol, consistent with the stated objectives for the \u226560 population.\u201D"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 14
      })
    }, "Approve"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "edit",
        size: 14
      })
    }, "Edit value"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Flag for reviewer"))))));
  }

  // -------------------------------------------------- Search Queries
  function Queries() {
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Stage 03 \xB7 Queries generated",
      title: "Search queries",
      desc: "Query groups generated from the protocol brief, mapped to public source coverage. Approve, edit, disable, or regenerate before evidence collection runs.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "refresh",
          size: 14
        })
      }, "Regenerate all"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 14
        })
      }, "Approve & run"))
    }), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Coverage",
      title: "Search source coverage",
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 10
      }
    }, D.querySources.map(s => {
      const map = {
        ok: ['safe', 'Indexed'],
        partial: ['compliance', 'Partial'],
        running: ['accent', 'Running'],
        off: ['neutral', 'Not used']
      };
      const [tone, lab] = map[s.state];
      return /*#__PURE__*/React.createElement("div", {
        key: s.name,
        style: {
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 11px',
          background: s.state === 'off' ? 'var(--surface-inset)' : 'var(--surface-card)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          lineHeight: 1.2,
          minHeight: 32
        }
      }, s.name), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginTop: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-lg)',
          fontWeight: 500,
          color: s.state === 'off' ? 'var(--text-tertiary)' : 'var(--text-primary)'
        }
      }, s.count), /*#__PURE__*/React.createElement(StatusBadge, {
        status: tone === 'safe' ? 'done' : tone === 'accent' ? 'active' : tone === 'compliance' ? 'warn' : 'pending',
        label: lab
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, D.queryGroups.map(g => /*#__PURE__*/React.createElement("section", {
      key: g.id,
      className: "panel",
      style: {
        opacity: g.status === 'disabled' ? 0.6 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "panel__head"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, g.id.toUpperCase()), /*#__PURE__*/React.createElement("span", {
      className: "panel__title"
    }, g.name), /*#__PURE__*/React.createElement(StatusBadge, {
      status: g.status
    })), /*#__PURE__*/React.createElement("div", {
      className: "panel__actions"
    }, g.results != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, g.results, " hits") : null, /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      title: "Edit"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      title: "Regenerate"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      title: g.status === 'disabled' ? 'Enable' : 'Disable'
    }, /*#__PURE__*/React.createElement(Icon, {
      name: g.status === 'disabled' ? 'play' : 'pause',
      size: 14
    })))), /*#__PURE__*/React.createElement("div", {
      className: "panel__body",
      style: {
        paddingTop: 12,
        paddingBottom: 12
      }
    }, g.status === 'regenerating' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: 'var(--text-secondary)',
        fontSize: 'var(--text-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "spinner",
      style: {
        width: 14,
        height: 14
      }
    }), " Regenerating queries from updated brief\u2026") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, g.queries.map((q, i) => /*#__PURE__*/React.createElement("code", {
      key: i,
      style: {
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-primary)',
        background: 'var(--surface-inset)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '7px 10px'
      }
    }, q))), /*#__PURE__*/React.createElement("div", {
      className: "pillrow",
      style: {
        marginTop: 10
      }
    }, g.sources.map(s => /*#__PURE__*/React.createElement("span", {
      key: s,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xs)',
        padding: '2px 7px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 5,
        height: 5,
        borderRadius: 9,
        background: 'var(--evidence)'
      }
    }), s))))))));
  }
  window.ScreensB = {
    Brief,
    Queries
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-brief-queries.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-candidates.jsx
try { (() => {
// KOL Candidates screen -> window.ScreensD
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge
  } = DS;
  const Icon = window.Icon;
  const {
    ScreenHead,
    Panel,
    StatusBadge,
    MiniBar,
    Note
  } = window.UI;
  const D = window.ORCH;
  const TRIAL = {
    lead: ['safe', 'Lead PI'],
    investigator: ['accent', 'Investigator'],
    none: ['neutral', 'No trial role']
  };

  // influence as a 3-step dot ramp
  function Influence({
    level
  }) {
    const n = {
      high: 3,
      medium: 2,
      low: 1
    }[level] || 0;
    const col = level === 'high' ? 'var(--evidence)' : level === 'medium' ? 'var(--evidence)' : 'var(--text-tertiary)';
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 3
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: 6,
        height: 6,
        borderRadius: 9,
        background: i < n ? col : 'var(--surface-sunken)',
        border: i < n ? 'none' : '1px solid var(--border-subtle)'
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'capitalize'
      }
    }, level));
  }
  function Candidates({
    openKol
  }) {
    const [sortKey, setSortKey] = React.useState('score');
    const [dir, setDir] = React.useState('desc');
    const [trialF, setTrialF] = React.useState('All');
    const [geoF, setGeoF] = React.useState('All');
    const TRIAL_ORDER = {
      lead: 3,
      investigator: 2,
      none: 1
    };
    const INF_ORDER = {
      high: 3,
      medium: 2,
      low: 1
    };
    function sortBy(key) {
      if (key === sortKey) {
        setDir(dir === 'desc' ? 'asc' : 'desc');
      } else {
        setSortKey(key);
        setDir('desc');
      }
    }
    let rows = D.candidates.filter(c => (trialF === 'All' || (trialF === 'Trial experience' ? c.trial !== 'none' : c.trial === 'none')) && (geoF === 'All' || c.geo.startsWith(geoF)));
    rows = [...rows].sort((a, b) => {
      const get = c => {
        switch (sortKey) {
          case 'name':
            return c.name.replace(/^(Dr\.|Prof\.)\s+/, '');
          case 'institution':
            return c.institution;
          case 'specialty':
            return c.specialty;
          case 'trial':
            return TRIAL_ORDER[c.trial];
          case 'pubRel':
            return c.pubRel;
          case 'influence':
            return INF_ORDER[c.influence];
          case 'sources':
            return c.sources;
          case 'flags':
            return c.flags;
          default:
            return c.score;
        }
      };
      const av = get(a),
        bv = get(b);
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return dir === 'desc' ? -cmp : cmp;
    });
    const Th = ({
      k,
      children,
      num
    }) => /*#__PURE__*/React.createElement("th", {
      className: (num ? 'num ' : '') + 'sortable',
      onClick: () => sortBy(k)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: sortKey === k ? 'var(--accent)' : undefined
      }
    }, children, sortKey === k ? /*#__PURE__*/React.createElement(Icon, {
      name: dir === 'desc' ? 'chevronDown' : 'chevron',
      size: 11,
      style: dir === 'desc' ? null : {
        transform: 'rotate(-90deg)'
      }
    }) : null));
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Stage 05 \xB7 KOLs extracted",
      title: "KOL candidates",
      desc: "64 experts surfaced from the evidence set and scored for scientific relevance to RSV-PreF-301. Sort and filter to compare; open any candidate for the full evidence-backed profile.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "filter",
          size: 14
        })
      }, "18 shortlisted"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "download",
          size: 14
        })
      }, "Export candidates"))
    }), /*#__PURE__*/React.createElement("div", {
      className: "toolbar"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fsearch"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "queries",
      size: 14
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Search name or institution\u2026"
    })), /*#__PURE__*/React.createElement("span", {
      className: "fsep"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '.08em'
      }
    }, "Trial"), ['All', 'Trial experience', 'No trial role'].map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      className: "fbtn",
      "aria-pressed": trialF === t,
      onClick: () => setTrialF(t)
    }, t)), /*#__PURE__*/React.createElement("span", {
      className: "fsep"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '.08em'
      }
    }, "Region"), ['All', 'US', 'EU', 'APAC', 'AU'].map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      className: "fbtn",
      "aria-pressed": geoF === t,
      onClick: () => setGeoF(t)
    }, t))), /*#__PURE__*/React.createElement(Panel, {
      noBody: true
    }, /*#__PURE__*/React.createElement("table", {
      className: "tbl"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: 36
      },
      className: "num"
    }, "#"), /*#__PURE__*/React.createElement(Th, {
      k: "name"
    }, "Expert"), /*#__PURE__*/React.createElement(Th, {
      k: "specialty"
    }, "Specialty"), /*#__PURE__*/React.createElement("th", null, "Geography"), /*#__PURE__*/React.createElement(Th, {
      k: "trial"
    }, "Trial experience"), /*#__PURE__*/React.createElement(Th, {
      k: "pubRel",
      num: true
    }, "Publication rel."), /*#__PURE__*/React.createElement(Th, {
      k: "influence"
    }, "Influence"), /*#__PURE__*/React.createElement(Th, {
      k: "sources",
      num: true
    }, "Sources"), /*#__PURE__*/React.createElement(Th, {
      k: "flags",
      num: true
    }, "Flags"), /*#__PURE__*/React.createElement(Th, {
      k: "score",
      num: true
    }, "Match score"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(c => {
      const [tt, tl] = TRIAL[c.trial];
      return /*#__PURE__*/React.createElement("tr", {
        key: c.id,
        onClick: () => openKol(c.id)
      }, /*#__PURE__*/React.createElement("td", {
        className: "num mono muted",
        style: {
          fontSize: 'var(--text-2xs)'
        }
      }, c.rank), /*#__PURE__*/React.createElement("td", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 500
        }
      }, c.name), /*#__PURE__*/React.createElement("div", {
        className: "muted",
        style: {
          fontSize: 'var(--text-2xs)'
        }
      }, c.institution)), /*#__PURE__*/React.createElement("td", {
        style: {
          fontSize: 'var(--text-sm)'
        }
      }, c.specialty), /*#__PURE__*/React.createElement("td", {
        className: "muted mono",
        style: {
          fontSize: 'var(--text-2xs)',
          whiteSpace: 'nowrap'
        }
      }, c.geo), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
        tone: tt,
        size: "sm",
        dot: c.trial !== 'none'
      }, tl)), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement(MiniBar, {
        value: c.pubRel
      })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Influence, {
        level: c.influence
      })), /*#__PURE__*/React.createElement("td", {
        className: "num mono",
        style: {
          color: 'var(--text-secondary)'
        }
      }, c.sources), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, c.flags > 0 ? /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          color: 'var(--risk-ink)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "flag",
        size: 12,
        color: "var(--risk)"
      }), c.flags) : /*#__PURE__*/React.createElement("span", {
        className: "muted",
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)'
        }
      }, "0")), /*#__PURE__*/React.createElement("td", {
        className: "num"
      }, /*#__PURE__*/React.createElement("span", {
        className: "scorepill",
        style: {
          color: c.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)'
        }
      }, c.score)), /*#__PURE__*/React.createElement("td", {
        style: {
          textAlign: 'right'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevron",
        size: 14,
        color: "var(--text-tertiary)"
      })));
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, "Showing ", rows.length, " of 64 \xB7 ranked by scientific relevance, not prescribing volume"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Load remaining 56 candidates")));
  }
  window.ScreensD = {
    Candidates
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-candidates.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-compliance.jsx
try { (() => {
// Compliance Review screen -> window.ScreensF
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge
  } = DS;
  const Icon = window.Icon;
  const {
    ScreenHead,
    Panel,
    Note,
    StatusBadge
  } = window.UI;
  const D = window.ORCH;
  const SEV = {
    high: ['risk', 'High'],
    medium: ['compliance', 'Medium'],
    low: ['neutral', 'Low']
  };
  function Compliance({
    openKol
  }) {
    const open = D.complianceFlags.filter(f => f.status === 'open');
    const resolved = D.complianceFlags.filter(f => f.status !== 'open');
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Stage 07 \xB7 Compliance review",
      title: "Compliance review",
      desc: "Every recommendation is screened against Medical Affairs guardrails before sign-off. Flagged language, unsupported claims, missing citations, and transparency notes are surfaced here with a full audit trail.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "download",
          size: 14
        })
      }, "Export audit log"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 14
        })
      }, "Sign off review"))
    }), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Guardrails",
      title: "Active Medical Affairs guardrails",
      actions: /*#__PURE__*/React.createElement(Badge, {
        tone: "compliance",
        size: "sm",
        dot: true
      }, "1 not yet satisfied")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10
      }
    }, D.guardrails.map((g, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "guard",
      style: {
        borderColor: g.ok ? 'color-mix(in srgb, var(--safe) 28%, white)' : 'color-mix(in srgb, var(--compliance) 32%, white)',
        background: g.ok ? 'var(--safe-tint)' : 'var(--compliance-tint)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: g.ok ? 'check' : 'alert',
      size: 16,
      color: g.ok ? 'var(--safe)' : 'var(--compliance)'
    }), /*#__PURE__*/React.createElement("span", {
      className: "gt",
      style: {
        color: g.ok ? 'var(--safe-ink)' : 'var(--compliance-ink)'
      }
    }, g.label)))), /*#__PURE__*/React.createElement(Note, {
      tone: "compliance",
      icon: "alert"
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontWeight: 600
      }
    }, "\"Every recommendation carries supporting evidence\" is not yet satisfied."), " One candidate (Delacroix) falls below the 2-source threshold and must be resolved before the packet can be approved.")), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: `${open.length} open`,
      title: "Flags requiring review",
      style: {
        marginTop: 16
      },
      noBody: true
    }, /*#__PURE__*/React.createElement("div", null, open.map((f, i) => {
      const [tone, lab] = SEV[f.severity];
      const k = D.candidates.find(c => c.name === f.kol);
      return /*#__PURE__*/React.createElement("div", {
        key: f.id,
        style: {
          display: 'flex',
          gap: 14,
          padding: 16,
          borderTop: i ? '1px solid var(--border-subtle)' : 'none'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 'none',
          width: 34,
          height: 34,
          borderRadius: 'var(--radius-md)',
          display: 'grid',
          placeItems: 'center',
          background: tone === 'risk' ? 'var(--risk-tint)' : 'var(--compliance-tint)',
          color: tone === 'risk' ? 'var(--risk)' : 'var(--compliance)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "flag",
        size: 16
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          flexWrap: 'wrap'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600,
          fontSize: 'var(--text-md)'
        }
      }, f.type), /*#__PURE__*/React.createElement(Badge, {
        tone: tone,
        size: "sm",
        dot: true
      }, lab, " severity"), /*#__PURE__*/React.createElement(StatusBadge, {
        status: "open"
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-tertiary)',
          marginTop: 4
        }
      }, "Candidate \xB7 ", f.kol), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginTop: 8,
          maxWidth: '70ch',
          lineHeight: 1.5
        }
      }, f.detail), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 8,
          marginTop: 12
        }
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 13
        })
      }, "Mark reviewed"), k ? /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "eye",
          size: 13
        }),
        onClick: () => openKol(k.id)
      }, "View candidate") : null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm"
      }, "Route to reviewer"))));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "cols cols--2",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Resolved",
      title: "Auto-resolved & cleared"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, resolved.map(f => /*#__PURE__*/React.createElement("div", {
      key: f.id,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15,
      color: "var(--safe)",
      style: {
        marginTop: 2,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 500
      }
    }, f.type, " \xB7 ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)',
        fontWeight: 400
      }
    }, f.kol)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        marginTop: 3,
        lineHeight: 1.45
      }
    }, f.detail)))))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Audit trail",
      title: "Processing audit log",
      actions: /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-tertiary)'
        }
      }, "run_8f2a91")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, D.audit.map((a, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "review-row",
      style: {
        borderTop: i ? '1px solid var(--border-subtle)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        flex: 'none',
        width: 64,
        paddingTop: 1
      }
    }, a.time), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        lineHeight: 1.45
      }
    }, a.text), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-tertiary)',
        marginTop: 3,
        textTransform: 'uppercase',
        letterSpacing: '.08em'
      }
    }, a.actor))))))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Sign-off",
      title: "Reviewer approval workflow",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        flexWrap: 'wrap'
      }
    }, [{
      label: 'Automated scan',
      who: 'system',
      done: true
    }, {
      label: 'Guardrail check',
      who: '2 open flags',
      done: false,
      active: true
    }, {
      label: 'Medical Affairs sign-off',
      who: 'a.okoye',
      done: false
    }, {
      label: 'Release packet',
      who: 'pending',
      done: false
    }].map((s, i, arr) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 'var(--radius-pill)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: s.done ? 'var(--safe)' : s.active ? 'var(--accent)' : 'var(--surface-card)',
        border: s.done || s.active ? 'none' : '1.5px solid var(--border-strong)',
        color: s.done || s.active ? '#fff' : 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)'
      }
    }, s.done ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 13,
      color: "#fff"
    }) : i + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        color: s.done || s.active ? 'var(--text-primary)' : 'var(--text-tertiary)'
      }
    }, s.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '.06em',
        marginTop: 2
      }
    }, s.who))), i < arr.length - 1 ? /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 24,
        height: 1,
        background: 'var(--border-strong)',
        margin: '0 14px'
      }
    }) : null))), /*#__PURE__*/React.createElement(Note, {
      tone: "info",
      icon: "shield"
    }, "Sign-off is blocked until all guardrails pass. Approving records your identity, timestamp, and the exact artifact hash to the audit log.")));
  }
  window.ScreensF = {
    Compliance
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-compliance.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-evidence.jsx
try { (() => {
// Evidence screen -> window.ScreensC
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge
  } = DS;
  const Icon = window.Icon;
  const {
    ScreenHead,
    Panel,
    Note,
    StatusBadge,
    SecLabel
  } = window.UI;
  const D = window.ORCH;
  const STRENGTH = {
    strong: ['safe', 'Strong'],
    moderate: ['compliance', 'Moderate'],
    weak: ['neutral', 'Weak']
  };
  const TYPE_ICON = {
    Publication: 'book',
    'Trial registry': 'flask',
    Guideline: 'shield',
    Congress: 'users',
    Institutional: 'protocols'
  };
  function Evidence({
    openKol
  }) {
    const [type, setType] = React.useState('All');
    const [strength, setStrength] = React.useState('All');
    const [sel, setSel] = React.useState(D.evidence[0]);
    const rows = D.evidence.filter(e => (type === 'All' || e.type === type) && (strength === 'All' || e.strength === strength));
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Stage 04 \xB7 Evidence retrieved",
      title: "Evidence",
      desc: "Public sources collected for the protocol \u2014 trials, publications, guidelines, congress, and institutional pages. Every source is scored for relevance against protocol endpoints and linked to candidate experts.",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "download",
          size: 14
        })
      }, "Export evidence")
    }), /*#__PURE__*/React.createElement("div", {
      className: "toolbar"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fsearch"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "queries",
      size: 14
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Search title, entity, or source\u2026"
    })), /*#__PURE__*/React.createElement("span", {
      className: "fsep"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '.08em'
      }
    }, "Type"), ['All', ...D.evidenceFilters.type].map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      className: "fbtn",
      "aria-pressed": type === t,
      onClick: () => setType(t)
    }, t)), /*#__PURE__*/React.createElement("span", {
      className: "fsep"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '.08em'
      }
    }, "Strength"), ['All', ...D.evidenceFilters.strength].map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      className: "fbtn",
      "aria-pressed": strength === t,
      onClick: () => setStrength(t),
      style: {
        textTransform: 'capitalize'
      }
    }, t))), /*#__PURE__*/React.createElement("div", {
      className: "cols cols--ev"
    }, /*#__PURE__*/React.createElement(Panel, {
      noBody: true
    }, /*#__PURE__*/React.createElement("table", {
      className: "tbl"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Source"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Relevance"), /*#__PURE__*/React.createElement("th", null, "Strength"), /*#__PURE__*/React.createElement("th", null, "Linked KOLs"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(e => /*#__PURE__*/React.createElement("tr", {
      key: e.id,
      "aria-selected": sel === e,
      onClick: () => setSel(e)
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: TYPE_ICON[e.type],
      size: 14,
      color: "var(--evidence)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500
      }
    }, e.type), /*#__PURE__*/React.createElement("div", {
      className: "muted mono",
      style: {
        fontSize: 9
      }
    }, e.host)))), /*#__PURE__*/React.createElement("td", {
      style: {
        maxWidth: 300
      }
    }, e.title), /*#__PURE__*/React.createElement("td", {
      className: "muted mono",
      style: {
        fontSize: 'var(--text-2xs)'
      }
    }, e.date), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: e.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)',
        fontWeight: 500
      }
    }, e.score)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
      status: STRENGTH[e.strength][0] === 'safe' ? 'done' : STRENGTH[e.strength][0] === 'compliance' ? 'warn' : 'pending',
      label: STRENGTH[e.strength][1]
    })), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        fontSize: 'var(--text-2xs)'
      }
    }, e.kols.length)))))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Source preview",
      title: sel.type,
      actions: /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: e => e.preventDefault(),
        className: "iconbtn",
        title: "Open source"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "external",
        size: 14
      }))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "doc",
      style: {
        fontSize: 'var(--text-md)',
        color: 'var(--text-primary)',
        fontWeight: 500,
        lineHeight: 1.35
      }
    }, sel.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        marginTop: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", null, sel.host), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, sel.date), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, sel.geo)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--evidence-ink)',
        marginTop: 6,
        wordBreak: 'break-all'
      }
    }, sel.url)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "evidence",
      size: "sm"
    }, "Relevance ", sel.score), /*#__PURE__*/React.createElement(StatusBadge, {
      status: STRENGTH[sel.strength][0] === 'safe' ? 'done' : STRENGTH[sel.strength][0] === 'compliance' ? 'warn' : 'pending',
      label: STRENGTH[sel.strength][1] + ' evidence'
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SecLabel, {
      icon: "book"
    }, "Supporting snippet"), /*#__PURE__*/React.createElement("div", {
      className: "note note--evidence",
      style: {
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "dot",
      size: 4,
      style: {
        opacity: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "doc",
      style: {
        color: 'var(--slate-700)',
        fontSize: 'var(--text-sm)'
      }
    }, "\u201C", sel.snippet, "\u201D"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SecLabel, {
      icon: "target"
    }, "Extracted entities"), /*#__PURE__*/React.createElement("div", {
      className: "pillrow"
    }, sel.entities.map(en => /*#__PURE__*/React.createElement("span", {
      key: en,
      style: {
        fontSize: 'var(--text-2xs)',
        background: 'var(--surface-inset)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xs)',
        padding: '3px 8px',
        color: 'var(--text-secondary)'
      }
    }, en)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SecLabel, {
      icon: "link"
    }, "Linked KOL candidates"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, sel.kols.map(kid => {
      const k = D.candidates.find(c => c.id === kid);
      return /*#__PURE__*/React.createElement("button", {
        key: kid,
        className: "rowlink",
        onClick: () => openKol(kid)
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 500
        }
      }, k.name), /*#__PURE__*/React.createElement("span", {
        className: "muted",
        style: {
          fontSize: 'var(--text-2xs)'
        }
      }, k.institution), /*#__PURE__*/React.createElement(Icon, {
        name: "chevron",
        size: 13,
        color: "var(--text-tertiary)"
      }));
    })))))));
  }
  window.ScreensC = {
    Evidence
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-evidence.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-moss.jsx
try { (() => {
// Moss Index screen -> window.ScreensG
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge
  } = DS;
  const Icon = window.Icon;
  const {
    ScreenHead,
    Panel,
    Note,
    StatusBadge
  } = window.UI;
  const D = window.ORCH;
  const ASSET_ICON = {
    protocol: 'file',
    evidence: 'evidence',
    profiles: 'candidates',
    ranking: 'ranking',
    cites: 'link'
  };
  function Moss() {
    const totalChunks = D.mossAssets.reduce((s, a) => s + a.chunks, 0);
    const totalEmbedded = D.mossAssets.reduce((s, a) => s + a.embedded, 0);
    const totalFailed = D.mossAssets.reduce((s, a) => s + a.failed, 0);
    const pct = Math.round(totalEmbedded / totalChunks * 100);
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Stage 08 \xB7 Indexed in Moss",
      title: "Moss index",
      desc: "Protocol-aware knowledge base. Every artifact \u2014 protocol chunks, evidence, KOL profiles, ranking metadata, and citations \u2014 is embedded and indexed in Moss so the copilot can answer with traceable, protocol-scoped retrieval.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "refresh",
          size: 14
        })
      }, "Retry failed (", totalFailed, ")"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "external",
          size: 14
        })
      }, "Open in Moss"))
    }), /*#__PURE__*/React.createElement("div", {
      className: "statgrid",
      style: {
        gridTemplateColumns: 'repeat(4, 1fr)'
      }
    }, [{
      lab: 'Index status',
      val: '97%',
      sub: `${pct}% embedded · 3 pending`,
      tone: 'accent',
      icon: 'database'
    }, {
      lab: 'Total chunks',
      val: totalChunks,
      sub: `${D.mossAssets.length} asset types`,
      tone: 'evidence',
      icon: 'file'
    }, {
      lab: 'Embedded',
      val: totalEmbedded,
      sub: 'vectors written',
      tone: 'safe',
      icon: 'check'
    }, {
      lab: 'Failed items',
      val: totalFailed,
      sub: 'retrying with backoff',
      tone: 'compliance',
      icon: 'alert'
    }].map(c => /*#__PURE__*/React.createElement("div", {
      key: c.lab,
      className: "stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat__top"
    }, /*#__PURE__*/React.createElement("span", {
      className: `stat__ic ic--${c.tone}`
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 16
    })), /*#__PURE__*/React.createElement("span", {
      className: "stat__lab"
    }, c.lab)), /*#__PURE__*/React.createElement("div", {
      className: "stat__val"
    }, c.val), /*#__PURE__*/React.createElement("div", {
      className: "stat__sub"
    }, c.sub)))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Embedding",
      title: "Indexed assets",
      style: {
        marginTop: 16
      },
      actions: /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-tertiary)'
        }
      }, "Last sync \xB7 ", D.mossSync),
      noBody: true
    }, /*#__PURE__*/React.createElement("table", {
      className: "tbl"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Asset"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Chunks"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Embedded"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Failed"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: 220
      }
    }, "Progress"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, D.mossAssets.map(a => {
      const p = Math.round(a.embedded / a.chunks * 100);
      const cls = a.failed > 0 ? 'is-error' : 'is-done';
      return /*#__PURE__*/React.createElement("tr", {
        key: a.key,
        style: {
          cursor: 'default'
        }
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: ASSET_ICON[a.key],
        size: 15,
        color: "var(--evidence)"
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 500
        }
      }, a.label))), /*#__PURE__*/React.createElement("td", {
        className: "num mono"
      }, a.chunks), /*#__PURE__*/React.createElement("td", {
        className: "num mono",
        style: {
          color: 'var(--safe-ink)'
        }
      }, a.embedded), /*#__PURE__*/React.createElement("td", {
        className: "num mono",
        style: {
          color: a.failed ? 'var(--risk-ink)' : 'var(--text-tertiary)'
        }
      }, a.failed), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 9
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: `meter ${cls}`,
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("i", {
        style: {
          width: p + '%'
        }
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-secondary)',
          width: 32,
          textAlign: 'right'
        }
      }, p, "%"))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
        status: a.state === 'done' ? 'done' : a.state === 'error' ? 'error' : 'active',
        label: a.state === 'done' ? 'Indexed' : a.state === 'error' ? 'Partial' : 'Embedding'
      })));
    })))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Errors",
      title: "Failed items",
      style: {
        marginTop: 16
      },
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "refresh",
          size: 14
        })
      }, "Retry all")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, D.mossFailed.map(f => /*#__PURE__*/React.createElement("div", {
      key: f.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 13px',
        border: '1px solid color-mix(in srgb, var(--risk) 26%, white)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--risk-tint)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "alert",
      size: 16,
      color: "var(--risk)",
      style: {
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        color: 'var(--text-primary)'
      }
    }, f.asset), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--risk-ink)',
        marginTop: 3
      }
    }, f.reason, " \xB7 ", f.attempts, " attempt", f.attempts > 1 ? 's' : '')), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "refresh",
        size: 13
      })
    }, "Retry"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Skip")))), /*#__PURE__*/React.createElement(Note, {
      tone: "info",
      icon: "clock"
    }, "Failed embeddings retry automatically with exponential backoff. Items still failing after 5 attempts are held for manual review and excluded from copilot retrieval until resolved.")));
  }
  window.ScreensG = {
    Moss
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-moss.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-overview.jsx
try { (() => {
// Overview + Protocols + Processing Runs screens -> window.ScreensA
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge,
    Tag
  } = DS;
  const Icon = window.Icon;
  const {
    ScreenHead,
    Panel,
    Note,
    StatusBadge
  } = window.UI;
  const D = window.ORCH;

  // -------------------------------------------------- Overview
  function Overview({
    go
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Processing run \xB7 run_8f2a91",
      title: "Run overview",
      desc: "Protocol-aware processing of RSV-PreF-301. Eight stages from parse to review \u2014 most complete; Moss indexing and compliance sign-off still need attention.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "refresh",
          size: 14
        })
      }, "Re-run"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "download",
          size: 14
        }),
        onClick: () => go('summary')
      }, "Export summary"))
    }), /*#__PURE__*/React.createElement("div", {
      className: "statgrid"
    }, D.statusCards.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.key,
      className: "stat",
      style: {
        textAlign: 'left',
        cursor: 'pointer',
        font: 'inherit'
      },
      onClick: () => go({
        kols: 'candidates',
        evidence: 'evidence',
        missing: 'brief',
        flags: 'compliance',
        moss: 'moss'
      }[c.key])
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat__top"
    }, /*#__PURE__*/React.createElement("span", {
      className: `stat__ic ic--${c.tone}`
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 16
    })), /*#__PURE__*/React.createElement("span", {
      className: "stat__lab"
    }, c.label)), /*#__PURE__*/React.createElement("div", {
      className: "stat__val"
    }, c.value), /*#__PURE__*/React.createElement("div", {
      className: "stat__sub"
    }, c.sub)))), /*#__PURE__*/React.createElement("div", {
      className: "cols cols--2",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Pipeline",
      title: "Workflow stages",
      actions: /*#__PURE__*/React.createElement(StatusBadge, {
        status: "warn",
        label: "2 items need attention"
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, D.stages.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.key,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '9px 0',
        borderTop: i ? '1px solid var(--border-subtle)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: `stage stage--${s.state}`,
      style: {
        flex: 'none',
        padding: 0,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "stage__dot"
    }, s.state === 'done' ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 11,
      color: "#fff"
    }) : s.state === 'warn' ? /*#__PURE__*/React.createElement(Icon, {
      name: "alert",
      size: 10,
      color: "#fff"
    }) : s.state === 'active' ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 9,
        background: '#fff'
      }
    }) : null)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-medium)',
        color: s.state === 'pending' ? 'var(--text-tertiary)' : 'var(--text-primary)'
      }
    }, s.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, s.detail)), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 'none',
        paddingTop: 1
      }
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      status: s.state,
      label: s.state === 'done' ? 'Complete' : s.state === 'warn' ? 'Warnings' : s.state === 'active' ? 'In review' : 'Pending'
    })))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Attention",
      title: "Needs your review"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement(Note, {
      tone: "risk",
      icon: "shield"
    }, "2 open compliance flags \u2014 a transparency note (Mwangi) and a sub-threshold evidence count (Delacroix). ", /*#__PURE__*/React.createElement("button", {
      className: "lk",
      onClick: () => go('compliance')
    }, "Open compliance review \u2192")), /*#__PURE__*/React.createElement(Note, {
      tone: "compliance",
      icon: "database"
    }, "3 KOL profiles failed to embed in Moss and are retrying. ", /*#__PURE__*/React.createElement("button", {
      className: "lk",
      onClick: () => go('moss')
    }, "Inspect index \u2192")), /*#__PURE__*/React.createElement(Note, {
      tone: "compliance",
      icon: "alert"
    }, "5 missing-data warnings in the brief; 2 affect ranking. ", /*#__PURE__*/React.createElement("button", {
      className: "lk",
      onClick: () => go('brief')
    }, "Review brief \u2192")))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Governance",
      title: "Active guardrails"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, D.guardrails.map((g, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        fontSize: 'var(--text-sm)',
        color: g.ok ? 'var(--text-primary)' : 'var(--compliance-ink)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: g.ok ? 'check' : 'alert',
      size: 14,
      color: g.ok ? 'var(--safe)' : 'var(--compliance)'
    }), g.label)))))));
  }

  // -------------------------------------------------- Protocols
  function Protocols({
    go,
    onUpload
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Library",
      title: "Protocols",
      desc: "Select a protocol to open its processing run, or upload a new Phase 3 protocol to begin extraction.",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "upload",
          size: 14
        }),
        onClick: onUpload
      }, "Upload protocol")
    }), /*#__PURE__*/React.createElement(Panel, {
      noBody: true
    }, /*#__PURE__*/React.createElement("table", {
      className: "tbl"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Protocol ID"), /*#__PURE__*/React.createElement("th", null, "Sponsor"), /*#__PURE__*/React.createElement("th", null, "Phase"), /*#__PURE__*/React.createElement("th", null, "Indication"), /*#__PURE__*/React.createElement("th", null, "Geography"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Updated"))), /*#__PURE__*/React.createElement("tbody", null, D.protocols.map(p => /*#__PURE__*/React.createElement("tr", {
      key: p.id,
      "aria-selected": p.active,
      onClick: () => p.active ? go('overview') : p.empty ? onUpload && onUpload() : null
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        color: 'var(--text-accent)',
        fontWeight: 500
      }
    }, p.id), /*#__PURE__*/React.createElement("td", null, p.sponsor), /*#__PURE__*/React.createElement("td", {
      className: "mono"
    }, p.phase), /*#__PURE__*/React.createElement("td", null, p.indication), /*#__PURE__*/React.createElement("td", {
      className: "muted mono",
      style: {
        fontSize: 'var(--text-2xs)'
      }
    }, p.geo), /*#__PURE__*/React.createElement("td", null, p.empty ? /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      size: "sm"
    }, "Queued") : /*#__PURE__*/React.createElement(StatusBadge, {
      status: p.status === 'Ready for review' ? 'active' : 'active',
      label: p.status
    })), /*#__PURE__*/React.createElement("td", {
      className: "num muted"
    }, p.updated)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Note, {
      tone: "info",
      icon: "upload"
    }, /*#__PURE__*/React.createElement("span", null, "Drag a Phase 3 protocol PDF anywhere to start a run, or ", /*#__PURE__*/React.createElement("button", {
      className: "lk",
      onClick: onUpload
    }, "upload one now \u2192"), " Parsing begins on upload \u2014 no templates or manual tagging required."))));
  }

  // -------------------------------------------------- Processing Runs
  function Runs({
    go
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Activity",
      title: "Processing runs",
      desc: "Every orchestration run across the protocol library, with stage, duration, and outcome.",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "refresh",
          size: 14
        })
      }, "Refresh")
    }), /*#__PURE__*/React.createElement(Panel, {
      noBody: true
    }, /*#__PURE__*/React.createElement("table", {
      className: "tbl"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Run ID"), /*#__PURE__*/React.createElement("th", null, "Protocol"), /*#__PURE__*/React.createElement("th", null, "Started"), /*#__PURE__*/React.createElement("th", {
      className: "num"
    }, "Duration"), /*#__PURE__*/React.createElement("th", null, "Stage"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Triggered by"))), /*#__PURE__*/React.createElement("tbody", null, D.runs.map(r => /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      "aria-selected": r.id === D.protocol.run,
      onClick: () => r.id === D.protocol.run ? go('overview') : null
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        color: r.id === D.protocol.run ? 'var(--text-accent)' : 'var(--text-primary)',
        fontWeight: 500
      }
    }, r.id), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        fontSize: 'var(--text-2xs)'
      }
    }, r.protocol), /*#__PURE__*/React.createElement("td", {
      className: "muted mono",
      style: {
        fontSize: 'var(--text-2xs)'
      }
    }, r.started), /*#__PURE__*/React.createElement("td", {
      className: "num muted"
    }, r.duration), /*#__PURE__*/React.createElement("td", null, r.stage), /*#__PURE__*/React.createElement("td", null, r.state === 'active' ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "spinner",
      style: {
        width: 12,
        height: 12
      }
    }), /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      size: "sm"
    }, "Running")) : /*#__PURE__*/React.createElement(StatusBadge, {
      status: r.state
    })), /*#__PURE__*/React.createElement("td", {
      className: "muted mono",
      style: {
        fontSize: 'var(--text-2xs)'
      }
    }, r.by)))))));
  }
  window.ScreensA = {
    Overview,
    Protocols,
    Runs
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-overview.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-ranking.jsx
try { (() => {
// Ranking screen (explainable matrix) -> window.ScreensE
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge
  } = DS;
  const Icon = window.Icon;
  const {
    ScreenHead,
    Panel,
    Note,
    StatusBadge
  } = window.UI;
  const D = window.ORCH;
  const DIM_SHORT = {
    'Protocol match': 'Protocol\nmatch',
    'Trial investigator experience': 'Trial\nexperience',
    'Publication relevance': 'Publication\nrelevance',
    'Institution / site relevance': 'Institution /\nsite',
    'Guideline / congress influence': 'Guideline /\ncongress',
    'Recency': 'Recency'
  };
  const DIM_TONE = {
    'Protocol match': 'var(--accent)',
    'Trial investigator experience': 'var(--safe)',
    'Publication relevance': 'var(--evidence)',
    'Institution / site relevance': 'var(--slate-400)',
    'Guideline / congress influence': 'var(--evidence)',
    'Recency': 'var(--compliance)'
  };
  function Cell({
    value,
    max,
    tone
  }) {
    const pct = Math.round(value / max * 100);
    return /*#__PURE__*/React.createElement("span", {
      className: "cell-score"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bar"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct + '%',
        background: tone
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, value.toFixed(1), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)'
      }
    }, "/ ", max)));
  }
  function Ranking({
    openKol
  }) {
    const ranked = D.candidates.filter(c => c.breakdown && c.breakdown.length);
    const dims = D.rankingDimensions;
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Stage 06 \xB7 Ranked",
      title: "Ranking",
      desc: "Each expert's overall score is the weighted sum of six explainable dimensions. The matrix shows every component so a reviewer can see exactly why a candidate ranks where it does.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "sliders",
          size: 14
        })
      }, "Adjust weights"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "download",
          size: 14
        })
      }, "Export ranking"))
    }), /*#__PURE__*/React.createElement(Note, {
      tone: "info",
      icon: "shield"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)'
      }
    }, "Ranking weights scientific relevance only. ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-primary)'
      }
    }, "Prescribing volume, promotional value, and sales potential are excluded by policy"), " and are never inputs to this score.")), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Methodology",
      title: "Scoring dimensions & weights",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 12
      }
    }, dims.map(d => /*#__PURE__*/React.createElement("div", {
      key: d.key
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        lineHeight: 1.25,
        minHeight: 34
      }
    }, d.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 6,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xl)',
        fontWeight: 500,
        color: DIM_TONE[d.label]
      }
    }, Math.round(d.weight * 100)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, "% weight")), /*#__PURE__*/React.createElement("div", {
      className: "cell-score",
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "bar"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: d.weight * 100 / 0.25 * 100 / 100 + '%',
        background: DIM_TONE[d.label]
      }
    }))))))), /*#__PURE__*/React.createElement(Panel, {
      noBody: true,
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "matrix"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        position: 'sticky',
        left: 0,
        zIndex: 2
      },
      className: "matrix__dim"
    }, "Expert"), dims.map(d => /*#__PURE__*/React.createElement("th", {
      key: d.key,
      style: {
        minWidth: 92,
        whiteSpace: 'pre-line'
      }
    }, DIM_SHORT[d.label] || d.label, /*#__PURE__*/React.createElement("span", {
      className: "wt"
    }, "\xD7", d.weight.toFixed(2)))), /*#__PURE__*/React.createElement("th", null, "Flags"), /*#__PURE__*/React.createElement("th", {
      className: "num",
      style: {
        textAlign: 'right'
      }
    }, "Weighted", /*#__PURE__*/React.createElement("br", null), "score"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, ranked.map(c => /*#__PURE__*/React.createElement("tr", {
      key: c.id,
      style: {
        cursor: 'pointer'
      },
      onClick: () => openKol(c.id)
    }, /*#__PURE__*/React.createElement("td", {
      className: "matrix__dim",
      style: {
        position: 'sticky',
        left: 0,
        zIndex: 1,
        minWidth: 188
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        width: 16
      }
    }, c.rank), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500,
        fontSize: 'var(--text-sm)',
        whiteSpace: 'nowrap'
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, c.specialty, " \xB7 ", c.geo.split(' · ')[0])))), dims.map(d => {
      const b = c.breakdown.find(x => x.label === d.label);
      return /*#__PURE__*/React.createElement("td", {
        key: d.key
      }, b ? /*#__PURE__*/React.createElement(Cell, {
        value: b.value,
        max: b.max,
        tone: DIM_TONE[d.label]
      }) : /*#__PURE__*/React.createElement("span", {
        className: "muted"
      }, "\u2014"));
    }), /*#__PURE__*/React.createElement("td", null, c.flags > 0 ? /*#__PURE__*/React.createElement(Badge, {
      tone: "risk",
      size: "sm",
      dot: true
    }, c.flags) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, "0")), /*#__PURE__*/React.createElement("td", {
      className: "num",
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "total",
      style: {
        color: c.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)'
      }
    }, c.score)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 14,
      color: "var(--text-tertiary)"
    })))))))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Top rationale",
      title: "Why Dr. Elena Marchetti ranks #1",
      style: {
        marginTop: 16
      },
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        iconRight: /*#__PURE__*/React.createElement(Icon, {
          name: "chevron",
          size: 13
        }),
        onClick: () => openKol('marchetti')
      }, "Open profile")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12
      }
    }, [{
      dim: 'Trial investigator experience',
      note: 'Coordinating PI across 14 EU sites for the pivotal Phase 3 prefusion-F efficacy cohort.',
      n: 2,
      tone: 'safe'
    }, {
      dim: 'Publication relevance',
      note: 'First-author NEJM efficacy paper on the protocol\'s primary LRTD endpoint in adults ≥60.',
      n: 2,
      tone: 'evidence'
    }, {
      dim: 'Protocol match',
      note: 'Direct overlap on intervention class, endpoint definition, and target population.',
      n: 3,
      tone: 'accent'
    }].map(r => /*#__PURE__*/React.createElement("div", {
      key: r.dim,
      style: {
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "ds-eyebrow",
      style: {
        fontSize: 9
      }
    }, r.dim), /*#__PURE__*/React.createElement(Badge, {
      tone: "evidence",
      size: "sm"
    }, r.n, " cited")), /*#__PURE__*/React.createElement("div", {
      className: "doc",
      style: {
        fontSize: 'var(--text-sm)'
      }
    }, r.note))))));
  }
  window.ScreensE = {
    Ranking
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-ranking.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-summary.jsx
try { (() => {
// Summary / Export screen -> window.ScreensH
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge,
    Avatar
  } = DS;
  const Icon = window.Icon;
  const {
    ScreenHead,
    Panel,
    Note,
    StatusBadge
  } = window.UI;
  const D = window.ORCH;
  const FMT_TONE = {
    PDF: {
      bg: 'var(--risk-tint)',
      c: 'var(--risk-ink)'
    },
    CSV: {
      bg: 'var(--safe-tint)',
      c: 'var(--safe-ink)'
    },
    JSON: {
      bg: 'var(--evidence-tint)',
      c: 'var(--evidence-ink)'
    },
    PKT: {
      bg: 'var(--accent-tint)',
      c: 'var(--teal-700)'
    }
  };
  function Summary({
    openKol
  }) {
    const P = D.protocol;
    const top = D.topKols.map(id => D.candidates.find(c => c.id === id));
    return /*#__PURE__*/React.createElement("div", {
      className: "page page--wide"
    }, /*#__PURE__*/React.createElement(ScreenHead, {
      eyebrow: "Stage 09 \xB7 Ready for review",
      title: "Processing summary",
      desc: "The complete, evidence-backed output of this run \u2014 ready to export or route for Medical Affairs approval. Every figure below traces to a source artifact in the index.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "flag",
          size: 14
        })
      }, "Request changes"), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "sm",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 14
        })
      }, "Approve summary"))
    }), /*#__PURE__*/React.createElement("div", {
      className: "cols",
      style: {
        gridTemplateColumns: '1fr 360px',
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Protocol brief",
      title: P.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "doc",
      style: {
        fontSize: 'var(--text-md)',
        marginBottom: 14
      }
    }, P.title), /*#__PURE__*/React.createElement("dl", {
      className: "kv"
    }, /*#__PURE__*/React.createElement("dt", null, "Sponsor"), /*#__PURE__*/React.createElement("dd", null, P.sponsor), /*#__PURE__*/React.createElement("dt", null, "Phase"), /*#__PURE__*/React.createElement("dd", null, "Phase ", P.phase), /*#__PURE__*/React.createElement("dt", null, "Indication"), /*#__PURE__*/React.createElement("dd", null, P.indication), /*#__PURE__*/React.createElement("dt", null, "Intervention"), /*#__PURE__*/React.createElement("dd", null, P.intervention), /*#__PURE__*/React.createElement("dt", null, "Population"), /*#__PURE__*/React.createElement("dd", null, P.population), /*#__PURE__*/React.createElement("dt", null, "Geography"), /*#__PURE__*/React.createElement("dd", null, P.geographies.join(' · ')), /*#__PURE__*/React.createElement("dt", null, "Specialties"), /*#__PURE__*/React.createElement("dd", null, P.specialties.join(' · ')))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Top ranked",
      title: "Evidence-backed expert recommendations",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        iconRight: /*#__PURE__*/React.createElement(Icon, {
          name: "chevron",
          size: 13
        })
      }, "All 64"),
      noBody: true
    }, /*#__PURE__*/React.createElement("div", null, top.map((c, i) => /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => openKol(c.id),
      style: {
        display: 'flex',
        gap: 13,
        width: '100%',
        textAlign: 'left',
        font: 'inherit',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        padding: 16,
        borderTop: i ? '1px solid var(--border-subtle)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-lg)',
        color: 'var(--text-tertiary)',
        fontWeight: 500,
        flex: 'none',
        width: 22
      }
    }, c.rank), /*#__PURE__*/React.createElement(Avatar, {
      name: c.name,
      size: 38,
      tone: "auto"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 'var(--text-md)'
      }
    }, c.name), /*#__PURE__*/React.createElement(StatusBadge, {
      status: c.status
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        marginTop: 3
      }
    }, c.institution, " \xB7 ", c.specialty, " \xB7 ", c.geo), /*#__PURE__*/React.createElement("p", {
      className: "doc",
      style: {
        fontSize: 'var(--text-sm)',
        marginTop: 7
      }
    }, c.rationale), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 7
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "evidence",
      size: "sm",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "link",
        size: 11
      })
    }, c.sources, " supporting sources"))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 500,
        color: c.score >= 85 ? 'var(--safe-ink)' : 'var(--text-primary)',
        flex: 'none'
      }
    }, c.score))))), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Quality",
      title: "Missing data & warnings",
      actions: /*#__PURE__*/React.createElement(Badge, {
        tone: "compliance",
        size: "sm",
        dot: true
      }, D.warnings.length)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, D.warnings.map((w, i) => /*#__PURE__*/React.createElement(Note, {
      key: i,
      tone: w.tone,
      icon: w.tone === 'risk' ? 'flag' : 'alert'
    }, w.text))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Run status",
      title: "Processing complete"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 11
      }
    }, [['KOLs found', '64', 'safe'], ['Shortlisted', '18', 'accent'], ['Evidence sources', '148', 'evidence'], ['Open compliance flags', '2', 'risk'], ['Moss index', '97%', 'compliance']].map(([l, v, t]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)'
      }
    }, l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-md)',
        fontWeight: 500,
        color: `var(--${t === 'accent' ? 'text-accent' : t + '-ink'})`
      }
    }, v)))), /*#__PURE__*/React.createElement(Note, {
      tone: "compliance",
      icon: "shield"
    }, "Summary can be exported now. Final approval is blocked until the 2 open compliance flags are cleared.")), /*#__PURE__*/React.createElement(Panel, {
      eyebrow: "Export",
      title: "Download & share"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, D.exports.map(e => {
      const t = FMT_TONE[e.fmt];
      return /*#__PURE__*/React.createElement("button", {
        key: e.fmt,
        className: "expcard"
      }, /*#__PURE__*/React.createElement("span", {
        className: "expcard__fmt",
        style: {
          background: t.bg,
          color: t.c
        }
      }, e.fmt), /*#__PURE__*/React.createElement("span", {
        style: {
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          fontWeight: 600,
          fontSize: 'var(--text-sm)'
        }
      }, e.label), /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-tertiary)',
          marginTop: 3,
          lineHeight: 1.4
        }
      }, e.desc)), /*#__PURE__*/React.createElement(Icon, {
        name: "download",
        size: 15,
        color: "var(--text-tertiary)",
        style: {
          flex: 'none',
          marginTop: 2
        }
      }));
    }))))));
  }
  window.ScreensH = {
    Summary
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-summary.jsx", error: String((e && e.message) || e) }); }

// dashboard/screen-upload.jsx
try { (() => {
// Upload protocol modal (drag & drop) -> window.UploadModal
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Button,
    Badge
  } = DS;
  const Icon = window.Icon;
  const {
    Note
  } = window.UI;
  const D = window.ORCH;
  const ACCEPT = ['pdf', 'docx', 'doc'];
  const MAX_MB = 50;

  // sample protocol the user can drop or pick
  const SAMPLE = {
    name: 'RSV-PreF-301_Protocol_Amendment-4.pdf',
    sizeMB: 4.2,
    ext: 'pdf'
  };
  const PARSE_STEPS = [{
    lab: 'Parsing document structure',
    ct: '312 chunks'
  }, {
    lab: 'Extracting protocol brief',
    ct: '12 sections'
  }, {
    lab: 'Detecting endpoints & population',
    ct: '2 endpoints'
  }, {
    lab: 'Classifying specialties & themes',
    ct: '4 specialties'
  }];
  function fmtSize(mb) {
    return mb >= 1 ? mb.toFixed(1) + ' MB' : Math.round(mb * 1024) + ' KB';
  }

  // phase: idle | invalid | uploading | parsing | ready
  function UploadModal({
    initialDrag,
    initialFile,
    onClose,
    onComplete
  }) {
    const [phase, setPhase] = React.useState('idle');
    const [drag, setDrag] = React.useState(!!initialDrag);
    const [file, setFile] = React.useState(null);
    const [err, setErr] = React.useState('');
    const [progress, setProgress] = React.useState(0);
    const [stepIdx, setStepIdx] = React.useState(0);
    const inputRef = React.useRef(null);
    const timers = React.useRef([]);
    const push = t => {
      timers.current.push(t);
      return t;
    };
    React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

    // a file handed in from the drag-anywhere veil auto-starts
    React.useEffect(() => {
      if (initialFile) accept(initialFile); /* eslint-disable-next-line */
    }, []);

    // ESC closes
    React.useEffect(() => {
      const h = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', h);
      return () => window.removeEventListener('keydown', h);
    }, [onClose]);
    function accept(f) {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      if (!ACCEPT.includes(ext)) {
        setErr(`"${f.name}" isn't a supported format. Upload a PDF or Word protocol.`);
        setPhase('invalid');
        return;
      }
      if (f.sizeMB > MAX_MB) {
        setErr(`"${f.name}" is ${fmtSize(f.sizeMB)} — over the ${MAX_MB} MB limit.`);
        setPhase('invalid');
        return;
      }
      setErr('');
      setFile({
        name: f.name,
        sizeMB: f.sizeMB,
        ext
      });
      startUpload();
    }
    function startUpload() {
      setPhase('uploading');
      setProgress(0);
      let p = 0;
      const tick = () => {
        p += Math.random() * 18 + 8;
        if (p >= 100) {
          setProgress(100);
          push(setTimeout(startParse, 360));
        } else {
          setProgress(Math.round(p));
          push(setTimeout(tick, 180));
        }
      };
      push(setTimeout(tick, 200));
    }
    function startParse() {
      setPhase('parsing');
      setStepIdx(0);
      const advance = i => {
        if (i >= PARSE_STEPS.length) {
          push(setTimeout(() => setPhase('ready'), 450));
          return;
        }
        setStepIdx(i);
        push(setTimeout(() => advance(i + 1), 720));
      };
      advance(0);
    }

    // drag handlers
    function onDrop(e) {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) accept({
        name: f.name,
        sizeMB: f.size / (1024 * 1024)
      });else accept(SAMPLE); // demo fallback
    }
    function onPick(e) {
      const f = e.target.files && e.target.files[0];
      if (f) accept({
        name: f.name,
        sizeMB: f.size / (1024 * 1024)
      });
    }
    const P = D.protocol;
    return /*#__PURE__*/React.createElement("div", {
      className: "umodal-scrim",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "umodal",
      role: "dialog",
      "aria-label": "Upload protocol",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      className: "umodal__head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "umi"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 17
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("h2", null, "Upload protocol"), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, phase === 'ready' ? 'Parsed · ready to start run' : phase === 'parsing' ? 'Extracting protocol intelligence…' : phase === 'uploading' ? 'Uploading…' : 'Phase 3 clinical protocol · PDF or DOCX')), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      onClick: onClose,
      title: "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "umodal__body"
    }, (phase === 'idle' || phase === 'invalid') && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: 'dropzone' + (drag ? ' is-drag' : '') + (phase === 'invalid' ? ' is-error' : ''),
      onClick: () => inputRef.current && inputRef.current.click(),
      onDragOver: e => {
        e.preventDefault();
        setDrag(true);
      },
      onDragEnter: e => {
        e.preventDefault();
        setDrag(true);
      },
      onDragLeave: e => {
        e.preventDefault();
        setDrag(false);
      },
      onDrop: onDrop
    }, /*#__PURE__*/React.createElement("span", {
      className: "dropzone__ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: phase === 'invalid' ? 'alert' : 'upload',
      size: 22,
      color: phase === 'invalid' ? 'var(--risk)' : 'var(--accent)'
    })), /*#__PURE__*/React.createElement("h3", null, drag ? 'Drop to begin parsing' : /*#__PURE__*/React.createElement(React.Fragment, null, "Drag & drop, or ", /*#__PURE__*/React.createElement("b", null, "browse"))), /*#__PURE__*/React.createElement("p", null, "Parsing starts on upload \u2014 no templates or manual tagging."), /*#__PURE__*/React.createElement("div", {
      className: "formats"
    }, "PDF \xB7 DOCX \xB7 max ", MAX_MB, " MB \xB7 single file"), /*#__PURE__*/React.createElement("input", {
      ref: inputRef,
      type: "file",
      accept: ".pdf,.doc,.docx",
      hidden: true,
      onChange: onPick
    })), phase === 'invalid' && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Note, {
      tone: "risk",
      icon: "alert"
    }, err)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '16px 0 6px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        height: 1,
        flex: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '.1em'
      }
    }, "or"), /*#__PURE__*/React.createElement("span", {
      style: {
        height: 1,
        flex: 1,
        background: 'var(--border-subtle)'
      }
    })), /*#__PURE__*/React.createElement("button", {
      className: "rowlink",
      onClick: () => accept(SAMPLE)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "file",
      size: 15,
      color: "var(--evidence)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontWeight: 500
      }
    }, "Use sample protocol"), /*#__PURE__*/React.createElement("span", {
      className: "muted",
      style: {
        fontSize: 'var(--text-2xs)',
        fontFamily: 'var(--font-mono)'
      }
    }, SAMPLE.name, " \xB7 ", fmtSize(SAMPLE.sizeMB))), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 14,
      color: "var(--text-tertiary)"
    }))), phase === 'uploading' && file && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "ufile"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ufile__ic"
    }, file.ext.toUpperCase().slice(0, 3)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ufile__nm"
    }, file.name), /*#__PURE__*/React.createElement("div", {
      className: "ufile__meta"
    }, fmtSize(file.sizeMB), " \xB7 uploading ", progress, "%")), /*#__PURE__*/React.createElement("span", {
      className: "spinner"
    })), /*#__PURE__*/React.createElement("div", {
      className: "uprog"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: progress + '%'
      }
    }))), phase === 'parsing' && file && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "ufile"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ufile__ic"
    }, file.ext.toUpperCase().slice(0, 3)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ufile__nm"
    }, file.name), /*#__PURE__*/React.createElement("div", {
      className: "ufile__meta"
    }, fmtSize(file.sizeMB), " \xB7 uploaded")), /*#__PURE__*/React.createElement(Badge, {
      tone: "safe",
      size: "sm",
      dot: true
    }, "Uploaded")), /*#__PURE__*/React.createElement("div", {
      className: "usteps"
    }, PARSE_STEPS.map((s, i) => {
      const state = i < stepIdx ? 'done' : i === stepIdx ? 'active' : 'pending';
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: 'ustep ustep--' + state
      }, /*#__PURE__*/React.createElement("span", {
        className: "ustep__dot"
      }, state === 'done' ? /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 12,
        color: "#fff"
      }) : state === 'active' ? /*#__PURE__*/React.createElement("span", {
        className: "spinner",
        style: {
          width: 16,
          height: 16,
          borderWidth: 2
        }
      }) : null), /*#__PURE__*/React.createElement("span", {
        className: "ustep__lab"
      }, s.lab), state === 'done' ? /*#__PURE__*/React.createElement("span", {
        className: "ustep__ct"
      }, s.ct) : null);
    }))), phase === 'ready' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Note, {
      tone: "safe",
      icon: "check"
    }, "Protocol parsed into 312 chunks. Brief extracted with 12 sections \u2014 review confidence on the next screen."), /*#__PURE__*/React.createElement("div", {
      className: "uprev"
    }, /*#__PURE__*/React.createElement("div", {
      className: "full"
    }, /*#__PURE__*/React.createElement("dt", null, "Study title"), /*#__PURE__*/React.createElement("dd", null, P.title)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Sponsor"), /*#__PURE__*/React.createElement("dd", null, P.sponsor)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Phase"), /*#__PURE__*/React.createElement("dd", null, "Phase ", P.phase)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Indication"), /*#__PURE__*/React.createElement("dd", null, "RSV \u2014 LRTD")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Population"), /*#__PURE__*/React.createElement("dd", null, "Adults aged \u226560")), /*#__PURE__*/React.createElement("div", {
      className: "full"
    }, /*#__PURE__*/React.createElement("dt", null, "Geography"), /*#__PURE__*/React.createElement("dd", null, P.geographies.join(' · ')))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Note, {
      tone: "compliance",
      icon: "alert"
    }, "2 fields parsed below 80% confidence (modality, specialties). Flagged for review in the protocol brief.")))), /*#__PURE__*/React.createElement("div", {
      className: "umodal__foot"
    }, phase === 'ready' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "shield",
      size: 14,
      color: "var(--text-tertiary)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)'
      }
    }, "Indexed to Moss on run start \xB7 audit-logged"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        marginLeft: 'auto'
      },
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "play",
        size: 13
      }),
      onClick: () => onComplete && onComplete()
    }, "Start processing run")) : phase === 'uploading' || phase === 'parsing' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)'
      }
    }, phase === 'uploading' ? 'Transferring…' : 'Working…'), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        marginLeft: 'auto'
      },
      onClick: onClose
    }, "Cancel")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "shield",
      size: 14,
      color: "var(--text-tertiary)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-tertiary)'
      }
    }, "Non-promotional \xB7 protocol stays within your workspace"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        marginLeft: 'auto'
      },
      onClick: onClose
    }, "Cancel")))));
  }
  window.UploadModal = UploadModal;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/screen-upload.jsx", error: String((e && e.message) || e) }); }

// dashboard/shared.jsx
try { (() => {
// Shared dashboard UI -> window.UI
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    Badge
  } = DS;
  const Icon = window.Icon;

  // ---- screen header ----
  function ScreenHead({
    eyebrow,
    title,
    desc,
    actions
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "shead"
    }, /*#__PURE__*/React.createElement("div", null, eyebrow ? /*#__PURE__*/React.createElement("div", {
      className: "shead__ey"
    }, eyebrow) : null, /*#__PURE__*/React.createElement("h1", null, title), desc ? /*#__PURE__*/React.createElement("p", null, desc) : null), actions ? /*#__PURE__*/React.createElement("div", {
      className: "shead__actions"
    }, actions) : null);
  }

  // ---- panel ----
  function Panel({
    eyebrow,
    title,
    actions,
    children,
    bodyStyle,
    noBody
  }) {
    return /*#__PURE__*/React.createElement("section", {
      className: "panel"
    }, title || actions ? /*#__PURE__*/React.createElement("div", {
      className: "panel__head"
    }, /*#__PURE__*/React.createElement("div", null, eyebrow ? /*#__PURE__*/React.createElement("div", {
      className: "panel__eyebrow"
    }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("div", {
      className: "panel__title"
    }, title) : null), actions ? /*#__PURE__*/React.createElement("div", {
      className: "panel__actions"
    }, actions) : null) : null, noBody ? children : /*#__PURE__*/React.createElement("div", {
      className: "panel__body",
      style: bodyStyle
    }, children));
  }

  // ---- confidence chip ----
  function Confidence({
    value
  }) {
    const cls = value >= 90 ? 'conf--hi' : value >= 78 ? 'conf--mid' : 'conf--lo';
    return /*#__PURE__*/React.createElement("span", {
      className: `conf ${cls}`,
      title: `Extraction confidence ${value}%`
    }, /*#__PURE__*/React.createElement("span", {
      className: "conf__track"
    }, /*#__PURE__*/React.createElement("span", {
      className: "conf__fill",
      style: {
        width: value + '%'
      }
    })), value, "%");
  }

  // ---- chunk ref ----
  function Chunk({
    children,
    onClick
  }) {
    return /*#__PURE__*/React.createElement("button", {
      className: "chunk",
      onClick: onClick
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "file",
      size: 10
    }), " ", children);
  }

  // ---- mini bar ----
  function MiniBar({
    value,
    max = 100,
    tone = 'var(--evidence)'
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: "mbar"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mbar__track"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mbar__fill",
      style: {
        width: value / max * 100 + '%',
        background: tone
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "mbar__v"
    }, value));
  }

  // ---- note / callout ----
  function Note({
    tone = 'info',
    icon = 'alert',
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: `note note--${tone}`
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 16
    }), /*#__PURE__*/React.createElement("div", null, children));
  }

  // ---- empty / loading / error ----
  function State({
    kind = 'empty',
    icon = 'inbox',
    title,
    children,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "estate"
    }, kind === 'loading' ? /*#__PURE__*/React.createElement("div", {
      className: "spinner"
    }) : /*#__PURE__*/React.createElement("div", {
      className: "estate__ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 22
    })), title ? /*#__PURE__*/React.createElement("h3", null, title) : null, children ? /*#__PURE__*/React.createElement("p", null, children) : null, action || null);
  }

  // ---- status -> badge tone ----
  const STATUS = {
    validated: {
      tone: 'safe',
      label: 'Validated',
      dot: true
    },
    review: {
      tone: 'compliance',
      label: 'Review',
      dot: true
    },
    conflict: {
      tone: 'risk',
      label: 'Conflict',
      dot: true
    },
    approved: {
      tone: 'safe',
      label: 'Approved',
      dot: true
    },
    edited: {
      tone: 'evidence',
      label: 'Edited',
      dot: true
    },
    disabled: {
      tone: 'neutral',
      label: 'Disabled',
      dot: false
    },
    regenerating: {
      tone: 'accent',
      label: 'Regenerating',
      dot: true
    },
    done: {
      tone: 'safe',
      label: 'Done',
      dot: true
    },
    warn: {
      tone: 'compliance',
      label: 'Warning',
      dot: true
    },
    active: {
      tone: 'accent',
      label: 'Running',
      dot: true
    },
    error: {
      tone: 'risk',
      label: 'Error',
      dot: true
    },
    open: {
      tone: 'risk',
      label: 'Open',
      dot: true
    },
    resolved: {
      tone: 'safe',
      label: 'Resolved',
      dot: true
    },
    pending: {
      tone: 'neutral',
      label: 'Pending',
      dot: false
    }
  };
  function StatusBadge({
    status,
    label,
    size = 'sm'
  }) {
    const s = STATUS[status] || STATUS.pending;
    return /*#__PURE__*/React.createElement(Badge, {
      tone: s.tone,
      size: size,
      dot: s.dot
    }, label || s.label);
  }

  // ---- section label inside drawers/panels ----
  function SecLabel({
    icon,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "drawer__sectitle"
    }, icon ? /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 12
    }) : null, children);
  }
  window.UI = {
    ScreenHead,
    Panel,
    Confidence,
    Chunk,
    MiniBar,
    Note,
    State,
    StatusBadge,
    SecLabel,
    STATUS
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/shared.jsx", error: String((e && e.message) || e) }); }

// dashboard/voice-panel.jsx
try { (() => {
// Live voice agent panel (scoped to selected protocol) -> window.VoicePanel
(function () {
  const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
  const {
    VoiceControl,
    Badge
  } = DS;
  const Icon = window.Icon;
  const D = window.ORCH;

  // render an answer string with [n] tokens as evidence citations
  function Answer({
    text
  }) {
    const parts = String(text).split(/(\[\d+\])/g);
    return /*#__PURE__*/React.createElement("p", {
      className: "qa__doc"
    }, parts.map((p, i) => {
      const m = /^\[(\d+)\]$/.exec(p);
      return m ? /*#__PURE__*/React.createElement("sup", {
        key: i,
        className: "cite",
        title: "Traced to source evidence"
      }, "[", m[1], "]") : /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, p);
    }));
  }
  function fmt(s) {
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function VoicePanel({
    currentId,
    onClose
  }) {
    const cfg = D.voice[currentId] || {
      suggestions: [],
      qa: []
    };
    const det = D.protocolDetails[currentId];
    const seed = cfg.qa[0] ? [{
      role: 'you',
      text: cfg.qa[0].q
    }, {
      role: 'ai',
      text: cfg.qa[0].a,
      chips: cfg.qa[0].chips
    }] : [];
    const [msgs, setMsgs] = React.useState(seed);
    const [vstate, setVstate] = React.useState('idle'); // idle | listening | thinking
    const [elapsed, setElapsed] = React.useState(12);
    const [pending, setPending] = React.useState(null); // question being processed
    const convoRef = React.useRef(null);
    const timers = React.useRef([]);
    const push = t => {
      timers.current.push(t);
      return t;
    };

    // reset when protocol changes
    React.useEffect(() => {
      const s = cfg.qa[0] ? [{
        role: 'you',
        text: cfg.qa[0].q
      }, {
        role: 'ai',
        text: cfg.qa[0].a,
        chips: cfg.qa[0].chips
      }] : [];
      setMsgs(s);
      setVstate('idle');
      setPending(null);
      // eslint-disable-next-line
    }, [currentId]);

    // elapsed timer + cleanup
    React.useEffect(() => {
      const id = setInterval(() => setElapsed(e => e + 1), 1000);
      const onKey = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKey);
      return () => {
        clearInterval(id);
        window.removeEventListener('keydown', onKey);
        timers.current.forEach(clearTimeout);
      };
    }, [onClose]);

    // autoscroll
    React.useEffect(() => {
      if (convoRef.current) convoRef.current.scrollTop = convoRef.current.scrollHeight;
    }, [msgs, pending]);
    function ask(q) {
      if (vstate !== 'idle') return;
      const hit = cfg.qa.find(x => x.q === q) || {
        a: `I can answer from whatever has been indexed for ${det.id} so far — try one of the suggested questions.`,
        chips: [{
          label: 'Grounded in indexed data',
          tone: 'evidence'
        }]
      };
      setMsgs(m => [...m, {
        role: 'you',
        text: q
      }]);
      setPending(q);
      setVstate('listening');
      push(setTimeout(() => setVstate('thinking'), 950));
      push(setTimeout(() => {
        setMsgs(m => [...m, {
          role: 'ai',
          text: hit.a,
          chips: hit.chips
        }]);
        setPending(null);
        setVstate('idle');
      }, 2100));
    }
    const transcript = pending || cfg.suggestions[0] || '';
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("aside", {
      className: "voicepanel",
      role: "dialog",
      "aria-label": `Voice copilot — ${det.id}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "voicepanel__head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "voicepanel__mark"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../assets/logo-mark.svg",
      alt: "",
      width: "22",
      height: "22"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("h2", null, "Voice copilot"), /*#__PURE__*/React.createElement("div", {
      className: "voicepanel__scope"
    }, "Asking about ", /*#__PURE__*/React.createElement("b", null, det.id), " \xB7 grounded in indexed data")), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      onClick: onClose,
      title: "Close"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "voicepanel__control"
    }, /*#__PURE__*/React.createElement(VoiceControl, {
      state: vstate,
      elapsed: fmt(elapsed),
      transcript: vstate === 'idle' ? '' : transcript,
      onToggle: () => setVstate(s => s === 'idle' ? 'listening' : 'idle')
    })), /*#__PURE__*/React.createElement("div", {
      className: "voicepanel__convo ds-scroll",
      ref: convoRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "qa"
    }, msgs.map((m, i) => m.role === 'you' ? /*#__PURE__*/React.createElement("div", {
      className: "qa__q",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "qa__role"
    }, "You"), /*#__PURE__*/React.createElement("p", null, m.text)) : /*#__PURE__*/React.createElement("div", {
      className: "qa__a",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "qa__role qa__role--ai"
    }, /*#__PURE__*/React.createElement("span", {
      className: "qa__avatar"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../assets/logo-mark.svg",
      alt: "",
      width: "20",
      height: "20"
    })), "KOL Copilot"), /*#__PURE__*/React.createElement(Answer, {
      text: m.text
    }), m.chips && m.chips.length ? /*#__PURE__*/React.createElement("div", {
      className: "qa__foot"
    }, m.chips.map((c, j) => /*#__PURE__*/React.createElement("span", {
      key: j,
      className: 'qa__chip' + (c.tone === 'safe' ? ' qa__chip--safe' : c.tone === 'risk' ? ' qa__chip--risk' : '')
    }, c.label)), /*#__PURE__*/React.createElement("span", {
      className: "qa__guard"
    }, "Checked against Medical Affairs guardrails")) : null)), pending ? /*#__PURE__*/React.createElement("div", {
      className: "qa__a qa__a--typing"
    }, /*#__PURE__*/React.createElement("span", {
      className: "qa__role qa__role--ai"
    }, /*#__PURE__*/React.createElement("span", {
      className: "qa__avatar"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../assets/logo-mark.svg",
      alt: "",
      width: "20",
      height: "20"
    })), "KOL Copilot"), /*#__PURE__*/React.createElement("span", {
      className: "vtyping"
    }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null))) : null)), /*#__PURE__*/React.createElement("div", {
      className: "voicepanel__foot"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vsuggest"
    }, cfg.suggestions.map(s => /*#__PURE__*/React.createElement("button", {
      key: s,
      className: "vchip",
      disabled: vstate !== 'idle',
      onClick: () => ask(s)
    }, s))), /*#__PURE__*/React.createElement("div", {
      className: "vinput"
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: `Ask about ${det.id}…`,
      disabled: true
    }), /*#__PURE__*/React.createElement("button", {
      className: "vinput__mic",
      "aria-label": "Hold to talk",
      onClick: () => setVstate(s => s === 'idle' ? 'listening' : 'idle')
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "2",
      width: "6",
      height: "12",
      rx: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"
    })))))));
  }
  window.VoicePanel = VoicePanel;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dashboard/voice-panel.jsx", error: String((e && e.message) || e) }); }

// landing/showcase.jsx
try { (() => {
/* Live product fragments used as the landing page's "imagery".
   These are the actual design-system components, not screenshots. */
const DS = window.MedicalAffairsCopilotDesignSystem_2d0005;
const {
  KolCard,
  VoiceControl,
  CompliancePanel,
  Badge,
  Avatar
} = DS;

/* ---- Hero cockpit fragment ---------------------------------------------- */
function HeroCockpit() {
  const [listening, setListening] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    className: "device"
  }, /*#__PURE__*/React.createElement("div", {
    className: "device__bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "device__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "device__title"
  }, "RSV-PreF-301", /*#__PURE__*/React.createElement("span", {
    className: "device__sub"
  }, " \xB7 Phase 3 \xB7 adults \u226560")), /*#__PURE__*/React.createElement(Badge, {
    tone: "evidence",
    size: "sm",
    dot: true
  }, "Indexed")), /*#__PURE__*/React.createElement("div", {
    className: "device__body"
  }, /*#__PURE__*/React.createElement(VoiceControl, {
    state: listening ? 'listening' : 'idle',
    elapsed: "0:12",
    transcript: "Find infectious-disease KOLs for this protocol",
    onToggle: () => setListening(v => !v)
  }), /*#__PURE__*/React.createElement(KolCard, {
    rank: 1,
    name: "Dr. Elena Marchetti",
    institution: "Karolinska Institutet",
    specialty: "Vaccinology",
    geography: "EU \xB7 Sweden",
    score: 92.4,
    status: "validated",
    citations: 37,
    breakdown: [{
      label: 'Trial',
      value: 30
    }, {
      label: 'Pubs',
      value: 24
    }, {
      label: 'Guidelines',
      value: 18
    }, {
      label: 'Recency',
      value: 12
    }],
    rationale: "Led Phase 3 prefusion-F efficacy work directly relevant to the protocol's primary endpoint.",
    selected: true
  }), /*#__PURE__*/React.createElement(CompliancePanel, {
    mode: "Medical Affairs",
    items: [{
      label: 'Citation-required recommendations'
    }, {
      label: 'No prescribing-volume targeting'
    }],
    auditAvailable: true
  })));
}

/* ---- Voice Q&A fragment -------------------------------------------------- */
function Cite({
  n
}) {
  return /*#__PURE__*/React.createElement("sup", {
    className: "cite",
    title: "Traced to source evidence"
  }, "[", n, "]");
}
function VoiceCopilot() {
  const [state, setState] = React.useState('listening');
  // gentle cycle: listening -> thinking -> idle -> listening
  React.useEffect(() => {
    const order = ['listening', 'thinking', 'idle'];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % order.length;
      setState(order[i]);
    }, 2600);
    return () => clearInterval(id);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "voice"
  }, /*#__PURE__*/React.createElement(VoiceControl, {
    state: state,
    elapsed: "0:41",
    transcript: "Why is Dr. Chen ranked above Dr. Patel?",
    onToggle: () => setState(s => s === 'idle' ? 'listening' : 'idle')
  }), /*#__PURE__*/React.createElement("div", {
    className: "qa"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qa__q"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__role"
  }, "You"), /*#__PURE__*/React.createElement("p", null, "Why is Dr. Chen ranked above Dr. Patel?")), /*#__PURE__*/React.createElement("div", {
    className: "qa__a"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__role qa__role--ai"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__avatar"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-mark.svg",
    alt: "",
    width: "20",
    height: "20"
  })), "KOL Copilot"), /*#__PURE__*/React.createElement("p", null, "Dr. Chen contributed direct Phase 3 trial experience on the protocol's primary endpoint", /*#__PURE__*/React.createElement(Cite, {
    n: 1
  }), " and authored two guideline statements in the disease state", /*#__PURE__*/React.createElement(Cite, {
    n: 2
  }), ". Dr. Patel's record is strong but weighted toward adjacent indications", /*#__PURE__*/React.createElement(Cite, {
    n: 3
  }), ", so trial relevance separates them."), /*#__PURE__*/React.createElement("div", {
    className: "qa__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__chip"
  }, "3 citations"), /*#__PURE__*/React.createElement("span", {
    className: "qa__guard"
  }, "Reviewed against Medical Affairs guardrails \xB7 audit-logged"))), /*#__PURE__*/React.createElement("div", {
    className: "qa__q"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__role"
  }, "You"), /*#__PURE__*/React.createElement("p", null, "Draft a compliant MSL pre-call brief.")), /*#__PURE__*/React.createElement("div", {
    className: "qa__a qa__a--brief"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__role qa__role--ai"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__avatar"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-mark.svg",
    alt: "",
    width: "20",
    height: "20"
  })), "KOL Copilot"), /*#__PURE__*/React.createElement("p", {
    className: "qa__doc"
  }, "Generated a non-promotional pre-call brief \u2014 background, related trial experience, recent publications, and suggested scientific-exchange topics \u2014 with every claim traced to source", /*#__PURE__*/React.createElement(Cite, {
    n: 4
  }), "."), /*#__PURE__*/React.createElement("div", {
    className: "qa__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__chip qa__chip--safe"
  }, "Guardrail check passed"), /*#__PURE__*/React.createElement("span", {
    className: "qa__guard"
  }, "No prescribing-volume or promotional content")))));
}

/* ---- mount -------------------------------------------------------------- */
const heroEl = document.getElementById('hero-visual');
if (heroEl) ReactDOM.createRoot(heroEl).render(/*#__PURE__*/React.createElement(HeroCockpit, null));
const voiceEl = document.getElementById('voice-visual');
if (voiceEl) ReactDOM.createRoot(voiceEl).render(/*#__PURE__*/React.createElement(VoiceCopilot, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "landing/showcase.jsx", error: String((e && e.message) || e) }); }

// ui_kits/copilot-workspace/App.jsx
try { (() => {
// App — composes the three-panel cockpit and owns interaction state.
function App() {
  const D = window.DS;
  const data = window.WS;
  const [selectedId, setSelectedId] = React.useState('marchetti');
  const [voiceState, setVoiceState] = React.useState('listening');
  const [elapsed, setElapsed] = React.useState('0:12');
  const [transcript, setTranscript] = React.useState(data.transcript);
  const [brief, setBrief] = React.useState(null);
  const [drawer, setDrawer] = React.useState({
    open: false,
    id: 'marchetti'
  });
  const expertById = id => data.experts.find(e => e.id === id);
  const evidenceFor = id => data.evidence[id] || data.evidence.marchetti;

  // live elapsed timer while listening
  React.useEffect(() => {
    if (voiceState !== 'listening') return;
    let s = 12;
    const t = setInterval(() => {
      s += 1;
      setElapsed(`0:${String(s).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(t);
  }, [voiceState]);
  const toggleVoice = () => setVoiceState(v => v === 'listening' ? 'idle' : 'listening');
  const openEvidence = id => {
    setSelectedId(id);
    setDrawer({
      open: true,
      id
    });
  };
  const generateBrief = id => {
    setSelectedId(id);
    setVoiceState('thinking');
    setBrief({
      expert: expertById(id),
      evidence: evidenceFor(id),
      generating: true
    });
    setTimeout(() => {
      setVoiceState('idle');
      setBrief({
        expert: expertById(id),
        evidence: evidenceFor(id),
        generating: false,
        onClose: () => setBrief(null)
      });
    }, 1700);
  };
  const onSuggest = text => {
    setTranscript(t => [...t, {
      role: 'user',
      text
    }]);
    if (/brief/i.test(text)) {
      generateBrief('marchetti');
      setTimeout(() => setTranscript(t => [...t, {
        role: 'assistant',
        text: 'Drafted a compliance-checked pre-call brief for Dr. Marchetti below — scientifically relevant topics only, with supporting evidence [1] [2]. No prescribing-volume or promotional content was included.',
        cites: ['1', '2']
      }]), 700);
    } else if (/compare/i.test(text)) {
      setTimeout(() => setTranscript(t => [...t, {
        role: 'assistant',
        text: 'On trial experience, Dr. Marchetti leads (direct Phase 3 prefusion-F leadership) while Prof. Tanaka scores highest on publication relevance [1]. Use the Compare view at right for the full breakdown.',
        cites: ['1']
      }]), 600);
    } else {
      setTimeout(() => setTranscript(t => [...t, {
        role: 'assistant',
        text: 'Both Dr. Marchetti and Dr. Okonkwo have protocol-relevant RSV-LRTD publications addressing the ≥60 population [1] [3]. Open evidence to inspect the underlying sources.',
        cites: ['1', '3']
      }]), 600);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-canvas)'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    protocol: data.protocol
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(ProtocolPanel, {
    protocol: data.protocol
  }), /*#__PURE__*/React.createElement(CopilotConversation, {
    transcript: transcript,
    suggested: data.suggested,
    voiceState: voiceState,
    elapsed: elapsed,
    onToggleVoice: toggleVoice,
    brief: brief,
    onCite: ref => openEvidence(selectedId),
    onSuggest: onSuggest
  }), /*#__PURE__*/React.createElement(KolRail, {
    experts: data.experts,
    selectedId: selectedId,
    onSelect: setSelectedId,
    onViewEvidence: openEvidence,
    onGenerateBrief: generateBrief
  }), /*#__PURE__*/React.createElement(EvidenceDrawer, {
    open: drawer.open,
    expert: expertById(drawer.id),
    evidence: evidenceFor(drawer.id),
    onClose: () => setDrawer(d => ({
      ...d,
      open: false
    }))
  })));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/copilot-workspace/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/copilot-workspace/BriefDocument.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// BriefDocument — the compliant MSL pre-call brief (serif "clinical document" voice).
function BriefDocument({
  expert,
  evidence = [],
  generating,
  onClose
}) {
  const {
    Badge,
    Button,
    Citation
  } = window.DS;
  if (!expert) return null;
  const DocSection = ({
    title,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow",
    style: {
      color: 'var(--teal-700)',
      marginBottom: 8
    }
  }, title), children);
  const topics = ['Scientifically relevant data on RSV-confirmed LRTD efficacy in adults ≥60.', 'Evidence-supported discussion of day-30 neutralizing immunogenicity.', 'Related trial experience in subunit RSV vaccine safety & reactogenicity.'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-inset)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-secondary)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 2v6h6M9 13h6M9 17h6"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)'
    }
  }, "MSL Pre-Call Brief"), /*#__PURE__*/React.createElement(Badge, {
    tone: "safe",
    size: "sm",
    dot: true
  }, "Compliance-checked"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), generating ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--evidence-ink)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "brief-pulse",
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--evidence)'
    }
  }), "Generating") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost"
  }, "Export PDF"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: onClose
  }, "Close"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 26px',
      fontFamily: 'var(--font-serif)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes brief-pulse{0%,100%{opacity:.35}50%{opacity:1}} .brief-pulse{animation:brief-pulse 1.1s ease-in-out infinite}
          @keyframes brief-rise{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
          .brief-rise{animation:brief-rise .5s ease both}`), /*#__PURE__*/React.createElement("div", {
    className: "brief-rise"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em'
    }
  }, expert.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-tertiary)',
      marginTop: 5,
      letterSpacing: '.03em'
    }
  }, expert.institution, " \xB7 ", expert.specialty, " \xB7 ", expert.geography)), /*#__PURE__*/React.createElement(DocSection, {
    title: "Scientific summary"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-md)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--slate-700)'
    }
  }, expert.name.split(' ').slice(-1), " has ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)'
    }
  }, "direct Phase 3 trial experience"), " relevant to RSV-PreF-301 and has authored evidence directly supporting the protocol\u2019s primary efficacy endpoint. Engagement should center on ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)'
    }
  }, "non-promotional scientific exchange"), ", not product positioning.")), /*#__PURE__*/React.createElement(DocSection, {
    title: "Scientifically relevant discussion topics"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, topics.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontSize: 'var(--text-md)',
      lineHeight: 1.5,
      color: 'var(--slate-700)'
    }
  }, t)))), /*#__PURE__*/React.createElement(DocSection, {
    title: "Supporting evidence"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'var(--font-sans)'
    }
  }, evidence.map(c => /*#__PURE__*/React.createElement(Citation, _extends({
    key: c.refId
  }, c))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      paddingTop: 14,
      borderTop: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-xs)',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--compliance)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  })), "Reviewed against Medical Affairs guardrails \xB7 no prescribing-volume or promotional content \xB7 audit-logged")));
}
window.BriefDocument = BriefDocument;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/copilot-workspace/BriefDocument.jsx", error: String((e && e.message) || e) }); }

// ui_kits/copilot-workspace/CopilotConversation.jsx
try { (() => {
// CopilotConversation — center working surface: transcript, answer stream,
// suggested prompts, voice control, and the generated brief.
function renderWithCitations(text, onCite) {
  const {
    Citation
  } = window.DS;
  const parts = String(text).split(/(\[\d+\])/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[(\d+)\]$/);
    if (m) return /*#__PURE__*/React.createElement(Citation, {
      key: i,
      compact: true,
      refId: m[1],
      onClick: () => onCite(m[1])
    });
    return /*#__PURE__*/React.createElement("span", {
      key: i
    }, p);
  });
}
function UserMsg({
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '78%',
      padding: '11px 14px',
      borderRadius: '12px 12px 4px 12px',
      background: 'var(--accent-tint)',
      border: '1px solid var(--teal-100)',
      fontSize: 'var(--text-md)',
      color: 'var(--teal-700)',
      lineHeight: 1.5
    }
  }, text));
}
function AssistantMsg({
  text,
  onCite
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    width: "28",
    height: "28",
    alt: "",
    style: {
      flex: 'none',
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginBottom: 6
    }
  }, "Copilot"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-md)',
      color: 'var(--text-primary)',
      lineHeight: 1.65
    }
  }, renderWithCitations(text, onCite))));
}
function CopilotConversation({
  transcript,
  suggested,
  voiceState,
  elapsed,
  onToggleVoice,
  brief,
  onCite,
  onSuggest
}) {
  const {
    VoiceControl,
    Button
  } = window.DS;
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript, brief]);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-canvas)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 20px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-eyebrow"
  }, "Copilot Session"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 16,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-tertiary)'
    }
  }, "Protocol-aware \xB7 evidence-cited"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginRight: 5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 12a9 9 0 1 0 9-9 9.7 9.7 0 0 0-6.7 2.7L3 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 3v5h5"
  })), "New session")), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    className: "ds-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '22px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, transcript.map((m, i) => m.role === 'user' ? /*#__PURE__*/React.createElement(UserMsg, {
    key: i,
    text: m.text
  }) : /*#__PURE__*/React.createElement(AssistantMsg, {
    key: i,
    text: m.text,
    onCite: onCite
  })), brief ? /*#__PURE__*/React.createElement(BriefDocument, brief) : null)), suggested && suggested.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      padding: '0 20px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, suggested.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => onSuggest(s),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 30,
      padding: '0 12px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5 12 7-7 7 7M12 5v14"
  })), s)))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      padding: '12px 20px 16px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(VoiceControl, {
    state: voiceState,
    elapsed: elapsed,
    onToggle: onToggleVoice,
    transcript: voiceState === 'listening' ? 'Draft a non-promotional brief for Dr. Marchetti' : ''
  }))));
}
window.CopilotConversation = CopilotConversation;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/copilot-workspace/CopilotConversation.jsx", error: String((e && e.message) || e) }); }

// ui_kits/copilot-workspace/EvidenceDrawer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// EvidenceDrawer — slide-over panel listing protocol-relevant evidence for an expert.
function EvidenceDrawer({
  open,
  expert,
  evidence = [],
  onClose
}) {
  const {
    Badge,
    Button,
    Citation
  } = window.DS;
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(19,26,28,.28)',
      zIndex: 20
    }
  }), /*#__PURE__*/React.createElement("aside", {
    className: "ds-scroll",
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: 420,
      zIndex: 21,
      background: 'var(--surface-card)',
      borderLeft: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-overlay)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      background: 'var(--surface-card)',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--evidence)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Evidence"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)',
      marginTop: 2
    }
  }, expert ? expert.name : '')), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "evidence",
    size: "sm"
  }, evidence.length, " protocol-relevant sources"), expert ? /*#__PURE__*/React.createElement(Badge, {
    tone: expert.status === 'validated' ? 'safe' : 'compliance',
    size: "sm",
    dot: true
  }, expert.status === 'validated' ? 'Validated' : 'Review pending') : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, evidence.map(c => /*#__PURE__*/React.createElement(Citation, _extends({
    key: c.refId
  }, c, {
    onClick: () => {}
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-inset)',
      border: '1px solid var(--border-subtle)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '.03em',
      lineHeight: 1.5
    }
  }, "Sources retrieved from indexed publications, congress abstracts, and trial registries. Relevance is scored against protocol endpoints \u2014 non-promotional scientific exchange only."))));
}
window.EvidenceDrawer = EvidenceDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/copilot-workspace/EvidenceDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/copilot-workspace/KolRail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// KolRail — right rail: ranked experts + a compact comparison view.
function KolRail({
  experts,
  selectedId,
  onSelect,
  onViewEvidence,
  onGenerateBrief
}) {
  const {
    KolCard,
    ScoreBar,
    Avatar,
    Badge,
    Button
  } = window.DS;
  const [mode, setMode] = React.useState('ranked');
  const top2 = experts.slice(0, 2);
  const Toggle = () => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-md)',
      padding: 2
    }
  }, ['ranked', 'compare'].map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => setMode(m),
    style: {
      height: 26,
      padding: '0 11px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      textTransform: 'capitalize',
      background: mode === m ? 'var(--surface-card)' : 'transparent',
      color: mode === m ? 'var(--text-primary)' : 'var(--text-tertiary)',
      boxShadow: mode === m ? 'var(--shadow-xs)' : 'none'
    }
  }, m)));
  return /*#__PURE__*/React.createElement("aside", {
    className: "ds-scroll",
    style: {
      width: 'var(--rail-right)',
      flex: 'none',
      background: 'var(--surface-canvas)',
      borderLeft: '1px solid var(--border-subtle)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 2,
      background: 'var(--surface-canvas)',
      padding: '14px 16px 12px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-eyebrow"
  }, "Ranked Experts"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    size: "sm"
  }, experts.length), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Toggle, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-tertiary)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M7 12h10M11 18h2"
  })), "Sorted by scientific relevance to ", `RSV-PreF-301`)), mode === 'ranked' ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, experts.map(e => /*#__PURE__*/React.createElement(KolCard, _extends({
    key: e.id
  }, e, {
    breakdown: e.breakdown.map(b => ({
      label: b.label.split(' ')[0],
      value: b.value
    })),
    selected: e.id === selectedId,
    onSelect: () => onSelect(e.id),
    onViewEvidence: () => onViewEvidence(e.id),
    onGenerateBrief: () => onGenerateBrief(e.id)
  })))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      marginBottom: 14
    }
  }, top2.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 12,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: e.name,
    size: 36,
    style: {
      margin: '0 auto 8px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)',
      lineHeight: 1.2
    }
  }, e.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--teal-700)',
      marginTop: 6
    }
  }, e.score)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 13
    }
  }, top2[0].breakdown.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginBottom: 6
    }
  }, b.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(ScoreBar, {
    label: top2[0].name.split(' ').slice(-1),
    value: b.value,
    max: b.max,
    tone: "accent",
    height: 5
  }), /*#__PURE__*/React.createElement(ScoreBar, {
    label: top2[1].name.split(' ').slice(-1),
    value: top2[1].breakdown[i].value,
    max: top2[1].breakdown[i].max,
    tone: "evidence",
    height: 5
  }))))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    style: {
      marginTop: 12
    },
    onClick: () => onGenerateBrief(top2[0].id)
  }, "Generate brief for top match")));
}
window.KolRail = KolRail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/copilot-workspace/KolRail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/copilot-workspace/ProtocolPanel.jsx
try { (() => {
// ProtocolPanel — left rail: a clean clinical abstraction of the parsed protocol.
function ProtocolPanel({
  protocol
}) {
  const {
    Tag,
    Badge,
    CompliancePanel
  } = window.DS;
  const Section = ({
    label,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow",
    style: {
      marginBottom: 10
    }
  }, label), children);
  const Field = ({
    k,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      marginBottom: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
      lineHeight: 1.45
    }
  }, children));
  return /*#__PURE__*/React.createElement("aside", {
    className: "ds-scroll",
    style: {
      width: 'var(--rail-left)',
      flex: 'none',
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-subtle)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-eyebrow"
  }, "Protocol Intelligence"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "safe",
    size: "sm",
    dot: true
  }, "Parsed")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--teal-700)',
      marginBottom: 6
    }
  }, protocol.id, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      fontWeight: 400
    }
  }, "\xB7 ", protocol.nct)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-md)',
      lineHeight: 1.4,
      color: 'var(--text-primary)'
    }
  }, protocol.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    label: "Phase",
    value: protocol.phase,
    tone: "accent"
  }), /*#__PURE__*/React.createElement(Tag, {
    label: "Enroll",
    value: protocol.enrollment
  }))), /*#__PURE__*/React.createElement(Section, {
    label: "Indication"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
      lineHeight: 1.5
    }
  }, protocol.indication)), /*#__PURE__*/React.createElement(Section, {
    label: "Intervention"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
      lineHeight: 1.5
    }
  }, protocol.intervention)), /*#__PURE__*/React.createElement(Section, {
    label: "Population & Geography"
  }, /*#__PURE__*/React.createElement(Field, {
    k: "Patient population"
  }, protocol.population), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, protocol.geographies.map(g => /*#__PURE__*/React.createElement(Tag, {
    key: g,
    value: g
  })))), /*#__PURE__*/React.createElement(Section, {
    label: "Endpoints"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, protocol.endpoints.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: e.type === 'Primary' ? 'accent' : 'neutral',
    size: "sm",
    style: {
      flex: 'none',
      marginTop: 1
    }
  }, e.type), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
      lineHeight: 1.4
    }
  }, e.text))))), /*#__PURE__*/React.createElement(Section, {
    label: "Relevant specialties"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, protocol.specialties.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    value: s
  })))), /*#__PURE__*/React.createElement(Section, {
    label: "Key inclusion / exclusion"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, protocol.inclusion.map((t, i) => /*#__PURE__*/React.createElement(Criterion, {
    key: 'i' + i,
    ok: true,
    text: t
  })), protocol.exclusion.map((t, i) => /*#__PURE__*/React.createElement(Criterion, {
    key: 'e' + i,
    text: t
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      borderTop: '1px solid var(--border-subtle)',
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement(CompliancePanel, {
    mode: "Medical Affairs",
    items: [{
      label: 'Citation-required recommendations'
    }, {
      label: 'No prescribing-volume targeting'
    }, {
      label: 'No pre-approval promotional claims'
    }, {
      label: 'Medical / Commercial firewall active'
    }],
    auditAvailable: true
  })));
}
function Criterion({
  ok,
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      marginTop: 2,
      color: ok ? 'var(--safe)' : 'var(--risk)'
    }
  }, ok ? /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--slate-700)',
      lineHeight: 1.4
    }
  }, text));
}
window.ProtocolPanel = ProtocolPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/copilot-workspace/ProtocolPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/copilot-workspace/TopBar.jsx
try { (() => {
// TopBar — global app chrome: logo lockup, protocol context, MA-mode, audit, user.
function TopBar({
  protocol
}) {
  const {
    Badge
  } = window.DS;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 'var(--topbar-h)',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 16px',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    width: "26",
    height: "26",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.05
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: '-0.01em',
      color: 'var(--text-primary)'
    }
  }, "Medical Affairs Copilot"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginTop: 1
    }
  }, "Scientific Intelligence"))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 26,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      height: 34,
      padding: '0 10px 0 11px',
      background: 'var(--surface-inset)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--safe)',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-primary)',
      fontWeight: 'var(--weight-medium)'
    }
  }, protocol.id), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-tertiary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Phase ", protocol.phase, " \xB7 parsed"), /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-tertiary)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "compliance",
    size: "md",
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m9 12 2 2 4-4"
    }))
  }, "Medical Affairs mode"), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 32,
      padding: '0 11px',
      background: 'transparent',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4l3 2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  })), "Audit"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-md)',
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--slate-950)',
      color: 'var(--white)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, "MA"));
}
window.TopBar = TopBar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/copilot-workspace/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/copilot-workspace/data.js
try { (() => {
// Medical Affairs Copilot — demo workspace data (plain script -> window.WS)
window.WS = {
  protocol: {
    id: 'RSV-PreF-301',
    nct: 'NCT05•••421',
    title: 'A Phase 3 Study of a Bivalent RSV Prefusion-F Vaccine in Adults ≥60',
    indication: 'Respiratory Syncytial Virus (RSV) — lower respiratory tract disease',
    intervention: 'Bivalent RSV prefusion-F subunit vaccine (single IM dose)',
    phase: '3',
    population: 'Community-dwelling adults aged ≥60, immunocompetent',
    enrollment: '24,800',
    geographies: ['US', 'EU', 'JP', 'AU'],
    specialties: ['Vaccinology', 'Infectious Disease', 'Geriatric Medicine', 'Pulmonology'],
    endpoints: [{
      type: 'Primary',
      text: 'Vaccine efficacy against RSV-confirmed LRTD (≥2 signs)'
    }, {
      type: 'Secondary',
      text: 'Immunogenicity — neutralizing titers at day 30'
    }, {
      type: 'Secondary',
      text: 'Safety & reactogenicity through 6 months'
    }],
    inclusion: ['Age ≥ 60 years at enrollment', 'Medically stable per investigator', 'Able to provide informed consent'],
    exclusion: ['Prior RSV vaccination of any kind', 'Immunocompromising condition or therapy', 'Acute febrile illness within 72h of dosing']
  },
  experts: [{
    rank: 1,
    id: 'marchetti',
    name: 'Dr. Elena Marchetti',
    institution: 'Karolinska Institutet',
    specialty: 'Vaccinology',
    geography: 'EU · Sweden',
    score: 92.4,
    status: 'validated',
    citations: 37,
    breakdown: [{
      label: 'Trial experience',
      value: 30,
      max: 30
    }, {
      label: 'Publication relevance',
      value: 24,
      max: 25
    }, {
      label: 'Guideline authorship',
      value: 18,
      max: 20
    }, {
      label: 'Recency',
      value: 12,
      max: 15
    }, {
      label: 'Congress activity',
      value: 8.4,
      max: 10
    }],
    rationale: 'Direct Phase 3 RSV prefusion-F trial leadership; authored evidence on the protocol\u2019s primary efficacy endpoint in older adults.'
  }, {
    rank: 2,
    id: 'tanaka',
    name: 'Prof. Hideo Tanaka',
    institution: 'University of Tokyo',
    specialty: 'Infectious Disease',
    geography: 'APAC · Japan',
    score: 88.1,
    status: 'review',
    citations: 29,
    breakdown: [{
      label: 'Trial experience',
      value: 24,
      max: 30
    }, {
      label: 'Publication relevance',
      value: 25,
      max: 25
    }, {
      label: 'Guideline authorship',
      value: 14,
      max: 20
    }, {
      label: 'Recency',
      value: 14,
      max: 15
    }, {
      label: 'Congress activity',
      value: 9,
      max: 10
    }],
    rationale: 'Related trial experience in adult RSV; strong recent publication record relevant to the immunogenicity endpoint.'
  }, {
    rank: 3,
    id: 'okonkwo',
    name: 'Dr. Amara Okonkwo',
    institution: 'Johns Hopkins',
    specialty: 'Geriatric Medicine',
    geography: 'NA · United States',
    score: 84.6,
    status: 'validated',
    citations: 22,
    breakdown: [{
      label: 'Trial experience',
      value: 21,
      max: 30
    }, {
      label: 'Publication relevance',
      value: 22,
      max: 25
    }, {
      label: 'Guideline authorship',
      value: 17,
      max: 20
    }, {
      label: 'Recency',
      value: 13,
      max: 15
    }, {
      label: 'Congress activity',
      value: 8,
      max: 10
    }],
    rationale: 'Authored geriatric immunization guidance directly relevant to the ≥60 population; active in related LRTD research.'
  }],
  evidence: {
    marchetti: [{
      refId: '1',
      title: 'Efficacy of a bivalent RSV prefusion F vaccine in older adults',
      source: 'N Engl J Med',
      year: '2024',
      relevance: 'Directly supports the protocol\u2019s primary efficacy endpoint (RSV-confirmed LRTD) in adults ≥60.'
    }, {
      refId: '2',
      title: 'Neutralizing antibody responses to RSV prefusion F immunization',
      source: 'Lancet Infect Dis',
      year: '2023',
      relevance: 'Establishes day-30 immunogenicity readouts referenced in the secondary endpoint.'
    }, {
      refId: '3',
      title: 'Safety and reactogenicity of subunit RSV vaccines in the elderly',
      source: 'Clin Infect Dis',
      year: '2022',
      relevance: 'Relevant safety dataset for the ≥60 immunocompetent population.'
    }]
  },
  transcript: [{
    role: 'user',
    text: 'Find infectious-disease and vaccinology KOLs with direct experience relevant to this RSV Phase 3 protocol.'
  }, {
    role: 'assistant',
    text: 'I ranked experts by scientific relevance to RSV-PreF-301 — weighting direct Phase 3 trial experience, publication relevance to the primary endpoint, and guideline authorship. The top match is Dr. Elena Marchetti, who led prefusion-F efficacy work in adults ≥60 [1] and contributed to the immunogenicity evidence base [2].',
    cites: ['1', '2']
  }],
  suggested: ['Compare the top two experts on trial experience', 'Which experts have related RSV-LRTD publications?', 'Draft a non-promotional pre-call brief for Dr. Marchetti']
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/copilot-workspace/data.js", error: String((e && e.message) || e) }); }

__ds_ns.CompliancePanel = __ds_scope.CompliancePanel;

__ds_ns.KolCard = __ds_scope.KolCard;

__ds_ns.VoiceControl = __ds_scope.VoiceControl;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Citation = __ds_scope.Citation;

__ds_ns.ScoreBar = __ds_scope.ScoreBar;

})();
