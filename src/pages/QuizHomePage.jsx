import { useParams, Link, useNavigate } from 'react-router-dom'
import { getQuizzes } from '../data'
import { LEVEL_CONFIG, LEVELS } from '../utils/levels'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import { useApp } from '../context/AppContext'
import { useQuiz } from '../context/QuizContext'
import { shuffle, pickRandom } from '../utils/shuffle'

export default function QuizHomePage() {
  const { level } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()
  const { quizDispatch } = useQuiz()

  // If no level param, show level selection
  if (!level) {
    return (
      <div className="p-4 pb-24 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">测验挑战</h2>
          <p className="text-sm text-slate-400 mt-1">选择等级，测试你的日语能力</p>
        </div>

        {/* Exam link */}
        <Link to="/exam">
          <Card className="p-4 flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:shadow-md transition-shadow">
            <span className="text-3xl">📋</span>
            <div className="flex-1">
              <p className="font-bold text-amber-700">真题模拟</p>
              <p className="text-xs text-amber-500">JLPT 考试格式 · 分题型练习</p>
            </div>
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Card>
        </Link>

        <div className="space-y-3">
          {LEVELS.map(lvl => {
            const config = LEVEL_CONFIG[lvl]
            const scores = Object.entries(state.quizScores).filter(([id]) => id.startsWith(lvl.toLowerCase()))
            const bestScore = scores.length > 0 ? Math.max(...scores.map(([, s]) => Math.round((s.score / s.total) * 100))) : null

            return (
              <Link key={lvl} to={`/quiz/${lvl}`}>
                <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: config.color + '20' }}
                  >
                    {config.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{lvl} · {config.nameCn}</p>
                    <p className="text-xs text-slate-400">
                      {scores.length > 0 ? `${scores.length}次测验，最佳成绩 ${bestScore}%` : '尚未测验'}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

  // Level-specific quiz page
  const config = LEVEL_CONFIG[level] || { emoji: '📝', nameCn: '', color: '#6366F1' }
  const quizData = getQuizzes(level)
  const questions = quizData.quizzes || []

  const quizModes = [
    {
      id: 'quick',
      title: '快速测试',
      icon: '⚡',
      description: '随机抽取10道题，快速检验水平',
      count: Math.min(10, questions.length),
    },
    {
      id: 'vocab',
      title: '词汇专项',
      icon: '📖',
      description: '专注词汇读音与含义',
      count: questions.filter(q => ['reading', 'meaning', 'vocabulary', 'listening'].includes(q.topic)).length,
    },
    {
      id: 'grammar',
      title: '语法专项',
      icon: '📝',
      description: '测试助词、活用等语法知识',
      count: questions.filter(q => q.topic === 'grammar' || q.topic === 'particle' || q.topic === 'conjugation').length,
    },
    {
      id: 'full',
      title: '模拟考试',
      icon: '🎯',
      description: '全部题目，模拟真实考试',
      count: questions.length,
    },
  ]

  const startQuiz = (mode) => {
    let selectedQuestions = []

    switch (mode) {
      case 'quick':
        selectedQuestions = pickRandom(questions, 10)
        break
      case 'vocab':
        selectedQuestions = shuffle(questions.filter(q =>
          ['reading', 'meaning', 'vocabulary', 'listening'].includes(q.topic)
        ))
        break
      case 'grammar':
        selectedQuestions = shuffle(questions.filter(q =>
          ['grammar', 'particle', 'conjugation'].includes(q.topic)
        ))
        break
      case 'full':
        selectedQuestions = shuffle([...questions])
        break
      default:
        selectedQuestions = pickRandom(questions, 10)
    }

    if (selectedQuestions.length === 0) {
      alert('该模式暂无题目')
      return
    }

    quizDispatch({
      type: 'START_QUIZ',
      level,
      questions: selectedQuestions,
    })

    navigate(`/quiz/${level}/play`)
  }

  const prevScores = Object.entries(state.quizScores)
    .filter(([id]) => id.startsWith(level.toLowerCase()))
    .map(([, s]) => s)

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Header */}
      <div className="text-center">
        <span className="text-3xl">{config.emoji}</span>
        <h2 className="text-xl font-bold text-slate-800 mt-1">{level} 测验</h2>
        <p className="text-sm text-slate-400">{config.nameCn}水平测试</p>
      </div>

      {/* Previous Scores */}
      {prevScores.length > 0 && (
        <Card className="p-3">
          <p className="text-xs text-slate-400 mb-1">最近成绩</p>
          <div className="flex gap-2">
            {prevScores.slice(-3).reverse().map((s, i) => (
              <div key={i} className="flex-1 bg-slate-50 rounded-xl p-2 text-center">
                <p className="text-lg font-bold text-slate-800">{Math.round((s.score / s.total) * 100)}%</p>
                <p className="text-xs text-slate-400">{s.date}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quiz Modes */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-800">选择模式</h3>
        {quizModes.map(mode => (
          <Card
            key={mode.id}
            onClick={() => startQuiz(mode.id)}
            className={`p-4 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer
              ${mode.count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl">{mode.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">{mode.title}</p>
              <p className="text-xs text-slate-400">{mode.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{mode.count}题</span>
              <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
