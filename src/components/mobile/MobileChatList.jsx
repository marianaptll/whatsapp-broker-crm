import { useState, useRef, useEffect } from 'react'
import Avatar from '../ui/Avatar'
import { WaIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'
import logoClaro from '../../imagem/logo_leadhub_claro.png'

function isWithin24h(t) { return /^\d{1,2}:\d{2}$/.test(t) }

function filterConversations(conversations, filter, search) {
  return conversations.filter(c => {
    const matchSearch =
      !search ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (filter === 'mine')    return c.assignedTo === 'a1' && c.status !== 'closed'
    if (filter === 'waiting') return c.messages[c.messages.length - 1]?.type === 'received' && c.status !== 'closed'
    if (filter === 'closed')  return c.status === 'closed'
    return true
  })
}

const FILTERS = [
  { key: 'mine',    label: 'Minhas' },
  { key: 'all',     label: 'Todas' },
  { key: 'waiting', label: 'Aguardando' },
  { key: 'closed',  label: 'Arquivadas' },
]

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
        width: '100%', padding: '10px 16px',
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: '1px solid #f0f0f0',
        textAlign: 'left',
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar initials={conv.avatar} color={conv.avatarColor} size={50} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Row 1: name + time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <span style={{
            fontWeight: 600, fontSize: 15.5, color: '#111B21',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%',
          }}>
            {conv.contactName}
          </span>
          <span style={{
            fontSize: 12, color: conv.unread > 0 ? '#25D366' : '#667781',
            fontWeight: conv.unread > 0 ? 700 : 400, flexShrink: 0, marginLeft: 8,
          }}>
            {conv.lastTime}
          </span>
        </div>

        {/* Row 2: last message + badge */}
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
                background: '#25D366', color: '#fff',
                borderRadius: 99, fontSize: 11.5, fontWeight: 700,
                minWidth: 21, height: 21, padding: '0 5px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {conv.unread}
              </div>
            )}
            {conv.status !== 'closed' && isWaiting && !conv.unread && (
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#f59e0b', flexShrink: 0,
              }} />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function MobileChatList({
  conversations, activeId, onSelect,
  filter, setFilter, search, setSearch,
}) {
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (showSearch) searchRef.current?.focus()
  }, [showSearch])

  const filtered = filterConversations(conversations, filter, search)
  const totalUnread = conversations.filter(c => c.unread > 0).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', overflow: 'hidden' }}>

      {/* Status bar spacer */}
      <div style={{ height: 'env(safe-area-inset-top)', background: '#fff', flexShrink: 0 }} />

      {/* Top bar */}
      <div style={{ padding: '8px 16px 0', background: '#fff', flexShrink: 0 }}>
        {showSearch ? (
          /* Search mode */
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10 }}>
            <button
              onClick={() => { setShowSearch(false); setSearch('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#4356a0' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div style={{
              flex: 1, background: '#f0f2f5', borderRadius: 10,
              display: 'flex', alignItems: 'center', padding: '9px 14px', gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar conversa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: 15,
                  color: '#111B21', background: 'transparent', fontFamily: 'Sora, sans-serif',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Normal mode */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6 }}>
            <img src={logoClaro} alt="LeadHub" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(24%) sepia(72%) saturate(511%) hue-rotate(199deg) brightness(89%) contrast(95%)' }} />
            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <button
                onClick={() => setShowSearch(true)}
                style={{ background: 'none', border: 'none', color: '#4356a0', cursor: 'pointer', padding: 8, display: 'flex', borderRadius: '50%' }}
              >
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
        )}

        {/* Big title */}
        {!showSearch && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 12 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#111B21', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Conversas
              {totalUnread > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginLeft: 10, background: '#25D366', color: '#fff',
                  borderRadius: 99, fontSize: 13, fontWeight: 700,
                  minWidth: 24, height: 24, padding: '0 6px',
                  verticalAlign: 'middle',
                }}>
                  {totalUnread}
                </span>
              )}
            </h1>
          </div>
        )}
      </div>

      {/* Filter chips */}
      {!showSearch && (
        <div style={{
          display: 'flex', gap: 8, padding: '0 16px 12px',
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
        }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '6px 16px', borderRadius: 99, border: 'none',
                background: filter === f.key ? '#d3ebff' : '#f0f2f5',
                color: filter === f.key ? '#4356a0' : '#667781',
                fontSize: 13, fontWeight: filter === f.key ? 700 : 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Sora, sans-serif', flexShrink: 0,
                transition: 'all 0.15s',
                outline: filter === f.key ? '1.5px solid #93c5fd' : 'none',
              }}
            >
              {f.label}
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
          filtered.map(conv => (
            <ConvItem key={conv.id} conv={conv} onClick={() => onSelect(conv.id)} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        style={{
          position: 'absolute', bottom: 76, right: 20,
          width: 56, height: 56, borderRadius: '50%',
          background: '#25D366', border: 'none',
          boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', zIndex: 10,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      </button>
    </div>
  )
}
