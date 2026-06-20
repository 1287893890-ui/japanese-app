import { useState } from 'react'
import { motion } from 'framer-motion'

export default function MultipleChoice({ question, onAnswer, reviewMode = false, reviewSelected = null }) {
  const [selected, setSelected] = useState(reviewSelected || null)
  const [submitted, setSubmitted] = useState(reviewMode)

  const handleSelect = (option) => {
    if (submitted) return
    setSelected(option.id)
    setSubmitted(true)
    setTimeout(() => onAnswer?.(option.id, option.isCorrect), 400)
  }

  return (
    <div className="grid grid-cols-1 gap-3.5">
      {question.options?.map((option, i) => {
        const isSelected = selected === option.id
        const isRevealed = submitted && (isSelected || option.isCorrect)
        const isCorrect = option.isCorrect

        let bg = 'bg-white border-slate-200 hover:border-brand/50 hover:bg-brand/5 hover:shadow-sm'
        if (submitted) {
          if (isSelected && isCorrect) bg = 'bg-success-light border-success text-success'
          else if (isSelected && !isCorrect) bg = 'bg-error-light border-error text-error'
          else if (isCorrect) bg = 'bg-success-light border-success text-success'
          else bg = 'bg-white border-slate-100 text-slate-300'
        }

        return (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => handleSelect(option)}
            disabled={submitted}
            whileTap={!submitted ? { scale: 0.97 } : {}}
            className={`px-5 py-4 rounded-2xl border-2 text-left transition-all duration-300 ${bg}
              ${submitted && !isCorrect && !isSelected ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3.5">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                ${isSelected && !isCorrect ? 'bg-error text-white' : ''}
                ${isCorrect && submitted ? 'bg-success text-white' : ''}
                ${!submitted ? 'bg-slate-100 text-slate-500' : ''}
                ${submitted && !isSelected && !isCorrect ? 'bg-slate-100 text-slate-400' : ''}
              `}>
                {['A', 'B', 'C', 'D'][i]}
              </span>
              <span className="font-medium text-base">{option.text}</span>
              {submitted && isSelected && isCorrect && <span className="ml-auto text-base">✅</span>}
              {submitted && isSelected && !isCorrect && <span className="ml-auto text-base">❌</span>}
              {submitted && !isSelected && isCorrect && <span className="ml-auto text-base text-success">✅</span>}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
