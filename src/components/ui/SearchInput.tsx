import { ico } from './Ico'

const SearchIcon = ico('fluent:search-24-filled')

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
}: SearchInputProps) {
  return (
    <label className={`relative flex h-[34px] items-center rounded-[8px] border border-line bg-white pl-[13px] pr-[34px] ${className}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-muted"
      />
      <SearchIcon size={15} className="absolute right-[11px] text-[#7B8A9C]" />
    </label>
  )
}
