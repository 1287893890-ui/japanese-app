import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useStreak } from '../hooks/useStreak'
import { LEVEL_CONFIG } from '../utils/levels'
import Card from '../components/shared/Card'
import ProgressBar from '../components/shared/ProgressBar'

export default function HomePage() {
  const { state } = useApp()
  const streak = useStreak()

  const stats = {
    vocab: state.completedVocabulary.length,
    grammar: state.completedGrammar.length,
    dialogue: state.completedDialogues.length,
    quiz: Object.keys(state.quizScores).length,
  }
  const totalCompleted = stats.vocab + stats.grammar + stats.dialogue + stats.quiz
  const dailyGoal = state.dailyGoal
  const today = new Date().toISOString().split('T')[0]
  const todayCount = state.dailyProgress[today] || 0
  const goalPct = Math.min(100, (todayCount / dailyGoal) * 100)

  return (
    <div className="p-4 pb-24 space-y-5">
      {/* Streak Banner */}
      <div className={`rounded-2xl p-4 ${streak.current > 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">连续学习</p>
            <p className="text-3xl font-bold">{streak.current} <span className="text-lg font-normal">天</span></p>
            <p className="text-xs mt-1 opacity-70">最长记录 {streak.longest} 天</p>
          </div>
          <span className={`text-5xl ${streak.current > 0 ? 'animate-pulse' : 'grayscale opacity-50'}`}>🔥</span>
        </div>
      </div>

      {/* Daily Goal Ring */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#E2E8F0" strokeWidth="6" />
              <circle cx="28" cy="28" r="24" fill="none" stroke="#4F46E5" strokeWidth="6"
                strokeDasharray={`${goalPct * 1.51} 151`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-brand">{Math.round(goalPct)}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">今日目标</p>
            <p className="text-sm text-slate-500">{todayCount} / {dailyGoal} 项</p>
            <ProgressBar value={todayCount} max={dailyGoal} className="mt-2" />
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '已学单词', value: stats.vocab, icon: '📖', color: 'bg-emerald-50 text-emerald-600' },
          { label: '语法掌握', value: stats.grammar, icon: '📝', color: 'bg-blue-50 text-blue-600' },
          { label: '情景对话', value: stats.dialogue, icon: '💬', color: 'bg-purple-50 text-purple-600' },
          { label: '测验完成', value: stats.quiz, icon: '✏️', color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <Card key={i} className="p-3">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${stat.color}`}>{stat.icon}</span>
              <div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* JLPT Level Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-800">JLPT 等级</h3>
          <span className="text-xs text-slate-400">共完成 {totalCompleted} 项</span>
        </div>
        <div className="space-y-2">
          {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
            <Link key={level} to={`/learn/${level}`}>
              <Card className="p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: config.color + '20' }}
                >
                  {config.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{level}</span>
                    <span className="text-xs text-slate-400">{config.nameCn}</span>
                  </div>
                  <ProgressBar
                    value={stats.vocab}
                    max={level === 'N5' ? 105 : 100}
                    color={`bg-[${config.color}]`}
                    className="mt-1.5"
                    style={{ '--tw-bg-opacity': 1, backgroundColor: config.color }}
                  />
                </div>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Card>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
