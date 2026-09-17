import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import BuildingIcon from '../ui/BuildingIcon'
import ReportsIcon from '../ui/ReportsIcon'
import SupportIcon from '../ui/SupportIcon'
import Toggle from '../ui/Toggle'

const ICONS = { building: BuildingIcon, support: SupportIcon, billing: ReportsIcon }

const tint = (color, alpha) =>
  `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase()}`

export default function AlertGroup({ group, values, onToggle, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const Icon = ICONS[group.icon] ?? BuildingIcon

  return (
    <section className="overflow-hidden rounded-[12px] border border-line bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-[12px] px-[16px] py-[14px] text-left"
      >
        <span
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: tint(group.color, 0.12), color: group.color }}
        >
          <Icon size={18} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-5" style={{ color: group.color }}>
            {group.title}
          </span>
          <span className="mt-[2px] block text-[12px] leading-4 text-ink-muted">{group.blurb}</span>
        </span>

        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`shrink-0 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-[8px] pb-[8px]">
          {group.items.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-[16px] px-[12px] py-[13px]">
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold leading-[18px] text-ink">{item.label}</span>
                <span className="mt-[3px] block text-[12px] leading-4 text-ink-muted">{item.blurb}</span>
              </span>
              <Toggle
                checked={values[item.key]}
                onChange={(next) => onToggle(item.key, next)}
                label={item.label}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
