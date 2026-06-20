import Button from '../shared/Button'

export default function DeckComplete({ results, total, onRestart, onFinish }) {
  const knowCount = results.filter(r => r.status === 'know').length
  const reviewCount = results.filter(r => r.status === 'review').length
  const pct = Math.round((knowCount / total) * 100)

  const getMessage = () => {
    if (pct >= 90) return { emoji: '🎉', text: '太厉害了！几乎全部掌握！' }
    if (pct >= 70) return { emoji: '👍', text: '做得不错！继续加油！' }
    if (pct >= 50) return { emoji: '💪', text: '不错！多复习会更好！' }
    return { emoji: '📚', text: '继续努力！学习需要坚持！' }
  }

  const msg = getMessage()

  return (
    <div className="text-center space-y-5 w-full">
      <div className="text-6xl">{msg.emoji}</div>
      <div>
        <div className="text-4xl font-bold text-slate-800">{pct}%</div>
        <p className="text-slate-500 text-sm mt-1">{msg.text}</p>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-500">{knowCount}</div>
          <div className="text-sm text-slate-500 font-medium mt-0.5">已掌握</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-500">{reviewCount}</div>
          <div className="text-sm text-slate-500 font-medium mt-0.5">需复习</div>
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="primary" size="lg" className="w-full" onClick={onFinish}>
          🎯 完成学习
        </Button>
        {reviewCount > 0 && (
          <Button variant="secondary" size="lg" className="w-full" onClick={() => onRestart(results.filter(r => r.status === 'review').map(r => r.wordId))}>
            🔄 复习薄弱词（{reviewCount}个）
          </Button>
        )}
      </div>
    </div>
  )
}
