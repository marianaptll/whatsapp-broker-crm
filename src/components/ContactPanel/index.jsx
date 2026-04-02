import { useState } from 'react'
import Avatar from '../ui/Avatar'
import { Section, Row } from '../ui/Section'
import { WaIcon, PlusIcon, XIcon } from '../ui/Icons'
import { AGENTS, TAGS } from '../../data/mockData'

function getConversionScore(conv) {
  const highTags    = ['t4', 't5'] // VIP, Qualificado
  const hotStages   = ['Proposta Enviada', 'Fechamento', 'Negociação']
  const coldStages  = ['Primeiro Contato']

  const hasHighTag  = conv.tags.some(t => highTags.includes(t))
  const isHotStage  = hotStages.includes(conv.leadStage)
  const isColdStage = coldStages.includes(conv.leadStage) && !hasHighTag

  if (hasHighTag && isHotStage) return { label: '🔥 Alta chance de conversão', color: '#059669', bg: '#dcfce7', border: '#bbf7d0' }
  if (hasHighTag || isHotStage) return { label: '💼 Em negociação',             color: '#d97706', bg: '#fef3c7', border: '#fde68a' }
  if (isColdStage)              return { label: '❄️ Lead frio',                  color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0' }
  return                               { label: '📊 Em andamento',               color: '#4356a0', bg: '#eef2ff', border: '#c7d2fe' }
}

function TagPicker({ conv, onUpdate, onClose }) {
  const available = TAGS.filter(t => !conv.tags.includes(t.id))
  return (
    <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, minWidth: 150, overflow: 'hidden' }}>
      {available.length === 0 ? (
        <div style={{ padding: '10px 12px', fontSize: 12, color: '#94a3b8' }}>Todas as tags aplicadas</div>
      ) : available.map(t => (
        <div
          key={t.id}
          onClick={() => { onUpdate(conv.id, { tags: [...conv.tags, t.id] }); onClose() }}
          style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span className="tag-badge" style={{ background: t.bg, color: t.color }}>{t.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function ContactPanel({ conv, onUpdate }) {
  const [sections, setSections] = useState({ crm: true, contact: false })
  const [showTagPicker, setShowTagPicker] = useState(false)

  const toggle = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }))

  if (!conv) return <div style={{ width: 280, background: '#fff', borderLeft: '1px solid #e2e8f0', flexShrink: 0 }} />

  const convTags = TAGS.filter(t => conv.tags.includes(t.id))
  const agent    = AGENTS.find(a => a.id === conv.assignedTo)
  const score    = getConversionScore(conv)

  const removeTag = (tagId) => {
    onUpdate(conv.id, { tags: conv.tags.filter(t => t !== tagId) })
  }

  return (
    <div style={{ width: 280, minWidth: 280, background: '#fff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>

      {/* Contact header */}
      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(160deg, #f8fafc 0%, #fff 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar initials={conv.avatar} color={conv.avatarColor} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.contactName}</div>
            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 1 }}>{conv.contactJob}</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{conv.contactCompany}</div>
          </div>
        </div>

        {/* Conversion score */}
        <div style={{ marginTop: 12, padding: '7px 10px', background: score.bg, border: `1px solid ${score.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: score.color }}>{score.label}</span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
          {convTags.map(t => (
            <span key={t.id} className="tag-badge" style={{ background: t.bg, color: t.color, display: 'flex', alignItems: 'center', gap: 4 }}>
              {t.label}
              <span onClick={() => removeTag(t.id)} style={{ cursor: 'pointer', opacity: 0.6, display: 'flex' }}>
                <XIcon />
              </span>
            </span>
          ))}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowTagPicker(!showTagPicker)}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: 99, padding: '2px 8px', fontSize: 10, fontWeight: 700, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'Sora, sans-serif' }}
            >
              <PlusIcon /> Tag
            </button>
            {showTagPicker && <TagPicker conv={conv} onUpdate={onUpdate} onClose={() => setShowTagPicker(false)} />}
          </div>
        </div>

      </div>

      {/* Pipeline & CRM */}
      <Section title="Pipeline & CRM" open={sections.crm} onToggle={() => toggle('crm')}>

        {conv.dealValue !== '—' && (
          <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Valor estimado</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>{conv.dealValue}</div>
          </div>
        )}

        <Row label="Pipeline"   value={conv.pipeline} />
        <Row label="Estágio"    value={conv.leadStage} highlight />
        <Row label="Origem"     value={conv.origin ?? '—'} />
        <Row label="Criado em"  value={conv.createdAt} />
        <Row label="Atribuído" isNode value={
          agent
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Avatar initials={agent.avatar} color={agent.color} size={16} />{agent.name}</span>
            : <span style={{ color: '#f87171', fontSize: 11.5 }}>Sem atribuição</span>
        } />
        <Row label="Canal" isNode value={
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <WaIcon size={12} /> WhatsApp
          </span>
        } />
      </Section>

      {/* Contact details */}
      <Section title="Contato" open={sections.contact} onToggle={() => toggle('contact')}>
        <Row label="Telefone" value={conv.contactPhone} />
        <Row label="E-mail"   value={conv.contactEmail} />
        <Row label="Empresa"  value={conv.contactCompany} />
        <Row label="Cargo"    value={conv.contactJob} />
      </Section>

    </div>
  )
}
