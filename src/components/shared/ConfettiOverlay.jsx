import { useEffect, useState } from 'react'

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', '#06B6D4']
const EMOJIS = ['🎉', '🎊', '✨', '🌟', '💯', '🎯', '👏']

function randomPiece() {
  return {
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    size: 10 + Math.random() * 20,
  }
}

export default function ConfettiOverlay({ show }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (show) {
      setPieces(Array.from({ length: 30 }, randomPiece))
      const timer = setTimeout(() => setPieces([]), 5000)
      return () => clearTimeout(timer)
    } else {
      setPieces([])
    }
  }, [show])

  if (!show || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animation: `fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
