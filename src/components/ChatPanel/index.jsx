import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Avatar from '../ui/Avatar'
import StatusBadge from '../ui/StatusBadge'
import { WaIcon, SendIcon, AttachIcon, EmojiIcon, LockIcon, DoubleCheckIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'

// ─── Animated input placeholders ─────────────────────────────────────────────
const REPLY_PLACEHOLDERS = [
  'Digite sua mensagem...',
  'Escreva um follow-up para o cliente...',
  'Envie uma proposta personalizada...',
  'Responda com agilidade...',
]
const NOTE_PLACEHOLDERS = [
  'Escreva uma nota para o time...',
  'Registre informações importantes...',
  'Adicione um contexto interno...',
]

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

// ─── Message actions dropdown ─────────────────────────────────────────────────
function MessageActions({ isMe, onCopy, onDelete }) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const ref = useRef(null)

  const close = () => {
    setClosing(true)
    setTimeout(() => { setOpen(false); setClosing(false) }, 180)
  }

  useEffect(() => {
    if (!open || closing) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) close()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, closing])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => open ? close() : setOpen(true)}
        style={{
          width: 24, height: 24, borderRadius: 6,
          border: '1px solid #e2e8f0',
          background: open ? '#f1f5f9' : '#fff',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748b', transition: 'all 0.13s', padding: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = '#fff' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
        </svg>
      </button>

      {open && (
        <div className={closing ? 'dropdown-menu-exit' : 'dropdown-menu-enter'} style={{
          position: 'absolute', bottom: 'calc(100% + 6px)',
          [isMe ? 'right' : 'left']: 0,
          background: '#fff', borderRadius: 10,
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          width: 148, zIndex: 999, overflow: 'hidden', padding: 4,
        }}>
          {[
            { label: '↩ Responder',  action: () => { close() } },
            { label: '📋 Copiar',    action: () => { onCopy(); close() } },
            ...(isMe ? [{ label: '🗑 Excluir', action: () => { onDelete(); close() }, danger: true }] : []),
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              style={{
                width: '100%', display: 'block', padding: '7px 10px',
                border: 'none', borderRadius: 7, background: 'transparent',
                color: item.danger ? '#ef4444' : '#334155',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'Sora, sans-serif', textAlign: 'left',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = item.danger ? '#fff1f2' : '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
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
  const [hov, setHov] = useState(false)
  return (
    <div
      className="fade-up"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4, alignSelf: 'flex-start', maxWidth: '70%' }}
    >
      <Avatar initials={conv.avatar} color={conv.avatarColor} size={28} />
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          <div className="msg-in" style={{ background: '#fff', padding: '9px 13px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p style={{ margin: 0, fontSize: 13.5, color: '#1e293b', lineHeight: 1.6 }}>{msg.text}</p>
          </div>
          <div style={{ opacity: hov ? 1 : 0, transition: 'opacity 0.15s', marginBottom: 2 }}>
            <MessageActions isMe={false} onCopy={() => navigator.clipboard?.writeText(msg.text)} onDelete={() => {}} />
          </div>
        </div>
        <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, display: 'block', paddingLeft: 4 }}>{msg.time}</span>
      </div>
    </div>
  )
}

function SentMessage({ msg, onDelete }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="fade-up"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4, alignSelf: 'flex-end', maxWidth: '70%', flexDirection: 'row-reverse' }}
    >
      <Avatar initials="V" color="#4356a0" size={28} />
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flexDirection: 'row-reverse' }}>
          <div className="msg-out" style={{ background: '#dcf8c6', padding: '9px 13px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p style={{ margin: 0, fontSize: 13.5, color: '#1e293b', lineHeight: 1.6 }}>{msg.text}</p>
          </div>
          <div style={{ opacity: hov ? 1 : 0, transition: 'opacity 0.15s', marginBottom: 2 }}>
            <MessageActions isMe={true} onCopy={() => navigator.clipboard?.writeText(msg.text)} onDelete={onDelete} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 3, paddingRight: 4 }}>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>{msg.time}</span>
          <DoubleCheckIcon color="#3b82f6" />
        </div>
      </div>
    </div>
  )
}

