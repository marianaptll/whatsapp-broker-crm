import { useState } from 'react'
import MobileChatList from './MobileChatList'
import MobileChatView from './MobileChatView'
import MobileContactView from './MobileContactView'
import MobileBottomNav from './MobileBottomNav'

// ─── Slide transition wrapper ─────────────────────────────────────────────────
function SlidePane({ position, children }) {
  // position: 'current' | 'left' | 'right'
  const x = position === 'current' ? '0%' : position === 'left' ? '-100%' : '100%'
  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `translateX(${x})`,
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}

// ─── View stack: 'list' → 'chat' → 'contact' ─────────────────────────────────
export default function MobileLayout({
  conversations, activeId, filter, setFilter,
  search, setSearch, onSelect, onUpdate,
}) {
  const [view, setView] = useState('list')
  const [activeTab, setActiveTab] = useState('conversas')

  const activeConv = conversations.find(c => c.id === activeId)
  const totalUnread = conversations.filter(c => c.unread > 0).length

  const goToChat = (id) => {
    onSelect(id)
    setView('chat')
  }

  const goToList    = () => setView('list')
  const goToContact = () => setView('contact')
  const goToChat_   = () => setView('chat')

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: '#fff',
      fontFamily: "'Sora', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Page stack */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Page 1 — Chat list */}
        <SlidePane position={view === 'list' ? 'current' : 'left'}>
          <MobileChatList
            conversations={conversations}
            activeId={activeId}
            onSelect={goToChat}
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
          />
        </SlidePane>

        {/* Page 2 — Chat view */}
        <SlidePane position={view === 'chat' ? 'current' : view === 'list' ? 'right' : 'left'}>
          {activeConv && (
            <MobileChatView
              conv={activeConv}
              onUpdate={onUpdate}
              onBack={goToList}
              onViewContact={goToContact}
            />
          )}
        </SlidePane>

        {/* Page 3 — Contact info */}
        <SlidePane position={view === 'contact' ? 'current' : 'right'}>
          {activeConv && (
            <MobileContactView
              conv={activeConv}
              onUpdate={onUpdate}
              onBack={goToChat_}
            />
          )}
        </SlidePane>
      </div>

      {/* Bottom nav — slides down when inside chat or contact */}
      <div style={{
        transform: view === 'list' ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
        flexShrink: 0,
      }}>
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={totalUnread}
        />
      </div>
    </div>
  )
}
