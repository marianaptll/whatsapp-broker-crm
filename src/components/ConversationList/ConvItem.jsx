import { useState } from 'react'
import Avatar from '../ui/Avatar'
import { WaIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'

function getSlaInfo(conv) {
  const lastMsg = conv.messages[conv.messages.length - 1]
  if (!lastMsg || lastMsg.type !== 'received') return null

  const match = conv.lastTime.match(/^(\d{2}):(\d{2})$/)
  if (!match) {
    return { label: '+24h', color: '#ef4444', cardBg: 'rgba(239,68,68,0.09)', border: '#ef4444', level: 'critical' }
  }

  const now = new Date()
  const msg = new Date()
  msg.setHours(parseInt(match[1]), parseInt(match[2]), 0)
  const mins = Math.max(0, Math.floor((now - msg) / 60000))

  if (mins < 30)  return { label: `${mins}min`, color: '#25D366', cardBg: null,                         border: '#25D366', level: 'ok' }
  if (mins < 120) return { label: `${mins}min`, color: '#fbbf24', cardBg: 'rgba(251,191,36,0.07)',  border: '#fbbf24', level: 'warning' }
  return              { label: `${Math.floor(mins/60)}h`, color: '#ef4444', cardBg: 'rgba(239,68,68,0.09)', border: '#ef4444', level: 'critical' }
}

function AssignMini({ conv, onUpdate, onClose }) {
  return (
    <div
      style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#1e2548', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.35)', zIndex: 100, minWidth: 160, overflow: 'hidden' }}
      onClick={e => e.stopPropagation()}
    >
      {AGENTS.map(a => (
        <div
          key={a.id}
          onClick={() => { onUpdate(conv.id, { assignedTo: a.id }); onClose() }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', transition: 'background 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Avatar initials={a.avatar} color={a.color} size={22} />
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{a.name}</span>
          {conv.assignedTo === a.id && <span style={{ marginLeft: 'auto', color: '#25D366', fontSize: 11 }}>✓</span>}
        </div>
      ))}
    </div>
  )
}

export default function ConvItem({ conv, active, onClick, onUpdate }) {
  const [hovered, setHovered] = useState(false)
  const [showAssign, setShowAssign] = useState(false)

  const agent  = AGENTS.find(a => a.id === conv.assignedTo)
  const sla    = getSlaInfo(conv)
  const lastMsg = conv.messages[conv.messages.length - 1]

  // Direction clarity
  const waitingAgent  = lastMsg?.type === 'received'  // client sent last → vendor needs to reply
  const waitingClient = lastMsg?.type === 'sent'      // agent sent last → client needs to reply

  // Card border: SLA-driven (only warning/critical), active overrides
  const borderColor = active
    ? '#25D366'
    : (sla?.level === 'critical' ? '#ef4444' : sla?.level === 'warning' ? '#fbbf24' : 'transparent')

  const cardBg = active ? undefined : sla?.cardBg ?? undefined

  return (
    <div
      className={`conv-item ${active ? 'active' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowAssign(false) }}
      style={{
        padding: '11px 14px', cursor: 'pointer',
        borderLeft: `3px solid ${borderColor}`,
        display: 'flex', gap: 10, alignItems: 'flex-start',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: cardBg,
        position: 'relative',
        transition: 'background 0.15s',
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', marginTop: 2, flexShrink: 0 }}>
        <Avatar initials={conv.avatar} color={conv.avatarColor} size={36} />
        <div style={{ position: 'absolute', bottom: -1, right: -1, background: '#141a3d', borderRadius: '50%', padding: 1 }}>
          <WaIcon size={11} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{ color: conv.unread > 0 ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: conv.unread > 0 ? 700 : 500, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
            {conv.contactName}
          </span>
          <span style={{ color: sla ? sla.color : 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 4 }}>
            {conv.lastTime}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ color: waitingAgent ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)', fontSize: 11.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 155 }}>
            {conv.lastMessage}
          </span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4 }}>
            {agent && <Avatar initials={agent.avatar} color={agent.color} size={15} ring />}
            {conv.unread > 0 && (
              <div style={{ background: '#25D366', color: '#fff', borderRadius: 99, fontSize: 10, fontWeight: 800, minWidth: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                {conv.unread}
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {conv.status === 'pending' && (
            <span style={{ fontSize: 9.5, background: 'rgba(234,179,8,0.15)', color: '#fbbf24', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
              Pendente
            </span>
          )}

          {conv.status !== 'closed' && waitingAgent && (
            <span style={{ fontSize: 9.5, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
              ⏳ Ag. vendedor
            </span>
          )}

          {conv.status !== 'closed' && waitingClient && (
            <span style={{ fontSize: 9.5, background: 'rgba(37,211,102,0.12)', color: '#25D366', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
              ✓ Ag. cliente
            </span>
          )}

          {sla && conv.status !== 'closed' && sla.level !== 'ok' && (
            <span style={{ fontSize: 9.5, background: sla.level === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)', color: sla.color, borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>
              {sla.label}
            </span>
          )}

          {!conv.assignedTo && conv.status !== 'closed' && (
            <span style={{ fontSize: 9.5, background: 'rgba(190,24,93,0.15)', color: '#fb7185', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
              Sem atribuição
            </span>
          )}
        </div>
      </div>

      {/* Hover actions — estilo Gmail/Intercom */}
      {hovered && conv.status !== 'closed' && (
        <div
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 3, zIndex: 10, background: 'rgba(20,26,61,0.95)', borderRadius: 8, padding: '3px 4px', border: '1px solid rgba(255,255,255,0.1)' }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => onUpdate(conv.id, { status: 'closed' })}
            title="Arquivar"
            style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', color: '#25D366', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >✔</button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAssign(!showAssign)}
              title="Atribuir"
              style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: showAssign ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s' }}
              onMouseEnter={e => { if (!showAssign) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { if (!showAssign) e.currentTarget.style.background = 'transparent' }}
            >👤</button>
            {showAssign && <AssignMini conv={conv} onUpdate={onUpdate} onClose={() => setShowAssign(false)} />}
          </div>

          <button
            title="Transferir"
            style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >↗</button>
        </div>
      )}
    </div>
  )
}
