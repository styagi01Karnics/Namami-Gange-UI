import { Search } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Search', className = '' }) {
  return (
    <label className={`relative flex h-[34px] items-center rounded-[8px] border border-line bg-white pl-[13px] pr-[34px] ${className}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-muted"
      />
      <Search size={15} className="absolute right-[11px] text-[#7B8A9C]" strokeWidth={2} />
    </label>
  )
}
