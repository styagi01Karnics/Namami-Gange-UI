/**
 * Section switcher for STP Management.
 * Top-only radius, tight spacing; the active tab grows taller than its neighbours.
 */
export default function SectionTabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`scroll-thin overflow-x-auto border-b border-line ${className}`}>
      <div className="flex items-end gap-[4px]">
        {tabs.map((t) => {
          const isActive = active === t

          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={`shrink-0 whitespace-nowrap rounded-t-[8px] text-[14px] font-semibold leading-5 tracking-normal transition-all ${
                isActive
                  ? 'h-[42px] bg-brand px-[16px] text-white'
                  : 'h-[34px] border border-b-0 border-line bg-white px-[12px] text-[#07121E] hover:text-brand'
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
