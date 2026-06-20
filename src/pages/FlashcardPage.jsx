import { useParams, useNavigate } from 'react-router-dom'
import { getLesson } from '../data'
import { useApp } from '../context/AppContext'
import FlashCardDeck from '../components/flashcard/FlashCardDeck'

export default function FlashcardPage() {
  const { level, lessonId } = useParams()
  const navigate = useNavigate()
  const { dispatch } = useApp()

  const lesson = getLesson(level, lessonId)

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-2">😕</p>
        <p className="text-slate-500">未找到该课程</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-brand text-sm">返回</button>
      </div>
    )
  }

  const handleWordResult = (wordId, status) => {
    // Mark as completed when user rates a word (regardless of know/review)
    dispatch({ type: 'COMPLETE_VOCABULARY', id: wordId })
    // Check achievements
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'first-word' })
  }

  const handleComplete = (results) => {
    const knowCount = results.filter(r => r.status === 'know').length
    if (knowCount === results.length) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'perfect-quiz' })
    }
  }

  return (
    <div className="p-4 pb-8">
      {/* Lesson Header */}
      <div className="text-center mb-4">
        <span className="text-3xl">{lesson.emoji}</span>
        <h2 className="text-lg font-bold text-slate-800 mt-1">{lesson.title}</h2>
        <p className="text-sm text-slate-400">{lesson.titleCn}</p>
      </div>

      <FlashCardDeck
        words={lesson.words || []}
        onWordResult={handleWordResult}
        onComplete={handleComplete}
      />
    </div>
  )
}
