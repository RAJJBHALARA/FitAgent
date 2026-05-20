from fastapi import APIRouter
from fastapi.responses import RedirectResponse
import os

router = APIRouter()

STRAVA_CLIENT_ID = os.getenv("STRAVA_CLIENT_ID", "")
STRAVA_CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET", "")
REDIRECT_URI = os.getenv("STRAVA_REDIRECT_URI", "http://localhost:8000/api/strava/callback")


@router.get("/strava/auth")
async def strava_auth():
    """Redirect to Strava OAuth"""
    url = (
        f"https://www.strava.com/oauth/authorize"
        f"?client_id={STRAVA_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={REDIRECT_URI}"
        f"&approval_prompt=force"
        f"&scope=read,activity:read"
    )
    return RedirectResponse(url)


@router.get("/strava/callback")
async def strava_callback(code: str):
    """Handle Strava OAuth callback"""
    import httpx
    async with httpx.AsyncClient() as client:
        res = await client.post("https://www.strava.com/oauth/token", json={
            "client_id": STRAVA_CLIENT_ID,
            "client_secret": STRAVA_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
        })
    token_data = res.json()
    # In production, store token in Firebase
    return {"status": "connected", "athlete": token_data.get("athlete", {})}


@router.get("/strava/activities")
async def strava_activities(access_token: str):
    """Fetch recent Strava activities"""
    import httpx
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://www.strava.com/api/v3/athlete/activities",
            headers={"Authorization": f"Bearer {access_token}"},
            params={"per_page": 10},
        )
    return res.json()
