import { motion } from 'framer-motion'
import { Card, CardHeader } from '../ui/Card'
import { READINESS_LABELS } from '../../lib/constants'
import { getReadinessLevel } from '../../lib/healthLogic'
import { useNavigate } from 'react-router-dom'

export function ReadinessCard({ score, checkedToday }) {
  const navigate = useNavigate()

  if (!checkedToday) {
    return (
      <Card onClick={() => navigate('/checkin')} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,113,133,0.1))',
            border: '1px solid rgba(245,158,11,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>🌅</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-100)' }}>
              Morning Check-In
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-300)', marginTop: 2, fontFamily: 'var(--font-body)' }}>
              Set your readiness for today
            </p>
          </div>
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ color: 'var(--text-300)', fontSize: 16 }}>→</motion.span>
        </div>
      </Card>
    )
  }

  const level = getReadinessLevel(score)
  const info = READINESS_LABELS[level]
  const colors = { high: 'var(--brand)', medium: 'var(--amber)', low: 'var(--coral)' }
  const color = colors[level]

  return (
    <Card style={{ borderColor: `${color}20` }}>
      <CardHeader title="Readiness" icon="🧠" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 60, height: 60, borderRadius: 20,
          border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}0a`, flexShrink: 0,
        }}>
          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-mono)', color, letterSpacing: '-0.04em' }}>{score}</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 3, fontFamily: 'var(--font-display)' }}>{info.label}</div>
          <p style={{ fontSize: 12, color: 'var(--text-300)', lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>{info.advice}</p>
        </div>
      </div>
    </Card>
  )
}
