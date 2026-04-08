import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Avatar from '../ui/Avatar'
import StatusBadge from '../ui/StatusBadge'
import { LockIcon, DoubleCheckIcon, SendIcon } from '../ui/Icons'
import { AGENTS, QUICK_REPLIES } from '../../data/mockData'

// ─── Message components ───────────────────────────────────────────────────────
function DateSeparator({ date }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 12px' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
      <span style={{
        fontSize: 12, color: '#667781', fontWeight: 600,
        background: 'rgba(255,255,255,0.9)', padding: '3px 12px',
        borderRadius: 99, boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}>{date}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
    </div>
  )
}

function NoteMessage({ msg }) {
  return (
    <div className="fade-up" style={{ alignSelf: 'center', maxWidth: '82%', marginBottom: 10, marginTop: 4 }}>
      <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 10, padding: '9px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <LockIcon />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#a16207' }}>Nota interna</span>
          <span style={{ fontSize: 10.5, color: '#ca8a04', marginLeft: 2 }}>· {msg.author}</span>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#78350f', lineHeight: 1.5 }}>{msg.text}</p>
        <div style={{ textAlign: 'right', marginTop: 3 }}>
          <span style={{ fontSize: 11, color: '#a16207' }}>{msg.time}</span>
        </div>
      </div>
    </div>
  )
}

function ReceivedMessage({ msg, conv, spacingBottom }) {
  return (
    <div className="fade-up" style={{
      display: 'flex', alignItems: 'flex-end', gap: 6,
      marginBottom: spacingBottom, alignSelf: 'flex-start', maxWidth: '80%',
    }}>
      <Avatar initials={conv.avatar} color={conv.avatarColor} size={26} />
      <div>
        <div className="msg-in" style={{ background: '#fff', padding: '9px 13px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, fontSize: 15, color: '#111B21', lineHeight: 1.55 }}>{msg.text}</p>
          <div style={{ textAlign: 'right', marginTop: 3 }}>
            <span style={{ fontSize: 11, color: '#667781' }}>{msg.time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SentMessage({ msg, onDelete, spacingBottom }) {
  const [showActions, setShowActions] = useState(false)
  return (
    <div className="fade-up" style={{
      display: 'flex', alignItems: 'flex-end', gap: 6,
      marginBottom: spacingBottom, alignSelf: 'flex-end', maxWidth: '80%', flexDirection: 'row-reverse',
    }}>
      <div>
        <div
          className="msg-out"
          style={{ background: '#DCF8C6', padding: '9px 13px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', cursor: 'pointer' }}
          onContextMenu={e => { e.preventDefault(); setShowActions(v => !v) }}
          onTouchStart={() => {}}
        >
          <p style={{ margin: 0, fontSize: 15, color: '#111B21', lineHeight: 1.5 }}>{msg.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 2 }}>
            <span style={{ fontSize: 11, color: '#667781' }}>{msg.time}</span>
            <DoubleCheckIcon color="#53BDEB" />
          </div>
        </div>
        {showActions && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 5 }}>
            <button onClick={() => { navigator.clipboard?.writeText(msg.text); setShowActions(false) }}
              style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              📋 Copiar
            </button>
            <button onClick={() => { onDelete?.(); setShowActions(false) }}
              style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: '1px solid #fecdd3', background: '#fff1f2', color: '#ef4444', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              🗑 Excluir
            </button>
          </div>
        )}
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
    const onTime = () => { if (audio.duration) { setProgress((audio.currentTime / audio.duration) * 100); setCurrentTime(audio.currentTime) } }
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('timeupdate', onTime)
    return () => { audio.removeEventListener('ended', onEnd); audio.removeEventListener('timeupdate', onTime) }
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) } else { a.play(); setPlaying(true) }
  }
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div className="fade-up" style={{
      display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 2,
      alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '78%',
      flexDirection: isMe ? 'row-reverse' : 'row',
    }}>
      <audio ref={audioRef} src={msg.audioUrl} preload="metadata" />
      <Avatar initials={isMe ? 'V' : '?'} color={isMe ? '#4356a0' : '#64748b'} size={26} />
      <div style={{
        background: isMe ? '#DCF8C6' : '#fff',
        borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        padding: '10px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', gap: 10, minWidth: 180,
      }}>
        <button onClick={toggle} style={{
          width: 38, height: 38, borderRadius: '50%', border: 'none',
          background: isMe ? '#25D366' : '#4356a0', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          {playing
            ? <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="1" width="4" height="10" rx="1"/><rect x="7" y="1" width="4" height="10" rx="1"/></svg>
            : <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5l9 4.5-9 4.5z"/></svg>
          }
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {Array.from({ length: 26 }, (_, i) => {
              const h = [4,6,10,14,10,8,12,16,10,7,14,18,12,8,16,20,14,10,8,12,16,10,6,14,10,8][i] || 6
              return <div key={i} style={{ width: 2.5, height: h, borderRadius: 2, background: (i / 26) * 100 <= progress ? (isMe ? '#25D366' : '#4356a0') : '#cbd5e1' }} />
            })}
          </div>
          <span style={{ fontSize: 11, color: '#667781' }}>{playing || progress > 0 ? fmt(currentTime) : fmt(msg.duration || 0)}</span>
        </div>
      </div>
    </div>
  )
}

