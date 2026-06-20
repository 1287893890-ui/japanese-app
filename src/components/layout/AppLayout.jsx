import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function AppLayout({ showNav = true }) {
  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col">
      {/* Desktop: center as phone-sized card */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full bg-white shadow-lg relative overflow-hidden">
        <TopBar showBack={!showNav} />
        <main className="flex-1 overflow-y-auto pb-4">
          <Outlet />
        </main>
        {showNav && <BottomNav />}
      </div>
    </div>
  )
}
