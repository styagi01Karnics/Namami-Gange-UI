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
      className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#D7EDFF] text-[#0768D2] transition-colors hover:bg-[#C8E4FF]"
    >
      <ChevronDown size={17} strokeWidth={2.2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}
