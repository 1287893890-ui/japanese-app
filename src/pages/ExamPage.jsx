import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExamData } from '../data'
import { useQuiz } from '../context/QuizContext'
import { LEVELS, LEVEL_CONFIG, getLevelColor } from '../utils/levels'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'

/** 読解・情報検索题型：按 context 合并为阅读组；其他题型保持普通排版 */
function groupReadingQuestions(questions) {
  if (questions.length === 0) return []
  const first = questions[0]
  const shouldGroup = first.topic === 'reading-comp' || first.topic === 'info-retrieval'
  if (!shouldGroup) return questions

  const contextMap = new Map()
  for (const q of questions) {
    if (contextMap.has(q.context)) {
      contextMap.get(q.context).subQuestions.push(q)
    } else {
      contextMap.set(q.context, {
        id: q.id,
        type: 'reading-group',
        context: q.context,
        subQuestions: [q],
      })
    }
  }
  return [...contextMap.values()]
}

export default function ExamPage() {
  const { level } = useParams()
  const navigate = useNavigate()
  const { quizDispatch } = useQuiz()
  const [selectedSection, setSelectedSection] = useState(null)

  if (!level) {
    // Level selection
    return (
      <div className="p-4 pb-24 space-y-4">
        <div className="text-center mb-2">
          <span className="text-4xl">📋</span>
          <h2 className="text-xl font-bold text-slate-800 mt-1">真题模拟</h2>
          <p className="text-sm text-slate-400">按 JLPT 真题格式分题型练习</p>
        </div>
        <div className="space-y-3">
          {LEVELS.map(lvl => {
            const config = LEVEL_CONFIG[lvl]
            return (
              <Card key={lvl} onClick={() => navigate(`/exam/${lvl}`)} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: config.color + '20' }}>{config.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{lvl} · {config.nameCn}</p>
                  <p className="text-xs text-slate-400">JLPT {lvl} 模拟真题</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">真题</span>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  const config = LEVEL_CONFIG[level]
  const color = getLevelColor(level)
  const examData = getExamData(level)

  if (!examData || !examData.sections || examData.sections.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-2">📋</p>
        <p className="text-slate-500">{level} 真题数据暂未上线</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>返回</Button>
      </div>
    )
  }

  const startSection = (section) => {
    const rawQuestions = section.questions || []
    if (rawQuestions.length === 0) {
      alert('该部分暂无题目')
      return
    }
    const grouped = groupReadingQuestions(rawQuestions)
    quizDispatch({
      type: 'START_QUIZ',
      level,
      questions: grouped,
    })
    navigate(`/exam/${level}/play?section=${encodeURIComponent(section.title)}`)
  }

  const startAll = () => {
    const rawQuestions = examData.sections.flatMap(s => s.questions || [])
    if (rawQuestions.length === 0) {
      alert('暂无题目')
      return
    }
    const grouped = groupReadingQuestions(rawQuestions)
    quizDispatch({
      type: 'START_QUIZ',
      level,
      questions: grouped,
    })
    navigate(`/exam/${level}/play?section=全卷通做`)
  }

  return (
    <div className="p-4 pb-8 space-y-4">
      <div className="text-center">
        <span className="text-3xl">{config?.emoji}</span>
        <h2 className="text-xl font-bold text-slate-800">{level} 真题模拟</h2>
        <p className="text-sm text-slate-400">按 JLPT 考试题型分项练习</p>
      </div>

      {/* Full exam button */}
      <Card onClick={startAll} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 cursor-pointer hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div className="flex-1">
            <p className="font-bold text-amber-700">全卷通做</p>
            <p className="text-xs text-amber-500">模拟完整考试流程</p>
          </div>
          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
            {examData.sections.reduce((s, sec) => s + (sec.questions?.length || 0), 0)}题
          </span>
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>

      {/* Section cards */}
      <h3 className="font-semibold text-slate-800">分项练习</h3>
      <div className="space-y-2">
        {examData.sections.map((section, i) => (
          <Card key={i} onClick={() => startSection(section)} className="p-3 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
            <span className="text-lg">{section.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm">{section.title}</p>
              <p className="text-xs text-slate-400">{section.description}</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex-shrink-0">
              {section.questions?.length || 0}题
            </span>
            <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Card>
        ))}
      </div>
    </div>
  )
}
