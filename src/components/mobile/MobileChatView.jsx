import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Avatar from '../ui/Avatar'
import StatusBadge from '../ui/StatusBadge'
import { LockIcon, DoubleCheckIcon, SendIcon, EmojiIcon, AttachIcon } from '../ui/Icons'
import { AGENTS } from '../../data/mockData'

// ─── Quick replies ────────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  { label: '👋 Saudação',   text: 'Olá! Como posso te ajudar hoje?' },
  { label: '🔄 Follow-up',  text: 'Tudo bem? Passando pra saber se você teve a oportunidade de analisar nossa proposta.' },
  { label: '⏳ Aguardar',   text: 'Vou verificar isso agora e te retorno em instantes.' },
  { label: '✅ Fechamento', text: 'Perfeito! Vou preparar a proposta e envio ainda hoje.' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function DateSeparator({ date }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0 6px' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
      <span style={{
        fontSize: 11.5, color: '#667781', fontWeight: 600,
        background: 'rgba(255,255,255,0.85)',
        padding: '2px 10px', borderRadius: 99,
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      }}>{date}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
    </div>
  )
}

function NoteMessage({ msg }) {
  return (
    <div className="fade-up" style={{ alignSelf: 'center', maxWidth: '80%', marginBottom: 6 }}>
      <div style={{
        background: '#fef9c3', border: '1px solid #fde047',
        borderRadius: 8, padding: '9px 13px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <LockIcon />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#a16207' }}>Nota interna</span>
          <span style={{ fontSize: 10, color: '#ca8a04', marginLeft: 2 }}>· {msg.author}</span>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#78350f', lineHeight: 1.5 }}>{msg.text}</p>
        <div style={{ textAlign: 'right', marginTop: 3 }}>
          <span style={{ fontSize: 10, color: '#a16207' }}>{msg.time}</span>
        </div>
      </div>
    </div>
  )
}

