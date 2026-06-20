import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useQuiz } from '../context/QuizContext'
import { useApp } from '../context/AppContext'
import QuizRunner from '../components/quiz/QuizRunner'

export default function QuizSessionPage() {
  const navigate = useNavigate()
  const { quiz, quizDispatch } = useQuiz()
  const { dispatch } = useApp()
  const finishingRef = useRef(false)

  // Only redirect if quiz was never started (idle) or reset, not when intentionally finished
  if (quiz.status !== 'active' && !finishingRef.current) {
    navigate(quiz.level ? `/quiz/${quiz.level}` : '/quiz')
    return null
  }

  const handleAnswer = (answer) => {
    quizDispatch({ type: 'ANSWER_QUESTION', ...answer })
  }

  const handleFinish = (result) => {
    finishingRef.current = true

    const score = result.answers.filter(a => a.isCorrect).length
    const total = result.answers.length

    // Save to AppContext first
    const quizId = `quiz-${quiz.level}-${Date.now()}`
    dispatch({
      type: 'SAVE_QUIZ_RESULT',
      id: quizId,
      score,
      total,
      timeSpent: result.totalTime,
    })

    // Check achievements
    if (score === total) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'perfect-quiz' })
    }

    // Store result before dispatch to avoid race
    sessionStorage.setItem('lastQuizResult', JSON.stringify({
      score,
      total,
      timeSpent: result.totalTime,
      answers: result.answers,
      level: quiz.level,
    }))

    // Dispatch FINISH_QUIZ and navigate — finishingRef prevents guard redirect
    quizDispatch({ type: 'FINISH_QUIZ' })
    navigate(`/quiz/${quiz.level}/result`)
  }

  return (
    <div className="p-4 pb-8">
      <QuizRunner
        questions={quiz.questions}
        onAnswer={handleAnswer}
        onFinish={handleFinish}
      />
    </div>
  )
}