function TypingIndicator({ conv }) {
  return (
    <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', gap: 6, alignSelf: 'flex-start', marginBottom: 4 }}>
      <Avatar initials={conv.avatar} color={conv.avatarColor} size={26} />
      <div className="msg-in" style={{ background: '#fff', padding: '10px 14px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 4 }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} />
        ))}
      </div>
    </div>
  )
}

// ─── Audio recorder ───────────────────────────────────────────────────────────
function useAudioRecorder(onDone) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [denied, setDenied] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onDone(URL.createObjectURL(blob), seconds)
        stream.getTracks().forEach(t => t.stop())
        setSeconds(0)
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true); setDenied(false)
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } catch { setDenied(true) }
  }, [onDone, seconds])

  const stop = useCallback(() => { mediaRef.current?.stop(); clearInterval(timerRef.current); setRecording(false) }, [])
  const cancel = useCallback(() => {
    mediaRef.current?.stream?.getTracks().forEach(t => t.stop())
    mediaRef.current?.stop()
    chunksRef.current = []
    clearInterval(timerRef.current)
    setRecording(false); setSeconds(0)
  }, [])

  return { recording, seconds, denied, start, stop, cancel }
}

// ─── Wallpaper options ────────────────────────────────────────────────────────
const WALLPAPERS = [
  { label: 'Padrão',  value: '#ECE5DD' },
  { label: 'Azul',    value: '#d3ebff' },
  { label: 'Navy',    value: '#afc3e4' },
  { label: 'Roxo',    value: '#e8d1ff' },
  { label: 'Amarelo', value: '#fbebbb' },
  { label: 'Rosa',    value: '#fad7d8' },
  { label: 'Cinza',   value: '#e2e8f0' },
  { label: 'Branco',  value: '#ffffff' },
]

