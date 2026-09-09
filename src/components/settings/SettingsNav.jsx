import { Bell, Gauge, ShieldCheck, SlidersHorizontal, User, Users } from 'lucide-react'
import { settingsSections } from '../../data/mockData'

const ICONS = { user: User, bell: Bell, gauge: Gauge, sliders: SlidersHorizontal, shield: ShieldCheck, users: Users }

export default function SettingsNav({ active, onChange }) {
  return (
    <nav className="p-[10px]">
      {settingsSections.map((s) => {
        const Icon = ICONS[s.icon]
        const isActive = s.key === active
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={`flex w-full items-center gap-[11px] rounded-[9px] px-[13px] py-[11px] text-left transition-colors ${
              isActive ? 'bg-brand-soft text-brand' : 'text-ink-soft hover:bg-[#F4F7FB] hover:text-brand'
            }`}
          >
            <Icon size={17} strokeWidth={isActive ? 2.2 : 1.9} />
            <span className={`text-[13.5px] leading-5 ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {s.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
