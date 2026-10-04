import { teamTheme } from './teamTheme'
import type { ReactNode } from 'react'

/** Brand title, blurb, and an optional control on the right — same as STP section headers. */
export default function TeamSectionHeader({ tab, right }: { tab: string; right?: ReactNode }) {
  const { blurb } = teamTheme(tab)

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
