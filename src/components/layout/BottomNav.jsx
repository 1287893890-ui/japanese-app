import { NavLink, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/learn', label: '学习', icon: '📚' },
  { to: '/quiz', label: '测验', icon: '✏️' },
  { to: '/profile', label: '我的', icon: '👤' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-bottom z-50
      max-w-lg mx-auto">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
                ${isActive ? 'text-brand scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
