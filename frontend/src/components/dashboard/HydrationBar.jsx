import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardHeader } from '../ui/Card'
import useFitStore from '../../store'
import { formatWater } from '../../lib/healthLogic'

export function HydrationBar({ waterMl, goalL }) {
  const logWater = useFitStore((s) => s.logWater)
  const goalMl = goalL * 1000
  const pct = Math.min(1, waterMl / goalMl)

  const QUICK = [
    { label: '+250ml', ml: 250 },
    { label: '+500ml', ml: 500 },
    { label: '+1L', ml: 1000 },
  ]

  return (
    <Card>
      <CardHeader title="Hydration" icon="💧" action={
        <span style={{ fontSize: 11, color: 'var(--text-300)', fontFamily: 'var(--font-body)' }}>
          🌡️ Goal: {goalL}L
        </span>
      } />

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        {/* Pill-shaped water bottle */}
        <div style={{
          width: 44, height: 80, borderRadius: 22,
          border: '2px solid rgba(56,189,248,0.2)',
          background: 'var(--bg-elevated)',
          position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Water fill from bottom */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${pct * 100}%` }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%)',
              borderRadius: '0 0 20px 20px',
              boxShadow: '0 -4px 12px rgba(56,189,248,0.2)',
            }}
          >
            {/* Bubble */}
            {pct > 0.1 && (
              <div style={{
                position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
                width: 4, height: 4, borderRadius: '50%',
                background: 'rgba(255,255,255,0.35)',
                animation: 'bubble-rise 2.5s ease-in-out infinite',
              }} />
            )}
          </motion.div>
          {pct >= 1 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, zIndex: 2 }}>
              ✨
            </div>
          )}
        </div>

        {/* Number + mini bar */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--blue)', letterSpacing: '-0.03em' }}>
              {formatWater(waterMl)}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-300)' }}>/ {goalL}L</span>
          </div>
          {/* Thin progress bar */}
          <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-elevated)', overflow: 'hidden', marginBottom: 6 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }}
            />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-400)' }}>
            {Math.round(pct * 100)}% of daily goal
          </span>
        </div>
      </div>

      {/* Quick buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {QUICK.map(({ label, ml }) => (
          <motion.button
            key={ml}
            whileTap={{ scale: 0.93 }}
            onClick={() => logWater(ml)}
            style={{
              flex: 1, padding: '10px 0',
              borderRadius: 12,
              border: '1px solid rgba(56,189,248,0.15)',
              background: 'rgba(56,189,248,0.05)',
              color: 'var(--blue)',
              fontSize: 12, fontWeight: 700,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              transition: 'background 0.15s',
            }}
          >
            <Plus size={11} strokeWidth={3} />
            {label}
          </motion.button>
        ))}
      </div>

      {goalL > 4 && (
        <p style={{ fontSize: 10, color: 'var(--text-400)', marginTop: 10, fontFamily: 'var(--font-body)' }}>
          🌡️ Heat-adjusted — extra hydration for Rajkot weather
        </p>
      )}
    </Card>
  )
}
