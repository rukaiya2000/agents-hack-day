// EvidenceDrawer — slide-over panel listing protocol-relevant evidence for an expert.
function EvidenceDrawer({ open, expert, evidence = [], onClose }) {
  const { Badge, Button, Citation } = window.DS;
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(19,26,28,.28)', zIndex: 20,
      }} />
      <aside className="ds-scroll" style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 420, zIndex: 21,
        background: 'var(--surface-card)', borderLeft: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-overlay)', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
          borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0,
          background: 'var(--surface-card)', zIndex: 1,
        }}>
          <span style={{ display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--evidence)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ds-eyebrow">Evidence</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', marginTop: 2 }}>{expert ? expert.name : ''}</div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </Button>
        </div>

        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          <Badge tone="evidence" size="sm">{evidence.length} protocol-relevant sources</Badge>
          {expert ? <Badge tone={expert.status === 'validated' ? 'safe' : 'compliance'} size="sm" dot>{expert.status === 'validated' ? 'Validated' : 'Review pending'}</Badge> : null}
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {evidence.map((c) => <Citation key={c.refId} {...c} onClick={() => {}} />)}
          <div style={{
            marginTop: 4, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            background: 'var(--surface-inset)', border: '1px solid var(--border-subtle)',
            fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
            letterSpacing: '.03em', lineHeight: 1.5,
          }}>
            Sources retrieved from indexed publications, congress abstracts, and trial registries. Relevance is scored against protocol endpoints — non-promotional scientific exchange only.
          </div>
        </div>
      </aside>
    </>
  );
}
window.EvidenceDrawer = EvidenceDrawer;
