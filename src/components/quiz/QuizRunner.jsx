import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MultipleChoice from './MultipleChoice'
import QuizProgress from './QuizProgress'
import QuizTimer from './QuizTimer'

/** 阅读组子题目的选项组件 */
function SubQuestionChoice({ subQuestion, selected, onSelect, submitted, index }) {
  const labels = ['A', 'B', 'C', 'D']

  return (
    <div className="mb-5">
      <p className="text-base font-semibold text-slate-700 mb-2.5 leading-relaxed">
        {index + 1}. {subQuestion.question}
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {subQuestion.options?.map((option, oi) => {
          const isSelected = selected === option.id
          const isCorrect = option.isCorrect
          let bg = 'bg-white border-slate-200 hover:border-brand/40 hover:bg-brand/5'
          if (submitted) {
            if (isSelected && isCorrect) bg = 'bg-success-light border-success text-success'
            else if (isSelected && !isCorrect) bg = 'bg-error-light border-error text-error'
            else if (isCorrect) bg = 'bg-success-light border-success text-success'
            else bg = 'bg-white border-slate-100 text-slate-300'
          } else if (isSelected) {
            bg = 'bg-brand/10 border-brand text-brand'
          }

          return (
            <button
              key={option.id}
              onClick={() => !submitted && onSelect(subQuestion.id, option.id)}
              disabled={submitted}
              className={`p-3 rounded-xl border text-left text-sm transition-all ${bg}
                ${submitted && !isCorrect && !isSelected ? 'opacity-50' : ''}`}
            >
              <span className="font-bold mr-1.5">{labels[oi]}.</span>
              {option.text}
              {submitted && isSelected && isCorrect && <span className="ml-1">✅</span>}
              {submitted && isSelected && !isCorrect && <span className="ml-1">❌</span>}
            </button>
          )
        })}
      </div>
      {submitted && subQuestion.explanation && (
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          <span className="font-semibold">解析：</span>{subQuestion.explanation}
        </p>
      )}
    </div>
  )
}

