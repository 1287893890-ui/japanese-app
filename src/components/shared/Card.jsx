export default function Card({ children, className = '', onClick, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
