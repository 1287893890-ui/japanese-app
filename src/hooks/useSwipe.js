import { useState, useCallback } from 'react'

export function useSwipe(onSwipeLeft, onSwipeRight, onSwipeDown, threshold = 80) {
  const [touchStart, setTouchStart] = useState(null)
  const [swipeDir, setSwipeDir] = useState(null)

  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setSwipeDir(null)
  }, [])

  const onTouchMove = useCallback((e) => {
    if (!touchStart) return
    const touch = e.touches[0]
    const dx = touch.clientX - touchStart.x
    const dy = touch.clientY - touchStart.y
    if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
      if (Math.abs(dx) > Math.abs(dy)) {
        setSwipeDir(dx > 0 ? 'right' : 'left')
      } else {
        setSwipeDir(dy > 0 ? 'down' : 'up')
      }
    }
  }, [touchStart])

  const onTouchEnd = useCallback((e) => {
    if (!touchStart) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStart.x
    const dy = touch.clientY - touchStart.y

    if (Math.abs(dx) > threshold) {
      if (dx > 0) onSwipeRight?.()
      else onSwipeLeft?.()
    } else if (Math.abs(dy) > threshold && dy > 0) {
      onSwipeDown?.()
    }

    setTouchStart(null)
    setSwipeDir(null)
  }, [touchStart, threshold, onSwipeLeft, onSwipeRight, onSwipeDown])

  return { onTouchStart, onTouchMove, onTouchEnd, swipeDir }
}
