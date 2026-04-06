import { useState } from 'react'
import Avatar from '../ui/Avatar'
import { WaIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'

const THERMO_LEVELS = [
  { key: 'sem-perfil', label: 'Sem Perfil',   icon: '🧊' },
  { key: 'indefinido', label: 'Indefinido',   icon: '😐' },
  { key: 'potencial',  label: 'Em potencial', icon: '🔥' },
]

function getThermoLevel(conv) {
  const highTags  = ['t4', 't5']
  const hotStages = ['Proposta Enviada', 'Fechamento', 'Negociação', 'Contrato Pendente', 'Negociação Final']
  const hasHighTag = conv.tags.some(t => highTags.includes(t))
  const isHotStage = hotStages.includes(conv.leadStage)
  const isCold     = conv.leadStage === 'Primeiro Contato' && !hasHighTag
  if (hasHighTag || isHotStage) return 2
  if (isCold)                   return 0
  return 1
}

function InfoRow({ label, value, isNode }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '11px 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, minWidth: 100 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500, textAlign: 'right', flex: 1 }}>
        {isNode ? value : (value || '—')}
      </span>
    </div>
  )
}

function SectionHeader({ title, open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '14px 0 10px',
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: open ? 'none' : '1px solid #f1f5f9',
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{title}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
  )
}

export default function MobileContactView({ conv, onUpdate, onBack }) {
  const [sections, setSections] = useState({ info: true, deal: true })
  const toggle = key => setSections(prev => ({ ...prev, [key]: !prev[key] }))

  if (!conv) return null

  const agent = AGENTS.find(a => a.id === conv.assignedTo)
  const thermoLevel = getThermoLevel(conv)
  const total = THERMO_LEVELS.length - 1

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#f8fafc',
    }}>
      {/* Header */}
      <div style={{
        background: '#4356a0',
        paddingTop: 'env(safe-area-inset-top)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px 4px 4px 0', display: 'flex' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>Info do contato</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

        {/* Contact hero */}
        <div style={{
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 20px 20px',
          borderBottom: '8px solid #f1f5f9',
        }}>
          <Avatar initials={conv.avatar} color={conv.avatarColor} size={72} />
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#0f172a', letterSpacing: '-0.02em' }}>{conv.contactName}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{conv.contactCompany}</div>
            <div style={{ fontSize: 13, color: '#667781', marginTop: 2 }}>{conv.contactPhone}</div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
            {[
              { label: 'Mensagem', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
              { label: 'Ligar', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> },
              { label: 'E-mail', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
            ].map(action => (
              <button
                key={action.label}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: '#4356a0',
                }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {action.icon}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lead Thermometer */}
        <div style={{ background: '#fff', padding: '16px 20px', borderBottom: '8px solid #f1f5f9' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Qualificação do Lead</div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
            <div style={{ position: 'absolute', left: 26, right: 26, top: '50%', transform: 'translateY(-50%)', height: 3, background: '#e2e8f0', borderRadius: 99 }} />
            {thermoLevel > 0 && (
              <div style={{
                position: 'absolute', left: 26, height: 3, borderRadius: 99,
                background: '#3b82f6', top: '50%', transform: 'translateY(-50%)',
                width: `calc(${(thermoLevel / total) * 100}% - ${(thermoLevel / total) * 52}px)`,
              }} />
            )}
            {THERMO_LEVELS.map((level, i) => (
              <div key={level.key} style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: i === thermoLevel ? 24 : 18, opacity: i > thermoLevel ? 0.3 : 1, display: 'block' }}>
                  {level.icon}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0' }}>
            {THERMO_LEVELS.map((level, i) => (
              <span key={level.key} style={{
                fontSize: 11, fontWeight: i === thermoLevel ? 700 : 400,
                color: i === thermoLevel ? '#3b82f6' : '#94a3b8',
                textAlign: 'center', flex: 1,
              }}>
                {level.label}
              </span>
            ))}
          </div>
        </div>

        {/* Informações section */}
        <div style={{ background: '#fff', padding: '0 20px', borderBottom: '8px solid #f1f5f9' }}>
          <SectionHeader title="Informações" open={sections.info} onToggle={() => toggle('info')} />
          {sections.info && (
            <div style={{ paddingBottom: 6 }}>
              <InfoRow label="Telefone"    value={conv.contactPhone} />
              <InfoRow label="E-mail"      value={conv.contactEmail} />
              <InfoRow label="Empresa"     value={conv.contactCompany} />
              <InfoRow label="Responsável" isNode value={
                agent
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      <Avatar initials={agent.avatar} color={agent.color} size={18} />
                      {agent.name}
                    </span>
                  : '—'
              } />
              <InfoRow label="Fonte"       value={conv.origin} />
              <InfoRow label="Criado em"   value={conv.createdAt} />
              <InfoRow label="Canal" isNode value={
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <WaIcon size={14} /> WhatsApp
                </span>
              } />
            </div>
          )}
        </div>

        {/* Negócio section */}
        <div style={{ background: '#fff', padding: '0 20px', marginBottom: 24 }}>
          <SectionHeader title="Negócio" open={sections.deal} onToggle={() => toggle('deal')} />
          {sections.deal && (
            <div style={{ paddingBottom: 12 }}>
              {conv.dealValue && conv.dealValue !== '—' && (
                <div style={{
                  background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                  border: '1px solid #bbf7d0',
                  borderRadius: 12, padding: '14px 16px', marginBottom: 12,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Crédito
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                    {conv.dealValue}
                  </div>
                </div>
              )}
              <InfoRow label="Etapa"    value={conv.leadStage} />
              <InfoRow label="Pipeline" value={conv.pipeline} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
