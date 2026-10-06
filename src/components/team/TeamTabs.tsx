/**
 * Team Management tab strip — Figma pill style (node 2155:9015).
 */
export default function TeamTabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`scroll-thin overflow-x-auto ${className}`}>
      <div className="inline-flex items-center gap-[8px] rounded-[10px] bg-white/80 p-[4px] shadow-card">
        {tabs.map((tab) => {
          const isActive = active === tab

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`h-[36px] shrink-0 whitespace-nowrap rounded-[8px] px-[16px] text-[14px] font-semibold leading-5 transition-colors ${
                isActive
                  ? 'bg-brand text-white'
                  : 'bg-transparent text-ink hover:bg-brand-soft hover:text-brand'
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
