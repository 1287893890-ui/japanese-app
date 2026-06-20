import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { updateDailyStreak } from '../utils/streaks'

export function useStreak() {
  const { state, dispatch } = useApp()

  // Check in on mount
  useEffect(() => {
    const newStreak = updateDailyStreak(state.streak)
    if (newStreak.current !== state.streak.current ||
        newStreak.lastActiveDate !== state.streak.lastActiveDate) {
      dispatch({ type: 'UPDATE_STREAK', streak: newStreak })
    }
  }, []) // Only on mount

  return state.streak
}
