import { useState } from 'react'
import MobileChatList from './MobileChatList'
import MobileChatView from './MobileChatView'
import MobileContactView from './MobileContactView'
import MobileBottomNav from './MobileBottomNav'

// View stack: 'list' → 'chat' → 'contact'
export default function MobileLayout({
  conversations,
  activeId,
  filter,
  setFilter,
  search,
  setSearch,
  onSelect,
  onUpdate,
}) {
  const [view, setView] = useState('list') // 'list' | 'chat' | 'contact'
  const [activeTab, setActiveTab] = useState('conversas')

  const activeConv = conversations.find(c => c.id === activeId)

  const handleSelectConv = (id) => {
    onSelect(id)
    setView('chat')
  }

  const handleBackToList = () => {
    setView('list')
  }

  const handleViewContact = () => {
    setView('contact')
  }

  const handleBackToChat = () => {
    setView('chat')
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      fontFamily: "'Sora', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Main content area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* List view */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: view === 'list' ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}>
          <MobileChatList
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelectConv}
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
            onUpdate={onUpdate}
          />
        </div>

        {/* Chat view */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: view === 'chat' ? 'translateX(0)' : view === 'list' ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}>
          {activeConv && (
            <MobileChatView
              conv={activeConv}
              onUpdate={onUpdate}
              onBack={handleBackToList}
              onViewContact={handleViewContact}
            />
          )}
        </div>

        {/* Contact view */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: view === 'contact' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}>
          {activeConv && (
            <MobileContactView
              conv={activeConv}
              onUpdate={onUpdate}
              onBack={handleBackToChat}
            />
          )}
        </div>
      </div>

      {/* Bottom nav — only visible on list view */}
      <div style={{
        transform: view === 'list' ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
        flexShrink: 0,
      }}>
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
