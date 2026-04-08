import { useState, useRef } from 'react'
import Avatar from '../ui/Avatar'
import { WaIcon } from '../ui/Icons'
import { AGENTS, THERMO_LEVELS, getThermoLevel } from '../../data/mockData'

// ─── Settings-style row ───────────────────────────────────────────────────────
function InfoRow({ icon, label, value, isNode, noBorder }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      borderBottom: noBorder ? 'none' : '1px solid #f0f0f0',
    }}>
      {icon && (
        <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#4356a0' }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14.5, color: '#111B21', fontWeight: 500, wordBreak: 'break-word' }}>
          {isNode ? value : (value || '—')}
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  )
}

// ─── Section block ────────────────────────────────────────────────────────────
function Section({ title, children, open, onToggle }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '14px 18px',
          background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid #f0f0f0' : 'none',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111B21' }}>{title}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div style={{ padding: '0 18px' }}>{children}</div>}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MobileContactView({ conv, onBack, onUpdate }) {
  const [sections, setSections] = useState({ info: true, deal: true, lead: true })
  const toggle = key => setSections(prev => ({ ...prev, [key]: !prev[key] }))
  const [noteInput, setNoteInput] = useState('')
  const noteRef = useRef(null)

  const handleAddNote = () => {
    if (!noteInput.trim() || !conv) return
    const newMsg = {
      id: 'm' + Date.now(),
      type: 'note',
      text: noteInput.trim(),
      author: 'Você',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: 'Hoje',
    }
    onUpdate(conv.id, { messages: [...conv.messages, newMsg] })
    setNoteInput('')
    noteRef.current?.blur()
  }

  if (!conv) return null

  const agent = AGENTS.find(a => a.id === conv.assignedTo)
  const thermoLevel = getThermoLevel(conv)
  const total = THERMO_LEVELS.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f2f5', overflow: 'hidden' }}>

      {/* Status bar spacer */}
      <div style={{ height: 'env(safe-area-inset-top)', background: '#4356a0', flexShrink: 0 }} />

      {/* Header */}
      <div style={{
        background: '#4356a0', flexShrink: 0,
        display: 'flex', alignItems: 'center', padding: '12px 16px',
        gap: 8,
      }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px 4px 4px 0', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ flex: 1, color: '#fff', fontWeight: 700, fontSize: 17, textAlign: 'center' }}>
          Info do contato
        </span>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', padding: '4px 0', flexShrink: 0, fontFamily: 'Sora, sans-serif' }}>
          Editar
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 14px', paddingBottom: 'env(safe-area-inset-bottom)' }}>

        {/* Hero card */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '28px 20px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{ position: 'relative' }}>
            <Avatar initials={conv.avatar} color={conv.avatarColor} size={80} />
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              background: '#25D366', borderRadius: '50%', width: 22, height: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff',
            }}>
              <WaIcon size={11} color="#fff" />
            </div>
          </div>
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#111B21', letterSpacing: '-0.02em' }}>{conv.contactName}</div>
            {conv.contactCompany && <div style={{ fontSize: 14, color: '#667781', marginTop: 3 }}>{conv.contactCompany}</div>}
            {conv.contactPhone && <div style={{ fontSize: 14, color: '#4356a0', marginTop: 2, fontWeight: 500 }}>{conv.contactPhone}</div>}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, width: '100%' }}>
            <button
              onClick={onBack}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                background: '#f1f5f9', border: 'none', borderRadius: 14,
                padding: '12px 8px', cursor: 'pointer', color: '#4356a0',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Sora, sans-serif' }}>Conversar</span>
            </button>
            <button style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              background: '#f1f5f9', border: 'none', borderRadius: 14,
              padding: '12px 8px', cursor: 'pointer', color: '#4356a0',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Sora, sans-serif' }}>Pesquisar</span>
            </button>
          </div>
        </div>

        {/* Lead Thermometer */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111B21', marginBottom: 14 }}>Qualificação do Lead</div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
            <div style={{ position: 'absolute', left: 26, right: 26, top: '50%', transform: 'translateY(-50%)', height: 3, background: '#e2e8f0', borderRadius: 99 }} />
            {thermoLevel > 0 && (
              <div style={{
                position: 'absolute', left: 26, height: 3, borderRadius: 99, background: '#3b82f6',
                top: '50%', transform: 'translateY(-50%)',
                width: `calc(${(thermoLevel / total) * 100}% - ${(thermoLevel / total) * 52}px)`,
              }} />
            )}
            {THERMO_LEVELS.map((level, i) => (
              <div key={level.key} style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: i === thermoLevel ? 26 : 20, opacity: i > thermoLevel ? 0.3 : 1, display: 'block' }}>{level.icon}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0' }}>
            {THERMO_LEVELS.map((level, i) => (
              <span key={level.key} style={{ fontSize: 11.5, fontWeight: i === thermoLevel ? 700 : 400, color: i === thermoLevel ? '#3b82f6' : '#94a3b8', textAlign: 'center', flex: 1 }}>
                {level.label}
              </span>
            ))}
          </div>
        </div>

        {/* Negócio (Deal value highlight) */}
        {conv.dealValue && conv.dealValue !== '—' && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            border: '1px solid #bbf7d0', borderRadius: 16,
            padding: '18px 20px', marginBottom: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>💰 Crédito em análise</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>{conv.dealValue}</div>
            {conv.leadStage && <div style={{ fontSize: 13, color: '#16a34a', marginTop: 6, fontWeight: 600 }}>Etapa: {conv.leadStage}</div>}
          </div>
        )}

        {/* Informações */}
        <Section title="Informações" open={sections.info} onToggle={() => toggle('info')}>
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>}
            label="Telefone" value={conv.contactPhone}
          />
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            label="E-mail" value={conv.contactEmail}
          />
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
            label="Empresa" value={conv.contactCompany}
          />
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            label="Responsável"
            isNode
            value={agent
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar initials={agent.avatar} color={agent.color} size={20} />
                  {agent.name}
                </span>
              : '—'
            }
          />
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>}
            label="Fonte" value={conv.origin}
          />
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            label="Criado em" value={conv.createdAt}
          />
          <InfoRow
            icon={<WaIcon size={18} />}
            label="Canal"
            isNode
            value={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><WaIcon size={16} /> WhatsApp</span>}
            noBorder
          />
        </Section>

        {/* Negócio */}
        <Section title="Negócio" open={sections.deal} onToggle={() => toggle('deal')}>
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
            label="Etapa" value={conv.leadStage}
          />
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
            label="Valor" value={conv.dealValue}
          />
          <InfoRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 10h8M8 14h5"/></svg>}
            label="Pipeline" value={conv.pipeline}
            noBorder
          />
        </Section>

        {/* Notas internas */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#a16207">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#a16207' }}>Notas internas</span>
          </div>

          {conv.messages.filter(m => m.type === 'note').map(note => (
            <div key={note.id} style={{
              background: '#fefce8', border: '1px solid #fde047',
              borderRadius: 10, padding: '10px 12px', marginBottom: 8,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: '#1e293b', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{note.text}</p>
              <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>{note.author} · {note.time}</span>
            </div>
          ))}

          <textarea
            ref={noteRef}
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddNote() } }}
            placeholder="Escreva uma nota para o time..."
            rows={2}
            style={{
              width: '100%', boxSizing: 'border-box',
              border: '1.5px solid #fde047', borderRadius: 10,
              background: '#fefce8', padding: '10px 12px',
              fontSize: 13, color: '#1e293b', fontFamily: 'Sora, sans-serif',
              resize: 'none', outline: 'none', lineHeight: 1.5,
            }}
          />
          <button
            onClick={handleAddNote}
            disabled={!noteInput.trim()}
            style={{
              marginTop: 8, width: '100%', padding: '8px 0',
              borderRadius: 10, border: 'none', cursor: noteInput.trim() ? 'pointer' : 'default',
              background: noteInput.trim() ? '#a16207' : '#e2e8f0',
              color: noteInput.trim() ? '#fff' : '#94a3b8',
              fontSize: 13, fontWeight: 700, fontFamily: 'Sora, sans-serif',
              transition: 'all 0.15s',
            }}
          >
            Salvar nota
          </button>
        </div>

      </div>
    </div>
  )
}
