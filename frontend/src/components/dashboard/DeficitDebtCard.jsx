import { motion } from 'framer-motion'
import { Card, CardHeader } from '../ui/Card'
import { calcDebtPlan } from '../../lib/healthLogic'

export function DeficitDebtCard({ debtKcal, onClear }) {
  if (!debtKcal || debtKcal <= 0) return null
  const plan = calcDebtPlan(debtKcal)
  const pct = Math.min(1, debtKcal / 1000)

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <Card style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        <CardHeader title="Calorie Debt" icon="⚖️" action={
          onClear && <button onClick={onClear} style={{ fontSize: 10, color: 'var(--text-400)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Clear</button>
        } />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-mono)', color: debtKcal > 500 ? 'var(--coral)' : 'var(--amber)', letterSpacing: '-0.04em' }}>
            {Math.round(debtKcal)}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-300)' }}>kcal over</span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-400)', fontStyle: 'italic', fontFamily: 'var(--font-body)', marginBottom: 14 }}>
          No shame, just math. Recovery plan 👇
        </p>
        <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-base)', overflow: 'hidden', marginBottom: 14 }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 1 }}
            style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, var(--amber), var(--coral))', boxShadow: '0 0 8px rgba(245,158,11,0.3)' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ d: 'D1', g: Math.round(plan.day1), highlight: true }, { d: 'D2', g: Math.round(plan.day2) }, { d: 'D3', g: Math.round(plan.day3) }].map(({ d, g, highlight }) => (
            <div key={d} style={{ flex: 1, padding: '10px 6px', borderRadius: 14, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--text-400)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>{d}</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: highlight ? 'var(--amber)' : 'var(--text-100)', letterSpacing: '-0.03em' }}>{g}</div>
              <div style={{ fontSize: 9, color: 'var(--text-400)' }}>kcal</div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
