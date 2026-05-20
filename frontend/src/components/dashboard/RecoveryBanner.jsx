import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import useFitStore from '../../store'

export function RecoveryBanner() {
  const { recoveryMode, deactivateRecoveryMode } = useFitStore()
  if (!recoveryMode.active) return null
  return (
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      style={{
        background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)',
        borderRadius: 16, padding: '12px 14px', margin: '0 16px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
      <span style={{ fontSize: 18 }}>🌿</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--font-display)' }}>Recovery Mode — Day {recoveryMode.day}</div>
        <div style={{ fontSize: 11, color: 'var(--text-300)', fontFamily: 'var(--font-body)' }}>Easy today. Light walk + 4.5L water.</div>
      </div>
      <button onClick={deactivateRecoveryMode} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-400)', padding: 4 }}>
        <X size={16} />
      </button>
    </motion.div>
  )
}