function AudioMessage({ msg }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)
  const isMe = msg.type === 'sent-audio'

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnd = () => { setPlaying(false); setProgress(0); setCurrentTime(0) }
    const onTime = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
      }
    }
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('timeupdate', onTime)
    return () => { audio.removeEventListener('ended', onEnd); audio.removeEventListener('timeupdate', onTime) }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const displayTime = playing || progress > 0 ? formatTime(currentTime) : formatTime(msg.duration || 0)

  return (
    <div className="fade-up" style={{
      display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4,
      alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '60%',
      flexDirection: isMe ? 'row-reverse' : 'row',
    }}>
      <audio ref={audioRef} src={msg.audioUrl} preload="metadata" />
      <Avatar initials={isMe ? 'V' : '?'} color={isMe ? '#4356a0' : '#64748b'} size={28} />
      <div>
        <div style={{
          background: isMe ? '#dcf8c6' : '#fff',
          borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          padding: '10px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', gap: 10, minWidth: 200,
        }}>
          {/* Play/pause */}
          <button
            onClick={toggle}
            style={{
              width: 34, height: 34, borderRadius: '50%', border: 'none', flexShrink: 0,
              background: isMe ? '#25D366' : '#3b82f6', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            {playing
              ? <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="1" width="4" height="10" rx="1"/><rect x="7" y="1" width="4" height="10" rx="1"/></svg>
              : <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5l9 4.5-9 4.5z"/></svg>
            }
          </button>

          {/* Waveform + progress */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center', gap: 1 }}>
              {Array.from({ length: 28 }, (_, i) => {
                const h = [4,6,10,14,10,8,12,16,10,7,14,18,12,8,16,20,14,10,8,12,16,10,6,14,10,8,6,4][i] || 6
                const filled = (i / 28) * 100 <= progress
                return (
                  <div key={i} style={{
                    width: 2.5, height: h, borderRadius: 2, flexShrink: 0,
                    background: filled ? (isMe ? '#25D366' : '#3b82f6') : '#cbd5e1',
                    transition: 'background 0.1s',
                  }} />
                )
              })}
            </div>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{displayTime}</span>
          </div>
        </div>
        {isMe && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 3, paddingRight: 4 }}>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{msg.time}</span>
            <DoubleCheckIcon color="#3b82f6" />
          </div>
        )}
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

// ─── Typing indicator ────────────────────────────────────────────────────────
function TypingIndicator({ conv }) {
  return (
    <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', gap: 8, alignSelf: 'flex-start', marginBottom: 4 }}>
      <Avatar initials={conv.avatar} color={conv.avatarColor} size={28} />
      <div className="msg-in" style={{ background: '#fff', padding: '8px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 4 }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Audio recorder hook ─────────────────────────────────────────────────────
function useAudioRecorder(onDone) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [denied, setDenied] = useState(false)
  const mediaRef  = useRef(null)
  const chunksRef = useRef([])
  const timerRef  = useRef(null)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url  = URL.createObjectURL(blob)
        onDone(url, seconds)
        stream.getTracks().forEach(t => t.stop())
        setSeconds(0)
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
      setDenied(false)
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } catch {
      setDenied(true)
    }
  }, [onDone, seconds])

  const stop = useCallback(() => {
    mediaRef.current?.stop()
    clearInterval(timerRef.current)
    setRecording(false)
  }, [])

  const cancel = useCallback(() => {
    mediaRef.current?.stream?.getTracks().forEach(t => t.stop())
    mediaRef.current?.stop()
    chunksRef.current = []
    clearInterval(timerRef.current)
    setRecording(false)
    setSeconds(0)
  }, [])

  return { recording, seconds, denied, start, stop, cancel }
}

// ─── Mic button ───────────────────────────────────────────────────────────────
function MicButton({ onDone }) {
  const { recording, seconds, denied, start, stop, cancel } = useAudioRecorder(onDone)
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  if (recording) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Cancel */}
      <button
        onClick={cancel}
        title="Cancelar"
        style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>
      </button>

      {/* Timer + pulse */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '6px 12px', flexShrink: 0 }}>
        <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', fontFamily: 'Sora, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
          {fmt(seconds)}
        </span>
      </div>

      {/* Send recording */}
      <button
        onClick={stop}
        title="Enviar áudio"
        style={{ width: 42, height: 42, borderRadius: 10, border: 'none', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 8px rgba(37,211,102,0.35)' }}
      >
        <SendIcon />
      </button>
    </div>
  )

  return (
    <button
      onClick={start}
      title={denied ? 'Permissão de microfone negada' : 'Gravar áudio'}
      style={{
        width: 42, height: 42, borderRadius: 10, border: 'none', flexShrink: 0,
        background: denied ? '#fee2e2' : '#f1f5f9',
        color: denied ? '#ef4444' : '#64748b',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!denied) { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#334155' } }}
      onMouseLeave={e => { if (!denied) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b' } }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3"/>
        <path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/>
      </svg>
    </button>
  )
}

// ─── Animated input ───────────────────────────────────────────────────────────
function AnimatedInput({ input, setInput, isNote, onKeyDown, onSend, onSendAudio, onActiveChange }) {
  const [isActive, setIsActive] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const wrapperRef = useRef(null)
  const textareaRef = useRef(null)

  const expanded = isActive || !!input.trim()
  const PLACEHOLDERS = isNote ? NOTE_PLACEHOLDERS : REPLY_PLACEHOLDERS

  // Cycle placeholder when collapsed and idle
  useEffect(() => {
    setPlaceholderIndex(0)
    setShowPlaceholder(true)
    if (expanded) return
    const iv = setInterval(() => {
      setShowPlaceholder(false)
      setTimeout(() => {
        setPlaceholderIndex(p => (p + 1) % PLACEHOLDERS.length)
        setShowPlaceholder(true)
      }, 350)
    }, 3000)
    return () => clearInterval(iv)
  }, [expanded, isNote])

  // Notify parent of active state
  useEffect(() => { onActiveChange?.(isActive) }, [isActive])

  // Collapse on outside click (only if empty)
  useEffect(() => {
    if (!isActive) return
    function handle(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        if (!input.trim()) setIsActive(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [isActive, input])

  const borderColor = isNote ? '#fde047' : expanded ? '#3b82f6' : '#e2e8f0'
  const bg          = isNote ? '#fefce8' : '#fff'

  const letterVariants = {
    initial: { opacity: 0, filter: 'blur(8px)', y: 5 },
    animate: { opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { opacity: { duration: 0.2 }, filter: { duration: 0.3 }, y: { type: 'spring', stiffness: 80, damping: 20 } } },
    exit:    { opacity: 0, filter: 'blur(8px)', y: -5,
      transition: { opacity: { duration: 0.15 }, filter: { duration: 0.2 }, y: { type: 'spring', stiffness: 80, damping: 20 } } },
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <motion.div
        ref={wrapperRef}
        animate={{ height: expanded ? (isNote ? 132 : 116) : 50 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        onClick={() => { if (!isActive) { setIsActive(true); textareaRef.current?.focus() } }}
        style={{
          flex: 1, border: `1.5px solid ${borderColor}`, borderRadius: 12,
          background: bg, overflow: 'hidden', cursor: 'text',
          display: 'flex', flexDirection: 'column',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Note banner */}
        <motion.div
          animate={{ height: (isNote && expanded) ? 'auto' : 0, opacity: (isNote && expanded) ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ overflow: 'hidden', flexShrink: 0 }}
        >
          <div style={{ padding: '6px 12px 0', display: 'flex', alignItems: 'center', gap: 5 }}>
            <LockIcon />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#a16207' }}>Nota interna — não visível ao cliente</span>
          </div>
        </motion.div>

        {/* Textarea + placeholder */}
        <div style={{ flex: 1, position: 'relative', padding: '10px 12px', minHeight: 0 }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setIsActive(true)}
            spellCheck
            lang="pt-BR"
            style={{
              width: '100%', height: '100%', border: 'none', padding: 0,
              fontSize: 13, color: '#1e293b', background: 'transparent',
              resize: 'none', fontFamily: 'Sora, sans-serif',
              lineHeight: 1.55, outline: 'none', boxSizing: 'border-box',
              position: 'relative', zIndex: 1,
            }}
          />
          {/* Animated cycling placeholder */}
          {!input && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              padding: '10px 12px', pointerEvents: 'none',
              display: 'flex', alignItems: 'flex-start',
            }}>
              <AnimatePresence mode="wait">
                {showPlaceholder && !isActive && (
                  <motion.span
                    key={`${isNote ? 'n' : 'r'}-${placeholderIndex}`}
                    style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'Sora, sans-serif', lineHeight: 1.55 }}
                    variants={{ initial: {}, animate: { transition: { staggerChildren: 0.018 } }, exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } } }}
                    initial="initial" animate="animate" exit="exit"
                  >
                    {PLACEHOLDERS[placeholderIndex].split('').map((char, i) => (
                      <motion.span key={i} variants={letterVariants} style={{ display: 'inline-block' }}>
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom toolbar — fades in on expand */}
        <motion.div
          animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : 6, pointerEvents: expanded ? 'auto' : 'none' }}
          transition={{ duration: 0.2, delay: expanded ? 0.07 : 0 }}
          style={{ display: 'flex', gap: 6, padding: '4px 10px 6px', borderTop: `1px solid ${isNote ? 'rgba(253,224,71,0.4)' : '#f1f5f9'}`, flexShrink: 0 }}
        >
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, display: 'flex' }}><EmojiIcon /></button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, display: 'flex' }}><AttachIcon /></button>
        </motion.div>
      </motion.div>

      {/* Send or mic */}
      {input.trim() ? (
        <button
          onClick={onSend}
          style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: isNote ? '#a16207' : '#25D366',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', transition: 'all 0.15s',
          }}
        >
          <SendIcon />
        </button>
      ) : (
        !isNote && <MicButton onDone={onSendAudio} />
      )}
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
  const [inputActive, setInputActive] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [showWallpaper, setShowWallpaper] = useState(false)
  const [chatBg, setChatBg] = useState('#eef2f7')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages])

  // Simulate typing indicator when switching to a conversation with unread messages
  useEffect(() => {
    if (!conv || conv.status === 'closed') return
    const lastMsg = conv.messages[conv.messages.length - 1]
    if (lastMsg?.type !== 'received') return
    const delay = setTimeout(() => {
      setIsTyping(true)
      const stop = setTimeout(() => setIsTyping(false), 2800)
      return () => clearTimeout(stop)
    }, 600)
    return () => clearTimeout(delay)
  }, [conv?.id])

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
          if (item.type === 'note')       return <NoteMessage    key={item.id} msg={item} />
          if (item.type === 'received')   return <ReceivedMessage key={item.id} msg={item} conv={conv} />
          if (item.type === 'sent-audio') return <AudioMessage   key={item.id} msg={item} />
          return <SentMessage key={item.id} msg={item} onDelete={() => onUpdate(conv.id, { messages: conv.messages.filter(m => m.id !== item.id) })} />
        })}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              <TypingIndicator conv={conv} />
            </motion.div>
          )}
        </AnimatePresence>
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

              {/* Quick replies — only when input is active */}
              {!isNote && (inputActive || !!input.trim()) && (
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

            {/* Animated textarea + send */}
            <AnimatedInput
              input={input}
              setInput={setInput}
              isNote={isNote}
              onKeyDown={handleKeyDown}
              onSend={handleSend}
              onActiveChange={setInputActive}
              onSendAudio={(url, duration) => {
                const newMsg = {
                  id: 'm' + Date.now(),
                  type: 'sent-audio',
                  audioUrl: url,
                  duration,
                  time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                  date: 'Hoje',
                }
                onUpdate(conv.id, {
                  messages: [...conv.messages, newMsg],
                  lastMessage: '🎤 Áudio',
                  lastTime: newMsg.time,
                  unread: 0,
                })
              }}
            />
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
