import { teamTheme, tint } from './teamTheme'
import type { ReactNode } from 'react'

/** Accent tile, accent title, blurb and an optional control on the right. */
export default function TeamSectionHeader({ tab, right }: { tab: string; right?: ReactNode }) {
  const { color, icon: Icon, blurb } = teamTheme(tab)

  return (
    <div className="flex items-center justify-between gap-[16px]">
      <div className="flex min-w-0 items-center gap-[11px]">
        <span
          className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: tint(color, 0.12), color }}
        >
          <Icon size={22} strokeWidth={2} />
        </span>

        <div className="min-w-0">
          <h3 className="text-[14.5px] font-bold leading-[19px]" style={{ color }}>
            {tab}
          </h3>
          <p className="mt-[2px] text-[11.5px] leading-[15px] text-[#5E5E5E]">{blurb}</p>
        </div>
      </div>

      {right}
    </div>
  )
}
