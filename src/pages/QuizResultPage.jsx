import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import ConfettiOverlay from '../components/shared/ConfettiOverlay'

export default function QuizResultPage() {
  const navigate = useNavigate()
  const { level } = useParams()
  const [result, setResult] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('lastQuizResult')
    if (raw) {
      const data = JSON.parse(raw)
      setResult(data)
      if ((data.score / data.total) >= 0.8) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }
  }, [])

  if (!result) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-2">😕</p>
        <p className="text-slate-500">没有测验结果</p>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/quiz')}>
          返回测验
        </Button>
      </div>
    )
  }

  const { score, total, timeSpent, level: quizLevel } = result
  const pct = Math.round((score / total) * 100)
  const minutes = Math.floor(timeSpent / 60)
  const seconds = timeSpent % 60

  const getGrade = () => {
    if (pct >= 95) return { emoji: '👑', text: '完美通关！', color: 'text-amber-500' }
    if (pct >= 80) return { emoji: '🌟', text: '优秀！', color: 'text-success' }
    if (pct >= 60) return { emoji: '👍', text: '不错！继续加油！', color: 'text-brand' }
    if (pct >= 40) return { emoji: '💪', text: '还需努力！', color: 'text-warning' }
    return { emoji: '📚', text: '多多练习！', color: 'text-error' }
  }

  const grade = getGrade()

  return (
    <div className="p-4 pb-8 space-y-5">
      <ConfettiOverlay show={showConfetti} />

      {/* Score Circle */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-brand to-brand-dark
            flex flex-col items-center justify-center text-white shadow-lg"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold"
          >
            {pct}%
          </motion.span>
          <span className="text-xs text-white/70">{score}/{total}题</span>
        </motion.div>
        <p className={`text-2xl font-bold ${grade.color}`}>
          {grade.emoji} {grade.text}
        </p>
        <p className="text-xs text-slate-400">
          用时 {minutes}分{seconds}秒 · {quizLevel || level} 测试
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-success">{score}</p>
          <p className="text-xs text-slate-400">正确</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-error">{total - score}</p>
          <p className="text-xs text-slate-400">错误</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-slate-800">{minutes}:{String(seconds).padStart(2, '0')}</p>
          <p className="text-xs text-slate-400">用时</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-4">
        <Button variant="primary" size="lg" className="w-full" onClick={() => navigate(`/quiz/${quizLevel || level}/play`)}>
          🔄 再来一次
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/quiz')}>
          📋 选择其他测验
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate('/')}>
          🏠 返回首页
        </Button>
      </div>
    </div>
  )
}
