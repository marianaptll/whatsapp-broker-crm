const STATUS_MAP = {
  open:    ['Aberta',    'status-open'],
  pending: ['Pendente',  'status-pending'],
  closed:  ['Encerrada', 'status-closed'],
}

export default function StatusBadge({ status }) {
  const [label, cls] = STATUS_MAP[status] ?? ['—', 'status-closed']
  return <span className={`tag-badge ${cls}`}>{label}</span>
}
