import { ChevronDown } from 'lucide-react'
import type { MouseEventHandler } from 'react'

type IconToggleProps = {
  open: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  label?: string
}

export default function IconToggle({ open, onClick, label = 'Toggle section' }: IconToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] border border-[#D9E7FA] bg-[#EEF5FE] text-brand transition-colors hover:bg-brand-soft"
    >
      <ChevronDown size={17} strokeWidth={2.2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}
