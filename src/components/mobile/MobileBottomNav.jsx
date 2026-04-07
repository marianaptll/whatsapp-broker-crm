const TABS = [
  {
    key: 'atualizacoes',
    label: 'Atualizações',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    key: 'ligacoes',
    label: 'Ligações',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
  {
    key: 'comunidades',
    label: 'Comunidades',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    key: 'conversas',
    label: 'Conversas',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#25D366' : 'none'} stroke={active ? '#25D366' : 'currentColor'} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    key: 'voce',
    label: 'Você',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
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
      flexShrink: 0,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange?.(tab.key)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3, border: 'none', background: 'transparent',
              color: active ? '#25D366' : '#667781',
              fontSize: 10.5, fontWeight: active ? 700 : 400,
              fontFamily: 'Sora, sans-serif', cursor: 'pointer',
              padding: '10px 4px 8px',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              {tab.icon(active)}
              {/* Unread badge on Conversas tab */}
              {tab.key === 'conversas' && unreadCount > 0 && (
                <div style={{
                  position: 'absolute', top: -4, right: -8,
                  background: '#25D366', color: '#fff',
                  borderRadius: 99, fontSize: 10, fontWeight: 800,
                  minWidth: 17, height: 17, padding: '0 4px',
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
