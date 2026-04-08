import { useState } from 'react'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import ConversationList from './components/ConversationList'
import ChatPanel from './components/ChatPanel'
import ContactPanel from './components/ContactPanel'
import LeadsPage from './components/LeadsPage'
import LeadDetailPage from './components/LeadDetailPage'
import MobileLayout from './components/mobile/MobileLayout'
import useIsMobile from './hooks/useIsMobile'
import { INITIAL_CONVERSATIONS } from './data/mockData'

// Pages that replace the full chat layout
const FULL_PAGE_KEYS = ['leads', 'lead-detail', 'agenda', 'gestao', 'acessos', 'distribuicao', 'relatorios', 'inicio']

export default function App() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [activeId, setActiveId] = useState('c1')
  const [detailLeadId, setDetailLeadId] = useState(null)
  const [filter, setFilter] = useState('mine')
  const [search, setSearch] = useState('')
  const [contactPanelOpen, setContactPanelOpen] = useState(true)
  const [activePage, setActivePage] = useState('conversas')

  const isMobile = useIsMobile()

  const activeConv = conversations.find(c => c.id === activeId)
  const detailConv = conversations.find(c => c.id === detailLeadId)

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

  const handleNavigate = (page) => {
    setActivePage(page)
  }

  // From LeadsPage: open detail
  const handleOpenLeadDetail = (convId) => {
    setDetailLeadId(convId)
    setActivePage('lead-detail')
  }

  // From LeadDetailPage: open in chat
  const handleGoToChat = (convId) => {
    setActiveId(convId)
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: 0 } : c))
    setActivePage('conversas')
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

  const isFullPage = FULL_PAGE_KEYS.includes(activePage)

  // Sidebar highlights 'leads' for both list and detail
  const sidebarPage = activePage === 'lead-detail' ? 'leads' : activePage

  return (
    <div className="h-screen flex" style={{ fontFamily: "'Sora', sans-serif" }}>
      <Sidebar activePage={sidebarPage} onNavigate={handleNavigate} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />

        {activePage === 'leads' ? (
          <LeadsPage conversations={conversations} onSelectLead={handleOpenLeadDetail} />
        ) : activePage === 'lead-detail' ? (
          <LeadDetailPage
            conv={detailConv}
            onBack={() => setActivePage('leads')}
            onGoToChat={handleGoToChat}
          />
        ) : isFullPage ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#e1e5f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🚧</div>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>Em breve</span>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
