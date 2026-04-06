export default function MobileBottomNav({ activeTab = 'conversas', onTabChange }) {
  const tabs = [
    {
      key: 'conversas',
      label: 'Conversas',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
    {
      key: 'leads',
      label: 'Leads',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
    },
    {
      key: 'agenda',
      label: 'Agenda',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
    {
      key: 'mais',
      label: 'Mais',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      ),
    },
  ]

  return (
    <div style={{
      display: 'flex',
      background: '#fff',
      borderTop: '1px solid #e2e8f0',
      height: 60,
      flexShrink: 0,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(tab => {
        const active = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange?.(tab.key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              border: 'none',
              background: 'transparent',
              color: active ? '#25D366' : '#94a3b8',
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              fontFamily: 'Sora, sans-serif',
              cursor: 'pointer',
              padding: '8px 4px',
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute',
                top: 0, left: '25%', right: '25%',
                height: 2,
                background: '#25D366',
                borderRadius: '0 0 3px 3px',
              }} />
            )}
            {tab.icon(active)}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
