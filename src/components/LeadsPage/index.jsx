import { useState, useMemo } from 'react'
import { AGENTS } from '../../data/mockData'
import { FonteIcon } from '../ui/Icons'

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_MAP = {
  open:    { label: 'Em Atendimento', bg: '#d1fae5', color: '#065f46' },
  pending: { label: 'Tentando Contato', bg: '#ccfbf1', color: '#0f766e' },
  closed:  { label: 'Arquivado', bg: '#f1f5f9', color: '#64748b' },
}

// ─── Thermometer config ───────────────────────────────────────────────────────
const THERMO_MAP = {
  'Fechamento':   { emoji: '🔥', label: 'Quente' },
  'Negociação':   { emoji: '😊', label: 'Morno' },
  'Qualificação': { emoji: '😐', label: 'Neutro' },
  'Prospecção':   { emoji: '🥶', label: 'Frio' },
  'Pós-venda':    { emoji: '⭐', label: 'Cliente' },
}

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { key: 'recent',  label: 'Mais recentes' },
  { key: 'oldest',  label: 'Mais antigos' },
  { key: 'name',    label: 'Nome A–Z' },
  { key: 'value',   label: 'Maior valor' },
]

function parseDateBR(str) {
  if (!str) return 0
  const [d, m, y] = str.split('/')
  return new Date(`${y}-${m}-${d}`).getTime()
}

