import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useFitStore from '../store'
import { signInWithGoogle } from '../lib/firebase'

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, profile, setUser, fetchProfileFromFirestore, saveProfileToFirestore, showToast } = useFitStore()
  const [step, setStep] = useState(1) // 1: Login, 2: Loading, 3: Profile Form
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    startWeight: '',
    goalWeight: '',
    isVegetarian: true,
  })

  useEffect(() => {
    if (user && profile) {
      navigate('/dashboard', { replace: true })
    } else if (user && !profile) {
      setStep(3)
    }
  }, [user, profile, navigate])

  const handleLogin = async () => {
    try {
      setStep(2) // loading
      const firebaseUser = await signInWithGoogle()
      const existingProfile = await fetchProfileFromFirestore(firebaseUser.uid)
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      })
      
      if (existingProfile) {
        showToast(`Welcome back, ${existingProfile.name}!`, 'success')
        navigate('/dashboard', { replace: true })
      } else {
        setFormData(prev => ({ ...prev, name: firebaseUser.displayName?.split(' ')[0] || '' }))
        setStep(3)
      }
    } catch (error) {
      setStep(1)
      showToast('Login failed. Please try again.', 'error')
    }
  }

  const handleDemoLogin = async () => {
    try {
      setStep(2) // loading
      await new Promise(r => setTimeout(r, 600)) // smooth premium transition
      const mockUser = {
        uid: "demo-user-raj",
        email: "raj@fitagent.ai",
        displayName: "Raj Bhalara",
        photoURL: "https://lh3.googleusercontent.com/a/default-user"
      }
      
      let existingProfile = null
      try {
        existingProfile = await fetchProfileFromFirestore(mockUser.uid)
      } catch (err) {
        console.warn("Firestore fetch failed, proceeding with fresh setup", err)
      }
      
      setUser(mockUser)
      
      if (existingProfile) {
        showToast(`Welcome back, ${existingProfile.name}! (Demo Mode)`, 'success')
        navigate('/dashboard', { replace: true })
      } else {
        setFormData({
          name: 'Raj',
          age: '19',
          height: '180',
          startWeight: '85',
          goalWeight: '75',
          isVegetarian: true,
        })
        setStep(3)
        showToast('Demo account loaded! Complete the profile setup to continue. 🚀', 'success')
      }
    } catch (error) {
      setStep(1)
      showToast('Demo login failed.', 'error')
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    
    // Basic calculation for TDEE and Goals
    const weight = parseFloat(formData.startWeight)
    const height = parseFloat(formData.height)
    const age = parseInt(formData.age, 10)
    
    // Mifflin-St Jeor for TDEE (assuming male for simplicity here, can be adjusted)
    // BMR = 10W + 6.25H - 5A + 5
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    const tdee = Math.round(bmr * 1.2) // Sedentary multiplier
    const caloricGoal = Math.round(tdee - 500) // Default 500 cal deficit
    const proteinGoal = Math.round(weight * 1.6) // 1.6g per kg
    
    const newProfile = {
      name: formData.name,
      age: age,
      height: height,
      startWeight: weight,
      currentWeight: weight,
      goalWeight: parseFloat(formData.goalWeight),
      isVegetarian: formData.isVegetarian,
      tdee,
      caloricGoal,
      proteinGoal,
      waterGoalBase: 3.5, // Default
      city: 'Unknown',
      country: 'Unknown'
    }

    await saveProfileToFirestore(user.uid, newProfile)
    showToast('Profile created successfully!', 'success')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111318] border border-white/5 p-8 rounded-2xl shadow-2xl"
      >
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold mb-2">Welcome to FitAgent</h1>
            <p className="text-neutral-400 mb-8">Your AI-powered fitness companion.</p>
            <button 
              onClick={handleLogin}
              className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            
            <button 
              onClick={handleDemoLogin}
              className="w-full mt-4 bg-neutral-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-700 transition-colors border border-white/10 cursor-pointer"
            >
              🚀 Try Demo Mode (Bypass Login)
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Authenticating...</p>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Let's set up your profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#08090a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#f97316]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Age</label>
                  <input 
                    required
                    type="number" 
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-[#08090a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#f97316]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Height (cm)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.height}
                    onChange={e => setFormData({...formData, height: e.target.value})}
                    className="w-full bg-[#08090a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#f97316]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Current Weight (kg)</label>
                  <input 
                    required
                    type="number" step="0.1"
                    value={formData.startWeight}
                    onChange={e => setFormData({...formData, startWeight: e.target.value})}
                    className="w-full bg-[#08090a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#f97316]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Goal Weight (kg)</label>
                  <input 
                    required
                    type="number" step="0.1"
                    value={formData.goalWeight}
                    onChange={e => setFormData({...formData, goalWeight: e.target.value})}
                    className="w-full bg-[#08090a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#f97316]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="veg"
                  checked={formData.isVegetarian}
                  onChange={e => setFormData({...formData, isVegetarian: e.target.checked})}
                  className="w-5 h-5 rounded border-neutral-600 text-[#f97316] focus:ring-[#f97316] bg-neutral-800"
                />
                <label htmlFor="veg" className="text-sm text-neutral-300">I am vegetarian</label>
              </div>
              
              <button 
                type="submit"
                className="w-full btn-brand py-3 px-4 mt-6"
              >
                Complete Setup
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}
