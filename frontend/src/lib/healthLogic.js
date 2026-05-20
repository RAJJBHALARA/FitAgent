// ─────────────────────────────────────────────
// healthLogic.js — All calculation functions
// ─────────────────────────────────────────────
import useFitStore from '../store'

/** Calculate daily water goal based on temp and workout */
export function calcWaterGoal(tempC, workoutDone) {
  const profile = useFitStore.getState().profile
  let goal = profile ? profile.waterGoalBase : 3.5
  if (tempC > 35) goal += (tempC - 35) * 0.05
  if (workoutDone) goal += 0.5
  return Math.round(goal * 10) / 10
}

/** Calculate Readiness Score from 4 slider values (1-10) */
export function calcReadinessScore({ sleep, energy, soreness, mood }) {
  // Soreness is inverted (higher soreness = lower readiness)
  const sorenessInverted = 11 - soreness
  const weighted = sleep * 0.3 + energy * 0.3 + sorenessInverted * 0.2 + mood * 0.2
  return Math.round(weighted * 10) / 10
}

/** Readiness level: 'high' | 'medium' | 'low' */
export function getReadinessLevel(score) {
  if (score >= 7) return 'high'
  if (score >= 4) return 'medium'
  return 'low'
}

/** F4 — Deficit Debt recovery plan */
export function calcDebtPlan(debtKcal) {
  const profile = useFitStore.getState().profile || { caloricGoal: 2000 }
  return {
    day1: Math.max(1500, profile.caloricGoal - debtKcal * 0.4),
    day2: Math.max(1600, profile.caloricGoal - debtKcal * 0.3),
    day3: profile.caloricGoal,
  }
}

/** F6 — Protein gap */
export function calcProteinGap(consumed) {
  const profile = useFitStore.getState().profile || { proteinGoal: 150 }
  return Math.max(0, profile.proteinGoal - consumed)
}

/** Calories remaining */
export function calcCaloriesRemaining(consumed, goal) {
  const profile = useFitStore.getState().profile || { caloricGoal: 2000 }
  return (goal || profile.caloricGoal) - consumed
}

/** BMI calculation */
export function calcBMI(weight) {
  const profile = useFitStore.getState().profile || { height: 175 }
  const heightM = profile.height / 100
  return Math.round((weight / (heightM * heightM)) * 10) / 10
}

/** Progress percentage */
export function calcProgressPercent(current) {
  const profile = useFitStore.getState().profile || { startWeight: 80, goalWeight: 70 }
  const { startWeight, goalWeight } = profile
  const lost = startWeight - current
  const total = startWeight - goalWeight
  return Math.min(100, Math.max(0, Math.round((lost / total) * 100)))
}

/** Weight lost so far */
export function calcWeightLost(current) {
  const profile = useFitStore.getState().profile || { startWeight: 80 }
  return Math.round((profile.startWeight - current) * 10) / 10
}

/** Estimated weeks to goal at current pace (kcal deficit) */
export function calcWeeksToGoal(current, weeklyLossKg = 0.7) {
  const profile = useFitStore.getState().profile || { goalWeight: 70 }
  const remaining = current - profile.goalWeight
  return Math.ceil(remaining / weeklyLossKg)
}

/** Get current milestone status */
export function getMilestoneStatus(currentWeight, milestones) {
  return milestones.map((m) => ({
    ...m,
    reached: currentWeight <= m.weight,
    isCurrent: Math.abs(currentWeight - m.weight) < 0.5,
  }))
}

/** Date helpers */
export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function isToday(dateStr) {
  return dateStr === todayStr()
}

export function dayOfWeek() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long' })
}

export function greetingForTime() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Format ml → L display */
export function formatWater(ml) {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`
  return `${ml}ml`
}

/** Macro color */
export function getMacroColor(type) {
  const map = { protein: '#a78bfa', carbs: '#60a5fa', fat: '#fbbf24', calories: '#f97316' }
  return map[type] || '#fdba74'
}

/** Calculate streak based on consecutive logged days from weightLog or today's meals */
export function calculateStreak(weightLog, todayMealsCount = 0) {
  if (!weightLog) return 0
  
  const loggedDates = new Set(
    weightLog.map(w => {
      try {
        return new Date(w.date).toDateString()
      } catch {
        return ''
      }
    }).filter(Boolean)
  )

  let checkDate = new Date()
  const todayStrStr = checkDate.toDateString()
  
  if (todayMealsCount > 0) {
    loggedDates.add(todayStrStr)
  }

  let streak = 0
  let loggedToday = loggedDates.has(todayStrStr)
  
  let yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  let loggedYesterday = loggedDates.has(yesterday.toDateString())
  
  if (!loggedToday && !loggedYesterday) {
    return 0
  }
  
  if (!loggedToday) {
    checkDate = yesterday
  }
  
  while (loggedDates.has(checkDate.toDateString())) {
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }
  
  return streak
}
