import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Plus, Trash2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import useFitStore from '../store'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Sheet } from '../components/ui/Sheet'
import { QUICK_ADD_FOODS } from '../lib/constants'
import { searchFood } from '../services/foodSearch'

const pageAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
}

// Unique subtle gradient for each food card
const GRADIENTS = [
  'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.02) 100%)', // oats warm
  'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.02) 100%)',   // roti wheat
  'linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(202,138,4,0.03) 100%)',    // dal golden
  'linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.02) 100%)',   // rice cool
  'linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(74,222,128,0.02) 100%)',   // sabji green
  'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.01) 100%)',   // pav warm
  'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(167,139,250,0.02) 100%)', // bhaji purple
  'linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(56,189,248,0.01) 100%)',   // chaas cool
  'linear-gradient(135deg, rgba(245,158,11,0.09) 0%, rgba(245,158,11,0.02) 100%)',   // paneer cream
  'linear-gradient(135deg, rgba(74,222,128,0.07) 0%, rgba(74,222,128,0.02) 100%)',   // salad green
  'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(167,139,250,0.01) 100%)', // curd purple
  'linear-gradient(135deg, rgba(251,113,133,0.06) 0%, rgba(251,113,133,0.01) 100%)', // chana coral
]

export default function MealLogger() {
  const { today, logMeal, removeMeal, profile } = useFitStore()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (location.state?.prefill) {
      setSelected(location.state.prefill)
      setSheetOpen(true)
    }
  }, [location.state])

  const handleSearch = useCallback((q) => {
    setQuery(q)
    clearTimeout(debounceRef.current)
    if (!q.trim()) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try { setResults(await searchFood(q)) } catch (_) { setResults([]) }
      finally { setSearching(false) }
    }, 500)
  }, [])

  const openSheet = (food) => { setSelected(food); setQuantity(1); setSheetOpen(true) }

  const handleLog = () => {
    if (!selected) return
    logMeal({
      name: selected.name,
      calories: Math.round(selected.calories * quantity),
      protein: Math.round((selected.protein || 0) * quantity),
      carbs: Math.round((selected.carbs || 0) * quantity),
      fat: Math.round((selected.fat || 0) * quantity),
      emoji: selected.emoji || '🍽️',
    })
    setSheetOpen(false); setSelected(null); setQuery(''); setResults([])
  }

  const sortedMeals = [...today.meals].reverse()
  const goal = profile?.caloricGoal || 1800
  const pct = Math.min(1, today.totalCalories / goal)
  const over = today.totalCalories > goal

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" exit="exit" style={{ padding: '16px 0' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 16px' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--text-100)' }}>
            🍽️ Meal Logger
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-300)', fontFamily: 'var(--font-body)', marginTop: 2 }}>Track every bite.</p>
        </div>
        {/* Mini calorie arc */}
        <div style={{ position: 'relative', width: 52, height: 52 }}>
          <svg width={52} height={52} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={26} cy={26} r={21} fill="none" stroke="var(--bg-elevated)" strokeWidth={5} />
            <motion.circle cx={26} cy={26} r={21} fill="none"
              stroke={over ? 'var(--coral)' : 'var(--green-vivid)'}
              strokeWidth={5} strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 21}
              animate={{ strokeDashoffset: 2 * Math.PI * 21 * (1 - pct) }}
              transition={{ duration: 0.8 }}
              style={{ filter: `drop-shadow(0 0 4px ${over ? 'rgba(251,113,133,0.3)' : 'rgba(74,222,128,0.3)'})` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: over ? 'var(--coral)' : 'var(--text-100)' }}>
              {Math.round(pct * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Daily Total Bar */}
      <div style={{ padding: '0 16px 16px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'baseline' }}>
            <span className="label">Daily Total</span>
            <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: over ? 'var(--coral)' : 'var(--green-vivid)', letterSpacing: '-0.03em' }}>
              {today.totalCalories}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-400)' }}> / {goal} kcal</span>
            </span>
          </div>
          {/* Gradient progress bar */}
          <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-base)', overflow: 'hidden', marginBottom: 14 }}>
            <motion.div animate={{ width: `${Math.min(100, pct * 100)}%` }} transition={{ duration: 0.6 }}
              style={{ height: '100%', borderRadius: 3, background: over ? 'linear-gradient(90deg, var(--amber), var(--coral))' : pct > 0.8 ? 'linear-gradient(90deg, var(--green-vivid), var(--amber))' : 'var(--green-vivid)', boxShadow: `0 0 8px ${over ? 'rgba(251,113,133,0.3)' : 'rgba(74,222,128,0.2)'}` }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'Protein', val: `${Math.round(today.totalProtein)}g`, color: 'var(--purple)' },
              { label: 'Carbs', val: `${Math.round(today.totalCarbs)}g`, color: 'var(--teal)' },
              { label: 'Fat', val: `${Math.round(today.totalFat)}g`, color: 'var(--amber)' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color, letterSpacing: '-0.03em' }}>{val}</div>
                <div style={{ fontSize: 9, color: 'var(--text-400)', fontFamily: 'var(--font-body)' }}>{label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 16px', position: 'relative' }}>
        <div className="glass" style={{ borderRadius: 16, position: 'relative', display: 'flex', alignItems: 'center' }}>
          {searching ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              style={{ position: 'absolute', left: 14 }}>
              <Search size={16} color="var(--green-vivid)" />
            </motion.div>
          ) : (
            <Search size={16} style={{ position: 'absolute', left: 14, color: 'var(--text-400)' }} />
          )}
          <input value={query} onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search food (e.g. oats, paneer, banana)"
            style={{ paddingLeft: 42, paddingRight: query ? 40 : 14, background: 'transparent', border: 'none' }} />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]) }}
              style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-400)' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results dropdown */}
        <AnimatePresence>
          {(results.length > 0 || searching) && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              style={{
                position: 'absolute', left: 16, right: 16, top: '100%', marginTop: 4,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                borderRadius: 18, overflow: 'hidden', zIndex: 50, maxHeight: 280, overflowY: 'auto',
                boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              }}>
              {searching ? (
                <div style={{ padding: 20 }}>
                  <div className="skeleton" style={{ height: 40, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 40, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 40 }} />
                </div>
              ) : (
                results.map((food, i) => (
                  <motion.div key={food.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={() => openSheet(food)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', cursor: 'pointer',
                      borderBottom: i < results.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-100)', fontFamily: 'var(--font-body)' }}>{food.name}</span>
                        {food.source === 'gemini-ai' && (
                          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'rgba(167,139,250,0.15)', color: 'var(--purple)', fontWeight: 600, letterSpacing: '0.02em' }}>✨ AI</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-400)', marginTop: 1 }}>{food.source === 'gemini-ai' ? (food.serving || 'per serving') : 'per 100g'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--green-vivid)' }}>{food.calories}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-400)' }}>{food.protein}g protein</div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Add Grid */}
      <div style={{ padding: '0 16px 16px' }}>
        <h3 className="label" style={{ marginBottom: 10, paddingLeft: 2 }}>Quick Add</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {QUICK_ADD_FOODS.map((food, i) => (
            <motion.div key={food.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.025 }}
              whileTap={{ scale: 1.04 }}
              onClick={() => openSheet(food)}
              style={{
                padding: '12px 8px 10px',
                background: GRADIENTS[i % GRADIENTS.length],
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                cursor: 'pointer', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
              {/* Top inner glow */}
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 60, height: 30,
                background: 'radial-gradient(ellipse, rgba(255,255,255,0.03), transparent)',
                pointerEvents: 'none',
              }} />
              <div style={{ fontSize: 26, marginBottom: 6 }}>{food.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-100)', lineHeight: 1.2, fontFamily: 'var(--font-body)' }}>{food.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-300)', fontFamily: 'var(--font-mono)', marginTop: 4, letterSpacing: '-0.03em' }}>
                {food.calories} <span style={{ fontSize: 9, color: 'var(--text-400)' }}>kcal</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Today's Meals */}
      <div style={{ padding: '0 16px' }}>
        <h3 className="label" style={{ marginBottom: 10, paddingLeft: 2 }}>Today's Meals</h3>
        {sortedMeals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
              style={{ fontSize: 48, marginBottom: 12 }}>🍽️</motion.div>
            <p style={{ fontSize: 14, color: 'var(--text-300)', fontFamily: 'var(--font-body)' }}>What did you eat today?</p>
            <p style={{ fontSize: 12, color: 'var(--text-400)', marginTop: 4 }}>Search or tap a Quick Add above</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <AnimatePresence mode="popLayout">
              {sortedMeals.map((meal) => <MealItem key={meal.id} meal={meal} onDelete={() => removeMeal(meal.id)} />)}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Log Sheet */}
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`Log ${selected?.name || 'Food'}`}>
        {selected && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 52, width: 88, height: 88, borderRadius: 24, background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selected.emoji || '🍽️'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[
                { label: 'Calories', val: Math.round(selected.calories * quantity), color: 'var(--coral)' },
                { label: 'Protein', val: `${Math.round((selected.protein || 0) * quantity)}g`, color: 'var(--purple)' },
                { label: 'Carbs', val: `${Math.round((selected.carbs || 0) * quantity)}g`, color: 'var(--teal)' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: 'var(--bg-overlay)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color, letterSpacing: '-0.03em' }}>{val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-body)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <span className="label" style={{ display: 'block', marginBottom: 10 }}>Servings</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(q => Math.max(0.5, q - 0.5))}
                  style={{ width: 48, height: 48, borderRadius: 14, border: '1px solid var(--border-default)', background: 'var(--bg-overlay)', color: 'var(--text-100)', fontSize: 22, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>−</motion.button>
                <span style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-100)', flex: 1, textAlign: 'center', letterSpacing: '-0.04em' }}>{quantity}×</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(q => q + 0.5)}
                  style={{ width: 48, height: 48, borderRadius: 14, border: '1px solid var(--border-default)', background: 'var(--bg-overlay)', color: 'var(--text-100)', fontSize: 22, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>+</motion.button>
              </div>
            </div>
            <Button onClick={handleLog} fullWidth size="lg">
              Log Meal → {Math.round(selected.calories * quantity)} kcal
            </Button>
          </div>
        )}
      </Sheet>
    </motion.div>
  )
}

function MealItem({ meal, onDelete }) {
  const time = new Date(meal.loggedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  return (
    <motion.div layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      style={{
        display: 'flex', alignItems: 'center', padding: '12px 14px',
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 16, gap: 10, position: 'relative', overflow: 'hidden',
      }}>
      {/* Left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, borderRadius: 2, background: 'var(--green-vivid)', opacity: 0.5 }} />
      <span style={{ fontSize: 24, marginLeft: 4 }}>{meal.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-100)', fontFamily: 'var(--font-body)' }}>{meal.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-400)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
          {time} · {meal.protein}g protein
        </div>
      </div>
      <div style={{ textAlign: 'right', marginRight: 6 }}>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-100)', letterSpacing: '-0.03em' }}>{meal.calories}</div>
        <div style={{ fontSize: 9, color: 'var(--text-400)' }}>kcal</div>
      </div>
      <motion.button whileTap={{ scale: 0.85 }} onClick={onDelete}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--coral)', padding: 4, opacity: 0.4 }}>
        <Trash2 size={15} />
      </motion.button>
    </motion.div>
  )
}
