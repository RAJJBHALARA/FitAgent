import { motion } from 'framer-motion'

export function Card({ children, className = '', glow = false, elevated = false, onClick, style }) {
  return (
    <motion.div
      className={`${elevated ? 'card-elevated' : 'card'} ${glow ? 'glow-brand' : ''} ${className}`}
      style={{ padding: '16px 18px', ...style }}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      layout
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ title, subtitle, icon, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <div>
          <h3 className="label" style={{ margin: 0 }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 2, fontFamily: 'var(--font-body)' }}>{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}
