import { sectionTheme } from './sectionTheme'

/** Heading for a section panel: brand title, blurb, optional controls. */
export default function TabSectionHeader({ tab, right }) {
  const { blurb } = sectionTheme(tab)

  return (
    <div className="flex items-center justify-between gap-[16px]">
      <div className="min-w-0">
        <h3 className="text-[16px] font-bold leading-5 text-[#0768D2]">{tab}</h3>
        <p className="mt-[4px] text-[12px] font-medium leading-5 text-[#646464]">{blurb}</p>
      </div>

      {right}
    </div>
  )
}
