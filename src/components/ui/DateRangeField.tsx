import { ico } from './Ico'

const CalendarIcon = ico('fluent:calendar-32-filled')

type DateRangeFieldProps = {
  value: string
  onChange?: (value: string) => void
  className?: string
  compact?: boolean
}

export default function DateRangeField({ value, onChange, className = '', compact = false }: DateRangeFieldProps) {
  return (
    <label
      className={`relative flex items-center rounded-[9px] border border-line bg-white pl-[14px] pr-[38px] ${
        compact ? 'h-[32px]' : 'h-[38px]'
      } ${className}`}
    >
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-transparent text-[13px] font-medium text-ink outline-none"
      />
      <CalendarIcon size={16} className="absolute right-[13px] text-[#5B6B7F]" />
    </label>
  )
}
