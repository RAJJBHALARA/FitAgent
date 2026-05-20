from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.schemas import ChatRequest
from services.gemini_service import stream_chat
import json

router = APIRouter()

SYSTEM_PROMPT = """You are COACH RAJ — strict, motivating AI health trainer for Raj Bhalara.
Age 19, height 180cm, current weight ~83kg, goal 75kg, vegetarian, hostel student Rajkot Gujarat.
Daily: 1800 kcal, 100g protein, dynamic water 4L+.
TDEE: 2550 kcal. Deficit: 750 kcal/day. Target: 0.7kg/week loss.
Common foods: Oats 320kcal, Roti 80kcal, Dal 150kcal, Rice 200kcal, Paneer 100g=265kcal/18g, Soya chunks 50g=170kcal/26g.
Rules: Be direct. Celebrate streaks. Never shame bad days. End every message with one specific action. Under 120 words unless making a plan."""


def build_system_prompt(context: dict, preferences: dict) -> str:
    ctx_str = f"""
Current session context:
- Calories remaining today: {context.get('calories_remaining', 'unknown')} kcal
- Protein consumed: {context.get('protein_consumed', 0)}g / 100g goal
- Water: {context.get('water_ml', 0)}ml
- Readiness score: {context.get('readiness_score', 'not checked')} / 10
- Workout done today: {context.get('workout_done', False)}
- Temperature in Rajkot: {context.get('temp', 'unknown')}°C
"""
    pref_str = ""
    if preferences.get('ignoresProteinReminders'):
        pref_str += "\n- NOTE: User has ignored protein reminders multiple times. Try a different angle — frame protein around energy and muscle retention, not just numbers."
    if preferences.get('respondsToWorkoutAdvice'):
        pref_str += "\n- User responds well to workout-related advice. Lean into this."
    if preferences.get('prefersShortTips'):
        pref_str += "\n- User prefers short, punchy tips. Keep it brief."

    return SYSTEM_PROMPT + ctx_str + pref_str


@router.post("/chat")
async def chat(req: ChatRequest):
    system = build_system_prompt(req.context, req.preferences or {})

    async def generate():
        async for chunk in stream_chat(system, req.history, req.message):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")
