import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import MobileChatList from './MobileChatList'
import MobileChatView from './MobileChatView'
import MobileContactView from './MobileContactView'
import MobileBottomNav from './MobileBottomNav'

const VIEW_ORDER = { list: 0, chat: 1, contact: 2 }

export default function MobileLayout({
  conversations, activeId, filter, setFilter,
  search, setSearch, onSelect, onUpdate,
}) {
  const [view, setView]         = useState('list')
  const [direction, setDirection] = useState(1)
  const [activeTab, setActiveTab] = useState('conversas')

  const activeConv = conversations.find(c => c.id === activeId)
  const totalUnread = conversations.filter(c => c.unread > 0).length

  function navigate(target) {
    const dir = VIEW_ORDER[target] > VIEW_ORDER[view] ? 1 : -1
    setDirection(dir)
    setView(target)
  }

  const goToChat = (id) => { onSelect(id); navigate('chat') }
  const goToList    = () => navigate('list')
  const goToContact = () => navigate('contact')
  const goToChat_   = () => navigate('chat')

  const variants = {
    enter:   (dir) => ({ x: dir > 0 ? '100%' : '-100%' }),
    center:  { x: 0 },
    exit:    (dir) => ({ x: dir > 0 ? '-100%' : '100%' }),
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Sora', sans-serif",
      overflow: 'hidden',
      background: '#fff',
    }}>
      {/* Page area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={view}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {view === 'list' && (
              <MobileChatList
                conversations={conversations}
                activeId={activeId}
                onSelect={goToChat}
                filter={filter}
                setFilter={setFilter}
                search={search}
                setSearch={setSearch}
              />
            )}

            {view === 'chat' && (
              activeConv
                ? <MobileChatView
                    conv={activeConv}
                    onUpdate={onUpdate}
                    onBack={goToList}
                    onViewContact={goToContact}
                  />
                : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontSize: 44 }}>💬</span>
                    <span style={{ fontSize: 14 }}>Selecione uma conversa</span>
                  </div>
            )}

            {view === 'contact' && activeConv && (
              <MobileContactView
                conv={activeConv}
                onUpdate={onUpdate}
                onBack={goToChat_}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav — only on list page */}
      <AnimatePresence>
        {view === 'list' && (
          <motion.div
            key="bottomnav"
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ flexShrink: 0 }}
          >
            <MobileBottomNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              unreadCount={totalUnread}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
