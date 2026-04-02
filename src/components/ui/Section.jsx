import { ChevronIcon } from './Icons'

export function Section({ title, open, onToggle, children }) {
  return (
    <div style={{ borderBottom: '1px solid #f1f5f9' }}>
      <div
        className="section-toggle"
        onClick={onToggle}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {title}
        </span>
        <ChevronIcon open={open} />
      </div>
      {open && <div style={{ padding: '0 16px 12px' }}>{children}</div>}
    </div>
  )
}

export function Row({ label, value, highlight = false, isNode = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #f8fafc' }}>
      <span style={{ fontSize: 11.5, color: '#94a3b8', minWidth: 90 }}>{label}</span>
      {isNode ? (
        <span style={{ fontSize: 12, color: '#334155', fontWeight: 500, textAlign: 'right', display: 'flex', alignItems: 'center' }}>
          {value}
        </span>
      ) : (
        <span style={{ fontSize: 12, color: highlight ? '#0f172a' : '#334155', fontWeight: highlight ? 700 : 500, textAlign: 'right', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </span>
      )}
    </div>
  )
}
