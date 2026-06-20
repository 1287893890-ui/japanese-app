import { createContext, useContext, useReducer } from 'react'

const QuizContext = createContext(null)

const initialState = {
  status: 'idle', // idle | active | finished
  level: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  startTime: null,
  timeLimit: 0, // 0 = no limit
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ': {
      return {
        ...initialState,
        status: 'active',
        level: action.level,
        questions: action.questions,
        startTime: Date.now(),
        timeLimit: action.timeLimit || 0,
      }
    }
    case 'ANSWER_QUESTION': {
      return {
        ...state,
        answers: [...state.answers, {
          questionId: action.questionId,
          selected: action.selected,
          isCorrect: action.isCorrect,
          timeTaken: action.timeTaken || 0,
        }]
      }
    }
    case 'NEXT_QUESTION': {
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
      }
    }
    case 'FINISH_QUIZ': {
      return {
        ...state,
        status: 'finished',
      }
    }
    case 'RESET': {
      return { ...initialState }
    }
    default:
      return state
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <QuizContext.Provider value={{ quiz: state, quizDispatch: dispatch }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider')
  return ctx
}
