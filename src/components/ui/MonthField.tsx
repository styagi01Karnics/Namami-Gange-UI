function currentMonthValue() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function MonthField({
  value,
  onChange,
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">Inventory month</span>
      <input
        type="month"
        value={value}
        max={currentMonthValue()}
        onChange={(event) => event.target.value && onChange(event.target.value)}
        aria-label="Select inventory month"
        className="h-[38px] w-full rounded-[9px] border border-line bg-white px-[12px] text-[13px] font-medium text-ink outline-none focus:border-brand"
      />
    </label>
  )
}