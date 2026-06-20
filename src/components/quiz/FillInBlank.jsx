import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FillInBlank({ question, onAnswer }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = () => {
    if (!value.trim()) return
    setSubmitted(true)

    const answer = value.trim()
    const acceptable = question.acceptableAnswers || [question.answer]
    const isCorrect = acceptable.some(a => a === answer || a.toLowerCase() === answer.toLowerCase())
    onAnswer(answer, isCorrect)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="space-y-4">
      {/* Sentence with blank */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 bg-slate-50 rounded-2xl text-center"
      >
        <p className="text-xl font-medium text-slate-700">
          {question.question}
        </p>
      </motion.div>

      {/* Input */}
      <div>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={e => !submitted && setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitted}
            placeholder="输入答案..."
            className="w-full px-4 py-4 text-center text-xl font-bold rounded-2xl border-2 border-slate-200
              focus:border-brand focus:outline-none transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder:text-slate-300"
            autoFocus
          />
        </div>
      </div>

      {/* Hint */}
      {!submitted && question.hint && (
        <div className="text-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-amber-500 hover:text-amber-600 transition-colors"
          >
            💡 {showHint ? question.hint : '显示提示'}
          </button>
        </div>
      )}

      {/* Submit */}
      {!submitted && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="w-full py-3 bg-brand text-white font-semibold rounded-2xl
            hover:bg-brand-dark active:scale-95 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          确认答案
        </motion.button>
      )}
    </div>
  )
}
