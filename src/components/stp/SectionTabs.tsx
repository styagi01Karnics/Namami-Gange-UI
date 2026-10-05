/**
 * Section switcher for STP Management.
 * Top-only radius, tight spacing; the active tab grows taller than its neighbours.
 */
export default function SectionTabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`scroll-thin overflow-x-auto border-b border-[#E5E5E5] ${className}`}>
      <div className="flex items-end gap-[4px]">
        {tabs.map((t) => {
          const isActive = active === t

          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={`shrink-0 whitespace-nowrap rounded-t-[4px] text-[14px] leading-5 tracking-normal transition-all ${
                isActive
                  ? 'bg-[#0768D2] px-[12px] py-[10px] font-bold text-white'
                  : 'h-[36px] bg-white px-[10px] py-[8px] font-semibold text-[#07121E] hover:text-[#0768D2]'
              }`}
            >
              {t}
            </button>
          )
        })}
      </div>
    </div>
  )
}
