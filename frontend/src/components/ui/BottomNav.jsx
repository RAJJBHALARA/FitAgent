import { NavLink } from 'react-router-dom'
import { Home, UtensilsCrossed, Dumbbell, TrendingUp, Bot } from 'lucide-react'

const TABS = [
  { to: '/dashboard', label: 'Home',  icon: Home },
  { to: '/meals',     label: 'Meals', icon: UtensilsCrossed },
  { to: '/workout',   label: 'Train', icon: Dumbbell },
  { to: '/progress',  label: 'Stats', icon: TrendingUp },
  { to: '/coach',     label: 'Coach', icon: Bot },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[60px] bg-gradient-to-t from-[#08090a] to-[#111318]/90 backdrop-blur-xl border-t border-white/5 flex items-stretch z-[100] pb-[env(safe-area-inset-bottom,0px)]">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className="flex-1 no-underline">
          {({ isActive }) => (
            <div className={`h-full flex flex-col items-center justify-center gap-1 border-t-2 transition-colors duration-200 ${isActive ? 'border-brand' : 'border-transparent'}`}>
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-brand' : 'text-neutral-400'}
              />
              <span className={`text-[10px] font-body leading-none transition-colors duration-200 ${isActive ? 'font-semibold text-brand' : 'font-normal text-neutral-400'}`}>
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
