import { useNavigate, useLocation, useParams, matchPath } from 'react-router-dom'

export default function TopBar({ showBack = false }) {
  const navigate = useNavigate()
  const location = useLocation()

  const getTitle = () => {
    const path = location.pathname

    // Static titles
    const staticTitles = {
      '/': '🏠 日语学习',
      '/learn': '📚 选择等级',
      '/quiz': '✏️ 测验挑战',
      '/profile': '👤 我的',
      '/settings': '⚙️ 设置',
    }
    if (staticTitles[path]) return staticTitles[path]

    // Dynamic titles
    if (path.includes('/vocab/')) return '🃏 闪卡学习'
    if (path.includes('/grammar/')) return '📝 语法详解'
    if (path.includes('/dialogue/')) return '💬 情景对话'
    if (path.includes('/play')) return '🧠 答题中'
    if (path.includes('/result')) return '📊 测验结果'
    if (/\/learn\/[Nn][1-5]$/.test(path)) {
      const match = path.match(/\/learn\/([Nn][1-5])/)
      return `📖 ${match[1].toUpperCase()} 学习`
    }
    if (/\/quiz\/[Nn][1-5]$/.test(path)) {
      const match = path.match(/\/quiz\/([Nn][1-5])/)
      return `✏️ ${match[1].toUpperCase()} 测验`
    }

    return '日语学习'
  }

  const title = getTitle()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center h-12 px-4">
        {showBack ? (
          <>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 -ml-1 rounded-xl
                text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="flex-1 text-center text-sm font-semibold text-slate-800 mr-8">{title}</h1>
          </>
        ) : (
          <h1 className="flex-1 text-center text-sm font-semibold text-slate-800">{title}</h1>
        )}
      </div>
    </header>
  )
}
