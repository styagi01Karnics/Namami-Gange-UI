function currentMonthValue() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function MonthField({
  value,
  onChange,
  className = '',
  min,
  label = 'Inventory month',
}: {
  value: string
  onChange: (value: string) => void
  className?: string
  /** Earliest selectable month (YYYY-MM). */
  min?: string
  label?: string
}) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <input
        type="month"
        value={value}
        min={min}
        max={currentMonthValue()}
        onChange={(event) => event.target.value && onChange(event.target.value)}
        aria-label={`Select ${label.toLowerCase()}`}
        className="h-[38px] w-full rounded-[9px] border border-line bg-white px-[12px] text-[13px] font-medium text-ink outline-none focus:border-brand"
      />
    </label>
  )
}