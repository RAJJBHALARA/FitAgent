import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'
import useFitStore from '../../store'

const SIZE = 220
const cx = SIZE / 2
const cy = SIZE / 2

const RINGS = [
  { key: 'calories', r: 88, strokeWidth: 10, color: '#f97316', trackColor: 'rgba(249,115,22,0.15)', glowColor: 'rgba(249,115,22,0.5)', label: 'CAL' },
  { key: 'protein',  r: 70, strokeWidth: 8,  color: '#fb923c', trackColor: 'rgba(251,146,60,0.15)', glowColor: 'rgba(251,146,60,0.4)',  label: 'PRO' },
  { key: 'water',    r: 54, strokeWidth: 8,  color: '#38bdf8', trackColor: 'rgba(56,189,248,0.15)',  glowColor: 'rgba(56,189,248,0.4)',  label: 'H₂O' },
]

export function CalorieRing({ consumed = 0, protein = 0, waterMl = 0 }) {
  const profile = useFitStore(s => s.profile) || { caloricGoal: 2000, proteinGoal: 150 }
  const goal = profile.caloricGoal

  const numRef = useRef(null)
  const over = consumed > goal

  useEffect(() => {
    if (!numRef.current) return
    const c = animate(0, consumed, {
      duration: 1.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate(v) { if (numRef.current) numRef.current.textContent = Math.round(v) },
    })
    return c.stop
  }, [consumed])

  const values = [consumed, protein, waterMl]
  const maxes  = [goal, profile.proteinGoal, 4000]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {RINGS.map((ring, i) => {
          const circ = 2 * Math.PI * ring.r
          const pct  = Math.min(1, values[i] / maxes[i])
          // always show a tiny visible arc so rings never disappear at 0%
          const dashArray = pct < 0.02 
            ? `4 ${circ}`
            : `${pct * circ} ${circ}`

          return (
            <g key={ring.key}>
              {/* Track circle */}
              <circle
                cx={cx} cy={cy} r={ring.r}
                fill="none"
                stroke={ring.trackColor}
                strokeWidth={ring.strokeWidth}
              />
              {/* Progress arc */}
              <circle
                cx={cx} cy={cy} r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={ring.strokeWidth}
                strokeLinecap="round"
                strokeDasharray={dashArray}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{
                  filter: `drop-shadow(0 0 6px ${ring.glowColor})`,
                  transition: 'stroke-dasharray 0.8s ease',
                }}
              />
            </g>
          )
        })}

        {/* Center text — SVG native (no foreignObject) */}
        <text x={cx} y={cy - 16} textAnchor="middle"
          fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif"
          letterSpacing="0.12em" textDecoration="none">
          CONSUMED
        </text>
        <text
          ref={numRef}
          x={cx} y={cy + 16} textAnchor="middle"
          fill={over ? '#fb7185' : '#f8fafc'}
          fontSize="38" fontWeight="700"
          fontFamily="Space Mono, monospace">
          {Math.round(consumed)}
        </text>
        <text x={cx} y={cy + 34} textAnchor="middle"
          fill="#475569" fontSize="11" fontFamily="Inter, sans-serif">
          kcal
        </text>
      </svg>

      {/* Legend row */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
        {RINGS.map((ring) => (
          <div key={ring.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ring.color, boxShadow: `0 0 6px ${ring.glowColor}` }} />
            <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>{ring.label}</span>
          </div>
        ))}
      </div>

      {/* Goal / Left / Protein numbers */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
        <StatPill color="#f97316" label="Goal"    value={goal}                            unit="kcal" />
        <StatPill color={over ? '#fb7185' : '#f97316'} label={over ? 'Over' : 'Left'}
          value={over ? consumed - goal : Math.max(0, goal - consumed)} unit="kcal" highlight={!over} />
        <StatPill color="#fb923c" label="Protein" value={Math.round(protein)}             unit="g" />
      </div>
    </div>
  )
}

function StatPill({ color, label, value, unit, highlight }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 3 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
        <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>{label}</span>
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Space Mono, monospace', color: highlight ? color : '#f8fafc', letterSpacing: '-0.03em' }}>
        {value}
      </span>
      <span style={{ fontSize: 10, color: '#475569', marginLeft: 2 }}>{unit}</span>
    </div>
  )
}
