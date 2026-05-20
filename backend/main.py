from dotenv import load_dotenv
load_dotenv()  # Must be FIRST — before any service imports

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, meals, strava, reports

app = FastAPI(title="FitAgent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://*.vercel.app",  
        "*"  # update with exact domain after deploy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(meals.router, prefix="/api")
app.include_router(strava.router, prefix="/api")
app.include_router(reports.router, prefix="/api")


@app.get("/")
async def root():
    return {"status": "FitAgent API running", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    """Quick health check — also verifies Gemini key is loaded"""
    import os
    has_key = bool(os.getenv("GEMINI_API_KEY"))
    return {"status": "ok", "gemini_configured": has_key}


@app.get("/api/weather")
async def get_weather():
    """Proxy for OpenWeatherMap — hides API key from frontend"""
    from services.weather_service import fetch_weather
    return await fetch_weather()


@app.get("/api/food/search")
async def search_food_proxy(q: str):
    """Proxy Open Food Facts to avoid CORS browser restrictions."""
    import httpx
    try:
        params = {
            'search_terms': q,
            'search_simple': '1',
            'action': 'process',
            'json': '1',
            'page_size': '15',
            'fields': 'product_name,nutriments,image_url,code',
            'country': 'in',
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.get('https://world.openfoodfacts.org/cgi/search.pl', params=params)
            if r.status_code != 200:
                return {"products": []}
            data = r.json()
            products = [
                {
                    "id": p.get('code', ''),
                    "name": p['product_name'].split(',')[0].strip(),
                    "calories": round(p['nutriments'].get('energy-kcal_100g', 0)),
                    "protein": round(p['nutriments'].get('proteins_100g', 0) * 10) / 10,
                    "carbs": round(p['nutriments'].get('carbohydrates_100g', 0) * 10) / 10,
                    "fat": round(p['nutriments'].get('fat_100g', 0) * 10) / 10,
                    "source": "openfoodfacts",
                }
                for p in (data.get('products') or [])
                if p.get('product_name') and p.get('nutriments', {}).get('energy-kcal_100g')
            ]
            return {"products": products[:10]}
    except Exception as e:
        return {"products": [], "error": str(e)}
