import { motion } from 'framer-motion'
import { Card, CardHeader } from '../ui/Card'
import { useNavigate } from 'react-router-dom'
import { PROTEIN_SWAPS_SORTED } from '../../lib/constants'
import { calcProteinGap } from '../../lib/healthLogic'

export function ProteinAlert({ proteinConsumed }) {
  const navigate = useNavigate()
  const gap = calcProteinGap(proteinConsumed)
  if (gap <= 30) return null

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <Card style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
        <CardHeader title="Protein Gap" icon="⚡" action={
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--amber)', background: 'rgba(245,158,11,0.08)', padding: '3px 8px', borderRadius: 8, border: '1px solid rgba(245,158,11,0.15)' }}>
            -{gap}g
          </span>
        } />
        <p style={{ fontSize: 13, color: 'var(--text-200)', marginBottom: 12, fontFamily: 'var(--font-body)' }}>
          Need <strong style={{ color: 'var(--amber)' }}>{gap}g more protein</strong>. Try these:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PROTEIN_SWAPS_SORTED.slice(0, 3).map((food, i) => (
            <motion.div key={food.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => navigate('/meals', { state: { prefill: food } })}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 14, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{food.emoji}</span>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-100)', fontFamily: 'var(--font-body)' }}>{food.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-400)', marginLeft: 6 }}>{food.qty}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--brand)' }}>+{food.protein}g</div>
                <div style={{ fontSize: 10, color: 'var(--text-400)' }}>{food.calories} kcal</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
