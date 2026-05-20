import os
import json
import re
import asyncio
import queue
import threading
from typing import AsyncGenerator
from google import genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Initialize the client
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# gemini-2.5-flash has active free tier quota
MODEL = "gemini-2.5-flash"


async def stream_chat(system_prompt: str, history: list, message: str) -> AsyncGenerator[str, None]:
    """Stream Gemini Flash response chunk by chunk using new google-genai SDK.
    Uses a background thread to prevent blocking the async event loop."""
    if not client:
        yield "⚠️ GEMINI_API_KEY not set in backend/.env — please add your key and restart uvicorn."
        return

    # Build contents list: system instruction + history + new message
    contents = []
    for msg in history[-8:]:  # Keep last 8 messages for context window
        role = "user" if msg["role"] == "user" else "model"
        contents.append(genai.types.Content(
            role=role,
            parts=[genai.types.Part(text=msg["content"])]
        ))
    # Add the new user message
    contents.append(genai.types.Content(
        role="user",
        parts=[genai.types.Part(text=message)]
    ))

    # Use a thread-safe queue to bridge sync streaming → async generator
    chunk_queue: queue.Queue = queue.Queue()
    _SENTINEL = object()

    def _run_sync_stream():
        """Run the synchronous Gemini stream in a background thread."""
        try:
            response = client.models.generate_content_stream(
                model=MODEL,
                contents=contents,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.8,
                    max_output_tokens=500,
                ),
            )
            for chunk in response:
                if chunk.text:
                    chunk_queue.put(chunk.text)
        except Exception as e:
            chunk_queue.put(e)
        finally:
            chunk_queue.put(_SENTINEL)

    # Start streaming in background thread
    thread = threading.Thread(target=_run_sync_stream, daemon=True)
    thread.start()

    # Yield chunks from the queue without blocking the event loop
    try:
        while True:
            # Poll the queue with a short sleep to stay non-blocking
            while chunk_queue.empty():
                await asyncio.sleep(0.05)
            item = chunk_queue.get_nowait()
            if item is _SENTINEL:
                break
            if isinstance(item, Exception):
                raise item
            yield item
    except Exception as e:
        err = str(e)
        print(f"[GEMINI ERROR] {err}")  # Log full error to backend console
        if "RESOURCE_EXHAUSTED" in err or "429" in err:
            yield "\n\n⚠️ API quota temporarily exhausted. Wait a minute and try again — Coach Raj needs a breather! 💤"
        elif "API_KEY_INVALID" in err or "INVALID_ARGUMENT" in err:
            yield "\n\n⚠️ Invalid API key. Please check your GEMINI_API_KEY in backend/.env and restart the server."
        else:
            yield f"\n\n⚠️ AI error: {err[:200]}"


async def generate_weekly_report(weekly_data: dict, mode: str = "report") -> dict:
    """F8 — Generate weekly correlation insights"""
    if not client:
        return {"error": "GEMINI_API_KEY not configured"}

    if mode == "correlations":
        prompt = f"""Analyze this week of health data for patterns and correlations:
{weekly_data}

Find 2-3 specific correlations (e.g., sleep vs calories, days vs consistency).
Return JSON: {{"correlations": ["correlation1", "correlation2", ...]}}"""
    else:
        prompt = f"""You are Coach Raj analyzing a week of health data.
Data: {weekly_data}

Generate a weekly report as JSON with exactly these fields:
{{
  "worked": ["thing1 that worked", "thing2 that worked"],
  "fix": ["issue1 to fix", "issue2 to fix"],
  "focus": "One specific focus for next week — one sentence action item"
}}

Be specific with numbers from the data. Be direct, motivating, data-driven."""

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
        text = response.text.strip()

        # Parse JSON from response
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    except Exception:
        pass

    return {"worked": ["Data analyzed"], "fix": ["Keep logging consistently"], "focus": "Stay consistent this week."}


async def analyze_meal(description: str) -> dict:
    """Use Gemini to estimate macros from food description"""
    if not client:
        return {"error": "GEMINI_API_KEY not configured"}

    prompt = f"""Estimate nutritional info for: "{description}"
Common Indian vegetarian foods. Be accurate with typical serving sizes.
Return JSON only (no markdown, no explanation):
{{"name": "food name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "serving": "description of serving size"}}"""

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    except Exception:
        pass

    return {"name": description, "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "serving": "unknown"}
