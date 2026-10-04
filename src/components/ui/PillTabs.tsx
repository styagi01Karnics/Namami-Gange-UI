type PillTabsProps = {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
  className?: string
}

/** Same inner-tab switch style as Dashboard → Critical STP’s. */
export default function PillTabs({ tabs, active, onChange, className = '' }: PillTabsProps) {
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
              isActive ? 'bg-brand text-white' : 'bg-transparent text-ink hover:bg-[#F3F7FC]'
            }`}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
