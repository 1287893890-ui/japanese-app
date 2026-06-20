import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVocabulary, getGrammar, getDialogues } from '../data'
import { useApp } from '../context/AppContext'
import { LEVEL_CONFIG, getLevelColor } from '../utils/levels'
import Card from '../components/shared/Card'
import ProgressBar from '../components/shared/ProgressBar'

const TABS = [
  { key: 'vocab', label: '词汇', icon: '📖' },
  { key: 'grammar', label: '语法', icon: '📝' },
  { key: 'dialogue', label: '对话', icon: '💬' },
]

export default function LevelDetailPage() {
  const { level } = useParams()
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState('vocab')

  const config = LEVEL_CONFIG[level] || { emoji: '📚', nameCn: '', color: '#6366F1' }
  const color = getLevelColor(level)

  const vocabData = getVocabulary(level)
  const grammarData = getGrammar(level)
  const dialogueData = getDialogues(level)

  const isCompleted = (category, id) => {
    if (category === 'vocab') return state.completedVocabulary.includes(id)
    if (category === 'grammar') return state.completedGrammar.includes(id)
    if (category === 'dialogue') return state.completedDialogues.includes(id)
    return false
  }

  const lessonCount = {
    vocab: vocabData.lessons?.length || 0,
    grammar: grammarData.points?.length || 0,
    dialogue: dialogueData.dialogues?.length || 0,
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-3rem)]">
      {/* Level Header */}
      <div className="px-4 pt-2 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: color + '20' }}
          >
            {config.emoji}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{level} · {config.nameCn}</h2>
            <p className="text-xs text-slate-400">
              {lessonCount.vocab}课词汇 · {lessonCount.grammar}个语法 · {lessonCount.dialogue}篇对话
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-2">
        <div className="flex bg-slate-100 rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              <span className="text-xs ml-0.5 opacity-60">{lessonCount[tab.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Vocab Lessons */}
        {activeTab === 'vocab' && (
          <div className="space-y-2">
            {vocabData.lessons?.map(lesson => (
              <Link key={lesson.id} to={`/learn/${level}/vocab/${lesson.id}`}>
                <Card className="p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <span className="text-2xl">{lesson.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800 text-sm">{lesson.title}</p>
                      {isCompleted('vocab', lesson.id) && <span className="text-xs">✅</span>}
                    </div>
                    <p className="text-xs text-slate-400">{lesson.titleCn} · {lesson.words?.length || 0}词</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
              </Link>
            ))}
            {(!vocabData.lessons || vocabData.lessons.length === 0) && (
              <p className="text-center text-slate-400 py-8">暂无词汇数据</p>
            )}
          </div>
        )}

        {/* Grammar Points */}
        {activeTab === 'grammar' && (
          <div className="space-y-2">
            {grammarData.points?.map(point => (
              <Link key={point.id} to={`/learn/${level}/grammar/${point.id}`}>
                <Card className="p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <span className="text-xl">{point.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800 text-sm">{point.title}</p>
                      {isCompleted('grammar', point.id) && <span className="text-xs">✅</span>}
                    </div>
                    <p className="text-xs text-slate-400">{point.titleCn}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
              </Link>
            ))}
            {(!grammarData.points || grammarData.points.length === 0) && (
              <p className="text-center text-slate-400 py-8">暂无语法数据</p>
            )}
          </div>
        )}

        {/* Dialogues */}
        {activeTab === 'dialogue' && (
          <div className="space-y-2">
            {dialogueData.dialogues?.map(dialogue => (
              <Link key={dialogue.id} to={`/learn/${level}/dialogue/${dialogue.id}`}>
                <Card className="p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <span className="text-2xl">{dialogue.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800 text-sm">{dialogue.title}</p>
                      {isCompleted('dialogue', dialogue.id) && <span className="text-xs">✅</span>}
                    </div>
                    <p className="text-xs text-slate-400">{dialogue.titleCn} · {dialogue.scene}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
              </Link>
            ))}
            {(!dialogueData.dialogues || dialogueData.dialogues.length === 0) && (
              <p className="text-center text-slate-400 py-8">暂无对话数据</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
