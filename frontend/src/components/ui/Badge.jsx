import { motion } from 'framer-motion'

const VARIANTS = {
  default: { bg: 'var(--elevated)', color: 'var(--text-body)', border: 'var(--border)' },
  brand: { bg: 'var(--brand-ghost)', color: 'var(--brand)', border: 'var(--border-brand)' },
  success: { bg: 'rgba(74,222,128,0.08)', color: 'var(--success)', border: 'rgba(74,222,128,0.2)' },
  warning: { bg: 'rgba(245,158,11,0.08)', color: 'var(--warning)', border: 'rgba(245,158,11,0.2)' },
  danger: { bg: 'rgba(251,113,133,0.08)', color: 'var(--danger)', border: 'rgba(251,113,133,0.2)' },
}

export function Badge({ variant = 'default', children, style = {} }) {
  const v = VARIANTS[variant] || VARIANTS.default
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 100,
        fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)',
        background: v.bg, color: v.color, border: `1px solid ${v.border}`,
        letterSpacing: '0.02em',
        ...style,
      }}
    >
      {children}
    </motion.span>
  )
}
