import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useFitStore from '../store'
import { calcReadinessScore, getReadinessLevel } from '../lib/healthLogic'
import { READINESS_LABELS } from '../lib/constants'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

const SLIDERS = [
  { key: 'sleep', label: 'Sleep Quality', emoji: '😴', desc: 'How well did you sleep?', invert: false },
  { key: 'energy', label: 'Energy Level', emoji: '⚡', desc: 'How energetic do you feel?', invert: false },
  { key: 'soreness', label: 'Muscle Soreness', emoji: '🤕', desc: 'Higher = more sore', invert: true },
  { key: 'mood', label: 'Mood', emoji: '😊', desc: 'How\'s your mental state?', invert: false },
]

export default function MorningCheckIn() {
  const navigate = useNavigate()
  const { setReadiness } = useFitStore()
  const [values, setValues] = useState({ sleep: 7, energy: 7, soreness: 3, mood: 7 })
  const [submitted, setSubmitted] = useState(false)

  const score = calcReadinessScore(values)
  const level = getReadinessLevel(score)
  const info = READINESS_LABELS[level]
  const scoreColor = { high: 'var(--success)', medium: 'var(--warning)', low: 'var(--danger)' }[level]

  const handleSubmit = () => {
    setReadiness({ ...values, score, level })
    setSubmitted(true)
    setTimeout(() => navigate('/dashboard'), 2000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 500,
      display: 'flex', flexDirection: 'column',
      maxWidth: 430, margin: '0 auto', padding: 24, overflowY: 'auto',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 200,
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.06), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="check-in" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 32, paddingTop: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌅</div>
              <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', marginBottom: 8, color: 'var(--text-white)' }}>Morning Check-In</h1>
              <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
                Rate how you feel. This adjusts workout intensity and calorie flexibility.
              </p>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30, marginBottom: 28 }}>
              {SLIDERS.map(({ key, label, emoji, desc, invert }) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{emoji}</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-white)' }}>{label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, fontFamily: 'var(--font-body)' }}>{desc}</div>
                      </div>
                    </div>
                    <motion.div key={values[key]} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                      style={{
                        width: 38, height: 38, borderRadius: 12,
                        background: invert ? `hsl(${(10 - values[key]) * 12}, 70%, 45%)` : `hsl(${values[key] * 12}, 70%, 45%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#050a07',
                        boxShadow: `0 0 12px ${invert ? `hsla(${(10 - values[key]) * 12}, 70%, 45%, 0.3)` : `hsla(${values[key] * 12}, 70%, 45%, 0.3)`}`,
                      }}>{values[key]}</motion.div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 14 }}>1</span>
                    <input type="range" min={1} max={10} step={1} value={values[key]}
                      onChange={e => setValues(v => ({ ...v, [key]: Number(e.target.value) }))}
                      style={{ flex: 1 }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 14, textAlign: 'right' }}>10</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Score */}
            <div style={{
              padding: '18px 20px', borderRadius: 22, marginBottom: 20, textAlign: 'center',
              background: 'var(--elevated)', border: '1px solid var(--border)',
              boxShadow: `0 0 24px ${scoreColor}10`,
            }}>
              <span className="label" style={{ marginBottom: 8, display: 'block' }}>Readiness Score</span>
              <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-mono)', color: scoreColor, lineHeight: 1, letterSpacing: '-0.05em' }}>{score}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: scoreColor, marginTop: 8, fontFamily: 'var(--font-display)' }}>{info.label}</div>
              <p style={{ fontSize: 12, color: 'var(--text-body)', marginTop: 6, lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>{info.advice}</p>
            </div>

            <Button onClick={handleSubmit} fullWidth size="lg">Start My Day →</Button>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }} transition={{ duration: 0.6 }}
              style={{ fontSize: 72, marginBottom: 16 }}>{level === 'high' ? '🔥' : level === 'medium' ? '💪' : '🌿'}</motion.div>
            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 8, color: scoreColor }}>{info.label}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-body)', fontFamily: 'var(--font-body)' }}>Readiness locked. Heading to dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
