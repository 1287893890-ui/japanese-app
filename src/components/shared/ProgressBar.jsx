export default function ProgressBar({ value = 0, max = 100, color = 'bg-brand', className = '' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div className={`w-full h-2 bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
