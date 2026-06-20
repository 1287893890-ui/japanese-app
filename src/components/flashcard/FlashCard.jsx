import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipe } from '../../hooks/useSwipe'
import { speakWord } from '../../utils/audio'
import { useApp } from '../../context/AppContext'

export default function FlashCard({ word, onResult }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { state } = useApp()
  const autoPlay = state.settings.autoPlayAudio

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped && autoPlay) {
      speakWord(word.reading || word.word)
    }
  }

  const handleKnow = useCallback(() => {
    onResult(word.id, 'know')
    setIsFlipped(false)
  }, [word.id, onResult])

  const handleReview = useCallback(() => {
    onResult(word.id, 'review')
    setIsFlipped(false)
  }, [word.id, onResult])

  const swipeHandlers = useSwipe(
    handleReview,
    handleKnow,
    null, // no down action
    70
  )

  const handleSpeak = (e) => {
    e.stopPropagation()
    speakWord(word.reading || word.word)
  }

  return (
    <div className="w-full select-none" {...swipeHandlers}>
      {/* Card */}
      <div
        className="relative w-full aspect-[4/5] cursor-pointer perspective-[1000px]"
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-slate-100
              flex flex-col items-center justify-center p-6 backface-hidden"
          >
            <button
              onClick={handleSpeak}
              className="absolute top-4 right-4 w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center
                hover:bg-brand hover:text-white transition-colors text-lg"
            >
              🔊
            </button>
            <p className="text-4xl font-bold text-slate-800 mb-6 text-center">{word.word}</p>
            {!isFlipped && (
              <p className="text-xs text-slate-300 mt-2">点击翻转查看含义 ↘</p>
            )}
            {word.partOfSpeech && (
              <span className="mt-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {word.partOfSpeech}
              </span>
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark rounded-3xl shadow-lg
              flex flex-col items-center justify-center p-6 backface-hidden text-white"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <p className="text-5xl mb-4">{word.meaning}</p>
            <p className="text-xl text-white/80 mb-2">{word.reading}</p>
            {word.exampleJp && (
              <div className="mt-4 p-3 bg-white/10 rounded-xl text-center">
                <p className="text-sm text-white/90">{word.exampleJp}</p>
                {word.exampleReading && (
                  <p className="text-xs text-white/60 mt-1">{word.exampleReading}</p>
                )}
                {word.exampleCn && (
                  <p className="text-xs text-white/70 mt-1">{word.exampleCn}</p>
                )}
              </div>
            )}
            <p className="text-xs text-white/40 mt-3">再次点击翻回</p>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handleReview}
          className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-2xl
            hover:bg-rose-100 active:scale-90 transition-all shadow-sm"
          title="需要复习"
        >
          🔄
        </button>
<button
          onClick={handleKnow}
          className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-2xl
            hover:bg-emerald-100 active:scale-90 transition-all shadow-sm"
          title="已经掌握"
        >
          ✅
        </button>
      </div>
      <p className="text-xs text-slate-300 text-center mt-3">
        ← 需复习 | ✅ 已掌握 →
      </p>
    </div>
  )
}
