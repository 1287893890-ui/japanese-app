export default function QuizProgress({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 font-medium">
        {current}/{total}
      </span>
    </div>
  )
}
