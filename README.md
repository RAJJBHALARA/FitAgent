# 🔥 FitAgent — AI Health Coach

> The only open-source AI health agent built for 
> Indian college students

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-109989?style=for-the-badge&logo=fastapi&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini%202.0-blue?style=for-the-badge&logo=google-gemini&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-orange?style=for-the-badge&logo=progressive-web-apps&logoColor=white)
![MIT](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## Why FitAgent is different
- 🍱 Understands Indian hostel food (dal, roti, pav bhaji)
- 🌡️ Heat-adjusted hydration for 40°C+ Indian summers
- 📊 Deficit debt tracker — no shame, just math
- 🧠 Self-evolving AI that learns your habits
- 💸 100% free to run (Gemini free tier + Firebase free)
- 🌍 Works for any user — full onboarding + Firebase sync

## Features
- ✅ Calorie & macro tracking with 3-ring dashboard
- ✅ AI Coach powered by Gemini 2.0 Flash
- ✅ Heat-adjusted hydration goals
- ✅ Morning readiness score
- ✅ Deficit debt tracker
- ✅ Protein gap alerts with Indian food suggestions
- ✅ Weight journey with milestone celebrations
- ✅ Weekly AI correlation reports
- ✅ Self-evolving coaching (learns what you follow)
- ✅ Recovery Day mode
- ✅ PWA — installable on Android homescreen

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| State | Zustand |
| Animations | Framer Motion |
| Backend | FastAPI (Python) |
| AI | Gemini 2.0 Flash |
| Database | Firebase Firestore |
| Food DB | Open Food Facts API |
| Weather | OpenWeatherMap API |

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Gemini API key (free at aistudio.google.com)
- Firebase project (free at console.firebase.google.com)

### Setup

```bash
# Clone
git clone https://github.com/rajbhalara/fitagent
cd fitagent

# Frontend
cd frontend
npm install
cp .env.example .env  # add your API keys
npm run dev

# Backend (new terminal)
cd backend
pip install -r requirements.txt
cp .env.example .env  # add GEMINI_API_KEY
uvicorn main:app --reload
```

Open http://localhost:5173 → Sign in with Google → 
Set up your profile → Start your journey 🚀

## Environment Variables

### frontend/.env
VITE_GEMINI_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_ID=
VITE_FIREBASE_APP_ID=
VITE_WEATHER_API_KEY=

### backend/.env
GEMINI_API_KEY=
WEATHER_API_KEY=

## Screenshots
[Dashboard] [Meals] [Workout] [Progress] [Coach]

## Roadmap
- [ ] React Native mobile app
- [ ] Strava deep sync
- [ ] WhatsApp daily reminders
- [ ] Voice logging in Hindi/Gujarati
- [ ] Oura Ring / Whoop integration

## Contributing
PRs welcome! See CONTRIBUTING.md

## License
MIT — use it, fork it, build on it.

---
Built with ❤️ by Raj Bhalara
