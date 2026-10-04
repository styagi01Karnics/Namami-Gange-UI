/**
 * Section switcher for Team Management.
 * Same square-footed strip as STP Management / Data Reports.
 */
export default function TeamTabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`scroll-thin overflow-x-auto border-b border-line ${className}`}>
      <div className="flex items-end gap-[4px]">
        {tabs.map((tab) => {
          const isActive = active === tab

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`shrink-0 whitespace-nowrap rounded-t-[8px] text-[14px] font-semibold leading-5 tracking-normal transition-all ${
                isActive
                  ? 'h-[42px] bg-brand px-[16px] text-white'
                  : 'h-[34px] border border-b-0 border-line bg-white px-[12px] text-[#07121E] hover:text-brand'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
