import { teamTheme, tint } from './teamTheme'

/**
 * Section switcher for Team Management. Matches STP Management: square-footed
 * pills sit on a full-width rule so the selected one reads as the front sheet.
 */
export default function TeamTabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`scroll-thin overflow-x-auto border-b border-line ${className}`}>
      <div className="flex items-end gap-[8px]">
        {tabs.map((tab) => {
          const { color, icon: Icon } = teamTheme(tab)
          const isActive = active === tab

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
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
              {tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
