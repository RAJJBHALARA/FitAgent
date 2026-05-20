import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { todayStr } from '../lib/healthLogic'
import { USER_PROFILE, SEED_WEIGHT_LOG } from '../lib/constants'

const useFitStore = create(
  persist(
    (set, get) => ({
      // ── User ──────────────────────────────────────────
      user: null,
      profile: null,

      // ── Today's Log ───────────────────────────────────
      today: {
        date: todayStr(),
        meals: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        waterMl: 0,
        workoutDone: false,
        steps: 0,
      },

      // ── Readiness ─────────────────────────────────────
      readiness: {
        lastChecked: null,
        sleep: 7,
        energy: 7,
        soreness: 3,
        mood: 7,
        score: 7,
        level: 'high',
        checkedToday: false,
      },

      // ── Deficit Debt ──────────────────────────────────
      debt: {
        totalKcal: 0,
        daysSinceDebt: 0,
        active: false,
        recoveryPlan: null,
      },

      // ── Recovery Mode ─────────────────────────────────
      recoveryMode: {
        active: false,
        activatedAt: null,
        day: 0,
      },

      // ── Weight Log ────────────────────────────────────
      weightLog: [],
      currentWeight: 0,

      // ── Agent Memory (F9) ─────────────────────────────
      agentMemory: {
        adviceHistory: [],
        preferences: {
          prefersShortTips: false,
          respondsToDietAdvice: true,
          respondsToWorkoutAdvice: true,
          ignoresProteinReminders: false,
        },
        followCount: 0,
        skipCount: 0,
      },

      // ── Chat History ──────────────────────────────────
      chatHistory: [],

      // ── Weekly Reports ────────────────────────────────
      weeklyReports: [],
      lastReportDate: null,

      // ── Weather / Hydration ───────────────────────────
      weather: {
        temp: 38,
        condition: 'Sunny',
        lastFetched: null,
      },

      // ── Toast ─────────────────────────────────────────
      toast: null,

      // ──────────────────────────────────────────────────
      // ACTIONS
      // ──────────────────────────────────────────────────

      /** Reset today's log if it's a new day */
      checkNewDay() {
        const { today } = get()
        const today_str = todayStr()
        if (today.date !== today_str) {
          set({
            today: {
              date: today_str,
              meals: [],
              totalCalories: 0,
              totalProtein: 0,
              totalCarbs: 0,
              totalFat: 0,
              waterMl: 0,
              workoutDone: false,
              steps: 0,
            },
            readiness: { ...get().readiness, checkedToday: false },
          })
          
          // Save a daily snapshot to Firestore when a new day starts
          const { user } = get()
          if (user) {
            import('../lib/firebase').then(({ db, doc, setDoc }) => {
              const todayData = { ...get().today, ...get().readiness }
              setDoc(doc(db, 'users', user.uid, 'logs', today.date), todayData, { merge: true }).catch(console.error)
            })
          }
        }
      },

      /** User Management */
      setUser: (user) => set({ user }),
      
      setProfile: (profile) => {
        set({ profile, currentWeight: profile?.currentWeight || 0 })
      },

      async fetchProfileFromFirestore(uid) {
        try {
          const { db, doc, getDoc } = await import('../lib/firebase')
          const docRef = doc(db, 'users', uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            set({ profile: data.profile || null, currentWeight: data.profile?.currentWeight || 0 })
            return data.profile
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
        return null
      },

      async saveProfileToFirestore(uid, profileData) {
        // Always update local state first so the user can use the app offline/demo mode
        set({ profile: profileData, currentWeight: profileData.currentWeight || 0 })
        try {
          const { db, doc, setDoc } = await import('../lib/firebase')
          await setDoc(doc(db, 'users', uid), { profile: profileData }, { merge: true })
        } catch (error) {
          console.error("Error saving profile to Firestore:", error)
          get().showToast('Saved locally (Firestore sync offline) 📡', 'info')
        }
      },

      logout: () => set({ user: null, profile: null }),

      /** Add meal to today's log */
      logMeal(meal) {
        const { today, profile } = get()
        const newMeals = [...today.meals, { ...meal, id: Date.now(), loggedAt: new Date().toISOString() }]
        const newCals = today.totalCalories + meal.calories
        const newProtein = today.totalProtein + (meal.protein || 0)
        const newCarbs = today.totalCarbs + (meal.carbs || 0)
        const newFat = today.totalFat + (meal.fat || 0)

        // Check for deficit debt (only if profile is loaded)
        const excess = profile ? newCals - profile.caloricGoal : 0
        if (excess > 0) {
          set((s) => ({
            debt: {
              totalKcal: s.debt.totalKcal + excess,
              daysSinceDebt: 0,
              active: true,
              recoveryPlan: null,
            },
          }))
        }

        set({
          today: {
            ...today,
            meals: newMeals,
            totalCalories: newCals,
            totalProtein: newProtein,
            totalCarbs: newCarbs,
            totalFat: newFat,
          },
        })
        
        // Sync to Firestore
        const { user } = get()
        if (user) {
          import('../lib/firebase').then(({ db, doc, setDoc }) => {
            setDoc(doc(db, 'users', user.uid, 'logs', get().today.date), {
              meals: newMeals,
              totalCalories: newCals,
              totalProtein: newProtein,
              totalCarbs: newCarbs,
              totalFat: newFat
            }, { merge: true }).catch(console.error)
          })
        }

        const calGoal = profile ? profile.caloricGoal : 2000
        get().showToast(`${meal.name} logged! ${meal.calories} kcal. ${Math.max(0, calGoal - newCals)} remaining today`, 'success')
      },

      /** Remove meal */
      removeMeal(mealId) {
        const { today } = get()
        const meal = today.meals.find((m) => m.id === mealId)
        if (!meal) return
        set({
          today: {
            ...today,
            meals: today.meals.filter((m) => m.id !== mealId),
            totalCalories: today.totalCalories - meal.calories,
            totalProtein: today.totalProtein - (meal.protein || 0),
            totalCarbs: today.totalCarbs - (meal.carbs || 0),
            totalFat: today.totalFat - (meal.fat || 0),
          },
        })
      },

      /** Log water intake */
      logWater(ml) {
        set((s) => ({
          today: { ...s.today, waterMl: s.today.waterMl + ml },
        }))
        get().showToast(`+${ml}ml water logged 💧`, 'info')
      },

      /** Set readiness check-in */
      setReadiness(data) {
        set({ readiness: { ...data, checkedToday: true, lastChecked: todayStr() } })
      },

      /** Log weight */
      logWeight(weight) {
        const entry = { date: todayStr(), weight }
        set((s) => ({
          currentWeight: weight,
          weightLog: [...s.weightLog.filter((w) => w.date !== todayStr()), entry].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          ),
        }))
        get().showToast(`Weight logged: ${weight}kg 📊`, 'success')
      },

      /** Mark workout done */
      setWorkoutDone(done) {
        set((s) => ({ today: { ...s.today, workoutDone: done } }))
      },

      /** Activate Recovery Mode */
      activateRecoveryMode() {
        set({ recoveryMode: { active: true, activatedAt: todayStr(), day: 1 } })
      },

      deactivateRecoveryMode() {
        set({ recoveryMode: { active: false, activatedAt: null, day: 0 } })
      },

      /** Update weather */
      setWeather(data) {
        set({ weather: { ...data, lastFetched: Date.now() } })
      },

      /** AI chat */
      addChatMessage(msg) {
        set((s) => ({ chatHistory: [...s.chatHistory, msg] }))
      },

      clearChat() {
        set({ chatHistory: [] })
      },

      /** Agent advice tracking (F9) */
      trackAdvice(advice) {
        set((s) => ({
          agentMemory: {
            ...s.agentMemory,
            adviceHistory: [...s.agentMemory.adviceHistory, { ...advice, id: Date.now() }],
          },
        }))
      },

      markAdviceFollowed(id) {
        set((s) => {
          const history = s.agentMemory.adviceHistory.map((a) =>
            a.id === id ? { ...a, status: 'followed' } : a
          )
          return {
            agentMemory: {
              ...s.agentMemory,
              adviceHistory: history,
              followCount: s.agentMemory.followCount + 1,
            },
          }
        })
      },

      markAdviceSkipped(id) {
        set((s) => {
          const history = s.agentMemory.adviceHistory.map((a) =>
            a.id === id ? { ...a, status: 'skipped' } : a
          )
          const skips = s.agentMemory.skipCount + 1
          const proteinSkips = history.filter(
            (a) => a.type === 'protein' && a.status === 'skipped'
          ).length
          return {
            agentMemory: {
              ...s.agentMemory,
              adviceHistory: history,
              skipCount: skips,
              preferences: {
                ...s.agentMemory.preferences,
                ignoresProteinReminders: proteinSkips >= 3,
              },
            },
          }
        })
      },

      /** Add weekly report */
      addWeeklyReport(report) {
        set((s) => ({
          weeklyReports: [report, ...s.weeklyReports].slice(0, 10),
          lastReportDate: todayStr(),
        }))
      },

      /** Toast system */
      showToast(message, type = 'success') {
        set({ toast: { message, type, id: Date.now() } })
        setTimeout(() => set({ toast: null }), 3500)
      },

      dismissToast() {
        set({ toast: null })
      },

      /** Clear debt */
      clearDebt() {
        set({ debt: { totalKcal: 0, daysSinceDebt: 0, active: false, recoveryPlan: null } })
      },
    }),
    {
      name: 'fitagent-store',
      partialize: (state) => ({
        today: state.today,
        readiness: state.readiness,
        debt: state.debt,
        recoveryMode: state.recoveryMode,
        weightLog: state.weightLog,
        currentWeight: state.currentWeight,
        agentMemory: state.agentMemory,
        chatHistory: state.chatHistory.slice(-50), // keep last 50 messages
        weeklyReports: state.weeklyReports,
        lastReportDate: state.lastReportDate,
        weather: state.weather,
        user: state.user,
        profile: state.profile,
      }),
    }
  )
)

export default useFitStore
