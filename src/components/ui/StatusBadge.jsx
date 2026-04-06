function isWithin24h(lastTime) {
  return /^\d{1,2}:\d{2}$/.test(lastTime)
}

export default function StatusBadge({ status, lastTime }) {
  if (status === 'closed') {
    return <span className="tag-badge status-closed">Encerrada</span>
  }

  if (isWithin24h(lastTime)) {
    return <span className="tag-badge status-open">Aberta</span>
  }

  return <span className="tag-badge status-closed">Fechada</span>
}
