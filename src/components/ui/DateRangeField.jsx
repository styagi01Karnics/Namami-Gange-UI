import { Calendar } from 'lucide-react'

export default function DateRangeField({ value, onChange, className = '' }) {
  return (
    <label className={`relative flex h-[38px] items-center rounded-[9px] border border-line bg-white pl-[14px] pr-[38px] ${className}`}>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-transparent text-[13px] font-medium text-ink outline-none"
      />
      <Calendar size={16} className="absolute right-[13px] text-[#5B6B7F]" strokeWidth={1.8} />
    </label>
  )
}
