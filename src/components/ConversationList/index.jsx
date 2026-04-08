import { useState, useRef, useEffect } from 'react'
import { SearchIcon } from '../ui/Icons'
import ConvItem from './ConvItem'
import { AGENTS, isWithin24h } from '../../data/mockData'

function filterConversations(conversations, filter, search) {
  return conversations.filter(c => {
    const matchSearch =
      !search ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())

    if (!matchSearch) return false

    if (filter === 'mine')   return c.assignedTo === 'a1' && c.status !== 'closed'
    if (filter === 'closed') return c.status === 'closed'
    const isAgent = AGENTS.some(a => a.id === filter)
    if (isAgent)             return c.assignedTo === filter && c.status !== 'closed'
    return c.status !== 'closed'
  })
}

const DROPDOWN_EXTRAS = [
  { key: 'closed', label: 'Arquivadas', dot: '#94a3b8' },
]

function ChevronIcon({ open }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', opacity: 0.4, flexShrink: 0 }}>
      <path d="M2 3.5L5 6.5L8 3.5" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ConversationList({ conversations, activeId, onSelect, filter, setFilter, search, setSearch, onUpdate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  const liderados = AGENTS.filter(a => a.id !== 'a1')
  const dropdownPrimary = [
    { key: 'mine', label: 'Minhas conversas', dot: '#4356a0' },
    ...liderados.map(a => ({ key: a.id, label: a.name, dot: a.color })),
  ]
  const allDropdownOptions = [...dropdownPrimary, ...DROPDOWN_EXTRAS]

  const currentOption = allDropdownOptions.find(o => o.key === filter) || dropdownPrimary[0]

  const filtered = filterConversations(conversations, filter, search)
  const newCount = conversations.filter(c => c.unread > 0).length
  const activeCount = conversations.filter(c => c.status !== 'closed').length

  const showGroups = filter !== 'closed'
  const groups = showGroups
    ? [
        { key: 'abertas',  label: 'Abertas',  color: '#22c55e', items: filtered.filter(c => isWithin24h(c.lastTime)) },
        { key: 'fechadas', label: 'Fechadas', color: '#ef4444', items: filtered.filter(c => !isWithin24h(c.lastTime)) },
      ].filter(g => g.items.length > 0)
    : [{ key: 'closed', label: 'Arquivadas', color: '#94a3b8', items: filtered }]

  return (
    <div style={{ width: 300, minWidth: 300, background: '#f8fafc', display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid #e2e8f0', flexShrink: 0 }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>

        {/* Title row */}
        <div style={{ marginBottom: 10 }}>
          <span style={{ color: '#0f172a', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>Conversas</span>
        </div>

        {/* Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative', marginBottom: 8 }}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: dropdownOpen ? '#f1f5f9' : '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: dropdownOpen ? '8px 8px 0 0' : 8,
              padding: '7px 10px', color: '#334155',
              fontSize: 12.5, fontWeight: 600, fontFamily: 'Sora, sans-serif', cursor: 'pointer',
              transition: 'background 0.13s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: currentOption.dot, flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentOption.label}</span>
            </div>
            <ChevronIcon open={dropdownOpen} />
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderTop: 'none',
              borderRadius: '0 0 9px 9px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}>
              {dropdownPrimary.slice(0, 1).map(opt => (
                <DropItem key={opt.key} opt={opt} active={filter === opt.key} onClick={() => { setFilter(opt.key); setDropdownOpen(false) }} />
              ))}
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '2px 0' }} />
              {dropdownPrimary.slice(1).map(opt => (
                <DropItem key={opt.key} opt={opt} active={filter === opt.key} onClick={() => { setFilter(opt.key); setDropdownOpen(false) }} />
              ))}
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '2px 0' }} />
              {DROPDOWN_EXTRAS.map(opt => (
                <DropItem key={opt.key} opt={opt} active={filter === opt.key} onClick={() => { setFilter(opt.key); setDropdownOpen(false) }} dim />
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <SearchIcon color="#94a3b8" />
          </div>
          <input
            type="text"
            placeholder="Buscar conversa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 8, padding: '7px 10px 7px 34px',
              color: '#334155', fontSize: 12, fontFamily: 'Sora, sans-serif',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 4 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Nenhuma conversa
          </div>
        ) : groups.map(group => (
          <div key={group.key}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px 6px', marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: group.color, flexShrink: 0, boxShadow: `0 0 0 3px ${group.color}22` }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', letterSpacing: '-0.01em' }}>
                  {group.label}
                </span>
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: group.color, background: `${group.color}18`, border: `1.5px solid ${group.color}55`, borderRadius: 6, padding: '1px 7px' }}>
                {group.items.length} conversas
              </span>
            </div>
            {group.items.map(conv => (
              <ConvItem
                key={conv.id}
                conv={conv}
                active={conv.id === activeId}
                onClick={() => onSelect(conv.id)}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function DropItem({ opt, active, onClick, dim }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px', border: 'none',
        background: active ? '#d3ebff' : hov ? '#f8fafc' : 'transparent',
        color: active ? '#1d4ed8' : dim ? '#94a3b8' : '#475569',
        fontSize: 12.5, fontWeight: active ? 600 : 400,
        fontFamily: 'Sora, sans-serif', cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.1s',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
      {opt.label}
      {active && <span style={{ marginLeft: 'auto', color: '#25D366', fontSize: 11 }}>✓</span>}
    </button>
  )
}
