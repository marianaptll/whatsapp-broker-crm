import { useState, useRef, useEffect } from 'react'
import Avatar from '../ui/Avatar'
import StatusBadge from '../ui/StatusBadge'
import { WaIcon, SendIcon, AttachIcon, EmojiIcon, LockIcon, DoubleCheckIcon } from '../ui/Icons'

const QUICK_TEMPLATES = [
  { category: 'Saudação',   text: 'Olá! Como posso te ajudar hoje?' },
  { category: 'Saudação',   text: 'Bom dia! Estou aqui para te auxiliar.' },
  { category: 'Follow-up',  text: 'Tudo bem? Passando pra saber se você teve a oportunidade de analisar nossa proposta.' },
  { category: 'Follow-up',  text: 'Oi! Ficou alguma dúvida sobre o que conversamos?' },
  { category: 'Aguardar',   text: 'Vou verificar isso agora e te retorno em instantes.' },
  { category: 'Aguardar',   text: 'Pode me passar mais detalhes para eu te ajudar melhor?' },
  { category: 'Fechamento', text: 'Perfeito! Vou preparar a proposta e envio ainda hoje.' },
  { category: 'Fechamento', text: 'Ótimo! Posso te enviar o contrato para assinatura?' },
]

const CATEGORIES = [...new Set(QUICK_TEMPLATES.map(t => t.category))]

function TemplatesModal({ onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const filtered = QUICK_TEMPLATES.filter(t => t.category === activeCategory)

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}
      onClick={onClose}
    >
      <div
        style={{ flex: 1, background: '#fff', borderRadius: '16px 16px 0 0', boxShadow: '0 -12px 40px rgba(0,0,0,0.15)', maxHeight: '55vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>⚡ Respostas rápidas</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1 }}>Clique para inserir no campo de mensagem</div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 18px 0', flexShrink: 0 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '5px 12px', borderRadius: 99, border: 'none', cursor: 'pointer',
                background: activeCategory === cat ? '#0f172a' : '#f1f5f9',
                color: activeCategory === cat ? '#fff' : '#64748b',
                fontSize: 11.5, fontWeight: 600, fontFamily: 'Sora, sans-serif',
                transition: 'all 0.13s',
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Templates */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map((t, i) => (
            <div
              key={i}
              onClick={() => { onSelect(t.text); onClose() }}
              style={{ padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', cursor: 'pointer', fontSize: 13, color: '#334155', lineHeight: 1.55, transition: 'all 0.13s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.background = '#f0fdf4' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent' }}
            >
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
          <DoubleCheckIcon color="#25D366" />
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

export default function ChatPanel({ conv, onUpdate }) {
  const [mode, setMode] = useState('reply')
  const [input, setInput] = useState('')
  const [showTransfer, setShowTransfer] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
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
      {showTransfer && <TransferModal conv={conv} onUpdate={onUpdate} onClose={() => setShowTransfer(false)} />}
      {showTemplates && <TemplatesModal onSelect={t => setInput(t)} onClose={() => setShowTemplates(false)} />}

      {/* Header */}
      <div style={{ padding: '10px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flexShrink: 0 }}>
        <Avatar initials={conv.avatar} color={conv.avatarColor} size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', letterSpacing: '-0.02em' }}>{conv.contactName}</span>
            <StatusBadge status={conv.status} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#f0fdf4', borderRadius: 6, padding: '2px 7px' }}>
              <WaIcon size={11} />
              <span style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>WhatsApp</span>
            </div>
          </div>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{conv.contactPhone} · {conv.contactCompany}</span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => setShowTransfer(true)}
            style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
          >
            ↗ Transferir
          </button>

          {conv.status !== 'closed' ? (
            <button
              onClick={() => onUpdate(conv.id, { status: 'closed' })}
              style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
            >
              📥 Arquivar
            </button>
          ) : (
            <button
              onClick={() => onUpdate(conv.id, { status: 'open' })}
              style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#15803d', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
            >
              Reabrir
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 2,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(100,116,179,0.08) 1px, transparent 0)',
          backgroundSize: '28px 28px',
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

            {/* Mode toggle + templates button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
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

              {!isNote && (
                <button
                  onClick={() => setShowTemplates(true)}
                  style={{
                    marginLeft: 'auto',
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 14px', borderRadius: 8,
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                    boxShadow: '0 2px 8px rgba(37,211,102,0.35)',
                    transition: 'all 0.15s',
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
                  style={{ width: '100%', border: 'none', padding: isNote ? '6px 12px 8px' : '10px 12px', fontSize: 13, color: '#1e293b', background: 'transparent', resize: 'none', fontFamily: 'Sora, sans-serif', lineHeight: 1.55 }}
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
