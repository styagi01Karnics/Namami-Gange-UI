import { sectionTheme } from './sectionTheme'

/** Heading for a section panel: brand title, blurb, optional controls. */
export default function TabSectionHeader({ tab, right }) {
  const { blurb } = sectionTheme(tab)

  return (
    <div className="flex items-center justify-between gap-[16px]">
      <div className="min-w-0">
        <h3 className="text-[16px] font-bold leading-[21px] text-brand">{tab}</h3>
        <p className="mt-[3px] text-[12px] leading-[16px] text-[#5E5E5E]">{blurb}</p>
      </div>

      {right}
    </div>
  )
}
