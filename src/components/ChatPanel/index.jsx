import { useState, useRef, useEffect } from 'react'
import Avatar from '../ui/Avatar'
import StatusBadge from '../ui/StatusBadge'
import { WaIcon, SendIcon, AttachIcon, EmojiIcon, LockIcon, DoubleCheckIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'

// ─── Quick replies (mensagens prontas) ───────────────────────────────────────
const QUICK_REPLIES = [
  { label: '👋 Saudação',   text: 'Olá! Como posso te ajudar hoje?' },
  { label: '🔄 Follow-up',  text: 'Tudo bem? Passando pra saber se você teve a oportunidade de analisar nossa proposta.' },
  { label: '⏳ Aguardar',   text: 'Vou verificar isso agora e te retorno em instantes.' },
  { label: '✅ Fechamento', text: 'Perfeito! Vou preparar a proposta e envio ainda hoje.' },
]

// ─── Broadcast modal (mensagem de disparo) ───────────────────────────────────
const DISPARO_CATEGORIES = ['Boas-vindas', 'Follow-up', 'Promoção', 'Recuperação', 'Informativo']
const DISPARO_VARS = ['{{nome}}', '{{empresa}}', '{{produto}}', '{{valor}}', '{{link}}']

function BroadcastModal({ onClose }) {
  const [form, setForm] = useState({ name: '', category: DISPARO_CATEGORIES[0], body: '' })
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef(null)

  const insertVar = (v) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end   = el.selectionEnd
    const next  = form.body.slice(0, start) + v + form.body.slice(end)
    setForm(f => ({ ...f, body: next }))
    setTimeout(() => { el.focus(); el.selectionStart = el.selectionEnd = start + v.length }, 0)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.body.trim()) return
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  const preview = form.body
    .replace(/\{\{nome\}\}/g, 'João Silva')
    .replace(/\{\{empresa\}\}/g, 'Portovale')
    .replace(/\{\{produto\}\}/g, 'Consórcio')
    .replace(/\{\{valor\}\}/g, 'R$ 150.000')
    .replace(/\{\{link\}\}/g, 'https://portovale.com.br')

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', width: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>⚡ Nova mensagem de disparo</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>Crie um template para envio em massa via WhatsApp</div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 18, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Nome do template */}
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
              Nome do template
            </label>
            <input
              type="text"
              placeholder="ex: boas_vindas_consorcio"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value.replace(/\s+/g, '_').toLowerCase() }))}
              style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#0f172a', fontFamily: 'Sora, sans-serif', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Categoria */}
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
              Categoria
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {DISPARO_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  style={{
                    padding: '5px 12px', borderRadius: 99, border: 'none', cursor: 'pointer',
                    background: form.category === cat ? '#0f172a' : '#f1f5f9',
                    color: form.category === cat ? '#fff' : '#64748b',
                    fontSize: 11.5, fontWeight: 600, fontFamily: 'Sora, sans-serif',
                    transition: 'all 0.13s',
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>

          {/* Corpo da mensagem */}
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
              Mensagem
            </label>

            {/* Variable pills */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ fontSize: 10.5, color: '#94a3b8', alignSelf: 'center', marginRight: 2 }}>Inserir variável:</span>
              {DISPARO_VARS.map(v => (
                <button
                  key={v}
                  onClick={() => insertVar(v)}
                  style={{ padding: '2px 9px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#3b82f6', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#3b82f6' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                >{v}</button>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              placeholder="Olá {{nome}}! Tudo bem? Gostaria de apresentar uma oportunidade especial..."
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              rows={5}
              style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#0f172a', fontFamily: 'Sora, sans-serif', resize: 'vertical', lineHeight: 1.6, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
              <span style={{ fontSize: 10.5, color: '#cbd5e1' }}>{form.body.length} caracteres</span>
            </div>
          </div>

          {/* Preview */}
          {form.body.trim() && (
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                Prévia
              </label>
              <div style={{ background: '#eef2f7', borderRadius: 10, padding: 14, position: 'relative' }}>
                <div style={{ background: '#dcf8c6', borderRadius: '10px 10px 0 10px', padding: '10px 14px', maxWidth: '80%', marginLeft: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{preview}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 5 }}>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>agora</span>
                    <DoubleCheckIcon color="#3b82f6" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim() || !form.body.trim()}
            style={{
              padding: '8px 22px', borderRadius: 8, border: 'none',
              background: saved ? '#22c55e' : (!form.name.trim() || !form.body.trim()) ? '#e2e8f0' : 'linear-gradient(135deg, #25D366, #128C7E)',
              color: (!form.name.trim() || !form.body.trim()) ? '#94a3b8' : '#fff',
              fontSize: 13, fontWeight: 700, cursor: (!form.name.trim() || !form.body.trim()) ? 'default' : 'pointer',
              fontFamily: 'Sora, sans-serif', transition: 'all 0.15s',
              boxShadow: (!form.name.trim() || !form.body.trim()) ? 'none' : '0 2px 8px rgba(37,211,102,0.3)',
            }}
          >
            {saved ? '✓ Template salvo!' : '💾 Salvar template'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Chat components ──────────────────────────────────────────────────────────
function DateSeparator({ date }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0 8px' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(100,116,179,0.15)' }} />
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, background: '#f1f5f9', padding: '0 8px', borderRadius: 99, whiteSpace: 'nowrap' }}>{date}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(100,116,179,0.15)' }} />
    </div>
  )
}

function NoteMessage({ msg }) {
  return (
    <div className="fade-up" style={{ alignSelf: 'center', maxWidth: '75%', marginBottom: 8, marginTop: 4 }}>
      <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: '9px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
          <LockIcon />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#a16207' }}>Nota interna</span>
          <span style={{ fontSize: 10, color: '#ca8a04', marginLeft: 4 }}>· {msg.author}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#78350f', lineHeight: 1.55 }}>{msg.text}</p>
        <div style={{ textAlign: 'right', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: '#a16207' }}>{msg.time}</span>
        </div>
      </div>
    </div>
  )
}

function ReceivedMessage({ msg, conv }) {
  return (
    <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4, alignSelf: 'flex-start', maxWidth: '70%' }}>
      <Avatar initials={conv.avatar} color={conv.avatarColor} size={28} />
      <div>
        <div className="msg-in" style={{ background: '#fff', padding: '9px 13px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <p style={{ margin: 0, fontSize: 13.5, color: '#1e293b', lineHeight: 1.6 }}>{msg.text}</p>
        </div>
        <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, display: 'block', paddingLeft: 4 }}>{msg.time}</span>
      </div>
    </div>
  )
}

function SentMessage({ msg }) {
  return (
    <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4, alignSelf: 'flex-end', maxWidth: '70%', flexDirection: 'row-reverse' }}>
      <Avatar initials="V" color="#4356a0" size={28} />
      <div>
        <div className="msg-out" style={{ background: '#dcf8c6', padding: '9px 13px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <p style={{ margin: 0, fontSize: 13.5, color: '#1e293b', lineHeight: 1.6 }}>{msg.text}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 3, paddingRight: 4 }}>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>{msg.time}</span>
          <DoubleCheckIcon color="#3b82f6" />
        </div>
      </div>
    </div>
  )
}

function TransferModal({ conv, onUpdate, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', width: 320, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 2 }}>Transferir conversa</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Selecione o agente de destino</div>
        </div>
        {AGENTS.filter(a => a.id !== conv.assignedTo).map(a => (
          <div
            key={a.id}
            onClick={() => { onUpdate(conv.id, { assignedTo: a.id }); onClose() }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', cursor: 'pointer', transition: 'background 0.12s', borderBottom: '1px solid #f8fafc' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Avatar initials={a.avatar} color={a.color} size={32} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{a.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Transferir agora</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 18, color: '#cbd5e1' }}>→</span>
          </div>
        ))}
        <div style={{ padding: '10px 18px' }}>
          <button onClick={onClose} style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

const WALLPAPERS = [
  { label: 'Padrão',    value: '#eef2f7' },
  { label: 'Azul',      value: '#d3ebff' },
  { label: 'Navy',      value: '#afc3e4' },
  { label: 'Roxo',      value: '#e8d1ff' },
  { label: 'Amarelo',   value: '#fbebbb' },
  { label: 'Rosa',      value: '#fad7d8' },
  { label: 'Cinza',     value: '#cecfd0' },
  { label: 'Branco',    value: '#ffffff' },
]

function WallpaperModal({ current, onSelect, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.15)', padding: '18px 20px', width: 280 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>🎨 Papel de parede</div>
        <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 14 }}>Escolha a cor do fundo do chat</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {WALLPAPERS.map(w => (
            <button
              key={w.value}
              onClick={() => { onSelect(w.value); onClose() }}
              title={w.label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: w.value,
                border: current === w.value ? '2.5px solid #3b82f6' : '2px solid #e2e8f0',
                boxShadow: current === w.value ? '0 0 0 3px #d3ebff' : 'none',
                transition: 'all 0.15s',
              }} />
              <span style={{ fontSize: 10, color: '#64748b', fontWeight: current === w.value ? 700 : 400 }}>{w.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Quick reply chip ─────────────────────────────────────────────────────────
function QuickReplyChip({ item, onSelect }) {
  const [hov, setHov] = useState(false)
  const [tooltip, setTooltip] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => onSelect(item.text)}
        onMouseEnter={() => { setHov(true); setTooltip(true) }}
        onMouseLeave={() => { setHov(false); setTooltip(false) }}
        style={{
          padding: '4px 10px', borderRadius: 99,
          border: `1px solid ${hov ? '#3b82f6' : '#e2e8f0'}`,
          background: hov ? '#eff6ff' : '#f8fafc',
          color: hov ? '#1d4ed8' : '#64748b',
          fontSize: 11, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Sora, sans-serif', whiteSpace: 'nowrap',
          transition: 'all 0.13s',
        }}
      >
        {item.label}
      </button>
      {tooltip && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          background: '#0f172a', color: '#fff', fontSize: 11, borderRadius: 7,
          padding: '6px 10px', whiteSpace: 'normal', width: 200, lineHeight: 1.5,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)', zIndex: 100, textAlign: 'left',
          pointerEvents: 'none',
        }}>
          {item.text}
          <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: '#0f172a', rotate: '45deg' }} />
        </div>
      )}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ChatPanel({ conv, onUpdate }) {
  const [mode, setMode] = useState('reply')
  const [input, setInput] = useState('')
  const [showTransfer, setShowTransfer] = useState(false)
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [showWallpaper, setShowWallpaper] = useState(false)
  const [chatBg, setChatBg] = useState('#eef2f7')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages])

  if (!conv) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#e1e5f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WaIcon size={32} />
        </div>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>Selecione uma conversa</span>
      </div>
    )
  }

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg = {
      id: 'm' + Date.now(),
      type: mode === 'note' ? 'note' : 'sent',
      text: input.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: 'Hoje',
      ...(mode === 'note' ? { author: 'Você' } : {}),
    }
    onUpdate(conv.id, {
      messages: [...conv.messages, newMsg],
      lastMessage: input.trim().substring(0, 40),
      lastTime: newMsg.time,
      unread: 0,
    })
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const isNote = mode === 'note'

  const grouped = []
  let lastDate = null
  conv.messages.forEach(m => {
    if (m.date !== lastDate) { grouped.push({ _sep: true, date: m.date }); lastDate = m.date }
    grouped.push(m)
  })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', minWidth: 0 }}>
      {showTransfer  && <TransferModal  conv={conv} onUpdate={onUpdate} onClose={() => setShowTransfer(false)} />}
      {showBroadcast && <BroadcastModal onClose={() => setShowBroadcast(false)} />}
      {showWallpaper && <WallpaperModal current={chatBg} onSelect={setChatBg} onClose={() => setShowWallpaper(false)} />}

      {/* Header */}
      <div style={{ padding: '10px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flexShrink: 0 }}>
        <Avatar initials={conv.avatar} color={conv.avatarColor} size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', letterSpacing: '-0.02em' }}>{conv.contactName}</span>
            <StatusBadge status={conv.status} lastTime={conv.lastTime} />
          </div>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{conv.contactPhone} · {conv.contactCompany}</span>
        </div>

        <button
          onClick={() => setShowWallpaper(true)}
          title="Personalizar fundo"
          style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0, transition: 'all 0.13s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 2,
          background: chatBg,
          transition: 'background 0.3s ease',
        }}
      >
        {grouped.map((item, i) => {
          if (item._sep) return <DateSeparator key={'sep' + i} date={item.date} />
          if (item.type === 'note')     return <NoteMessage key={item.id} msg={item} />
          if (item.type === 'received') return <ReceivedMessage key={item.id} msg={item} conv={conv} />
          return <SentMessage key={item.id} msg={item} />
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {conv.status !== 'closed' ? (
        <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <div style={{ padding: '10px 16px 12px' }}>

            {/* Mode toggle + quick replies + templates button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>

              {/* Mode toggle */}
              <div style={{ display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 8, padding: 3, flexShrink: 0 }}>
                {[
                  { key: 'reply', label: '↩ Resposta' },
                  { key: 'note',  label: '🔒 Nota interna' },
                ].map(m => (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    style={{
                      padding: '4px 12px', borderRadius: 6, border: 'none',
                      background: mode === m.key ? '#fff' : 'transparent',
                      color: mode === m.key ? (m.key === 'note' ? '#a16207' : '#4356a0') : '#94a3b8',
                      fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                      boxShadow: mode === m.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Quick replies */}
              {!isNote && (
                <>
                  <div style={{ width: 1, height: 16, background: '#e2e8f0', flexShrink: 0 }} />
                  {QUICK_REPLIES.map((qr, i) => (
                    <QuickReplyChip key={i} item={qr} onSelect={t => setInput(t)} />
                  ))}
                </>
              )}

              {/* Templates button */}
              {!isNote && (
                <button
                  onClick={() => setShowBroadcast(true)}
                  style={{
                    marginLeft: 'auto',
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 14px', borderRadius: 8,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                    boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  ⚡ Templates
                </button>
              )}
            </div>

            {/* Textarea + send */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 1, border: `1.5px solid ${isNote ? '#fde047' : '#e2e8f0'}`, borderRadius: 10, background: isNote ? '#fefce8' : '#fff', transition: 'all 0.2s', overflow: 'hidden' }}>
                {isNote && (
                  <div style={{ padding: '6px 12px 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <LockIcon />
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#a16207' }}>Nota interna — não visível ao cliente</span>
                  </div>
                )}
                <textarea
                  placeholder={isNote ? 'Escreva uma nota para o time...' : 'Digite sua mensagem...'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  spellCheck={true}
                  lang="pt-BR"
                  style={{ width: '100%', border: 'none', padding: isNote ? '6px 12px 8px' : '10px 12px', fontSize: 13, color: '#1e293b', background: 'transparent', resize: 'none', fontFamily: 'Sora, sans-serif', lineHeight: 1.55, outline: 'none', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: 6, padding: '4px 10px 6px', borderTop: `1px solid ${isNote ? 'rgba(253,224,71,0.4)' : '#f1f5f9'}` }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, display: 'flex' }}><EmojiIcon /></button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, display: 'flex' }}><AttachIcon /></button>
                </div>
              </div>
              <button
                onClick={handleSend}
                style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: input.trim() ? (isNote ? '#a16207' : '#25D366') : '#e2e8f0',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: input.trim() ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s',
                }}
              >
                <SendIcon />
              </button>
            </div>
            <p style={{ margin: '5px 0 0', fontSize: 10, color: '#94a3b8' }}>Enter para enviar · Shift+Enter para nova linha</p>
          </div>
        </div>
      ) : (
        <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 13, color: '#94a3b8', flex: 1 }}>Esta conversa foi arquivada.</span>
          <button onClick={() => onUpdate(conv.id, { status: 'open' })} className="btn-primary">Reabrir</button>
        </div>
      )}
    </div>
  )
}
