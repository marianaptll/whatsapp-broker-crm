// CRM navigation tabs — mirrors the desktop Sidebar menu
const TABS = [
  {
    key: 'inicio',
    label: 'Início',
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    key: 'leads',
    label: 'Leads',
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2"/>
        <path d="M8 10h8M8 14h5"/>
        <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    key: 'conversas',
    label: 'Conversas',
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24"
        fill={active ? '#25D366' : 'none'}
        stroke={active ? '#25D366' : 'currentColor'}
        strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    key: 'agenda',
    label: 'Agenda',
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    key: 'relatorios',
    label: 'Relatórios',
    icon: (active) => (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

export default function MobileBottomNav({ activeTab = 'conversas', onTabChange, unreadCount = 0 }) {
  return (
    <div style={{
      display: 'flex',
      background: '#fff',
      borderTop: '1px solid #e8e8e8',
      paddingBottom: 'env(safe-area-inset-bottom)',
      height: 60,
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange?.(tab.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              border: 'none', background: 'transparent',
              color: active ? '#25D366' : '#94a3b8',
              fontSize: 10, fontWeight: active ? 700 : 400,
              fontFamily: 'Sora, sans-serif', cursor: 'pointer',
              padding: '8px 2px',
              position: 'relative',
            }}
          >
            {/* Active indicator line at top */}
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '20%', right: '20%',
                height: 2, background: '#25D366', borderRadius: '0 0 2px 2px',
              }} />
            )}

            <div style={{ position: 'relative' }}>
              {tab.icon(active)}
              {tab.key === 'conversas' && unreadCount > 0 && (
                <div style={{
                  position: 'absolute', top: -5, right: -8,
                  background: '#25D366', color: '#fff',
                  borderRadius: 99, fontSize: 9.5, fontWeight: 800,
                  minWidth: 16, height: 16, padding: '0 3px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {unreadCount}
                </div>
              )}
            </div>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
