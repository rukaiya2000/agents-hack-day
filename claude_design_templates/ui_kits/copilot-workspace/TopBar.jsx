// TopBar — global app chrome: logo lockup, protocol context, MA-mode, audit, user.
function TopBar({ protocol }) {
  const { Badge } = window.DS;
  return (
    <header style={{
      height: 'var(--topbar-h)', flex: 'none', display: 'flex', alignItems: 'center',
      gap: 16, padding: '0 16px', background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* logo lockup */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <img src="../../assets/logo-mark.svg" width="26" height="26" alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>Medical Affairs Copilot</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginTop: 1 }}>Scientific Intelligence</span>
        </div>
      </div>

      <span style={{ width: 1, height: 26, background: 'var(--border-subtle)' }} />

      {/* protocol context */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: 9, height: 34, padding: '0 10px 0 11px',
        background: 'var(--surface-inset)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', cursor: 'pointer', maxWidth: 360,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--safe)', flex: 'none' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', fontWeight: 'var(--weight-medium)' }}>{protocol.id}</span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Phase {protocol.phase} · parsed</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><path d="m6 9 6 6 6-6" /></svg>
      </button>

      <span style={{ flex: 1 }} />

      <Badge tone="compliance" size="md" icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>}>Medical Affairs mode</Badge>

      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 11px',
        background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
        cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: '.06em',
        textTransform: 'uppercase', color: 'var(--text-secondary)',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/></svg>
        Audit
      </button>

      <span style={{
        width: 32, height: 32, borderRadius: 'var(--radius-md)', flex: 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--slate-950)', color: 'var(--white)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
      }}>MA</span>
    </header>
  );
}
window.TopBar = TopBar;
