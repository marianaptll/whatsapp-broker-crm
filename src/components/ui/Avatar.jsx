export default function Avatar({ initials, color, size = 36, ring = false }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.32,
        fontWeight: 700,
        color: '#fff',
        border: ring ? '2px solid #1a1f2e' : 'none',
        letterSpacing: '-0.02em',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}
