// Fisher-Yates shuffle
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Pick random subset
export function pickRandom(array, n) {
  return shuffle(array).slice(0, n)
}
