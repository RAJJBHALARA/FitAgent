import { motion } from 'framer-motion'
import { Card, CardHeader } from '../ui/Card'
import { MILESTONES } from '../../lib/constants'
import { getMilestoneStatus } from '../../lib/healthLogic'
import { Check } from 'lucide-react'

export function MilestoneTrack({ currentWeight }) {
  const statuses = getMilestoneStatus(currentWeight, MILESTONES)
  return (
    <Card>
      <CardHeader title="Journey" icon="🏅" subtitle={`${85}kg → ${75}kg`} />
      <div style={{ position: 'relative', paddingLeft: 30 }}>
        <div style={{ position: 'absolute', left: 11, top: 14, bottom: 14, width: 2, background: 'linear-gradient(180deg, var(--brand) 0%, var(--border-subtle) 100%)', borderRadius: 1 }} />
        {statuses.map((m, i) => (
          <motion.div key={m.weight} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < statuses.length - 1 ? 20 : 0 }}>
            <div style={{ position: 'absolute', left: 0 }}>
              {m.reached ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(249,115,22,0.3)' }}>
                  <Check size={13} color="#050a07" strokeWidth={3} />
                </motion.div>
              ) : m.isCurrent ? (
                <motion.div className="pulse-brand"
                  style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--brand)', background: 'var(--brand-ghost)' }} />
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px dashed var(--border-default)', background: 'var(--bg-surface)' }} />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15, fontFamily: 'var(--font-mono)', fontWeight: 700, color: m.reached ? 'var(--brand)' : m.isCurrent ? 'var(--text-100)' : 'var(--text-400)', letterSpacing: '-0.03em' }}>{m.weight}kg</span>
                <span style={{ fontSize: 14 }}>{m.emoji}</span>
                <span style={{ fontSize: 11, color: 'var(--text-400)', fontFamily: 'var(--font-body)' }}>{m.label}</span>
              </div>
              {(m.reached && m.comparison) && <p style={{ fontSize: 11, color: 'var(--text-300)', marginTop: 2, fontFamily: 'var(--font-body)' }}>{m.comparison}</p>}
              {m.isCurrent && <p style={{ fontSize: 11, color: 'var(--brand)', marginTop: 2, fontFamily: 'var(--font-body)' }}>← You are here</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
