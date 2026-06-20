import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlashCard from './FlashCard'
import DeckProgress from './DeckProgress'
import DeckComplete from './DeckComplete'

export default function FlashCardDeck({ words, onComplete, onWordResult }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [filteredWords, setFilteredWords] = useState(null)

  const activeWords = filteredWords || words
  const currentWord = activeWords[currentIndex]
  const progress = { current: currentIndex + 1, total: activeWords.length }

  const handleResult = useCallback((wordId, status) => {
    const result = { wordId, status }
    setResults(prev => [...prev, result])
    onWordResult?.(wordId, status)

    if (currentIndex + 1 >= activeWords.length) {
      setTimeout(() => setIsComplete(true), 300)
    } else {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200)
    }
  }, [currentIndex, activeWords.length, onWordResult])

  const handleRestart = (reviewWordIds) => {
    if (reviewWordIds && reviewWordIds.length > 0) {
      setFilteredWords(activeWords.filter(w => reviewWordIds.includes(w.id)))
    }
    setCurrentIndex(0)
    setResults([])
    setIsComplete(false)
  }

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        没有可学习的单词
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto min-h-[calc(100dvh-7rem)]">
      <div className="px-1 mb-2">
        <DeckProgress current={progress.current} total={progress.total} />
      </div>

      <div className="flex-1 flex items-start justify-center pt-2">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <FlashCard word={currentWord} onResult={handleResult} />
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <DeckComplete
                results={results}
                total={activeWords.length}
                onRestart={handleRestart}
                onFinish={() => onComplete?.(results)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
