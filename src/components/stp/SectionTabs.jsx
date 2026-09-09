export default function SectionTabs({ tabs, active, onChange }) {
  return (
    <div className="scroll-thin flex items-center gap-[2px] overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`shrink-0 whitespace-nowrap rounded-[8px] px-[12px] py-[8px] text-[12.5px] font-medium leading-4 transition-colors ${
            active === t ? 'bg-brand text-white' : 'text-ink hover:bg-brand-soft'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
