import { motion } from 'framer-motion'

export function StreakBadge({ streak, label, emoji = '🔥' }) {
  if (!streak || streak === 0) return null
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', borderRadius: 100,
        background: 'rgba(245,158,11,0.06)',
        border: '1px solid rgba(245,158,11,0.18)',
      }}>
      <motion.span animate={{ rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.4 }}
        style={{ fontSize: 13 }}>{emoji}</motion.span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>{streak}</span>
      <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-body)' }}>{label}</span>
    </motion.div>
  )
}