/** 题目导航面板 — 底部弹出，显示所有题号及作答状态 */
function QuestionNav({ questions, answers, currentIndex, onJump, onClose }) {
  const getStatus = (q) => {
    if (q.type === 'reading-group') {
      const subIds = q.subQuestions.map(sq => sq.id)
      const subAnswers = answers.filter(a => subIds.includes(a.questionId))
      if (subAnswers.length === 0) return 'unanswered'
      return subAnswers.every(a => a.isCorrect) ? 'correct' : 'wrong'
    }
    const answer = answers.find(a => a.questionId === q.id)
    if (!answer) return 'unanswered'
    return answer.isCorrect ? 'correct' : 'wrong'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-t-3xl p-5 pb-8 max-h-[70vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">📋 题目列表</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {questions.map((q, i) => {
            const status = getStatus(q)
            const isCurrent = i === currentIndex
            let cls = 'flex items-center justify-center h-12 rounded-xl font-semibold text-base transition-all active:scale-95'
            if (isCurrent) cls += ' ring-2 ring-brand ring-offset-2'

            if (status === 'correct') {
              cls += ' bg-success-light text-success hover:bg-success/20'
            } else if (status === 'wrong') {
              cls += ' bg-error-light text-error hover:bg-error/20'
            } else {
              cls += ' bg-slate-100 text-slate-400 hover:bg-slate-200'
            }

            return (
              <button key={i} onClick={() => { onJump(i); onClose() }} className={cls}>
                {i + 1}
              </button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function QuizRunner({ questions, onFinish, onAnswer }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [lastAnswer, setLastAnswer] = useState(null)
  const [startTime] = useState(Date.now())
  const [groupSelections, setGroupSelections] = useState({})
  const [showNav, setShowNav] = useState(false)

  const question = questions[currentIndex]
  const isGroup = question?.type === 'reading-group'

  /** 判断某题是否已作答 */
  const isQuestionAnswered = useCallback((q) => {
    if (q.type === 'reading-group') {
      const subIds = q.subQuestions.map(sq => sq.id)
      return answers.filter(a => subIds.includes(a.questionId)).length === q.subQuestions.length
    }
    return answers.some(a => a.questionId === q.id)
  }, [answers])

  const allAnswered = questions.every(q => isQuestionAnswered(q))

  const handleAnswer = useCallback((selected, isCorrect) => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const answer = { questionId: question.id, selected, isCorrect, timeTaken }
    setAnswers(prev => [...prev, answer])
    setLastAnswer({ ...answer, question })
    onAnswer?.(answer)
  }, [question, startTime, onAnswer])

  const handleGroupSelect = useCallback((subQuestionId, optionId) => {
    setGroupSelections(prev => ({ ...prev, [subQuestionId]: optionId }))
  }, [])

  const handleGroupSubmit = useCallback(() => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const subAnswers = question.subQuestions.map(sq => {
      const selected = groupSelections[sq.id]
      const correct = sq.options.find(o => o.isCorrect)
      return { questionId: sq.id, selected: selected || null, isCorrect: selected === correct.id, timeTaken }
    })
    setAnswers(prev => [...prev, ...subAnswers])
    setLastAnswer({ isGroup: true, subAnswers, question })
    subAnswers.forEach(a => onAnswer?.(a))
    setGroupSelections({})
  }, [question, groupSelections, startTime, onAnswer])

  const allGroupAnswered = isGroup
    ? question.subQuestions.every(sq => groupSelections[sq.id])
    : false

  /** 跳转到任意题目（已答则恢复反馈，未答则空白） */
  const jumpToQuestion = useCallback((index) => {
    const target = questions[index]
    setCurrentIndex(index)
    if (target?.type === 'reading-group') {
      const subIds = target.subQuestions.map(sq => sq.id)
      const prev = answers.filter(a => subIds.includes(a.questionId))
      setLastAnswer(prev.length > 0 ? { isGroup: true, subAnswers: prev, question: target } : null)
    } else {
      const prev = answers.find(a => a.questionId === target?.id)
      setLastAnswer(prev ? { ...prev, question: target } : null)
    }
  }, [questions, answers])

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      if (allAnswered) {
        const totalTime = Math.round((Date.now() - startTime) / 1000)
        onFinish?.({ answers: [...answers], totalTime })
      }
      return // at last question but not all answered: do nothing (hint shown in UI)
    }
    {
      const nextIndex = currentIndex + 1
      const target = questions[nextIndex]
      setCurrentIndex(nextIndex)
      if (target?.type === 'reading-group') {
        const subIds = target.subQuestions.map(sq => sq.id)
        const prev = answers.filter(a => subIds.includes(a.questionId))
        setLastAnswer(prev.length > 0 ? { isGroup: true, subAnswers: prev, question: target } : null)
      } else {
        const prev = answers.find(a => a.questionId === target?.id)
        setLastAnswer(prev ? { ...prev, question: target } : null)
      }
    }
  }, [allAnswered, answers, startTime, onFinish, currentIndex, questions])

  if (!question) {
    return <div className="text-center py-12 text-slate-400 text-base">没有题目</div>
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      {/* Progress & Timer + Nav button */}
      <div className="flex items-center justify-between mb-5">
        <QuizProgress current={currentIndex + 1} total={questions.length} />
        <div className="flex items-center gap-2">
          <QuizTimer startTime={startTime} />
          <button
            onClick={() => setShowNav(true)}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors text-sm"
            title="题目列表"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentIndex}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
        >
          {/* ========== READING GROUP MODE ========== */}
          {isGroup && (
            <>
              <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                <p className="text-sm font-semibold text-amber-600 mb-2">📖 阅读文章</p>
                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">{question.context}</p>
              </div>

              <div className="mb-2">
                {question.subQuestions.map((sq, i) => (
                  <SubQuestionChoice
                    key={sq.id}
                    subQuestion={sq}
                    index={i}
                    selected={groupSelections[sq.id]}
                    onSelect={handleGroupSelect}
                    submitted={!!lastAnswer?.isGroup}
                  />
                ))}
              </div>

              {!lastAnswer && (
                <button
                  onClick={handleGroupSubmit}
                  disabled={!allGroupAnswered}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95
                    ${allGroupAnswered
                      ? 'bg-brand text-white shadow-sm hover:bg-brand-dark hover:shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  提交答案
                </button>
              )}

              {lastAnswer?.isGroup && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 space-y-3.5"
                >
                  {(() => {
                    const correctCount = lastAnswer.subAnswers.filter(a => a.isCorrect).length
                    const total = lastAnswer.subAnswers.length
                    return (
                      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold
                        ${correctCount === total ? 'bg-success-light text-success' : 'bg-error-light text-error'}`}>
                        <span>{correctCount === total ? '✅ 全部正确！' : `📝 答对 ${correctCount} / ${total}`}</span>
                      </div>
                    )
                  })()}

                  {currentIndex >= questions.length - 1 && !allAnswered ? (
                    <p className="text-center text-sm text-amber-600 font-medium px-2">
                      ⚠️ 前面还有未答的题目，点击右上角 <span className="font-bold bg-amber-100 px-1.5 py-0.5 rounded">☰</span> 跳转作答
                    </p>
                  ) : (
                    <button
                      onClick={handleNext}
                      className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95
                        ${(allAnswered && currentIndex >= questions.length - 1) ? 'bg-success text-white shadow-sm hover:bg-emerald-600 hover:shadow-md' : 'bg-brand text-white shadow-sm hover:bg-brand-dark hover:shadow-md'}`}
                    >
                      {(allAnswered && currentIndex >= questions.length - 1) ? '📊 查看结果' : '下一题 →'}
                    </button>
                  )}
                </motion.div>
              )}
            </>
          )}

          {/* ========== REGULAR SINGLE QUESTION MODE ========== */}
          {!isGroup && (
            <>
              {question.context && (
                <div className="mb-5 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{question.context}</p>
                </div>
              )}

              <div className="text-center mb-6">
                <span className="text-2xl">{question.emoji || '❓'}</span>
                <h3 className="text-xl font-bold text-slate-800 mt-2 leading-relaxed">{question.question}</h3>
                {question.topic && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full mt-2.5 inline-block font-medium">
                    {{reading:'读音',meaning:'含义',grammar:'语法',particle:'助词',conjugation:'活用',vocabulary:'词汇',listening:'听力'}[question.topic] || question.topic}
                  </span>
                )}
              </div>

              <MultipleChoice
                question={question}
                onAnswer={handleAnswer}
                reviewMode={!!lastAnswer}
                reviewSelected={lastAnswer?.selected}
              />

              {lastAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 space-y-3.5"
                >
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold
                    ${lastAnswer.isCorrect ? 'bg-success-light text-success' : 'bg-error-light text-error'}`}>
                    <span>{lastAnswer.isCorrect ? '✅ 回答正确！' : '❌ 回答错误'}</span>
                    {!lastAnswer.isCorrect && (
                      <span className="text-sm opacity-70 ml-auto">
                        你选了：{lastAnswer.question?.options?.find(o => o.id === lastAnswer.selected)?.text || lastAnswer.selected}
                      </span>
                    )}
                  </div>

                  {lastAnswer.question?.explanation && (
                    <div className="p-4 bg-slate-50 rounded-2xl text-left">
                      <p className="text-sm font-semibold text-slate-500 mb-1.5">📝 解析</p>
                      <p className="text-base text-slate-600 leading-relaxed">{lastAnswer.question.explanation}</p>
                    </div>
                  )}

                  {currentIndex >= questions.length - 1 && !allAnswered ? (
                    <p className="text-center text-sm text-amber-600 font-medium px-2">
                      ⚠️ 前面还有未答的题目，点击右上角 <span className="font-bold bg-amber-100 px-1.5 py-0.5 rounded">☰</span> 跳转作答
                    </p>
                  ) : (
                    <button
                      onClick={handleNext}
                      className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95
                        ${(allAnswered && currentIndex >= questions.length - 1) ? 'bg-success text-white shadow-sm hover:bg-emerald-600 hover:shadow-md' : 'bg-brand text-white shadow-sm hover:bg-brand-dark hover:shadow-md'}`}
                    >
                      {(allAnswered && currentIndex >= questions.length - 1) ? '📊 查看结果' : '下一题 →'}
                    </button>
                  )}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Question Nav Panel */}
      <AnimatePresence>
        {showNav && (
          <QuestionNav
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onJump={jumpToQuestion}
            onClose={() => setShowNav(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
