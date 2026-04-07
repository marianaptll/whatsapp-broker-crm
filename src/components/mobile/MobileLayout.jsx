import { useState } from 'react'
import MobileChatList from './MobileChatList'
import MobileChatView from './MobileChatView'
import MobileContactView from './MobileContactView'
import MobileBottomNav from './MobileBottomNav'

const VIEWS = ['list', 'chat', 'contact']

export default function MobileLayout({
  conversations, activeId, filter, setFilter,
  search, setSearch, onSelect, onUpdate,
}) {
  const [view, setView] = useState('list')
  const [activeTab, setActiveTab] = useState('conversas')

  const activeConv = conversations.find(c => c.id === activeId)
  const totalUnread = conversations.filter(c => c.unread > 0).length
  const viewIndex = VIEWS.indexOf(view)

  const goToChat = (id) => { onSelect(id); setView('chat') }
  const goToList    = () => setView('list')
  const goToContact = () => setView('contact')
  const goBackToChat = () => setView('chat')

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Sora', sans-serif",
      overflow: 'hidden',
      background: '#fff',
    }}>
      {/* Sliding page container — 3 views side by side */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          display: 'flex',
          width: '300%',
          height: '100%',
          transform: `translateX(${-viewIndex * (100 / 3)}%)`,
          transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}>

          {/* Page 1 — Conversation list */}
          <div style={{ width: '33.333%', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
            <MobileChatList
              conversations={conversations}
              activeId={activeId}
              onSelect={goToChat}
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
            />
          </div>

          {/* Page 2 — Chat */}
          <div style={{ width: '33.333%', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
            {activeConv ? (
              <MobileChatView
                conv={activeConv}
                onUpdate={onUpdate}
                onBack={goToList}
                onViewContact={goToContact}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 40 }}>💬</span>
                <span style={{ fontSize: 14 }}>Selecione uma conversa</span>
              </div>
            )}
          </div>

          {/* Page 3 — Contact info */}
          <div style={{ width: '33.333%', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
            {activeConv && (
              <MobileContactView
                conv={activeConv}
                onUpdate={onUpdate}
                onBack={goBackToChat}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav — only on list page */}
      <div style={{
        flexShrink: 0,
        transform: view === 'list' ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
        // keep it in flow so it doesn't overlap content
        marginTop: view === 'list' ? 0 : '-60px',
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