function ReceivedMessage({ msg, conv }) {
  return (
    <div className="fade-up" style={{
      display: 'flex', alignItems: 'flex-end', gap: 6,
      marginBottom: 2, alignSelf: 'flex-start', maxWidth: '78%',
    }}>
      <Avatar initials={conv.avatar} color={conv.avatarColor} size={26} />
      <div>
        <div className="msg-in" style={{
          background: '#fff',
          padding: '8px 12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}>
          <p style={{ margin: 0, fontSize: 14.5, color: '#111B21', lineHeight: 1.5 }}>{msg.text}</p>
          <div style={{ textAlign: 'right', marginTop: 3 }}>
            <span style={{ fontSize: 11, color: '#667781' }}>{msg.time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SentMessage({ msg, onDelete }) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="fade-up"
      style={{
        display: 'flex', alignItems: 'flex-end', gap: 4,
        marginBottom: 2, alignSelf: 'flex-end', maxWidth: '78%',
        flexDirection: 'row-reverse',
      }}
      onTouchStart={() => {}}
    >
      <div>
        <div
          className="msg-out"
          style={{
            background: '#DCF8C6',
            padding: '8px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
          onContextMenu={e => { e.preventDefault(); setShowActions(v => !v) }}
        >
          <p style={{ margin: 0, fontSize: 14.5, color: '#111B21', lineHeight: 1.5 }}>{msg.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 3 }}>
            <span style={{ fontSize: 11, color: '#667781' }}>{msg.time}</span>
            <DoubleCheckIcon color="#53BDEB" />
          </div>
        </div>
        {showActions && (
          <div style={{
            display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 4,
          }}>
            <button
              onClick={() => { navigator.clipboard?.writeText(msg.text); setShowActions(false) }}
              style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
            >
              📋 Copiar
            </button>
            <button
              onClick={() => { onDelete?.(); setShowActions(false) }}
              style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #fecdd3', background: '#fff1f2', color: '#ef4444', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
            >
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
      alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%',
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
        <button
          onClick={toggle}
          style={{
            width: 38, height: 38, borderRadius: '50%', border: 'none',
            background: isMe ? '#25D366' : '#4356a0', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          }}
        >
          {playing
            ? <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="1" width="4" height="10" rx="1"/><rect x="7" y="1" width="4" height="10" rx="1"/></svg>
            : <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5l9 4.5-9 4.5z"/></svg>
          }
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ position: 'relative', height: 26, display: 'flex', alignItems: 'center', gap: 1 }}>
            {Array.from({ length: 26 }, (_, i) => {
              const h = [4,6,10,14,10,8,12,16,10,7,14,18,12,8,16,20,14,10,8,12,16,10,6,14,10,8][i] || 6
              const filled = (i / 26) * 100 <= progress
              return (
                <div key={i} style={{
                  width: 2.5, height: h, borderRadius: 2, flexShrink: 0,
                  background: filled ? (isMe ? '#25D366' : '#4356a0') : '#cbd5e1',
                }} />
              )
            })}
          </div>
          <span style={{ fontSize: 10, color: '#667781' }}>{displayTime}</span>
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

// ─── Audio recorder hook ──────────────────────────────────────────────────────
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
        const url = URL.createObjectURL(blob)
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MobileChatView({ conv, onUpdate, onBack, onViewContact }) {
  const [mode, setMode] = useState('reply')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [showModeMenu, setShowModeMenu] = useState(false)
  const typingTimerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const { recording, seconds, denied, start: startRec, stop: stopRec, cancel: cancelRec } = useAudioRecorder(
    (url, dur) => {
      const newMsg = {
        id: 'm' + Date.now(),
        type: 'sent-audio',
        audioUrl: url,
        duration: dur,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        date: 'Hoje',
      }
      onUpdate(conv.id, {
        messages: [...conv.messages, newMsg],
        lastMessage: '🎤 Áudio',
        lastTime: newMsg.time,
      })
    }
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages])

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

  if (!conv) return null

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
    clearTimeout(typingTimerRef.current)
    setIsTyping(false)
  }

  const handleInputChange = (val) => {
    setInput(val)
    if (mode === 'note' || !val.trim()) return
    setIsTyping(true)
    clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => setIsTyping(false), 1800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const grouped = []
  let lastDate = null
  conv.messages.forEach(m => {
    if (m.date !== lastDate) { grouped.push({ _sep: true, date: m.date }); lastDate = m.date }
    grouped.push(m)
  })

  const isNote = mode === 'note'
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const agent = AGENTS.find(a => a.id === conv.assignedTo)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#ECE5DD',
    }}>
      {/* Header */}
      <div style={{
        background: '#4356a0',
        paddingTop: 'env(safe-area-inset-top)',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px 10px 4px' }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', color: '#fff',
              cursor: 'pointer', padding: '8px 8px 8px 10px',
              display: 'flex', alignItems: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          {/* Avatar + info (tappable → contact) */}
          <button
            onClick={onViewContact}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              textAlign: 'left', minWidth: 0,
            }}
          >
            <Avatar initials={conv.avatar} color={conv.avatarColor} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: '#fff', fontWeight: 700, fontSize: 15,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                letterSpacing: '-0.01em',
              }}>
                {conv.contactName}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11.5 }}>
                {conv.contactCompany || conv.contactPhone}
              </div>
            </div>
          </button>

          {/* Action icons */}
          <div style={{ display: 'flex', gap: 0 }}>
            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8, display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
            </button>
            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8, display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </button>
            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8, display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        background: '#ECE5DD',
        WebkitOverflowScrolling: 'touch',
      }}>
        {grouped.map((item, i) => {
          if (item._sep) return <DateSeparator key={'sep' + i} date={item.date} />
          if (item.type === 'note')       return <NoteMessage    key={item.id} msg={item} />
          if (item.type === 'received')   return <ReceivedMessage key={item.id} msg={item} conv={conv} />
          if (item.type === 'sent-audio') return <AudioMessage   key={item.id} msg={item} />
          return <SentMessage key={item.id} msg={item}
            onDelete={() => onUpdate(conv.id, { messages: conv.messages.filter(m => m.id !== item.id) })} />
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

      {/* Quick replies strip */}
      {conv.status !== 'closed' && (
        <div style={{
          display: 'flex',
          gap: 6,
          padding: '6px 12px 4px',
          overflowX: 'auto',
          background: 'transparent',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {QUICK_REPLIES.map((qr, i) => (
            <button
              key={i}
              onClick={() => setInput(qr.text)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.9)',
                color: '#4356a0',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'Sora, sans-serif',
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      {conv.status !== 'closed' ? (
        <div style={{
          background: '#F0F2F5',
          paddingBottom: 'env(safe-area-inset-bottom)',
          flexShrink: 0,
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}>
          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 2, padding: '6px 12px 0', alignItems: 'center' }}>
            {[
              { key: 'reply', label: '↩ Resposta' },
              { key: 'note',  label: '🔒 Nota interna' },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                style={{
                  padding: '3px 10px', borderRadius: 6, border: 'none',
                  background: mode === m.key ? '#fff' : 'transparent',
                  color: mode === m.key ? (m.key === 'note' ? '#a16207' : '#4356a0') : '#94a3b8',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                  boxShadow: mode === m.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '6px 8px 8px' }}>
            {/* Attach */}
            <button style={{
              width: 40, height: 40, borderRadius: '50%', border: 'none',
              background: 'none', color: '#54656F',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>

            {/* Text input */}
            {!recording ? (
              <div style={{
                flex: 1,
                background: isNote ? '#fefce8' : '#fff',
                borderRadius: 22,
                display: 'flex',
                alignItems: 'flex-end',
                padding: '8px 14px',
                gap: 8,
                border: isNote ? '1.5px solid #fde047' : '1.5px solid transparent',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                minHeight: 44,
                maxHeight: 120,
              }}>
                <button style={{ background: 'none', border: 'none', color: '#54656F', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                  <EmojiIcon />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isNote ? 'Nota interna...' : 'Mensagem'}
                  rows={1}
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: 15, color: '#111B21',
                    background: 'transparent', resize: 'none',
                    fontFamily: 'Sora, sans-serif', lineHeight: 1.5,
                    maxHeight: 80, overflowY: 'auto',
                  }}
                />
              </div>
            ) : (
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                background: '#fff1f2', borderRadius: 22,
                padding: '8px 16px', border: '1.5px solid #fecdd3',
                minHeight: 44,
              }}>
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }}
                />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(seconds)}
                </span>
                <span style={{ fontSize: 12, color: '#ef4444', opacity: 0.7 }}>Gravando...</span>
                <button
                  onClick={cancelRec}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4, display: 'flex' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Send / Mic */}
            {input.trim() || recording ? (
              <button
                onClick={recording ? stopRec : handleSend}
                style={{
                  width: 44, height: 44, borderRadius: '50%', border: 'none',
                  background: recording ? '#ef4444' : (isNote ? '#a16207' : '#25D366'),
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  boxShadow: recording ? '0 2px 8px rgba(239,68,68,0.4)' : '0 2px 8px rgba(37,211,102,0.4)',
                }}
              >
                {recording
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  : <SendIcon />
                }
              </button>
            ) : !isNote ? (
              <button
                onClick={startRec}
                style={{
                  width: 44, height: 44, borderRadius: '50%', border: 'none',
                  background: denied ? '#fee2e2' : '#25D366',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  boxShadow: denied ? 'none' : '0 2px 8px rgba(37,211,102,0.4)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0014 0"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="9" y1="22" x2="15" y2="22"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSend}
                style={{
                  width: 44, height: 44, borderRadius: '50%', border: 'none',
                  background: input.trim() ? '#a16207' : '#e2e8f0',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                <SendIcon />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          background: '#fff',
          padding: '14px 16px',
          paddingBottom: 'env(safe-area-inset-bottom)',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 13,
          fontStyle: 'italic',
          borderTop: '1px solid #e2e8f0',
          flexShrink: 0,
        }}>
          🔒 Conversa arquivada
        </div>
      )}
    </div>
  )
}
