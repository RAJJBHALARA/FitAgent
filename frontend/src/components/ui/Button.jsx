import { motion } from 'framer-motion'

const variants = {
  primary: { background: 'var(--brand)', color: '#050a07', border: 'none' },
  secondary: { background: 'var(--bg-elevated)', color: 'var(--text-200)', border: '1px solid var(--border-default)' },
  ghost: { background: 'transparent', color: 'var(--text-200)', border: '1px solid var(--border-subtle)' },
  danger: { background: 'rgba(251,113,133,0.08)', color: 'var(--coral)', border: '1px solid rgba(251,113,133,0.2)' },
  warning: { background: 'rgba(245,158,11,0.08)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' },
  glow: { background: 'var(--brand)', color: '#050a07', border: 'none' },
}

export function Button({ children, variant = 'primary', size = 'md', fullWidth, onClick, disabled, className = '', icon, style }) {
  const v = variants[variant] || variants.primary
  const isGlow = variant === 'primary' || variant === 'glow'
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 12, borderRadius: 11, gap: 6 },
    md: { padding: '12px 20px', fontSize: 14, borderRadius: 14, gap: 8 },
    lg: { padding: '15px 28px', fontSize: 15, borderRadius: 16, gap: 8 },
  }
  const s = sizes[size] || sizes.md

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${isGlow ? 'btn-glow' : ''} ${className}`}
      style={{
        ...v, ...s,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: s.gap,
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'opacity 0.15s',
        ...style,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </motion.button>
  )
}

export function IconButton({ icon, onClick, size = 36, variant = 'ghost', badge }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        style={{
          width: size, height: size, borderRadius: '50%',
          border: '1px solid var(--border-subtle)',
          background: variant === 'primary' ? 'var(--brand)' : 'var(--bg-elevated)',
          color: variant === 'primary' ? '#050a07' : 'var(--text-200)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {icon}
      </motion.button>
      {badge && (
        <span style={{
          position: 'absolute', top: -3, right: -3,
          background: 'var(--coral)', color: '#fff',
          fontSize: 8, fontWeight: 800, borderRadius: 6,
          padding: '1px 4px', minWidth: 14, textAlign: 'center',
          fontFamily: 'var(--font-mono)',
        }}>{badge}</span>
      )}
    </div>
  )
}
