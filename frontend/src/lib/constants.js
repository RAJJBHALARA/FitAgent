// ─────────────────────────────────────────────
// constants.js — Milestone data, food presets, seed data
// ─────────────────────────────────────────────

export const USER_PROFILE = {
  name: 'Raj',
  age: 19,
  height: 180,
  startWeight: 85,
  goalWeight: 75,
  currentWeight: 83.2,
  tdee: 2550,
  caloricGoal: 1800,
  proteinGoal: 100,
  waterGoalBase: 4.0,
  city: 'Rajkot',
  country: 'IN',
  isVegetarian: true,
}

export const MILESTONES = [
  {
    weight: 85,
    label: 'Day 1',
    emoji: '🚀',
    title: 'The Starting Line',
    description: 'You made the decision. That already puts you ahead of 90% of people.',
    comparison: null,
  },
  {
    weight: 83,
    label: '-2kg',
    emoji: '💧',
    title: 'First Notable Win',
    description: "You've dropped a full water dispenser jar. Your clothes already fit a little different.",
    comparison: 'That\'s the weight of a full water dispenser jar 🏺',
  },
  {
    weight: 80,
    label: 'Normal BMI',
    emoji: '🎯',
    title: 'No Longer Overweight',
    description: "You're clinically no longer overweight. Your body looks visibly different to everyone around you.",
    comparison: 'BMI: 24.7 — you\'re back in the healthy range 🏥',
  },
  {
    weight: 77.5,
    label: 'Halfway',
    emoji: '👑',
    title: 'Halfway King',
    description: "Halfway there. 5kg gone, 2.5kg to go. Most people quit before this point. You didn't.",
    comparison: 'That\'s the weight of a healthy human heart times 1000 — just for perspective 💪',
  },
  {
    weight: 75,
    label: 'GOAL 🏆',
    emoji: '🏆',
    title: 'NEW RAJ UNLOCKED',
    description: 'This took discipline most people will never have. Your BMI is 23.1. You look incredible.',
    comparison: 'NEW RAJ UNLOCKED. 🏆 This took discipline most people will never have.',
  },
]

export const QUICK_ADD_FOODS = [
  { id: 'oats', name: 'Oats + Milk', calories: 320, protein: 14, carbs: 48, fat: 8, emoji: '🥣' },
  { id: 'roti', name: 'Roti', calories: 80, protein: 2.5, carbs: 15, fat: 1.5, emoji: '🫓' },
  { id: 'dal', name: 'Dal Bowl', calories: 150, protein: 9, carbs: 22, fat: 3, emoji: '🍲' },
  { id: 'rice', name: 'Rice Bowl', calories: 200, protein: 4, carbs: 44, fat: 0.5, emoji: '🍚' },
  { id: 'sabji', name: 'Sabji Bowl', calories: 120, protein: 3, carbs: 15, fat: 5, emoji: '🥘' },
  { id: 'pav', name: 'Pav', calories: 120, protein: 3.5, carbs: 22, fat: 2, emoji: '🍞' },
  { id: 'bhaji', name: 'Bhaji Bowl', calories: 200, protein: 5, carbs: 18, fat: 12, emoji: '🥗' },
  { id: 'chaas', name: 'Chaas', calories: 60, protein: 3, carbs: 7, fat: 1.5, emoji: '🥤' },
  { id: 'paneer', name: 'Paneer 100g', calories: 265, protein: 18, carbs: 4, fat: 20, emoji: '🧀' },
  { id: 'salad', name: 'Salad Bowl', calories: 40, protein: 2, carbs: 8, fat: 0.5, emoji: '🥗' },
  { id: 'curd', name: 'Curd Bowl', calories: 100, protein: 6, carbs: 8, fat: 4, emoji: '🍦' },
  { id: 'chana', name: 'Chana Sabji', calories: 200, protein: 10, carbs: 32, fat: 4, emoji: '🫘' },
]

export const PROTEIN_SWAPS = [
  { id: 'paneer', name: 'Paneer', qty: '100g', calories: 265, protein: 18, emoji: '🧀' },
  { id: 'soya', name: 'Soya Chunks', qty: '50g', calories: 170, protein: 26, emoji: '🌱' },
  { id: 'greek-curd', name: 'Greek Curd', qty: '200g', calories: 130, protein: 12, emoji: '🍦' },
  { id: 'chana', name: 'Boiled Chana', qty: '100g', calories: 160, protein: 10, emoji: '🫘' },
  { id: 'besan', name: 'Besan Cheela', qty: '2 pieces', calories: 180, protein: 10, emoji: '🥞' },
  { id: 'sprouts', name: 'Sprouts', qty: '100g', calories: 97, protein: 9, emoji: '🌿' },
]

// Sort by protein per calorie
export const PROTEIN_SWAPS_SORTED = [...PROTEIN_SWAPS].sort(
  (a, b) => b.protein / b.calories - a.protein / a.calories
)

// Seed weight log for demo
export const SEED_WEIGHT_LOG = [
  { date: '2026-04-01', weight: 85.0 },
  { date: '2026-04-05', weight: 84.6 },
  { date: '2026-04-10', weight: 84.1 },
  { date: '2026-04-15', weight: 83.8 },
  { date: '2026-04-20', weight: 83.4 },
  { date: '2026-04-25', weight: 83.2 },
  { date: '2026-04-28', weight: 83.2 },
]

export const COACH_QUICK_CHIPS = [
  "What should I eat?",
  "Motivate me",
  "Check my macros",
  "Bad day help",
  "Plan tomorrow's meals",
  "How do I hit protein?",
]

export const READINESS_LABELS = {
  high: { label: 'Push hard today 🔥', color: '#f97316', advice: 'Your body is primed. Hit that workout and aim for 100g protein today.' },
  medium: { label: 'Moderate day — stay consistent', color: '#fbbf24', advice: 'Go steady. 80% effort on workout, stay on target with calories.' },
  low: { label: 'Recovery day — go easy', color: '#f87171', advice: 'Light walk only. Focus on sleep, water, and meals. Tomorrow will be better.' },
}
