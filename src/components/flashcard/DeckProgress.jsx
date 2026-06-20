import ProgressBar from '../shared/ProgressBar'

export default function DeckProgress({ current, total }) {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-400">
          {current} / {total}
        </span>
        <span className="text-xs text-slate-300">
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <ProgressBar value={current} max={total} />
    </div>
  )
}
