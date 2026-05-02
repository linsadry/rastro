export default function Donut({ data, size = 120, thickness = 18 }) {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const total = data.reduce((s, d) => s + d.value, 0)

  let offset = 0
  const slices = data.map((d) => {
    const pct = total ? d.value / total : 0
    const dash = pct * circ
    const slice = { ...d, dash, gap: circ - dash, offset }
    offset += dash
    return slice
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {total === 0 ? (
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E8E2D8" strokeWidth={thickness}/>
      ) : (
        slices.map((s, i) => (
          <circle
            key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
          />
        ))
      )}
    </svg>
  )
}
