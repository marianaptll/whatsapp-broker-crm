// online={true}      → dot verde (online)
// online={false}     → dot cinza (offline)
// online={undefined} → sem dot (avatares sem status de presença)
export default function Avatar({ initials, color, size = 36, ring = false, online }) {
  const showDot = online !== undefined
  const dotSize = Math.max(8, Math.round(size * 0.3))
  const borderWidth = dotSize <= 9 ? 1.5 : 2

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
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
        }}
      >
        {initials}
      </div>

      {showDot && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: online ? '#10b981' : '#cbd5e1',
            border: `${borderWidth}px solid #fff`,
            boxSizing: 'border-box',
            transition: 'background 0.3s ease',
          }}
        />
      )}
    </div>
  )
}
