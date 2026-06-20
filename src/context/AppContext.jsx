import { createContext, useContext, useReducer, useEffect } from 'react'
import { loadProgress, saveProgress } from '../utils/storage'
import { getToday } from '../utils/streaks'

const AppContext = createContext(null)

const initialState = {
  completedVocabulary: [],
  completedGrammar: [],
  completedDialogues: [],
  completedQuizzes: [],
  quizScores: {},
  streak: { current: 0, longest: 0, lastActiveDate: null, history: [] },
  dailyGoal: 20,
  dailyProgress: {},
  achievements: [],
  settings: {
    soundEnabled: true,
    autoPlayAudio: false,
    showFurigana: true,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_VOCABULARY': {
      if (state.completedVocabulary.includes(action.id)) return state
      const newState = {
        ...state,
        completedVocabulary: [...state.completedVocabulary, action.id],
      }
      return { ...newState, ...updateDailyProgress(newState) }
    }
    case 'COMPLETE_GRAMMAR': {
      if (state.completedGrammar.includes(action.id)) return state
      const newState = {
        ...state,
        completedGrammar: [...state.completedGrammar, action.id],
      }
      return { ...newState, ...updateDailyProgress(newState) }
    }
    case 'COMPLETE_DIALOGUE': {
      if (state.completedDialogues.includes(action.id)) return state
      const newState = {
        ...state,
        completedDialogues: [...state.completedDialogues, action.id],
      }
      return { ...newState, ...updateDailyProgress(newState) }
    }
    case 'SAVE_QUIZ_RESULT': {
      const newState = {
        ...state,
        completedQuizzes: state.completedQuizzes.includes(action.id)
          ? state.completedQuizzes
          : [...state.completedQuizzes, action.id],
        quizScores: {
          ...state.quizScores,
          [action.id]: {
            score: action.score,
            total: action.total,
            date: getToday(),
            timeSpent: action.timeSpent || 0,
          }
        }
      }
      return { ...newState, ...updateDailyProgress(newState) }
    }
    case 'UPDATE_STREAK': {
      return { ...state, streak: action.streak }
    }
    case 'UNLOCK_ACHIEVEMENT': {
      if (state.achievements.find(a => a.id === action.id)) return state
      return {
        ...state,
        achievements: [...state.achievements, { id: action.id, unlockedAt: getToday() }]
      }
    }
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, [action.key]: action.value }
      }
    }
    case 'SET_DAILY_GOAL': {
      return { ...state, dailyGoal: action.goal }
    }
    case 'LOAD_PROGRESS': {
      return { ...state, ...action.data }
    }
    default:
      return state
  }
}

function updateDailyProgress(state) {
  const today = getToday()
  const total = state.completedVocabulary.length + state.completedGrammar.length
    + state.completedDialogues.length + state.completedQuizzes.length
  return {
    dailyProgress: { ...state.dailyProgress, [today]: total }
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress()
    if (saved) {
      dispatch({ type: 'LOAD_PROGRESS', data: saved })
    }
  }, [])

  // Auto-save on any state change
  useEffect(() => {
    saveProgress(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
