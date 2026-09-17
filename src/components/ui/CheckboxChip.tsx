import { Check } from 'lucide-react'

type CheckboxChipProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function CheckboxChip({ label, checked, onChange }: CheckboxChipProps) {
  return (
    <label className="relative flex h-[38px] shrink-0 cursor-pointer select-none items-center gap-[10px] rounded-[8px] border border-line bg-white px-[13px]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span
        className={`flex h-[19px] w-[19px] items-center justify-center rounded-[5px] border transition-colors ${
          checked ? 'border-brand bg-brand' : 'border-[#C2CEDC] bg-white'
        }`}
      >
        {checked && <Check size={13} strokeWidth={3.2} className="text-white" />}
      </span>
      <span className="text-[13px] font-medium leading-4 text-ink">{label}</span>
    </label>
  )
}
