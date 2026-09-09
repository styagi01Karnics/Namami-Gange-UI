export default function CardTitle({ children, suffix, right, className = '' }) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <h3 className="text-[15px] font-semibold leading-5 text-ink">
        {children}
        {suffix ? <span className="ml-1 text-[13px] font-normal text-ink-muted">{suffix}</span> : null}
      </h3>
      {right}
    </div>
  )
}
