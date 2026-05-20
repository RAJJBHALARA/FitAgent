import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { BottomNav } from './components/ui/BottomNav'
import { ToastContainer } from './components/ui/Toast'
import Dashboard from './pages/Dashboard'
import MealLogger from './pages/MealLogger'
import Workout from './pages/Workout'
import Progress from './pages/Progress'
import Coach from './pages/Coach'
import MorningCheckIn from './pages/MorningCheckIn'
import Onboarding from './pages/Onboarding'
import { useEffect } from 'react'
import useFitStore from './store'

function ProtectedRoute({ children }) {
  const { user, profile } = useFitStore()
  if (!user || !profile) return <Navigate to="/onboarding" replace />
  return children
}

function AppRoutes() {
  const location = useLocation()
  const isFullScreenPage = location.pathname === '/checkin' || location.pathname === '/onboarding'

  return (
    <>
      <ToastContainer />
      {!isFullScreenPage && <BottomNav />}
      <main className={isFullScreenPage ? '' : 'page-content'}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/meals" element={<ProtectedRoute><MealLogger /></ProtectedRoute>} />
            <Route path="/workout" element={<ProtectedRoute><Workout /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/coach" element={<ProtectedRoute><Coach /></ProtectedRoute>} />
            <Route path="/checkin" element={<ProtectedRoute><MorningCheckIn /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}

function AppInit() {
  const checkNewDay = useFitStore((s) => s.checkNewDay)
  const setWeather = useFitStore((s) => s.setWeather)

  useEffect(() => {
    checkNewDay()
    // Fetch weather through backend proxy (hides API key)
    fetch('http://localhost:8000/api/weather')
      .then((r) => r.json())
      .then((d) => {
        if (d.temp) setWeather({ temp: d.temp, condition: d.condition || 'Clear' })
      })
      .catch(() => {
        // Default to 38°C for Rajkot summer if backend unreachable
        setWeather({ temp: 38, condition: 'Sunny' })
      })
  }, [])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppInit />
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}
