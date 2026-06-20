export function speakJapanese(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.rate = 0.85
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

export function speakWord(word) {
  speakJapanese(word)
}
