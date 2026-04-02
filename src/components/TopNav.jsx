import Avatar from './ui/Avatar'
import { BellIcon } from './ui/Icons'

export default function TopNav() {
  return (
    <div style={{ height: 52, background: '#0d1128', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 0, zIndex: 10, flexShrink: 0 }}>
      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
          <BellIcon />
          <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #0d1128' }} />
        </div>
        <Avatar initials="V" color="#4356a0" size={32} />
      </div>
    </div>
  )
}
