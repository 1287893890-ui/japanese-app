import { useApp } from '../context/AppContext'

export function useProgress(level) {
  const { state } = useApp()

  const completedVocab = state.completedVocabulary.filter(id => id.startsWith(level?.toLowerCase() || ''))
  const completedGrammar = state.completedGrammar.filter(id => id.startsWith(level?.toLowerCase() || ''))
  const completedDialogues = state.completedDialogues.filter(id => id.startsWith(level?.toLowerCase() || ''))

  return {
    vocabCount: completedVocab.length,
    grammarCount: completedGrammar.length,
    dialogueCount: completedDialogues.length,
    totalCompleted: state.completedVocabulary.length + state.completedGrammar.length + state.completedDialogues.length,
    quizScores: state.quizScores,
    streak: state.streak,
    dailyProgress: state.dailyProgress,
  }
}
