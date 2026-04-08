import { useState } from 'react'
import Avatar from '../ui/Avatar'
import { Section, Row } from '../ui/Section'
import { WaIcon } from '../ui/Icons'
import { AGENTS, THERMO_LEVELS, getThermoLevel } from '../../data/mockData'

function LeadThermometer({ conv }) {
  const current = getThermoLevel(conv)
  const total = THERMO_LEVELS.length - 1

  return (
    <div style={{ marginTop: 12, marginBottom: 2 }}>
      {/* Icons + track */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
        {/* Track background */}
        <div style={{ position: 'absolute', left: 26, right: 26, top: '50%', transform: 'translateY(-50%)', height: 2, background: '#e2e8f0', borderRadius: 99 }} />
        {/* Track fill */}
        {current > 0 && (
          <div style={{
            position: 'absolute', left: 26, height: 2, borderRadius: 99,
            background: '#3b82f6', top: '50%', transform: 'translateY(-50%)',
            width: `calc(${(current / total) * 100}% - ${(current / total) * 52}px)`,
          }} />
        )}
        {THERMO_LEVELS.map((level, i) => (
          <div key={level.key} style={{ position: 'relative', zIndex: 1, lineHeight: 1 }}>
            <span style={{
              fontSize: i === current ? 20 : 16,
              opacity: i > current ? 0.35 : 1,
              transition: 'all 0.25s ease',
              display: 'block',
            }}>
              {level.icon}
            </span>
          </div>
        ))}
      </div>
      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 4px 0' }}>
        {THERMO_LEVELS.map((level, i) => (
          <span key={level.key} style={{
            fontSize: 10,
            fontWeight: i === current ? 700 : 400,
            color: i === current ? '#3b82f6' : '#94a3b8',
            textAlign: 'center', flex: 1,
          }}>
            {level.label}
          </span>
        ))}
      </div>
    </div>
  )
}


export default function ContactPanel({ conv, onUpdate, open, onToggle }) {
  const [sections, setSections] = useState({ info: true, deal: true })
  const toggle = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }))

  const agent = conv ? AGENTS.find(a => a.id === conv.assignedTo) : null

  return (
    <div style={{
      width: open ? 280 : 32,
      minWidth: open ? 280 : 32,
      background: '#fff',
      borderLeft: '1px solid #e2e8f0',
      flexShrink: 0,
      overflow: 'hidden',
      position: 'relative',
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>

      {/* Collapsed: expand button */}
      <div style={{
        position: 'absolute', top: 12, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: open ? 0 : 1,
        pointerEvents: open ? 'none' : 'auto',
        transition: 'opacity 0.2s ease 0.15s',
        zIndex: 2,
      }}>
        <button
          onClick={onToggle}
          title="Expandir painel"
          style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'background 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Expanded content */}
      <div style={{
        width: 280,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: '100%',
      }}>
        {conv && (
          <>
            {/* Header */}
            <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(160deg, #f8fafc 0%, #fff 100%)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Avatar initials={conv.avatar} color={conv.avatarColor} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.contactName}</div>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{conv.contactCompany}</div>
                </div>
                <button
                  onClick={onToggle}
                  title="Recolher painel"
                  style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexShrink: 0, transition: 'background 0.13s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Thermometer */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 180 }}>
                  <LeadThermometer conv={conv} />
                </div>
              </div>

            </div>

            {/* Informações */}
            <Section title="Informações" open={sections.info} onToggle={() => toggle('info')}>
              <Row label="Telefone"    value={conv.contactPhone   ?? '—'} />
              <Row label="E-mail"      value={conv.contactEmail   ?? '—'} />
              <Row label="Empresa"     value={conv.contactCompany ?? '—'} />
              <Row label="Responsável" isNode value={
                agent
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Avatar initials={agent.avatar} color={agent.color} size={16} />{agent.name}</span>
                  : '—'
              } />
              <Row label="Fonte"       value={conv.origin    ?? '—'} />
              <Row label="Criado em"   value={conv.createdAt ?? '—'} />
              <Row label="Canal"       isNode value={
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <WaIcon size={12} /> WhatsApp
                </span>
              } />
            </Section>

            {/* Negócio */}
            <Section title="Negócio" open={sections.deal} onToggle={() => toggle('deal')}>
              {conv.dealValue && conv.dealValue !== '—' && (
                <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Crédito</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>{conv.dealValue}</div>
                </div>
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