// ─── Three-dots menu ──────────────────────────────────────────────────────────
function ChatMoreMenu({ conv, onUpdate, onViewContact, chatBg, setChatBg }) {
  const [open, setOpen] = useState(false)
  const [showWallpaper, setShowWallpaper] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handle = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('touchstart', handle) }
  }, [open])

  const actions = [
    {
      label: 'Info do contato',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      action: () => { setOpen(false); onViewContact() },
    },
    {
      label: 'Transferir conversa',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
      action: () => { setOpen(false); setShowTransfer(true) },
    },
    {
      label: 'Papel de parede',
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
      action: () => { setOpen(false); setShowWallpaper(true) },
    },
    {
      label: conv?.status === 'closed' ? 'Reabrir conversa' : 'Encerrar conversa',
      icon: conv?.status === 'closed'
        ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
      danger: conv?.status !== 'closed',
      action: () => {
        setOpen(false)
        onUpdate(conv.id, { status: conv.status === 'closed' ? 'open' : 'closed' })
      },
    },
  ]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Three dots button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8, display: 'flex' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 200,
          background: '#fff', borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          border: '1px solid #e2e8f0', minWidth: 210,
        }}>
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '13px 16px',
                border: 'none', borderBottom: i < actions.length - 1 ? '1px solid #f8fafc' : 'none',
                background: 'transparent', cursor: 'pointer', textAlign: 'left',
                color: action.danger ? '#ef4444' : '#0f172a',
                fontSize: 14, fontWeight: 500, fontFamily: 'Sora, sans-serif',
                transition: 'background 0.1s',
              }}
              onTouchStart={e => e.currentTarget.style.background = '#f8fafc'}
              onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: action.danger ? '#ef4444' : '#4356a0', flexShrink: 0 }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Wallpaper bottom sheet */}
      {showWallpaper && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowWallpaper(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px 20px 32px', width: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0', margin: '0 auto 18px' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>🎨 Papel de parede</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {WALLPAPERS.map(w => (
                <button
                  key={w.value}
                  onClick={() => { setChatBg(w.value); setShowWallpaper(false) }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 12, background: w.value,
                    border: chatBg === w.value ? '2.5px solid #4356a0' : '2px solid #e2e8f0',
                    boxShadow: chatBg === w.value ? '0 0 0 3px #d3ebff' : 'none',
                  }} />
                  <span style={{ fontSize: 10.5, color: '#64748b', fontWeight: chatBg === w.value ? 700 : 400 }}>{w.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transfer bottom sheet */}
      {showTransfer && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowTransfer(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px 0 32px', width: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0', margin: '0 auto 18px' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', padding: '0 20px', marginBottom: 8 }}>Transferir conversa</div>
            <div style={{ fontSize: 12.5, color: '#94a3b8', padding: '0 20px', marginBottom: 16 }}>Selecione o agente de destino</div>
            {AGENTS.filter(a => a.id !== conv?.assignedTo).map(agent => (
              <button
                key={agent.id}
                onClick={() => { onUpdate(conv.id, { assignedTo: agent.id }); setShowTransfer(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', padding: '12px 20px',
                  border: 'none', borderBottom: '1px solid #f8fafc',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                }}
                onTouchStart={e => e.currentTarget.style.background = '#f8fafc'}
                onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
              >
                <Avatar initials={agent.avatar} color={agent.color} size={40} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{agent.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Transferir agora</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 18, color: '#cbd5e1' }}>→</span>
              </button>
            ))}
            <div style={{ padding: '12px 20px 0' }}>
              <button
                onClick={() => setShowTransfer(false)}
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MobileChatView({ conv, onUpdate, onBack, onViewContact }) {
  const [mode] = useState('reply')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatBg, setChatBg] = useState('#ECE5DD')
  const typingTimerRef = useRef(null)
  const messagesEndRef = useRef(null)

  const { recording, seconds, denied, start: startRec, stop: stopRec, cancel: cancelRec } = useAudioRecorder(
    (url, dur) => {
      const msg = { id: 'm' + Date.now(), type: 'sent-audio', audioUrl: url, duration: dur,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), date: 'Hoje' }
      onUpdate(conv.id, { messages: [...conv.messages, msg], lastMessage: '🎤 Áudio', lastTime: msg.time })
    }
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages])

  useEffect(() => {
    if (!conv || conv.status === 'closed') return
    const lastMsg = conv.messages[conv.messages.length - 1]
    if (lastMsg?.type !== 'received') return
    const d = setTimeout(() => { setIsTyping(true); setTimeout(() => setIsTyping(false), 2800) }, 600)
    return () => clearTimeout(d)
  }, [conv?.id])

  if (!conv) return null

  const handleSend = () => {
    if (!input.trim()) return
    const msg = {
      id: 'm' + Date.now(),
      type: 'sent',
      text: input.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: 'Hoje',
    }
    onUpdate(conv.id, { messages: [...conv.messages, msg], lastMessage: input.trim().substring(0, 40), lastTime: msg.time, unread: 0 })
    setInput('')
    clearTimeout(typingTimerRef.current)
    setIsTyping(false)
  }

  const handleKeyDown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  const handleInputChange = val => {
    setInput(val)
    if (!val.trim()) return
    setIsTyping(true)
    clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => setIsTyping(false), 1800)
  }

  const grouped = []
  let lastDate = null
  conv.messages.forEach(m => {
    if (m.date !== lastDate) { grouped.push({ _sep: true, date: m.date }); lastDate = m.date }
    grouped.push(m)
  })

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const unreadCount = conv.unread || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ECE5DD' }}>

      {/* Status bar spacer */}
      <div style={{ height: 'env(safe-area-inset-top)', background: '#4356a0', flexShrink: 0 }} />

      {/* Header */}
      <div style={{
        background: '#4356a0', flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '8px 8px 8px 4px',
      }}>
        {/* Back + unread badge */}
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px 4px 8px 10px', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {unreadCount > 0 && (
            <span style={{
              background: '#fff', color: '#4356a0',
              borderRadius: 99, fontSize: 11.5, fontWeight: 800,
              minWidth: 20, height: 20, padding: '0 5px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{unreadCount}</span>
          )}
        </button>

        {/* Tappable contact info → opens contact page */}
        <button
          onClick={onViewContact}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 0', textAlign: 'left', minWidth: 0,
          }}
        >
          <Avatar initials={conv.avatar} color={conv.avatarColor} size={38} online={conv.isOnline === true} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              color: '#fff', fontWeight: 700, fontSize: 15.5,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              letterSpacing: '-0.01em',
            }}>
              {conv.contactName}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 1 }}>
              {conv.isOnline ? 'online' : (conv.contactCompany || conv.contactPhone)}
            </div>
          </div>
        </button>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 0, flexShrink: 0, position: 'relative' }}>
          <ChatMoreMenu conv={conv} onUpdate={onUpdate} onViewContact={onViewContact} setChatBg={setChatBg} chatBg={chatBg} />
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '14px 10px 8px',
        display: 'flex', flexDirection: 'column',
        background: chatBg, WebkitOverflowScrolling: 'touch',
      }}>
        {grouped.map((item, i) => {
          if (item._sep) return <DateSeparator key={'sep' + i} date={item.date} />

          // Determine spacing: if next item switches sender → bigger gap
          const next = grouped[i + 1]
          const senderOf = m => m._sep ? 'sep' : (m.type === 'note' ? 'note' : m.type === 'received' ? 'received' : 'sent')
          const thisSender = senderOf(item)
          const nextSender = next ? senderOf(next) : null
          const spacingBottom = !next || next._sep || nextSender !== thisSender ? 10 : 3

          if (item.type === 'note')       return null
          if (item.type === 'received')   return <ReceivedMessage  key={item.id} msg={item} conv={conv} spacingBottom={spacingBottom} />
          if (item.type === 'sent-audio') return <AudioMessage     key={item.id} msg={item} />
          return <SentMessage key={item.id} msg={item} spacingBottom={spacingBottom}
            onDelete={() => onUpdate(conv.id, { messages: conv.messages.filter(m => m.id !== item.id) })} />
        })}
        <AnimatePresence>
          {isTyping && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.2 }}>
              <TypingIndicator conv={conv} />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies strip */}
      {conv.status !== 'closed' && (
        <div style={{
          display: 'flex', gap: 6, padding: '6px 12px 4px',
          overflowX: 'auto', scrollbarWidth: 'none',
          background: 'transparent', flexShrink: 0,
        }}>
          {QUICK_REPLIES.map((qr, i) => (
            <button key={i} onClick={() => setInput(qr.text)} style={{
              padding: '5px 14px', borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.9)',
              background: 'rgba(255,255,255,0.92)', color: '#4356a0',
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', fontFamily: 'Sora, sans-serif',
              flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}>
              {qr.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      {conv.status !== 'closed' ? (
        <div style={{
          background: '#F0F2F5', flexShrink: 0,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {/* Input row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '6px 8px 10px' }}>
            {/* Attach */}
            <button style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', background: 'none', color: '#54656F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>

            {/* Text input */}
            {!recording ? (
              <div style={{
                flex: 1, background: '#fff',
                borderRadius: 24, padding: '10px 14px',
                display: 'flex', alignItems: 'flex-end', gap: 8,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: 'none',
                minHeight: 46,
              }}>
                <textarea
                  value={input}
                  onChange={e => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mensagem"
                  rows={1}
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: 15, color: '#111B21',
                    background: 'transparent', resize: 'none',
                    fontFamily: 'Sora, sans-serif', lineHeight: 1.5,
                    maxHeight: 100, overflowY: 'auto',
                  }}
                />
                {/* Emoji */}
                <button style={{ background: 'none', border: 'none', color: '#54656F', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0, alignSelf: 'flex-end' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                background: '#fff1f2', borderRadius: 24, padding: '10px 16px',
                border: '1.5px solid #fecdd3', minHeight: 46,
              }}>
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>{fmt(seconds)}</span>
                <span style={{ fontSize: 12.5, color: '#ef4444', opacity: 0.7 }}>Gravando...</span>
                <button onClick={cancelRec} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Send / Mic */}
            {input.trim() || recording ? (
              <button onClick={recording ? stopRec : handleSend} style={{
                width: 46, height: 46, borderRadius: '50%', border: 'none', flexShrink: 0,
                background: recording ? '#ef4444' : '#25D366',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}>
                {recording
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  : <SendIcon />
                }
              </button>
            ) : (
              <button onClick={startRec} style={{
                width: 46, height: 46, borderRadius: '50%', border: 'none', flexShrink: 0,
                background: denied ? '#fee2e2' : '#25D366',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,211,102,0.35)',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0014 0"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="9" y1="22" x2="15" y2="22"/>
                </svg>
              </button>
            ) : (
              <button onClick={handleSend} style={{
                width: 46, height: 46, borderRadius: '50%', border: 'none', flexShrink: 0,
                background: input.trim() ? '#a16207' : '#e2e8f0',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <SendIcon />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          background: '#fff', padding: '16px', textAlign: 'center',
          color: '#94a3b8', fontSize: 13, fontStyle: 'italic',
          borderTop: '1px solid #e2e8f0', flexShrink: 0,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          🔒 Conversa arquivada
        </div>
      )}
    </div>
  )
}
