import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getDialogue } from '../data'
import { useApp } from '../context/AppContext'
import { speakWord } from '../utils/audio'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'

export default function DialoguePlayerPage() {
  const { level, id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const dialogue = getDialogue(level, id)
  const [currentLine, setCurrentLine] = useState(0)
  const [showTranslation, setShowTranslation] = useState(true)
  const isCompleted = state.completedDialogues.includes(id)

  if (!dialogue) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-2">😕</p>
        <p className="text-slate-500">未找到该对话</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-brand text-sm">返回</button>
      </div>
    )
  }

  const getCharacter = (speakerId) => {
    return dialogue.characters.find(c => c.id === speakerId)
  }

  const handleNext = () => {
    if (currentLine < dialogue.lines.length - 1) {
      setCurrentLine(prev => prev + 1)
    }
  }

  const handleSpeak = (text) => {
    speakWord(text)
  }

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_DIALOGUE', id })
  }

  const line = dialogue.lines[currentLine]
  const character = getCharacter(line?.speakerId)

  return (
    <div className="flex flex-col h-[calc(100dvh-3rem)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800 text-sm">{dialogue.title}</h2>
          <p className="text-xs text-slate-400">{dialogue.titleCn} · {dialogue.scene}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${showTranslation ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            {showTranslation ? '隐藏翻译' : '显示翻译'}
          </button>
          <button
            onClick={() => handleSpeak(line?.reading || line?.jp)}
            className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm hover:bg-brand hover:text-white transition-colors"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {dialogue.lines.slice(0, currentLine + 1).map((l, i) => {
          const char = getCharacter(l.speakerId)
          const isLast = i === currentLine

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
                style={{ backgroundColor: char?.color + '20' }}
              >
                {char?.avatar}
              </div>

              {/* Bubble */}
              <div className="flex-1 max-w-[80%]">
                <p className="text-xs font-medium text-slate-500 mb-1">{char?.nameCn || char?.name}</p>
                <div
                  className={`p-3 rounded-2xl rounded-tl-sm cursor-pointer transition-all
                    ${isLast ? 'bg-brand text-white shadow-md' : 'bg-slate-100 text-slate-700'}
                  `}
                  onClick={() => handleSpeak(l.reading || l.jp)}
                >
                  <p className={`text-sm ${isLast ? 'font-medium' : ''}`}>{l.jp}</p>
                  <p className="text-xs mt-0.5 opacity-70">{l.reading}</p>
                  <AnimatePresence>
                    {showTranslation && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`text-xs mt-1.5 pt-1.5 border-t ${isLast ? 'border-white/20 text-white/80' : 'border-slate-200 text-slate-500'}`}
                      >
                        {l.cn}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Progress */}
        <div className="w-full bg-slate-100 rounded-full h-1">
          <div
            className="h-full bg-brand rounded-full transition-all duration-300"
            style={{ width: `${((currentLine + 1) / dialogue.lines.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-center text-slate-400">
          第 {currentLine + 1} / {dialogue.lines.length} 句
        </p>

        {currentLine < dialogue.lines.length - 1 ? (
          <Button variant="primary" size="lg" className="w-full" onClick={handleNext}>
            下一句 →
          </Button>
        ) : (
          <div className="space-y-2">
            {!isCompleted ? (
              <Button variant="success" size="lg" className="w-full" onClick={handleComplete}>
                ✅ 标记完成
              </Button>
            ) : (
              <div className="text-center py-2 bg-success-light rounded-xl">
                <p className="text-success font-medium text-sm">✅ 已完成</p>
              </div>
            )}
            <Button variant="secondary" size="lg" className="w-full" onClick={() => setCurrentLine(0)}>
              🔄 重新播放
            </Button>
          </div>
        )}
      </div>

      {/* Vocab Highlights */}
      {dialogue.vocabularyHighlights && dialogue.vocabularyHighlights.length > 0 && (
        <div className="p-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 mb-2">📖 生词提示</h4>
          <div className="flex flex-wrap gap-2">
            {dialogue.vocabularyHighlights.map((v, i) => (
              <button
                key={i}
                onClick={() => handleSpeak(v.reading)}
                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-full hover:bg-brand/10 hover:text-brand transition-colors"
              >
                {v.word} <span className="text-slate-400">({v.meaning})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
