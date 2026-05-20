import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import useFitStore from '../../store'

const TYPES = {
  success: { icon: CheckCircle, color: 'var(--success)', bg: 'rgba(74,222,128,0.08)' },
  warning: { icon: AlertTriangle, color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)' },
  info: { icon: Info, color: 'var(--hydration)', bg: 'rgba(56,189,248,0.08)' },
  error: { icon: AlertTriangle, color: 'var(--danger)', bg: 'rgba(251,113,133,0.08)' },
}

export function ToastContainer() {
  const toast = useFitStore((s) => s.toast)
  const dismiss = useFitStore((s) => s.dismissToast)

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
            zIndex: 200, maxWidth: 380, width: 'calc(100% - 32px)',
          }}
        >
          <div className="glass" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 16,
            border: '1px solid var(--border)',
            background: TYPES[toast.type]?.bg || TYPES.info.bg,
          }}>
            {(() => { const T = TYPES[toast.type] || TYPES.info; const I = T.icon; return <I size={18} color={T.color} /> })()}
            <span style={{ fontSize: 13, color: 'var(--text-body)', flex: 1, fontFamily: 'var(--font-body)' }}>{toast.message}</span>
            <motion.button whileTap={{ scale: 0.85 }} onClick={dismiss}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={14} color="var(--text-ghost)" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
