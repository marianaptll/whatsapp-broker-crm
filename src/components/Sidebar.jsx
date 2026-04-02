import { WaIcon } from './ui/Icons'

const NAV_ITEMS = [
  { key: 'whatsapp', label: 'WhatsApp Broker', icon: <WaIcon size={17} />, active: true },
]

export default function Sidebar() {
  return (
    <div style={{
      width: 200,
      minWidth: 200,
      background: '#0d1128',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      paddingBottom: 16,
      zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 10,
        padding: '0 16px',
        flexShrink: 0,
      }}>
        <img src="/logo_leadhub_dark_mode.png" alt="Logo" style={{ height: 44, objectFit: 'contain' }} />
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px' }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, border: 'none',
              background: item.active ? 'rgba(37,211,102,0.15)' : 'transparent',
              color: item.active ? '#25D366' : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: item.active ? 700 : 500,
              fontFamily: 'Sora, sans-serif', cursor: 'pointer',
              position: 'relative', transition: 'all 0.15s', textAlign: 'left',
              outline: item.active ? '1.5px solid rgba(37,211,102,0.3)' : 'none',
            }}
          >
            <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.active && (
              <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#25D366', flexShrink: 0 }} className="pulse-dot" />
            )}
          </button>
        ))}
      </div>

    </div>
  )
}