function parseValue(str) {
  if (!str) return 0
  return parseFloat(str.replace(/[^\d,]/g, '').replace(',', '.')) || 0
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LeadsPage({ conversations, onSelectLead }) {
  const [search, setSearch]           = useState('')
  const [sortKey, setSortKey]         = useState('recent')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [filterVendedor, setFilterVendedor] = useState(null)
  const [showVendMenu, setShowVendMenu] = useState(false)
  const [selected, setSelected]       = useState(new Set())

  const sortLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label

  const filtered = useMemo(() => {
    let list = [...conversations]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.contactName.toLowerCase().includes(q) ||
        c.contactPhone.includes(q) ||
        (c.contactCompany || '').toLowerCase().includes(q)
      )
    }
    if (filterVendedor) list = list.filter(c => c.assignedTo === filterVendedor)

    if (sortKey === 'recent') list.sort((a, b) => parseDateBR(b.createdAt) - parseDateBR(a.createdAt))
    if (sortKey === 'oldest') list.sort((a, b) => parseDateBR(a.createdAt) - parseDateBR(b.createdAt))
    if (sortKey === 'name')   list.sort((a, b) => a.contactName.localeCompare(b.contactName, 'pt-BR'))
    if (sortKey === 'value')  list.sort((a, b) => parseValue(b.dealValue) - parseValue(a.dealValue))
    return list
  }, [conversations, search, sortKey, filterVendedor])

  const allChecked = filtered.length > 0 && filtered.every(c => selected.has(c.id))
  const toggleAll  = () => {
    if (allChecked) setSelected(new Set())
    else setSelected(new Set(filtered.map(c => c.id)))
  }
  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', minWidth: 0, overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Todos os Leads */}
        <button
          onClick={() => setFilterVendedor(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: filterVendedor === null ? '#f1f5f9' : '#fff',
            color: filterVendedor === null ? '#1e293b' : '#64748b',
            fontSize: 13, fontWeight: filterVendedor === null ? 600 : 400,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          Todos os Leads
        </button>

        {/* Filtrar por Vendedor */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowVendMenu(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#fff',
              color: '#64748b', fontSize: 13, fontWeight: 400,
              cursor: 'pointer', fontFamily: 'Sora, sans-serif',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            {filterVendedor
              ? AGENTS.find(a => a.id === filterVendedor)?.name
              : 'Filtrar por Vendedor'}
          </button>
          {showVendMenu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50, minWidth: 180, overflow: 'hidden' }}>
              <button
                onClick={() => { setFilterVendedor(null); setShowVendMenu(false) }}
                style={{ display: 'block', width: '100%', padding: '9px 14px', textAlign: 'left', background: 'transparent', border: 'none', fontSize: 13, color: '#64748b', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
              >
                Todos os vendedores
              </button>
              {AGENTS.map(a => (
                <button
                  key={a.id}
                  onClick={() => { setFilterVendedor(a.id); setShowVendMenu(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px', textAlign: 'left', background: filterVendedor === a.id ? '#f1f5f9' : 'transparent', border: 'none', fontSize: 13, color: '#1e293b', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontWeight: filterVendedor === a.id ? 600 : 400 }}
                >
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700, flexShrink: 0 }}>{a.avatar}</span>
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Adicionar lead */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 18px', borderRadius: 8,
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          border: 'none', color: '#fff',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Sora, sans-serif',
          boxShadow: '0 2px 8px rgba(14,165,233,0.35)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Adicionar lead
        </button>
      </div>

      {/* ── Search + controls ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            style={{
              paddingLeft: 32, paddingRight: 14, paddingTop: 7, paddingBottom: 7,
              border: '1px solid #e2e8f0', borderRadius: 8,
              fontSize: 13, color: '#1e293b', background: '#f8fafc',
              outline: 'none', width: 220, fontFamily: 'Sora, sans-serif',
            }}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowSortMenu(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#fff',
              color: '#1e293b', fontSize: 13, fontWeight: 400,
              cursor: 'pointer', fontFamily: 'Sora, sans-serif',
            }}
          >
            <span>Ordenar por: <strong>{sortLabel}</strong></span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
          </button>
          {showSortMenu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50, minWidth: 180, overflow: 'hidden' }}>
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.key}
                  onClick={() => { setSortKey(o.key); setShowSortMenu(false) }}
                  style={{ display: 'block', width: '100%', padding: '9px 14px', textAlign: 'left', background: sortKey === o.key ? '#f1f5f9' : 'transparent', border: 'none', fontSize: 13, color: '#1e293b', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontWeight: sortKey === o.key ? 600 : 400 }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtros */}
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filtros
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        <ListView
          leads={filtered}
          selected={selected}
          allChecked={allChecked}
          toggleAll={toggleAll}
          toggleOne={toggleOne}
          onSelectLead={onSelectLead}
        />
      </div>
    </div>
  )
}

// ─── List view ────────────────────────────────────────────────────────────────
// flex values mirror screenshot column proportions
const COLS = [
  { key: 'titulo',     label: 'TÍTULO',          flex: '0 0 16%' },
  { key: 'nome',       label: 'NOME',             flex: '0 0 18%' },
  { key: 'status',     label: 'STATUS',           flex: '0 0 16%' },
  { key: 'fonte',      label: 'FONTE',            flex: '0 0 12%' },
  { key: 'responsavel',label: 'RESPONSÁVEL',      flex: '0 0 15%' },
  { key: 'thermo',     label: 'TERMÔMETRO',       flex: '0 0 12%' },
  { key: 'data',       label: 'DATA DE CHEGADA',  flex: '1 1 auto' },
]

function ListView({ leads, selected, allChecked, toggleAll, toggleOne, onSelectLead }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '11px 20px 11px 12px' }}>
        <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <Checkbox checked={allChecked} onChange={toggleAll} />
        </div>
        {COLS.map(col => (
          <div key={col.key} style={{ flex: col.flex, fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', paddingRight: 8 }}>
            {col.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {leads.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          Nenhum lead encontrado
        </div>
      ) : (
        leads.map((lead, i) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            checked={selected.has(lead.id)}
            onCheck={() => toggleOne(lead.id)}
            onSelect={() => onSelectLead(lead.id)}
            even={i % 2 === 0}
          />
        ))
      )}
    </div>
  )
}

function LeadRow({ lead, checked, onCheck, onSelect, even }) {
  const [hov, setHov] = useState(false)
  const agent  = AGENTS.find(a => a.id === lead.assignedTo)
  const status = STATUS_MAP[lead.status] || STATUS_MAP.open
  const thermo = THERMO_MAP[lead.pipeline] || { emoji: '😐', label: 'Neutro' }
  const firstMsgTime = lead.messages?.[0]?.time || '00:00'

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center',
        padding: '13px 20px 13px 12px',
        background: hov ? '#f0f7ff' : (checked ? '#eff6ff' : (even ? '#fff' : '#fafafa')),
        borderBottom: '1px solid #f1f5f9',
        transition: 'background 0.12s',
        cursor: 'default',
      }}
    >
      {/* Checkbox */}
      <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <Checkbox checked={checked} onChange={onCheck} />
      </div>

      {/* Título */}
      <div style={{ flex: '0 0 16%', paddingRight: 16, overflow: 'hidden' }}>
        <button onClick={onSelect} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'Sora, sans-serif', maxWidth: '100%' }}>
          <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500, textDecoration: hov ? 'underline' : 'none', textDecorationColor: '#3b82f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            Novo Lead - Leadhub
          </span>
        </button>
      </div>

      {/* Nome */}
      <div style={{ flex: '0 0 18%', paddingRight: 16, overflow: 'hidden' }}>
        <button onClick={onSelect} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'Sora, sans-serif', maxWidth: '100%' }}>
          <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            {lead.contactName}
          </span>
        </button>
      </div>

      {/* Status */}
      <div style={{ flex: '0 0 16%', paddingRight: 16 }}>
        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: status.bg, color: status.color, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {status.label}
        </span>
      </div>

      {/* Fonte */}
      <div style={{ flex: '0 0 12%', paddingRight: 16, display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
        <FonteIcon origem={lead.origin} />
        <span style={{ fontSize: 13, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.origin}</span>
      </div>

      {/* Responsável */}
      <div style={{ flex: '0 0 15%', paddingRight: 16, display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
        {agent && (
          <>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: agent.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
              {agent.avatar}
            </span>
            <span style={{ fontSize: 13, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</span>
          </>
        )}
      </div>

      {/* Termômetro */}
      <div style={{ flex: '0 0 12%', paddingRight: 16 }}>
        <span title={thermo.label} style={{ fontSize: 20, lineHeight: 1 }}>{thermo.emoji}</span>
      </div>

      {/* Data de chegada */}
      <div style={{ flex: '1 1 auto' }}>
        <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{lead.createdAt}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{firstMsgTime}</div>
      </div>
    </div>
  )
}

// ─── Checkbox ────────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange }) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange() }}
      style={{
        width: 16, height: 16, borderRadius: 4,
        border: checked ? '2px solid #3b82f6' : '2px solid #cbd5e1',
        background: checked ? '#3b82f6' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, transition: 'all 0.12s',
      }}
    >
      {checked && (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
          <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  )
}
