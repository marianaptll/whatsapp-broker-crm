import { useState, useRef, useEffect } from 'react'
import Avatar from '../ui/Avatar'
import { WaIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'
import logoClaro from '../../imagem/logo_leadhub_claro.png'

function isWithin24h(t) { return /^\d{1,2}:\d{2}$/.test(t) }

// ─── Filter logic ─────────────────────────────────────────────────────────────
function filterConversations(conversations, agentFilter, statusFilter, search) {
  return conversations.filter(c => {
    // search
    const matchSearch =
      !search ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false

    // agent filter
    if (agentFilter === 'mine')   { if (!(c.assignedTo === 'a1' && c.status !== 'closed')) return false }
    else if (agentFilter === 'closed') { if (c.status !== 'closed') return false }
    else {
      // specific agent id
      if (!(c.assignedTo === agentFilter && c.status !== 'closed')) return false
    }

    // status filter (only when not in archived view)
    if (agentFilter !== 'closed') {
      const lastMsg = c.messages[c.messages.length - 1]
      if (statusFilter === 'abertas')    return isWithin24h(c.lastTime)
      if (statusFilter === 'fechadas')   return !isWithin24h(c.lastTime)
      if (statusFilter === 'aguardando') return lastMsg?.type === 'received'
    }
    return true
  })
}

// ─── Conversation item ────────────────────────────────────────────────────────
function ConvItem({ conv, onClick }) {
  const lastMsg = conv.messages[conv.messages.length - 1]
  const isWaiting = lastMsg?.type === 'received'
  const isSent    = lastMsg?.type === 'sent'

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        width: '100%', padding: '11px 16px',
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: '1px solid #f0f0f0', textAlign: 'left',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Avatar initials={conv.avatar} color={conv.avatarColor} size={50} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <span style={{
            fontWeight: 600, fontSize: 15.5, color: '#111B21',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%',
          }}>
            {conv.contactName}
          </span>
          <span style={{
            fontSize: 12, flexShrink: 0, marginLeft: 8,
            color: conv.unread > 0 ? '#25D366' : '#667781',
            fontWeight: conv.unread > 0 ? 700 : 400,
          }}>
            {conv.lastTime}
          </span>
        </div>

        {/* Last message + badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            {isSent && (
              <svg width="15" height="10" viewBox="0 0 18 12" fill="none" style={{ flexShrink: 0 }}>
                <path d="M1 6l4 4L17 1" stroke="#53BDEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6l4 4" stroke="#53BDEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span style={{
              fontSize: 13.5, color: '#667781',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              fontWeight: isWaiting && conv.unread > 0 ? 600 : 400,
            }}>
              {conv.lastMessage}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8, flexShrink: 0 }}>
            {conv.unread > 0 && (
              <div style={{
                background: '#25D366', color: '#fff', borderRadius: 99,
                fontSize: 11.5, fontWeight: 700, minWidth: 21, height: 21,
                padding: '0 5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {conv.unread}
              </div>
            )}
            {isWaiting && !conv.unread && conv.status !== 'closed' && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Group header ─────────────────────────────────────────────────────────────
function GroupHeader({ label, color, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px 6px',
      background: '#f8fafc',
      borderBottom: '1px solid #f0f0f0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: color,
          boxShadow: `0 0 0 3px ${color}22`,
        }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', letterSpacing: '-0.01em' }}>
          {label}
        </span>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700, color,
        background: `${color}18`, border: `1.5px solid ${color}55`,
        borderRadius: 6, padding: '1px 8px',
      }}>
        {count}
      </span>
    </div>
  )
}

// ─── Agent dropdown ───────────────────────────────────────────────────────────
const LIDERADOS = AGENTS.filter(a => a.id !== 'a1')

function AgentDropdown({ agentFilter, setAgentFilter }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handle = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('touchstart', handle) }
  }, [open])

  const options = [
    { key: 'mine', label: 'Minhas conversas', color: '#4356a0', avatar: null },
    ...LIDERADOS.map(a => ({ key: a.id, label: a.name, color: a.color, avatar: a.avatar })),
  ]
  const current = options.find(o => o.key === agentFilter) || options[0]

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px 6px 10px', borderRadius: 99, border: 'none',
          background: open ? '#4356a0' : '#e8eaf6',
          color: open ? '#fff' : '#4356a0',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Sora, sans-serif', transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        {current.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
          background: '#fff', borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          border: '1px solid #e2e8f0', minWidth: 200,
        }}>
          {/* My conversations */}
          <DropOption
            opt={options[0]}
            active={agentFilter === 'mine'}
            onClick={() => { setAgentFilter('mine'); setOpen(false) }}
          />
          {LIDERADOS.length > 0 && (
            <>
              <div style={{ height: 1, background: '#f1f5f9', margin: '2px 0' }} />
              <div style={{ padding: '6px 14px 2px', fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Equipe
              </div>
              {options.slice(1).map(opt => (
                <DropOption
                  key={opt.key}
                  opt={opt}
                  active={agentFilter === opt.key}
                  onClick={() => { setAgentFilter(opt.key); setOpen(false) }}
                />
              ))}
            </>
          )}
          <div style={{ height: 1, background: '#f1f5f9', margin: '2px 0' }} />
          <DropOption
            opt={{ key: 'closed', label: 'Arquivadas', color: '#94a3b8', avatar: null }}
            active={agentFilter === 'closed'}
            onClick={() => { setAgentFilter('closed'); setOpen(false) }}
            dim
          />
        </div>
      )}
    </div>
  )
}

