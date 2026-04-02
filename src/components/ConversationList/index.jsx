import { SearchIcon } from '../ui/Icons'
import ConvItem from './ConvItem'
import { AGENTS } from '../../data/mockData'

function filterConversations(conversations, filter, search) {
  return conversations.filter(c => {
    const matchSearch =
      !search ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())

    if (!matchSearch) return false

    if (filter === 'mine')       return c.assignedTo === 'a1' && c.status !== 'closed'
    if (filter === 'unassigned') return !c.assignedTo && c.status !== 'closed'
    if (filter === 'closed')     return c.status === 'closed'
    // agent view (a2, a3, a4…)
    const isAgent = AGENTS.some(a => a.id === filter)
    if (isAgent)                 return c.assignedTo === filter && c.status !== 'closed'
    return c.status !== 'closed'
  })
}

const STATUS_GROUPS = [
  { key: 'open',    label: 'Abertas',   color: '#25D366' },
  { key: 'pending', label: 'Pendentes', color: '#fbbf24' },
]

const BASE_FILTERS = [
  { key: 'mine',       label: 'Minhas conversas', dot: '#4356a0' },
  { key: 'unassigned', label: 'Sem atribuição',   dot: '#fb7185' },
  { key: 'closed',     label: 'Arquivadas',        dot: 'rgba(255,255,255,0.25)' },
]

export default function ConversationList({ conversations, activeId, onSelect, filter, setFilter, search, setSearch, onUpdate }) {
  const liderados = AGENTS.filter(a => a.id !== 'a1')
  const FILTERS = [
    ...BASE_FILTERS.slice(0, 1),
    ...liderados.map(a => ({ key: a.id, label: a.name, dot: a.color })),
    ...BASE_FILTERS.slice(1),
  ]

  const filtered = filterConversations(conversations, filter, search)
  const newCount = conversations.filter(c => c.unread > 0).length

  // Group by status when not in 'closed' filter
  const showGroups = filter !== 'closed'
  const groups = showGroups
    ? STATUS_GROUPS.map(g => ({ ...g, items: filtered.filter(c => c.status === g.key) })).filter(g => g.items.length > 0)
    : [{ key: 'closed', label: 'Arquivadas', color: 'rgba(255,255,255,0.3)', items: filtered }]

  return (
    <div style={{ width: 300, minWidth: 300, background: '#141a3d', display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>Conversas</span>
          {newCount > 0 && (
            <div style={{ background: '#25D366', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
              {newCount} novo{newCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar conversa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px 7px 34px', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'Sora, sans-serif' }}
          />
        </div>

      </div>

      {/* Inbox filters */}
      <div style={{ padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '6px 6px 4px' }}>
          Caixa de entrada
        </div>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '6px 8px', borderRadius: 7, border: 'none',
              background: filter === f.key ? 'rgba(255,255,255,0.09)' : 'transparent',
              color: filter === f.key ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: 12.5, fontWeight: filter === f.key ? 600 : 400,
              fontFamily: 'Sora, sans-serif', cursor: 'pointer',
              transition: 'all 0.13s', textAlign: 'left',
            }}
            onMouseEnter={e => { if (filter !== f.key) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { if (filter !== f.key) e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: f.dot ?? 'rgba(255,255,255,0.2)', flexShrink: 0, display: 'inline-block' }} />
            {f.label}
          </button>
        ))}
      </div>

      {/* List — grouped by status */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 4 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            Nenhuma conversa
          </div>
        ) : groups.map(group => (
          <div key={group.key}>
            {/* Group header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px 4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: group.color, flexShrink: 0, display: 'inline-block' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                {group.label}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                {group.items.length}
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
