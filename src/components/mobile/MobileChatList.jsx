import { useState, useRef, useEffect } from 'react'
import Avatar from '../ui/Avatar'
import { WaIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'
import logoClaro from '../../imagem/logo_leadhub_claro.png'

function isWithin24h(lastTime) {
  return /^\d{1,2}:\d{2}$/.test(lastTime)
}

function filterConversations(conversations, filter, search) {
  return conversations.filter(c => {
    const matchSearch =
      !search ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (filter === 'mine')   return c.assignedTo === 'a1' && c.status !== 'closed'
    if (filter === 'closed') return c.status === 'closed'
    if (filter === 'all')    return true
    if (filter === 'waiting') return c.messages[c.messages.length - 1]?.type === 'received' && c.status !== 'closed'
    const isAgent = AGENTS.some(a => a.id === filter)
    if (isAgent) return c.assignedTo === filter && c.status !== 'closed'
    return c.status !== 'closed'
  })
}

function MobileChatItem({ conv, active, onClick }) {
  const lastMsg = conv.messages[conv.messages.length - 1]
  const waitingAgent = lastMsg?.type === 'received'

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: active ? '#f0fdf4' : '#fff',
        borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer',
        transition: 'background 0.12s',
        minHeight: 72,
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar initials={conv.avatar} color={conv.avatarColor} size={48} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          background: '#fff', borderRadius: '50%', padding: 2,
          boxShadow: '0 0 0 1px #f1f5f9',
        }}>
          <WaIcon size={12} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <span style={{
            fontWeight: conv.unread > 0 ? 700 : 600,
            fontSize: 15,
            color: '#111B21',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: 200,
          }}>
            {conv.contactName}
          </span>
          <span style={{
            fontSize: 11.5,
            color: conv.unread > 0 ? '#25D366' : '#667781',
            fontWeight: conv.unread > 0 ? 700 : 400,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginLeft: 8,
          }}>
            {conv.lastTime}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            {lastMsg?.type === 'sent' && (
              <svg width="14" height="14" viewBox="0 0 16 11" fill="none" style={{ flexShrink: 0 }}>
                <path d="M1 5.5l4 4L15 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 5.5l4 4" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span style={{
              fontSize: 13,
              color: waitingAgent ? '#111B21' : '#667781',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              fontWeight: waitingAgent ? 500 : 400,
            }}>
              {conv.lastMessage}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0, marginLeft: 8 }}>
            {conv.unread > 0 && (
              <div style={{
                background: '#25D366',
                color: '#fff',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                minWidth: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 5px',
              }}>
                {conv.unread}
              </div>
            )}
            {conv.status !== 'closed' && waitingAgent && !conv.unread && (
              <div style={{
                background: '#fbebbb',
                color: '#92400e',
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 700,
                padding: '2px 5px',
                whiteSpace: 'nowrap',
              }}>
                Aguardando
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const FILTER_CHIPS = [
  { key: 'mine',    label: 'Minhas' },
  { key: 'all',     label: 'Todas' },
  { key: 'waiting', label: 'Aguardando' },
  { key: 'closed',  label: 'Arquivadas' },
]

export default function MobileChatList({ conversations, activeId, onSelect, filter, setFilter, search, setSearch, onUpdate }) {
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (showSearch) searchRef.current?.focus()
  }, [showSearch])

  const filtered = filterConversations(conversations, filter, search)
  const totalUnread = conversations.filter(c => c.unread > 0).length

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fff',
    }}>
      {/* Header */}
      <div style={{
        background: '#4356a0',
        paddingTop: 'env(safe-area-inset-top)',
        flexShrink: 0,
      }}>
        {showSearch ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 12px 10px' }}>
            <button
              onClick={() => { setShowSearch(false); setSearch('') }}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 6, display: 'flex' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div style={{
              flex: 1,
              background: '#fff',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              padding: '8px 14px',
              gap: 8,
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
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: 15, color: '#111B21',
                  background: 'transparent',
                  fontFamily: 'Sora, sans-serif',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 12px' }}>
            <img src={logoClaro} alt="LeadHub" style={{ height: 28, objectFit: 'contain' }} />
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {totalUnread > 0 && (
                <div style={{
                  background: '#25D366',
                  color: '#fff',
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  minWidth: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px',
                  marginRight: 4,
                }}>
                  {totalUnread}
                </div>
              )}
              <button
                onClick={() => setShowSearch(true)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8, display: 'flex', borderRadius: 8 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
              <button
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8, display: 'flex', borderRadius: 8 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div style={{
          display: 'flex',
          gap: 6,
          padding: '0 12px 12px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {FILTER_CHIPS.map(chip => (
            <button
              key={chip.key}
              onClick={() => setFilter(chip.key)}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: 'none',
                background: filter === chip.key ? '#fff' : 'rgba(255,255,255,0.18)',
                color: filter === chip.key ? '#4356a0' : '#fff',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'Sora, sans-serif',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Nenhuma conversa</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Tente outro filtro</div>
          </div>
        ) : (
          filtered.map(conv => (
            <MobileChatItem
              key={conv.id}
              conv={conv}
              active={conv.id === activeId}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        style={{
          position: 'absolute',
          bottom: 76,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          zIndex: 10,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onTouchStart={e => e.currentTarget.style.transform = 'scale(0.93)'}
        onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
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
