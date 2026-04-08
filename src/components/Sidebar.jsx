import { WaIcon } from './ui/Icons'
import logoClaro from '../imagem/logo_leadhub_claro.png'

function HomeIcon()         { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg> }
function GestaoIcon()       { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> }
function AgendaIcon()       { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function LeadsIcon()        { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 10h8M8 14h5"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></svg> }
function AcessosIcon()      { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> }
function DistribuicaoIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> }
function RelatoriosIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }

const MENU_SECTIONS = [
  {
    label: 'Menu',
    items: [
      { key: 'inicio',   label: 'Início',  icon: <HomeIcon /> },
      { key: 'gestao',   label: 'Gestão',  icon: <GestaoIcon /> },
    ],
  },
  {
    label: 'CRM',
    items: [
      { key: 'agenda',       label: 'Agenda',       icon: <AgendaIcon /> },
      { key: 'leads',        label: 'Leads',        icon: <LeadsIcon /> },
      { key: 'conversas',    label: 'Conversas',    icon: <WaIcon size={16} /> },
      { key: 'acessos',      label: 'Acessos',      icon: <AcessosIcon /> },
      { key: 'distribuicao', label: 'Distribuição', icon: <DistribuicaoIcon /> },
      { key: 'relatorios',   label: 'Relatórios',   icon: <RelatoriosIcon /> },
    ],
  },
]

export default function Sidebar({ activePage = 'conversas', onNavigate }) {
  return (
    <div style={{
      width: 200,
      minWidth: 200,
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      borderRight: '1px solid #e2e8f0',
      paddingBottom: 16,
      zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: 8,
        padding: '0 16px',
        flexShrink: 0,
      }}>
        <img src={logoClaro} alt="LeadHub" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Nav sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '0 10px', overflowY: 'auto' }}>
        {MENU_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94a3b8', padding: '10px 8px 4px' }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const isActive = item.key === activePage
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate?.(item.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '8px 10px', borderRadius: 8, border: 'none',
                    background: isActive ? '#d3ebff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#475569',
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    fontFamily: 'Sora, sans-serif', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.13s',
                    outline: isActive ? '1.5px solid #93c5fd' : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} className="pulse-dot" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
