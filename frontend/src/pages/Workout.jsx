import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, CheckCircle2, ExternalLink } from 'lucide-react'
import useFitStore from '../store'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Sheet } from '../components/ui/Sheet'

const pageAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -6 },
}

const WORKOUT_TYPES = [
  { id: 'walk', emoji: '🚶', label: 'Walk', kcal: 150, duration: '30 min' },
  { id: 'jog', emoji: '🏃', label: 'Jog 2km', kcal: 200, duration: '20 min' },
  { id: 'gym', emoji: '🏋️', label: 'Gym session', kcal: 350, duration: '60 min' },
  { id: 'yoga', emoji: '🧘', label: 'Yoga', kcal: 100, duration: '45 min' },
  { id: 'cycling', emoji: '🚴', label: 'Cycling', kcal: 300, duration: '30 min' },
]

const WORKOUT_PLAN = [
  { day: 'Mon', activity: 'Strength + Core', emoji: '🏋️', target: '60 min' },
  { day: 'Tue', activity: '2km Jog', emoji: '🏃', target: '25 min' },
  { day: 'Wed', activity: 'Rest + Stretch', emoji: '🧘', target: '30 min' },
  { day: 'Thu', activity: 'Upper Body', emoji: '🏋️', target: '60 min' },
  { day: 'Fri', activity: '3km Jog', emoji: '🏃', target: '35 min' },
  { day: 'Sat', activity: 'Cycling', emoji: '🚴', target: '45 min' },
  { day: 'Sun', activity: 'Full Rest', emoji: '😴', target: 'Recovery' },
]

const QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "75kg isn't a dream. It's a plan with a deadline.",
  "Move because you can, not because you have to.",
]

export default function Workout() {
  const { today, setWorkoutDone, showToast } = useFitStore()
  const [logSheetOpen, setLogSheetOpen] = useState(false)
  const scrollRef = useRef(null)
  
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=Sun, 1=Mon...
  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

  const handleLogWorkout = (w) => {
    setWorkoutDone(true)
    showToast(`${w.emoji} ${w.label} logged! +0.5L water goal added 💧`, 'success')
    setLogSheetOpen(false)
  }

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" exit="exit" style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 16px' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>💪 Workout</h1>
          <p style={{ fontSize: 13, color: 'var(--text-300)', fontFamily: 'var(--font-body)', marginTop: 2 }}>Stay consistent</p>
        </div>
        {!today.workoutDone ? (
          <Button size="sm" onClick={() => setLogSheetOpen(true)} icon={<Plus size={14} />}>Log</Button>
        ) : (
          <Badge variant="success"><CheckCircle2 size={11} /> Done</Badge>
        )}
      </div>

      {/* Today Status */}
      <div style={{ padding: '0 16px 16px' }}>
        <Card glow={today.workoutDone}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <motion.div animate={today.workoutDone ? { scale: [1, 1.15, 1] } : {}}
              style={{
                width: 56, height: 56, borderRadius: 18,
                background: today.workoutDone ? 'var(--green-ghost)' : 'var(--bg-elevated)',
                border: `1px solid ${today.workoutDone ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              }}>{today.workoutDone ? '✅' : '🎯'}</motion.div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: today.workoutDone ? 'var(--green-vivid)' : 'var(--text-100)' }}>
                {today.workoutDone ? 'Workout complete! 🔥' : 'No workout yet'}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-300)', marginTop: 2, fontFamily: 'var(--font-body)' }}>
                {today.workoutDone ? 'Water goal bumped +0.5L. Rest well.' : quote}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Plan — Horizontal Scroll */}
      <div style={{ padding: '0 0 16px' }}>
        <h3 className="label" style={{ marginBottom: 10, paddingLeft: 18 }}>This Week</h3>
        <div ref={scrollRef} className="snap-scroll" style={{ paddingLeft: 16, paddingRight: 16 }}>
          {WORKOUT_PLAN.map((item, i) => {
            const isToday = i === todayIdx
            const isDone = i < todayIdx && today.workoutDone
            
            return (
              <motion.div key={item.day}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  width: 100, padding: '14px 10px 12px',
                  borderRadius: 18, textAlign: 'center',
                  background: isToday ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  border: isToday ? '1px solid var(--brand)' : '1px solid var(--border-subtle)',
                  boxShadow: isToday ? '0 0 16px rgba(249,115,22,0.12)' : 'none',
                  opacity: isDone ? 0.5 : 1,
                  transform: isToday ? 'scale(1.04)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}>
                <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', color: isToday ? 'var(--brand)' : 'var(--text-400)', marginBottom: 6, letterSpacing: '0.06em' }}>{item.day}</div>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{item.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-100)', fontFamily: 'var(--font-body)', textDecoration: isDone ? 'line-through' : 'none', lineHeight: 1.2, minHeight: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.activity}</div>
                <div style={{ fontSize: 9, color: 'var(--text-400)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{item.target}</div>
                {isDone && <CheckCircle2 size={14} color="var(--green-vivid)" style={{ marginTop: 6 }} />}
                {isToday && <Badge variant="brand" style={{ marginTop: 6 }}>Today</Badge>}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Strava */}
      <div style={{ padding: '0 16px 16px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>🚴</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-100)' }}>Connect Strava</h3>
              <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 2, fontFamily: 'var(--font-body)' }}>Auto-sync runs & rides</p>
            </div>
            <Button variant="secondary" size="sm" icon={<ExternalLink size={12} />}
              onClick={() => window.open('http://localhost:8000/api/strava/auth', '_blank')}>Connect</Button>
          </div>
        </Card>
      </div>

      {/* Log Sheet */}
      <Sheet open={logSheetOpen} onClose={() => setLogSheetOpen(false)} title="Log Workout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WORKOUT_TYPES.map(w => (
            <motion.div key={w.id} whileTap={{ scale: 0.97 }} onClick={() => handleLogWorkout(w)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 16,
                background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', cursor: 'pointer',
              }}>
              <div style={{ fontSize: 28, width: 40, textAlign: 'center' }}>{w.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--text-100)' }}>{w.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{w.duration}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green-vivid)', letterSpacing: '-0.03em' }}>~{w.kcal}</div>
            </motion.div>
          ))}
        </div>
      </Sheet>
    </motion.div>
  )
}
