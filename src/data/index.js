import n5Vocabulary from './n5/vocabulary.json'
import n5Grammar from './n5/grammar.json'
import n5Dialogues from './n5/dialogues.json'
import n5Quizzes from './n5/quizzes.json'
import n4Vocabulary from './n4/vocabulary.json'
import n4Grammar from './n4/grammar.json'
import n4Dialogues from './n4/dialogues.json'
import n4Quizzes from './n4/quizzes.json'
import n3Vocabulary from './n3/vocabulary.json'
import n3Grammar from './n3/grammar.json'
import n3Dialogues from './n3/dialogues.json'
import n3Quizzes from './n3/quizzes.json'
import n2Vocabulary from './n2/vocabulary.json'
import n2Grammar from './n2/grammar.json'
import n2Dialogues from './n2/dialogues.json'
import n2Quizzes from './n2/quizzes.json'
import n1Vocabulary from './n1/vocabulary.json'
import n1Grammar from './n1/grammar.json'
import n1Dialogues from './n1/dialogues.json'
import n1Quizzes from './n1/quizzes.json'
import n5Exam from './n5/exam.json'

const dataCache = {
  N5: { vocabulary: n5Vocabulary, grammar: n5Grammar, dialogues: n5Dialogues, quizzes: n5Quizzes, exam: n5Exam },
  N4: { vocabulary: n4Vocabulary, grammar: n4Grammar, dialogues: n4Dialogues, quizzes: n4Quizzes },
  N3: { vocabulary: n3Vocabulary, grammar: n3Grammar, dialogues: n3Dialogues, quizzes: n3Quizzes },
  N2: { vocabulary: n2Vocabulary, grammar: n2Grammar, dialogues: n2Dialogues, quizzes: n2Quizzes },
  N1: { vocabulary: n1Vocabulary, grammar: n1Grammar, dialogues: n1Dialogues, quizzes: n1Quizzes },
}

export function getExamData(level) {
  return dataCache[level]?.exam || null
}

export function getVocabulary(level) {
  return dataCache[level]?.vocabulary || { level, lessons: [] }
}

export function getGrammar(level) {
  return dataCache[level]?.grammar || { level, points: [] }
}

export function getDialogues(level) {
  return dataCache[level]?.dialogues || { level, dialogues: [] }
}

export function getQuizzes(level) {
  return dataCache[level]?.quizzes || { level, quizzes: [] }
}

export function getLesson(level, lessonId) {
  const vocab = getVocabulary(level)
  return vocab.lessons.find(l => l.id === lessonId) || null
}

export function getGrammarPoint(level, grammarId) {
  const grammar = getGrammar(level)
  return grammar.points.find(g => g.id === grammarId) || null
}

export function getDialogue(level, dialogueId) {
  const dialogues = getDialogues(level)
  return dialogues.dialogues.find(d => d.id === dialogueId) || null
}

export function getAvailableLevels() {
  return Object.keys(dataCache)
}