function DropOption({ opt, active, onClick, dim }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: '10px 14px',
        border: 'none', background: active ? '#eff6ff' : 'transparent',
        color: active ? '#1d4ed8' : dim ? '#94a3b8' : '#334155',
        fontSize: 13.5, fontWeight: active ? 700 : 400,
        fontFamily: 'Sora, sans-serif', cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.1s',
      }}
    >
      {opt.avatar
        ? <Avatar initials={opt.avatar} color={opt.color} size={26} />
        : <div style={{ width: 8, height: 8, borderRadius: '50%', background: opt.color, flexShrink: 0 }} />
      }
      <span style={{ flex: 1 }}>{opt.label}</span>
      {active && <span style={{ color: '#25D366', fontSize: 14 }}>✓</span>}
    </button>
  )
}

// ─── Status filter chips ──────────────────────────────────────────────────────
const STATUS_CHIPS = [
  { key: 'all',       label: 'Todas' },
  { key: 'abertas',   label: 'Abertas' },
  { key: 'fechadas',  label: 'Fechadas' },
  { key: 'aguardando', label: 'Aguardando' },
]

// ─── Main export ──────────────────────────────────────────────────────────────
export default function MobileChatList({
  conversations, activeId, onSelect,
  filter, setFilter, search, setSearch,
}) {
  // agent filter lives here (which agent's convs to show)
  const [agentFilter, setAgentFilter] = useState('mine')
  // status sub-filter
  const [statusFilter, setStatusFilter] = useState('all')
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (showSearch) searchRef.current?.focus()
  }, [showSearch])

  const filtered = filterConversations(conversations, agentFilter, statusFilter, search)
  const totalUnread = conversations.filter(c => c.unread > 0).length

  // Group into Abertas / Fechadas (only when not Arquivadas and not sub-filtered)
  const showGroups = agentFilter !== 'closed' && (statusFilter === 'all' || statusFilter === 'aguardando')
  const groups = showGroups
    ? [
        { key: 'abertas',  label: 'Abertas',  color: '#22c55e', items: filtered.filter(c => isWithin24h(c.lastTime)) },
        { key: 'fechadas', label: 'Fechadas', color: '#ef4444', items: filtered.filter(c => !isWithin24h(c.lastTime)) },
      ].filter(g => g.items.length > 0)
    : [{ key: 'all', items: filtered }]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', overflow: 'hidden' }}>

      {/* Safe area top */}
      <div style={{ height: 'env(safe-area-inset-top)', background: '#fff', flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: '8px 16px 0', background: '#fff', flexShrink: 0 }}>
        {showSearch ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10 }}>
            <button
              onClick={() => { setShowSearch(false); setSearch('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#4356a0' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div style={{ flex: 1, background: '#f0f2f5', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '9px 14px', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar conversa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#111B21', background: 'transparent', fontFamily: 'Sora, sans-serif' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Top row: logo + icons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6 }}>
              <img src={logoClaro} alt="LeadHub" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(24%) sepia(72%) saturate(511%) hue-rotate(199deg) brightness(89%) contrast(95%)' }} />
              <div style={{ display: 'flex', gap: 2 }}>
                <button onClick={() => setShowSearch(true)} style={{ background: 'none', border: 'none', color: '#4356a0', cursor: 'pointer', padding: 8, display: 'flex', borderRadius: '50%' }}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </button>
                <button style={{ background: 'none', border: 'none', color: '#4356a0', cursor: 'pointer', padding: 8, display: 'flex', borderRadius: '50%' }}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Title + agent dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#111B21', letterSpacing: '-0.03em', lineHeight: 1, flexShrink: 0 }}>
                Conversas
                {totalUnread > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    marginLeft: 8, background: '#25D366', color: '#fff',
                    borderRadius: 99, fontSize: 13, fontWeight: 700,
                    minWidth: 24, height: 24, padding: '0 6px', verticalAlign: 'middle',
                  }}>
                    {totalUnread}
                  </span>
                )}
              </h1>
              <AgentDropdown agentFilter={agentFilter} setAgentFilter={(v) => { setAgentFilter(v); setStatusFilter('all') }} />
            </div>
          </>
        )}
      </div>

      {/* Status filter chips — hidden when viewing Arquivadas */}
      {agentFilter !== 'closed' && !showSearch && (
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
          {STATUS_CHIPS.map(chip => (
            <button
              key={chip.key}
              onClick={() => setStatusFilter(chip.key)}
              style={{
                padding: '6px 16px', borderRadius: 99, border: 'none', flexShrink: 0,
                background: statusFilter === chip.key ? '#d3ebff' : '#f0f2f5',
                color: statusFilter === chip.key ? '#4356a0' : '#667781',
                fontSize: 13, fontWeight: statusFilter === chip.key ? 700 : 500,
                cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                outline: statusFilter === chip.key ? '1.5px solid #93c5fd' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: '#f0f0f0', flexShrink: 0 }} />

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 56, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>💬</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#334155' }}>Nenhuma conversa</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Tente outro filtro</div>
          </div>
        ) : (
          groups.map(group => (
            <div key={group.key}>
              {group.label && (
                <GroupHeader label={group.label} color={group.color} count={group.items.length} />
              )}
              {group.items.map(conv => (
                <ConvItem key={conv.id} conv={conv} onClick={() => onSelect(conv.id)} />
              ))}
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button style={{
        position: 'absolute', bottom: 76, right: 20,
        width: 56, height: 56, borderRadius: '50%',
        background: '#25D366', border: 'none',
        boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', zIndex: 10,
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      </button>
    </div>
  )
}
