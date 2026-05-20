import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useFitStore from '../store'
import { CalorieRing } from '../components/dashboard/CalorieRing'
import { HydrationBar } from '../components/dashboard/HydrationBar'
import { MilestoneTrack } from '../components/dashboard/MilestoneTrack'
import { DeficitDebtCard } from '../components/dashboard/DeficitDebtCard'
import { ProteinAlert } from '../components/dashboard/ProteinAlert'
import { ReadinessCard } from '../components/dashboard/ReadinessCard'
import { RecoveryBanner } from '../components/dashboard/RecoveryBanner'
import { StreakBadge } from '../components/dashboard/StreakBadge'
import { calcWaterGoal, greetingForTime, calcWeightLost, calcProgressPercent, calculateStreak } from '../lib/healthLogic'

const pageAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
}

const stagger = { animate: { transition: { staggerChildren: 0.04 } } }
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

export default function Dashboard() {
  const { today, readiness, debt, recoveryMode, currentWeight, weather, profile, checkNewDay, activateRecoveryMode, clearDebt, weightLog } = useFitStore()
  useEffect(() => { checkNewDay() }, [])

  const waterGoal = calcWaterGoal(weather.temp, today.workoutDone)
  const weightLost = calcWeightLost(currentWeight)
  const progressPct = calcProgressPercent(currentWeight)
  const streak = calculateStreak(weightLog, today.meals?.length || 0)

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" exit="exit" style={{ padding: '16px 0 8px' }}>

      {/* ═══ HEADER ═══ */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-display)',
              color: 'var(--text-100)', lineHeight: 1.05, letterSpacing: '-0.03em',
            }}>
              {greetingForTime()}{profile?.name ? `, ${profile.name}` : ''}!<br />
              <span className="text-gradient">Let's crush it.</span>
            </h1>
          </div>

          {/* Temp pill */}
          {weather.temp && (
            <div className="glass" style={{
              padding: '6px 12px', borderRadius: 12,
              fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)',
              color: 'var(--text-200)', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              🌡️ {weather.temp}°C
            </div>
          )}
        </div>

        {/* Status pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <StreakBadge streak={streak} label="day streak" emoji="🔥" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '5px 12px', borderRadius: 100,
              background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)',
              fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)',
              color: '#f97316',
            }}
          >
            <span>↓</span> {weightLost}kg lost
            <span style={{ color: 'var(--text-300)', marginLeft: 2 }}>({progressPct}%)</span>
          </motion.div>
        </div>
      </div>

      {/* ═══ RECOVERY BANNER ═══ */}
      <AnimatePresence>
        {recoveryMode.active && <RecoveryBanner key="rcv" />}
      </AnimatePresence>

      {/* ═══ CALORIE RING HERO ═══ */}
      <div style={{ padding: '0 16px 20px' }}>
        <div className="card-elevated" style={{
          padding: '28px 16px 24px',
          borderRadius: 24,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
            width: 260, height: 260,
            background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <CalorieRing
            consumed={today.totalCalories}
            protein={today.totalProtein}
            waterMl={today.waterMl}
          />

          {/* Macro bars */}
          <div style={{ display: 'flex', gap: 14, marginTop: 20, width: '100%', maxWidth: 340 }}>
            <MacroBar label="Protein" val={Math.round(today.totalProtein)} goal={100} unit="g" color="var(--purple)" />
            <MacroBar label="Carbs" val={Math.round(today.totalCarbs)} goal={220} unit="g" color="var(--teal)" />
            <MacroBar label="Fat" val={Math.round(today.totalFat)} goal={60} unit="g" color="var(--amber)" />
          </div>
        </div>
      </div>

      {/* ═══ CARD STACK ═══ */}
      <motion.div variants={stagger} initial="initial" animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}
      >
        <motion.div variants={fadeUp}><ReadinessCard score={readiness.score} checkedToday={readiness.checkedToday} /></motion.div>
        <motion.div variants={fadeUp}><HydrationBar waterMl={today.waterMl} goalL={waterGoal} /></motion.div>

        <AnimatePresence>
          {debt.active && debt.totalKcal > 0 && (
            <motion.div key="debt" variants={fadeUp}><DeficitDebtCard debtKcal={debt.totalKcal} onClear={clearDebt} /></motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={fadeUp}><ProteinAlert proteinConsumed={today.totalProtein} /></motion.div>
        <motion.div variants={fadeUp}><MilestoneTrack currentWeight={currentWeight} /></motion.div>

        {/* Bad Day button */}
        {!recoveryMode.active && (
          <motion.div variants={fadeUp} style={{ paddingBottom: 8 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={activateRecoveryMode}
              style={{
                width: '100%', padding: '13px', borderRadius: 16,
                background: 'transparent', border: '1px dashed rgba(251,113,133,0.15)',
                color: 'var(--text-400)', fontSize: 13, fontFamily: 'var(--font-body)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              <span style={{ fontSize: 16 }}>🌿</span>
              Rough day? Tap for Recovery Mode
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

function MacroBar({ label, val, goal, unit, color }) {
  const pct = Math.min(1, val / goal)
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'baseline' }}>
        <span style={{ fontSize: 10, color: 'var(--text-300)', fontFamily: 'var(--font-body)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color, letterSpacing: '-0.03em' }}>
          {val}<span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text-400)' }}>/{goal}{unit}</span>
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-base)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 2, boxShadow: `0 0 6px ${color}30` }}
        />
      </div>
    </div>
  )
}
