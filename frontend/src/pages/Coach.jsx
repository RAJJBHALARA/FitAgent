import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Check, X, Mic } from 'lucide-react'
import useFitStore from '../store'
import { COACH_QUICK_CHIPS } from '../lib/constants'

const API_BASE = 'http://localhost:8000/api'

const pageAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0 },
}

const STARTER_CARDS = [
  { emoji: '🔥', text: 'How am I doing today?' },
  { emoji: '🍽️', text: 'What should I eat for dinner?' },
  { emoji: '💪', text: 'Give me a pep talk' },
]

export default function Coach() {
  const { chatHistory, addChatMessage, today, readiness, weather, agentMemory, trackAdvice, markAdviceFollowed, markAdviceSkipped, profile } = useFitStore()
  const calorieGoal = profile?.caloricGoal || 1800
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory, loading])

  const buildContext = () => ({
    calories_remaining: Math.max(0, calorieGoal - today.totalCalories),
    protein_consumed: today.totalProtein,
    water_ml: today.waterMl,
    readiness_score: readiness.score,
    workout_done: today.workoutDone,
    temp: weather.temp,
  })

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')
    setLoading(true)
    addChatMessage({ role: 'user', content: userMsg, timestamp: Date.now(), id: `user-${Date.now()}` })

    const aiEntry = { role: 'assistant', content: '', timestamp: Date.now(), id: Date.now(), streaming: true }
    addChatMessage(aiEntry)

    try {
      // Build history for backend (last 8 messages)
      const history = chatHistory.slice(-8).map(m => ({ role: m.role, content: m.content }))

      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: buildContext(),
          history,
          preferences: agentMemory.preferences || {},
        }),
      })

      if (!res.ok) throw new Error(`Backend error: ${res.status}`)

      // Stream the response chunk by chunk
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let aiContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        aiContent += decoder.decode(value, { stream: true })
        useFitStore.setState(s => ({
          chatHistory: s.chatHistory.map(m =>
            m.id === aiEntry.id ? { ...m, content: aiContent } : m
          ),
        }))
      }

      // Mark streaming complete
      useFitStore.setState(s => ({
        chatHistory: s.chatHistory.map(m =>
          m.id === aiEntry.id ? { ...m, streaming: false } : m
        ),
      }))

      trackAdvice({ content: aiContent, type: 'general', date: new Date().toISOString(), id: aiEntry.id })
    } catch (err) {
      console.error('[Coach] Backend error:', err)
      useFitStore.setState(s => ({
        chatHistory: s.chatHistory.map(m =>
          m.id === aiEntry.id
            ? { ...m, content: "Hey! I couldn't connect to the backend right now. Make sure the server is running (`uvicorn main:app --reload`) and try again. 💪", streaming: false }
            : m
        ),
      }))
    } finally { setLoading(false); inputRef.current?.focus() }
  }

  const caloriesLeft = Math.max(0, calorieGoal - today.totalCalories)

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" exit="exit"
      style={{ display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, bottom: 'calc(60px + var(--safe-bottom))' }}>

      {/* Header */}
      <div className="glass-heavy" style={{
        padding: '14px 20px 12px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: 'var(--brand-ghost)', border: '1px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={22} color="var(--brand)" />
          </div>
          {/* Online ring */}
          <div className="pulse-brand" style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 12, height: 12, borderRadius: '50%',
            background: 'var(--brand)', border: '2px solid var(--bg)',
          }} />
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-white)' }}>Coach Raj</h2>
          <p style={{ fontSize: 10, color: 'var(--brand)', fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>AI Health Trainer · Online</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{caloriesLeft} left</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Empty state — 3 starter cards */}
        {chatHistory.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px', gap: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 4 }}>🤖</div>
            <h3 style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-white)' }}>Hey {profile?.name || 'there'}!</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, textAlign: 'center', fontFamily: 'var(--font-body)', maxWidth: 260 }}>
              I know your data, goals, and history. Ask me anything.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 300 }}>
              {STARTER_CARDS.map((card) => (
                <motion.div key={card.text} whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(card.text)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '13px 16px', borderRadius: 16,
                    background: 'var(--elevated)', border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}>
                  <span style={{ fontSize: 20 }}>{card.emoji}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-white)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>{card.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {chatHistory.map((msg, i) => <ChatBubble key={msg.id || `${msg.role}-${msg.timestamp}-${i}`} msg={msg} onFollow={markAdviceFollowed} onSkip={markAdviceSkipped} />)}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: 'var(--brand-ghost)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color="var(--brand)" />
            </div>
            <div style={{ padding: '10px 16px', background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 6px', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick chips (only when chat is active) */}
      {chatHistory.length > 0 && (
        <div className="snap-scroll" style={{ padding: '0 16px 6px' }}>
          {COACH_QUICK_CHIPS.map(chip => (
            <motion.button key={chip} whileTap={{ scale: 0.95 }} onClick={() => sendMessage(chip)}
              style={{
                padding: '8px 14px', borderRadius: 100,
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--text-muted)', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
              }}>{chip}</motion.button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form className="glass-heavy" onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{
        padding: '8px 16px calc(10px + var(--safe-bottom))',
        display: 'flex', gap: 10, alignItems: 'flex-end',
        borderTop: '1px solid var(--border)',
        margin: 0,
      }}>
        <textarea ref={inputRef} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="Ask Coach Raj anything..."
          rows={1}
          style={{ resize: 'none', borderRadius: 16, padding: '10px 14px', flex: 1, fontSize: 14, lineHeight: 1.4, maxHeight: 120, background: 'var(--elevated)', border: '1px solid var(--border)', outline: 'none' }}
        />
        {/* Mic placeholder */}
        <button type="button" style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
          <Mic size={18} color="var(--text-ghost)" />
        </button>
        {/* Send */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.88 }}
          disabled={!input.trim() || loading}
          className={input.trim() && !loading ? 'btn-brand' : ''}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: input.trim() && !loading ? 'var(--brand)' : 'var(--surface)',
            border: input.trim() && !loading ? 'none' : '1px solid var(--border)',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.2s',
            opacity: input.trim() && !loading ? 1 : 0.6,
          }}>
          <Send size={18} color={input.trim() && !loading ? '#fff' : 'var(--text-muted)'} style={{ marginLeft: input.trim() && !loading ? 2 : 0 }} />
        </motion.button>
      </form>
    </motion.div>
  )
}

function ChatBubble({ msg, onFollow, onSkip }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, borderRadius: 10, background: 'var(--brand-ghost)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 }}>
          <Bot size={14} color="var(--brand)" />
        </div>
      )}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '11px 15px',
          borderRadius: isUser ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
          background: isUser ? 'var(--brand)' : 'var(--elevated)',
          border: isUser ? 'none' : '1px solid var(--border)',
          color: isUser ? '#fff' : 'var(--text-white)',
          fontSize: 14, lineHeight: 1.55, fontFamily: 'var(--font-body)', whiteSpace: 'pre-wrap',
          boxShadow: isUser ? '0 2px 12px var(--brand-glow)' : 'none',
        }}>
          {msg.content}
          {msg.streaming && <span style={{ display: 'inline-block', width: 8, height: 14, background: 'var(--brand)', marginLeft: 2, animation: 'blink 1s infinite', verticalAlign: 'middle', borderRadius: 1 }} />}
        </div>
        {/* Timestamp */}
        <div style={{ fontSize: 9, color: 'var(--text-ghost)', marginTop: 4, fontFamily: 'var(--font-mono)', textAlign: isUser ? 'right' : 'left', paddingLeft: isUser ? 0 : 2, paddingRight: isUser ? 2 : 0 }}>
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {/* Follow / Skip — icon pills */}
        {!isUser && msg.id && !msg.status && (
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onFollow(msg.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: 20, padding: '5px 12px',
                color: '#4ade80', fontSize: 12, fontWeight: 500,
                cursor: 'pointer'
              }}>
              ✓ Did this
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onSkip(msg.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(251,113,133,0.1)',
                border: '1px solid rgba(251,113,133,0.3)',
                borderRadius: 20, padding: '5px 12px',
                color: '#fb7185', fontSize: 12, fontWeight: 500,
                cursor: 'pointer'
              }}>
              ✗ Skip
            </motion.button>
          </div>
        )}
      </div>
      {isUser && (
        <div style={{ width: 28, height: 28, borderRadius: 10, background: 'var(--brand-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 }}>
          <User size={14} color="var(--brand)" />
        </div>
      )}
    </motion.div>
  )
}
