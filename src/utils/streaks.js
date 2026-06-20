export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function getYesterday(today) {
  const d = new Date(today)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function calculateStreak(history, lastActiveDate) {
  const today = getToday()
  if (!lastActiveDate) return { current: 0, longest: 0, history: [] }

  // If never active today, check if streak is still alive
  if (lastActiveDate !== today) {
    const yesterday = getYesterday(today)
    if (lastActiveDate !== yesterday) {
      return { current: 0, longest: history.length > 0 ? Math.max(...history.map(h => h.length || 1)) : 0, history }
    }
  }

  // Count consecutive days backwards from lastActiveDate
  let count = 0
  let check = new Date(lastActiveDate)
  const activeSet = new Set(history)

  while (activeSet.has(check.toISOString().split('T')[0])) {
    count++
    check.setDate(check.getDate() - 1)
  }

  return {
    current: count,
    longest: Math.max(count, history.length > 0 ? Math.max(...history.map(h => h.length || 1)) : 0),
    history
  }
}

export function updateDailyStreak(prevStreak) {
  const today = getToday()
  const history = [...(prevStreak.history || [])]
  if (!history.includes(today)) {
    history.push(today)
  }
  const yesterday = getYesterday(today)
  const lastActive = prevStreak.lastActiveDate

  let current = prevStreak.current || 0
  if (lastActive === yesterday) {
    current += 1
  } else if (lastActive !== today) {
    current = 1
  }
  // If lastActive is today, current stays the same

  return {
    current,
    longest: Math.max(current, prevStreak.longest || 0),
    lastActiveDate: today,
    history
  }
}
