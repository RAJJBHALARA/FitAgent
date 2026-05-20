/**
 * foodSearch.js — Open Food Facts API + Gemini AI fallback
 * First searches Open Food Facts. If no results, calls the
 * backend Gemini API to estimate macros from the food name.
 */

const API_BASE = 'http://localhost:8000/api'

export async function searchFood(query) {
  // Try Open Food Facts first
  const offResults = await searchOpenFoodFacts(query)
  if (offResults.length > 0) return offResults

  // Fallback: use Gemini AI to estimate macros
  return await searchWithAI(query)
}

async function searchOpenFoodFacts(query) {
  try {
    // Route through backend proxy to avoid CORS issues
    const res = await fetch(`${API_BASE}/food/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.products || []).map((p) => ({
      ...p,
      emoji: getFoodEmoji(p.name || ''),
    }))
  } catch {
    return []
  }
}

async function searchWithAI(query) {
  try {
    const res = await fetch(`${API_BASE}/meals/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: query }),
    })
    if (!res.ok) return []

    const data = await res.json()
    if (data.error || !data.calories) return []

    return [{
      id: `ai-${Date.now()}`,
      name: data.name || query,
      calories: Math.round(data.calories),
      protein: Math.round(data.protein || 0),
      carbs: Math.round(data.carbs || 0),
      fat: Math.round(data.fat || 0),
      serving: data.serving || 'standard serving',
      emoji: getFoodEmoji(data.name || query),
      source: 'gemini-ai',
    }]
  } catch {
    return []
  }
}

function getFoodEmoji(name) {
  const lower = name.toLowerCase()
  if (lower.includes('milk') || lower.includes('doodh')) return '🥛'
  if (lower.includes('egg')) return '🥚'
  if (lower.includes('rice') || lower.includes('chawal')) return '🍚'
  if (lower.includes('roti') || lower.includes('chapati') || lower.includes('bread')) return '🫓'
  if (lower.includes('dal') || lower.includes('lentil')) return '🍲'
  if (lower.includes('paneer') || lower.includes('cheese')) return '🧀'
  if (lower.includes('chicken') || lower.includes('murg')) return '🍗'
  if (lower.includes('oat')) return '🥣'
  if (lower.includes('banana')) return '🍌'
  if (lower.includes('apple')) return '🍎'
  if (lower.includes('yogurt') || lower.includes('curd') || lower.includes('dahi')) return '🍦'
  if (lower.includes('coffee') || lower.includes('chai') || lower.includes('tea')) return '☕'
  if (lower.includes('water') || lower.includes('juice')) return '🥤'
  if (lower.includes('nut') || lower.includes('almond')) return '🥜'
  if (lower.includes('sabji') || lower.includes('vegetable') || lower.includes('bhaji')) return '🥗'
  if (lower.includes('soya') || lower.includes('soy')) return '🫘'
  if (lower.includes('idli') || lower.includes('dosa')) return '🫓'
  if (lower.includes('paratha')) return '🫓'
  if (lower.includes('samosa') || lower.includes('pakora')) return '🥟'
  if (lower.includes('chana') || lower.includes('chickpea')) return '🫘'
  if (lower.includes('fruit')) return '🍇'
  return '🍽️'
}
