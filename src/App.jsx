import { useState } from 'react'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import ConversationList from './components/ConversationList'
import ChatPanel from './components/ChatPanel'
import ContactPanel from './components/ContactPanel'
import MobileLayout from './components/mobile/MobileLayout'
import useIsMobile from './hooks/useIsMobile'
import { INITIAL_CONVERSATIONS } from './data/mockData'

export default function App() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [activeId, setActiveId] = useState('c1')
  const [filter, setFilter] = useState('mine')
  const [search, setSearch] = useState('')
  const [contactPanelOpen, setContactPanelOpen] = useState(true)

  const isMobile = useIsMobile()

  const activeConv = conversations.find(c => c.id === activeId)

  const handleSelect = (id) => {
    setActiveId(id)
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, unread: 0 } : c)
    )
  }

  const handleUpdate = (id, patch) => {
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, ...patch } : c)
    )
  }

  if (isMobile) {
    return (
      <MobileLayout
        conversations={conversations}
        activeId={activeId}
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        onSelect={handleSelect}
        onUpdate={handleUpdate}
      />
    )
  }

  return (
    <div className="h-screen flex" style={{ fontFamily: "'Sora', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <div className="flex flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelect}
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
            onUpdate={handleUpdate}
          />
          <ChatPanel conv={activeConv} onUpdate={handleUpdate} />
          <ContactPanel conv={activeConv} onUpdate={handleUpdate} open={contactPanelOpen} onToggle={() => setContactPanelOpen(v => !v)} />
        </div>
      </div>
    </div>
  )
}
