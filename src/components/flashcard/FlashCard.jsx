import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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

  const swipeHandlers = useSwipe(handleReview, handleKnow, null, 70)

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
            <p className="text-4xl font-bold text-slate-800 mb-6 text-center tracking-wide">{word.word}</p>
            {!isFlipped && (
              <p className="text-sm text-slate-300 mt-2">点击翻转查看含义</p>
            )}
            {word.partOfSpeech && (
              <span className="mt-2 text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-medium">
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
            <p className="text-4xl font-bold mb-4 tracking-wide">{word.meaning}</p>
            <p className="text-lg text-white/80 mb-2">{word.reading}</p>
            {word.exampleJp && (
              <div className="mt-4 p-3 bg-white/10 rounded-xl text-center max-w-full">
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
      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleReview}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-base bg-rose-50 text-rose-600
            hover:bg-rose-100 active:scale-95 transition-all shadow-sm"
        >
          需复习
        </button>
        <button
          onClick={handleKnow}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-base bg-emerald-50 text-emerald-600
            hover:bg-emerald-100 active:scale-95 transition-all shadow-sm"
        >
          已掌握
        </button>
      </div>
    </div>
  )
}
