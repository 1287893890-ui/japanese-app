import { Link } from 'react-router-dom'
import { LEVEL_CONFIG } from '../utils/levels'
import { useApp } from '../context/AppContext'
import Card from '../components/shared/Card'
import ProgressBar from '../components/shared/ProgressBar'

export default function LearnPage() {
  const { state } = useApp()

  const getLevelProgress = (level) => {
    const prefix = level.toLowerCase()
    const vocab = state.completedVocabulary.filter(id => id.startsWith(prefix)).length
    const grammar = state.completedGrammar.filter(id => id.startsWith(prefix)).length
    const dialogues = state.completedDialogues.filter(id => id.startsWith(prefix)).length
    const total = vocab + grammar + dialogues
    return { vocab, grammar, dialogues, total }
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">选择等级</h2>
        <p className="text-sm text-slate-400 mt-1">从 N5 到 N1，循序渐进掌握日语</p>
      </div>

      {/* Level Cards */}
      <div className="space-y-3">
        {Object.entries(LEVEL_CONFIG).map(([level, config]) => {
          const progress = getLevelProgress(level)
          const isUnlocked = level === 'N5' || (level !== 'N5' && getLevelProgress(
            Object.keys(LEVEL_CONFIG)[Object.keys(LEVEL_CONFIG).indexOf(level) - 1]
          ).total >= 5)

          return (
            <Link key={level} to={isUnlocked ? `/learn/${level}` : '#'}
              onClick={e => { if (!isUnlocked) e.preventDefault() }}>
              <Card className={`p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-md
                ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                {/* Level Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: config.color + '20' }}
                >
                  {config.emoji}
                </div>

                {/* Level Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-lg">{level}</span>
                    <span className="text-sm text-slate-500">{config.nameCn}</span>
                    {!isUnlocked && (
                      <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">🔒 未解锁</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <span>📖 {progress.vocab}词</span>
                    <span className="mx-1">·</span>
                    <span>📝 {progress.grammar}语法</span>
                    <span className="mx-1">·</span>
                    <span>💬 {progress.dialogues}对话</span>
                  </div>
                  <ProgressBar
                    value={progress.total}
                    max={level === 'N5' ? 27 : 20}
                    color={`bg-[${config.color}]`}
                    className="mt-2"
                    style={{ backgroundColor: config.color }}
                  />
                </div>

                <svg className="w-5 h-5 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
