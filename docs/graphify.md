# FitAgent — Project Graph

> **Status:** Generated 2026-04-28 | All 18 Playwright tests passing ✅

---

## 1. Component Dependency Graph

```mermaid
graph TD
    A[App.jsx] --> B[React Router]
    B --> C[Dashboard.jsx]
    B --> D[MealLogger.jsx]
    B --> E[Workout.jsx]
    B --> F[Progress.jsx]
    B --> G[Coach.jsx]
    B --> H[MorningCheckIn.jsx]

    A --> I[BottomNav.jsx]

    C --> J[CalorieRing.jsx]
    C --> K[ReadinessCard.jsx]
    C --> L[HydrationBar.jsx]
    C --> M[DeficitDebtCard.jsx]
    C --> N[ProteinAlert.jsx]
    C --> O[MilestoneTrack.jsx]
    C --> P[RecoveryBanner.jsx]
    C --> Q[StreakBadge.jsx]

    D --> R[Card.jsx]
    D --> S[Button.jsx]
    D --> T[Toast.jsx]
    D --> U[Sheet.jsx]

    G --> R
    G --> S

    F --> R

    J --> V[useFitStore - Zustand]
    K --> V
    L --> V
    M --> V
    N --> V
    O --> V
    P --> V
    Q --> V
    D --> V
    E --> V
    G --> V
    F --> V

    style A fill:#f97316,color:#000
    style V fill:#7c3aed,color:#fff
```

---

## 2. Data Flow Graph

```mermaid
flowchart LR
    subgraph Frontend
        UI[React UI Layer]
        ZS[Zustand Store\nuseFitStore]
        LS[(localStorage)]
    end

    subgraph Backend - FastAPI
        API["/api/*"]
        CHAT["/api/chat\nchat.py"]
        MEALS["/api/meals\nmeals.py"]
        REPORTS["/api/reports\nreports.py"]
        STRAVA["/api/strava\nstrava.py"]
    end

    subgraph External Services
        GEMINI[Google Gemini\nFlash 2.0]
        WEATHER[OpenWeatherMap\nAPI]
        STRAVAAPI[Strava\nOAuth API]
    end

    UI -- user action --> ZS
    ZS -- persist --> LS
    LS -- hydrate on load --> ZS
    ZS -- reads state --> UI

    UI -- POST /api/chat --> CHAT
    CHAT -- context prompt --> GEMINI
    GEMINI -- streamed response --> CHAT
    CHAT -- SSE stream --> UI

    UI -- GET /api/strava --> STRAVA
    STRAVA -- OAuth --> STRAVAAPI
    STRAVAAPI -- activity data --> STRAVA
    STRAVA -- JSON --> UI

    UI -- GET /api/reports --> REPORTS
    REPORTS -- summary --> UI

    App.jsx -- GET /api/weather --> WEATHER
    WEATHER -- temp/humidity --> App.jsx
    App.jsx -- hydration target --> ZS

    style ZS fill:#7c3aed,color:#fff
    style GEMINI fill:#4285F4,color:#fff
    style WEATHER fill:#0097a7,color:#fff
```

---

## 3. Backend Service Graph

```mermaid
graph TD
    ENTRY[main.py\nFastAPI App] --> CORS[CORS Middleware]
    ENTRY --> R1[/api/chat]
    ENTRY --> R2[/api/meals]
    ENTRY --> R3[/api/strava]
    ENTRY --> R4[/api/reports]
    ENTRY --> R5[GET /api/weather\nproxy in main.py]

    R1 --> GS[gemini_service.py\nGemini Flash 2.0]
    R3 --> WS[Strava OAuth Flow]
    R5 --> WX[weather_service.py\nOpenWeatherMap]
    R4 --> GS

    GS --> EXT1[Google AI API]
    WX --> EXT2[OpenWeatherMap API]

    style ENTRY fill:#f97316,color:#000
    style GS fill:#4285F4,color:#fff
    style WX fill:#0097a7,color:#fff
```

---

## 4. Zustand State Shape

```mermaid
classDiagram
    class useFitStore {
        +userProfile: Object
        +dailyLog: Object
        +readiness: Object
        +inRecoveryMode: boolean
        +debtKcal: number
        +agentMemory: Array
        +weather: Object
        +logMeal(meal)
        +setReadiness(data)
        +toggleRecoveryMode()
        +addAgentMemory(msg)
        +resetDay()
    }

    class dailyLog {
        +meals: Array
        +water: number
        +totalCalories: number
        +totalProtein: number
        +totalCarbs: number
        +totalFat: number
    }

    class userProfile {
        +name: string
        +targetCalories: number
        +targetProtein: number
        +weight: number
        +height: number
        +goal: string
    }

    useFitStore --> dailyLog
    useFitStore --> userProfile
```

---

## 5. Page Route Map

| Route | Page Component | Key Features |
|-------|----------------|--------------|
| `/` → redirect | — | Redirects to `/dashboard` |
| `/dashboard` | `Dashboard.jsx` | CalorieRing, MacroBars, Readiness, Hydration, Deficit |
| `/meals` | `MealLogger.jsx` | Log food, search, macro breakdown, meal list |
| `/workout` | `Workout.jsx` | Workout log, Strava sync |
| `/progress` | `Progress.jsx` | Weekly charts, streaks, milestones |
| `/coach` | `Coach.jsx` | AI chat with Coach Raj (Gemini Flash) |
| `/morning` | `MorningCheckIn.jsx` | Daily readiness check-in |

---

## 6. Playwright Test Coverage

| Test Suite | Tests | Status |
|------------|-------|--------|
| Dashboard — core metrics render | 5 | ✅ All pass |
| Navigation — bottom nav & routing | 5 | ✅ All pass |
| Meals Page — load & inputs | 2 | ✅ All pass |
| Coach Page — load, input, typing | 3 | ✅ All pass |
| Visual Snapshots — 3 pages | 3 | ✅ All pass |
| **TOTAL** | **18** | **✅ 18/18** |

> Test file: `frontend/tests/dashboard.spec.js`  
> Config: `frontend/playwright.config.js`  
> Run with: `cd frontend && npx playwright test`
