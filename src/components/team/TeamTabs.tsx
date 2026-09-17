import { teamTheme, tint } from './teamTheme'

/** Tab switcher for Team Management — the active pill fills with its accent. */
export default function TeamTabs({ tabs, active, onChange }) {
  return (
    <div className="scroll-thin overflow-x-auto">
      <div className="flex items-center gap-[8px]">
        {tabs.map((tab) => {
          const { color, icon: Icon } = teamTheme(tab)
          const isActive = active === tab

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className="flex h-[36px] shrink-0 items-center gap-[8px] whitespace-nowrap rounded-[8px] px-[13px] text-[13px] font-semibold leading-4 transition-colors"
              style={{
                backgroundColor: isActive ? color : tint(color, 0.1),
                color: isActive ? '#FFFFFF' : '#22303F',
              }}
            >
              <Icon size={16} strokeWidth={2} style={{ color: isActive ? '#FFFFFF' : color }} />
              {tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
