import { sectionTheme, tint } from './sectionTheme'

/**
 * Section switcher for STP Management. The pills are square-footed and sit on a
 * full-width rule, so the selected one reads as the front sheet of a stack.
 */
export default function SectionTabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`scroll-thin overflow-x-auto border-b border-line ${className}`}>
      <div className="flex items-end gap-[8px]">
        {tabs.map((t) => {
          const { color, icon: Icon } = sectionTheme(t)
          const isActive = active === t

          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={`flex shrink-0 items-center gap-[8px] whitespace-nowrap rounded-t-[6px] font-semibold leading-4 transition-all ${
                isActive ? 'h-[40px] px-[14px] text-[14px]' : 'h-[34px] px-[9px] text-[13px]'
              }`}
              style={{
                backgroundColor: isActive ? color : tint(color, 0.1),
                color: isActive ? '#FFFFFF' : '#22303F',
              }}
            >
              <span style={{ color: isActive ? '#FFFFFF' : color }}>
                <Icon size={isActive ? 18 : 16} />
              </span>
              {t}
            </button>
          )
        })}
      </div>
    </div>
  )
}
