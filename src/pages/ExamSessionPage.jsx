import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRef } from 'react'
import { useQuiz } from '../context/QuizContext'
import { useApp } from '../context/AppContext'
import QuizRunner from '../components/quiz/QuizRunner'

export default function ExamSessionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { quiz, quizDispatch } = useQuiz()
  const { dispatch } = useApp()
  const finishingRef = useRef(false)

  if (quiz.status !== 'active' && !finishingRef.current) {
    navigate(quiz.level ? `/exam/${quiz.level}` : '/exam')
    return null
  }

  const sectionTitle = searchParams.get('section') || ''

  const handleAnswer = (answer) => {
    quizDispatch({ type: 'ANSWER_QUESTION', ...answer })
  }

  const handleFinish = (result) => {
    finishingRef.current = true
    const score = result.answers.filter(a => a.isCorrect).length
    const total = result.answers.length

    const quizId = `exam-${quiz.level}-${Date.now()}`
    dispatch({ type: 'SAVE_QUIZ_RESULT', id: quizId, score, total, timeSpent: result.totalTime })
    if (score === total) dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'perfect-quiz' })

    sessionStorage.setItem('lastQuizResult', JSON.stringify({
      score, total, timeSpent: result.totalTime, answers: result.answers, level: quiz.level,
      mode: 'exam', section: sectionTitle
    }))

    quizDispatch({ type: 'FINISH_QUIZ' })
    navigate(`/exam/${quiz.level}/result`)
  }

  return (
    <div className="p-4 pb-8">
      {sectionTitle && (
        <p className="text-center text-xs text-slate-400 mb-2">{sectionTitle}</p>
      )}
      <QuizRunner questions={quiz.questions} onAnswer={handleAnswer} onFinish={handleFinish} />
    </div>
  )
}
