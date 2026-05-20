import { motion, AnimatePresence } from 'framer-motion'

export function Sheet({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 200 }}
          />
          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            style={{
              position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: 430,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              padding: '8px 20px calc(24px + var(--safe-bottom))',
              zIndex: 201, maxHeight: '85dvh', overflowY: 'auto',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(74,222,128,0.06)',
            }}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 16px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-default)' }} />
            </div>
            {/* Title */}
            {title && (
              <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-100)', marginBottom: 20, letterSpacing: '-0.02em' }}>
                {title}
              </h2>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
