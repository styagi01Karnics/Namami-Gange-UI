type PillTabsProps = {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
  className?: string
  /** `segmented` — same height as Manpower Staff Availability filters. */
  variant?: 'default' | 'segmented'
}

/** Inner-tab switch used across STP Management and reports. */
export default function PillTabs({
  tabs,
  active,
  onChange,
  className = '',
  variant = 'default',
}: PillTabsProps) {
  if (variant === 'segmented') {
    return (
      <div className={`inline-flex h-[32px] items-center rounded-[8px] bg-[#ECF6FF] p-[2px] ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab === active
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`h-[28px] min-w-0 flex-1 whitespace-nowrap rounded-[6px] px-[12px] transition-colors ${
                isActive
                  ? 'bg-[#0768D2] text-[14px] font-semibold leading-5 text-white'
                  : 'bg-white/70 text-[14px] font-medium leading-5 tracking-[-0.24px] text-[#10172A] hover:bg-white'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-[8px] ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab === active
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-[4px] px-[16px] py-[8px] text-[12.5px] font-semibold leading-4 transition-colors ${
              isActive ? 'bg-[#0768D2] text-white' : 'bg-transparent text-[#07121E] hover:bg-[#F3F7FC]'
            }`}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
