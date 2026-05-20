import os
import httpx

WEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
CITY = "Rajkot"
COUNTRY = "IN"


async def fetch_weather() -> dict:
    if not WEATHER_API_KEY:
        return {"temp": 38, "condition": "Sunny", "note": "API key not configured — using Rajkot summer default"}

    url = f"https://api.openweathermap.org/data/2.5/weather?q={CITY},{COUNTRY}&units=metric&appid={WEATHER_API_KEY}"
    async with httpx.AsyncClient() as client:
        res = await client.get(url, timeout=5.0)
        data = res.json()

    if "main" not in data:
        return {"temp": 38, "condition": "Sunny"}

    return {
        "temp": round(data["main"]["temp"]),
        "feels_like": round(data["main"]["feels_like"]),
        "condition": data["weather"][0]["main"] if data.get("weather") else "Clear",
        "humidity": data["main"].get("humidity", 0),
        "city": CITY,
    }
