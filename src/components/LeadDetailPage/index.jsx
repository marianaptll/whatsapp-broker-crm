import { useState } from 'react'
import { AGENTS } from '../../data/mockData'
import { FonteIcon } from '../ui/Icons'

// ─── Expand action button (hover: circle → pill with label + glow) ─────────────
function ActionButton({ icon, label, color, onClick, disabled = false }) {
  const [hov, setHov] = useState(false)
  const from = color

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Glow layer */}
      <div style={{
        position: 'absolute', top: 8, left: 0, right: 0, bottom: -6,
        borderRadius: 99,
        background: from,
        filter: 'blur(12px)',
        opacity: hov ? 0.45 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: 'relative', zIndex: 1,
          height: 42,
          width: hov ? 130 : 42,
          borderRadius: 99,
          border: 'none',
          cursor: disabled ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'width 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.35s ease',
          background: from,
          boxShadow: hov ? 'none' : '0 2px 8px rgba(14,165,233,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Sora, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Icon — fades out on hover */}
        <span style={{
          position: 'absolute',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          opacity: hov ? 0 : 1,
          transform: hov ? 'scale(0)' : 'scale(1)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}>
          {icon}
        </span>

        {/* Label — fades in on hover */}
        <span style={{
          color: '#fff',
          fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
          opacity: hov ? 1 : 0,
          transform: hov ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 0.25s ease 0.12s, transform 0.25s ease 0.12s',
          userSelect: 'none',
        }}>
          {label}
        </span>
      </button>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseDealInt(str) {
  if (!str) return 0
  return parseInt(str.replace('R$ ', '').replace(/\./g, ''), 10) || 0
}

function fmtBRL(n) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getModalidade(dealValue) {
  const v = parseDealInt(dealValue)
  if (v >= 200000) return 'Imóvel'
  if (v >= 50000)  return 'Veículo'
  return 'Moto'
}

function getParcela(dealValue) {
  const v = parseDealInt(dealValue)
  if (!v) return 'R$ 0,00'
  return fmtBRL(Math.round(v / 160))
}

function getActiveStatus(conv) {
  if (!conv) return null
  if (conv.status === 'pending') return 'Tentando Contato'
  if (conv.status === 'closed') {
    return conv.pipeline === 'Pós-venda' ? 'Venda Realizada' : null
  }
  if (conv.pipeline === 'Negociação' || conv.pipeline === 'Fechamento') return 'Em Negociação'
  return 'Em Atendimento'
}

function getThermoValue(pipeline) {
  const map = { 'Prospecção': 8, 'Qualificação': 33, 'Negociação': 58, 'Fechamento': 82, 'Pós-venda': 100 }
  return map[pipeline] ?? 50
}

// ─── STATUS FLOW ──────────────────────────────────────────────────────────────
const STATUS_STEPS = [
  'Novo',
  'Tentando Contato',
  'Em Atendimento',
  'Em Negociação',
  'Aguardando Comprovante',
  'Venda Realizada',
]

function FluxoStatus({ conv }) {
  const active = getActiveStatus(conv)

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '16px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
        {/* sparkle icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Fluxo de Status</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {STATUS_STEPS.map(step => {
          const isActive = step === active
          return (
            <div
              key={step}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8,
                background: isActive ? '#eff6ff' : 'transparent',
                cursor: 'default',
              }}
            >
              {/* radio circle */}
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: isActive ? '2px solid #3b82f6' : '2px solid #cbd5e1',
                background: isActive ? '#3b82f6' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isActive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ fontSize: 13, color: isActive ? '#1d4ed8' : '#64748b', fontWeight: isActive ? 600 : 400 }}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── INFO FIELD ───────────────────────────────────────────────────────────────
function InfoField({ icon, label, value, emptyLabel = 'Não informado' }) {
  const isEmpty = !value
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ color: '#94a3b8', flexShrink: 0, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#64748b', flexShrink: 0, minWidth: 90 }}>{label}:</span>
      <span style={{ fontSize: 13, color: isEmpty ? '#94a3b8' : '#1e293b', fontWeight: isEmpty ? 400 : 500 }}>
        {isEmpty ? emptyLabel : value}
      </span>
    </div>
  )
}

// ─── NEGOCIO FIELD ────────────────────────────────────────────────────────────
function NegField({ icon, label, value, emptyLabel = 'Não informado' }) {
  const isEmpty = !value || value === 'R$ 0,00'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ color: '#94a3b8', flexShrink: 0, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#64748b', flexShrink: 0, minWidth: 80 }}>{label}:</span>
      <span style={{ fontSize: 13, color: isEmpty ? '#94a3b8' : '#1e293b', fontWeight: isEmpty ? 400 : 600 }}>
        {isEmpty ? emptyLabel : value}
      </span>
    </div>
  )
}

// ─── THERMOMETER ──────────────────────────────────────────────────────────────
function Termometro({ pipeline }) {
  const value = getThermoValue(pipeline)
  let label = 'Sem Perfil'
  if (value > 60) label = 'Em potencial'
  else if (value > 20) label = 'Indefinido'

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Termômetro do Lead</span>
      </div>

      {/* Track with emojis */}
      <div style={{ position: 'relative', padding: '0 8px' }}>
        {/* Emoji row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🧊</span>
          <span style={{ fontSize: 22 }}>😐</span>
          <span style={{ fontSize: 22 }}>🔥</span>
        </div>

        {/* Track */}
        <div style={{ position: 'relative', height: 6, background: '#e2e8f0', borderRadius: 99, marginBottom: 8 }}>
          {/* Filled portion */}
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${value}%`,
            background: value > 60 ? '#ef4444' : value > 30 ? '#f59e0b' : '#3b82f6',
            borderRadius: 99,
            transition: 'width 0.4s ease',
          }} />
          {/* Thumb */}
          <div style={{
            position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
            left: `${value}%`,
            width: 14, height: 14, borderRadius: '50%',
            background: '#fff', border: '3px solid',
            borderColor: value > 60 ? '#ef4444' : value > 30 ? '#f59e0b' : '#3b82f6',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }} />
          {/* Dots at 0%, 50%, 100% */}
          {[0, 50, 100].map(pos => (
            <div key={pos} style={{
              position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
              left: `${pos}%`,
              width: 6, height: 6, borderRadius: '50%',
              background: pos <= value ? (value > 60 ? '#ef4444' : value > 30 ? '#f59e0b' : '#3b82f6') : '#cbd5e1',
            }} />
          ))}
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['Sem Perfil', 'Indefinido', 'Em potencial'].map((lbl, i) => (
            <span key={lbl} style={{
              fontSize: 11, fontWeight: lbl === label ? 700 : 400,
              color: lbl === label ? '#1e293b' : '#94a3b8',
              textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center',
              flex: 1,
            }}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function LeadDetailPage({ conv, onBack, onGoToChat }) {
  if (!conv) return null
  const agent = AGENTS.find(a => a.id === conv.assignedTo)
  const firstMsgTime = conv.messages?.[0]?.time || '00:00'
  const dealV = parseDealInt(conv.dealValue)

  // SVG icons reused
  const PhoneIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  )
  const MailIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  )
  const PinIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
  const PersonIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
  const CalIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
  const DollarIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  )
  const BriefIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
    </svg>
  )
  const ClockIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
  const ChartIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
  const ArrowDownIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  )
  const TagIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )
  const HomeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
  const EditIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
  const InfoIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
  const DocIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>
    </svg>
  )
  const ImgIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f0f2f5', overflow: 'hidden' }}>

      {/* ── Back bar ── */}
      <div style={{ padding: '12px 24px', background: '#f0f2f5', flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 14px', borderRadius: 8,
            border: '1px solid #e2e8f0', background: '#fff',
            color: '#475569', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Voltar aos Leads
        </button>
      </div>

      {/* ── Main layout ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ width: 250, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Fluxo de Status */}
          <FluxoStatus conv={conv} />

          {/* Arquivar Lead */}
          <button style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '11px 0', borderRadius: 10,
            border: '1px solid #e2e8f0', background: '#fff',
            color: '#64748b', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
            Arquivar Lead
          </button>

          {/* Anúncio */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '16px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <ImgIcon />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Anúncio</span>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '28px 0', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
              Sem imagem do anúncio
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Contact header card */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {/* Avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: conv.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {conv.avatar}
            </div>
            {/* Name block */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>{conv.contactName}</div>
              {agent && <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{agent.name}</div>}
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{conv.contactCompany}</div>
            </div>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>

              {/* 1 — Ligação */}
              <ActionButton
                label="Ligação"
                color="#0ea5e9"
                disabled
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                }
              />

              {/* 2 — WhatsApp (abre wa.me) */}
              <ActionButton
                label="WhatsApp"
                color="#0ea5e9"
                onClick={() => window.open(`https://wa.me/${conv.contactPhone.replace(/\D/g, '')}`, '_blank')}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                }
              />

              {/* 3 — Conversas (navega para o chat) */}
              <ActionButton
                label="Conversas"
                color="#0ea5e9"
                onClick={() => onGoToChat(conv.id)}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                }
              />

              {/* 4 — E-mail */}
              <ActionButton
                label="E-mail"
                color="#0ea5e9"
                disabled
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                }
              />
            </div>
          </div>

          {/* Info + Negócio row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Informações */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <InfoIcon />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Informações</span>
                <button style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'default', color: '#94a3b8', display: 'flex', padding: 0 }}><EditIcon /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <InfoField icon={<PhoneIcon />} label="Telefone" value={conv.contactPhone} />
                <InfoField icon={<MailIcon />}  label="E-mail"   value={conv.contactEmail} />
                <InfoField icon={<PinIcon />}   label="Local"    value={null} />
                <InfoField icon={<PersonIcon />} label="Responsável" value={agent?.name} />
                <InfoField icon={<FonteIcon origem={conv.origin} />} label="Fonte" value={conv.origin} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                  <span style={{ color: '#94a3b8', flexShrink: 0, display: 'flex' }}><CalIcon /></span>
                  <span style={{ fontSize: 13, color: '#64748b', flexShrink: 0, minWidth: 90 }}>Criado em:</span>
                  <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>
                    {conv.createdAt}, {firstMsgTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Negócio */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <DocIcon />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Negócio 1</span>
                <button style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'default', color: '#94a3b8', display: 'flex', padding: 0 }}><EditIcon /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <NegField icon={<DollarIcon />}  label="Crédito"    value={conv.dealValue} />
                <NegField icon={<BriefIcon />}   label="Parcela"    value={getParcela(conv.dealValue)} />
                <NegField icon={<ClockIcon />}   label="Prazo"      value={null} />
                <NegField icon={<ChartIcon />}   label="Renda"      value={null} emptyLabel="R$ 0,00" />
                <NegField icon={<ArrowDownIcon />} label="Entrada"  value={null} emptyLabel="R$ 0,00" />
                <NegField icon={<TagIcon />}     label="Interesse"  value={conv.leadStage} />
                <NegField icon={<DollarIcon />}  label="Valor"      value={conv.dealValue} />
                <NegField icon={<HomeIcon />}    label="Modalidade" value={getModalidade(conv.dealValue)} />
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ClockIcon />
                <span style={{ fontSize: 12, color: '#0ea5e9', cursor: 'default' }}>Ver histórico de negociações</span>
              </div>
            </div>
          </div>

          {/* Termômetro + Próximo Evento */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 14 }}>

            {/* Termômetro */}
            <Termometro pipeline={conv.pipeline} />

            {/* Próximo Evento */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {/* Add event button box */}
              <div style={{
                width: 70, height: 70, flexShrink: 0,
                border: '1.5px solid #e2e8f0', borderRadius: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                cursor: 'default',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span style={{ fontSize: 10, color: '#64748b', textAlign: 'center', lineHeight: 1.2 }}>Adicionar{'\n'}Evento</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Próximo Evento</div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>Nenhum evento agendado</div>
              </div>
            </div>
          </div>

        </div>{/* end right column */}
      </div>
    </div>
  )
}
