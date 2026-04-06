import Avatar from '../ui/Avatar'
import { WaIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'

function getSlaInfo(conv) {
  const lastMsg = conv.messages[conv.messages.length - 1]
  if (!lastMsg || lastMsg.type !== 'received') return null

  const match = conv.lastTime.match(/^(\d{2}):(\d{2})$/)
  if (!match) return { level: 'critical' }

  const now = new Date()
  const msg = new Date()
  msg.setHours(parseInt(match[1]), parseInt(match[2]), 0)
  const mins = Math.max(0, Math.floor((now - msg) / 60000))

  if (mins < 30)  return { level: 'ok' }
  if (mins < 120) return { level: 'warning' }
  return              { level: 'critical' }
}

export default function ConvItem({ conv, active, onClick, onUpdate }) {
  const agent   = AGENTS.find(a => a.id === conv.assignedTo)
  const lastMsg = conv.messages[conv.messages.length - 1]
  const waitingAgent = lastMsg?.type === 'received'

  return (
    <div
      className={`conv-item ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{
        padding: '11px 14px', cursor: 'pointer',
        borderLeft: '3px solid transparent',
        display: 'flex', gap: 10, alignItems: 'flex-start',
        borderBottom: '1px solid #f1f5f9',
        position: 'relative',
        transition: 'background 0.15s',
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', marginTop: 2, flexShrink: 0 }}>
        <Avatar initials={conv.avatar} color={conv.avatarColor} size={36} />
        <div style={{ position: 'absolute', bottom: -1, right: -1, background: '#f8fafc', borderRadius: '50%', padding: 1 }}>
          <WaIcon size={11} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{ color: conv.unread > 0 ? '#0f172a' : '#334155', fontWeight: conv.unread > 0 ? 700 : 500, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
            {conv.contactName}
          </span>
          <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 4 }}>
            {conv.lastTime}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ color: waitingAgent ? '#475569' : '#94a3b8', fontSize: 11.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 155 }}>
            {conv.lastMessage}
          </span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4 }}>
            {conv.unread > 0 && (
              <div style={{ background: '#22c55e', color: '#fff', borderRadius: 99, fontSize: 10, fontWeight: 800, minWidth: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                {conv.unread}
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {conv.status !== 'closed' && waitingAgent && (
            <span style={{ fontSize: 9.5, background: '#fbebbb', color: '#92400e', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
              Aguardando resposta
            </span>
          )}
          {conv.status !== 'closed' && lastMsg?.type === 'sent' && (
            <span style={{ fontSize: 9.5, background: '#cefbe5', color: '#0f766e', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
              ✓ Respondido
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
