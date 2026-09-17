import SegmentedGauge from '../charts/SegmentedGauge'
import type { IconComponent } from '../../types'
import type { ReactNode } from 'react'

type GaugeSegment = {
  key: string
  label: string
  value: ReactNode
  percent: ReactNode
  color: string
  [key: string]: unknown
}

type GaugeSummaryCardProps = {
  icon: IconComponent
  label: ReactNode
  total: ReactNode
  scopeLabel: ReactNode
  breakdown: GaugeSegment[]
  className?: string
  gaugeSize?: number
}

export default function GaugeSummaryCard({
  icon: Icon,
  label,
  total,
  scopeLabel,
  breakdown,
  className = '',
  gaugeSize = 172,
}: GaugeSummaryCardProps) {
  return (
    <section className={`rounded-[12px] border border-line bg-white p-[15px] shadow-card ${className}`}>
      <div className="flex items-center gap-[11px]">
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-brand-soft">
          <Icon size={22} strokeWidth={2.2} className="text-brand" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-5 text-ink-soft">{label}</p>
          <p className="text-[20px] font-bold leading-7 text-ink">{total}</p>
        </div>
      </div>

      <div className="mt-[9px] pl-[53px]">
        <button
          type="button"
          className="rounded-[6px] bg-brand-soft px-[9px] py-[4px] text-[12px] font-semibold leading-4 text-brand-link transition-colors hover:bg-[#DCE9FB]"
        >
          {scopeLabel}
        </button>
      </div>

      <div className="mt-[10px] flex items-center gap-[16px]">
        <SegmentedGauge
          segments={breakdown}
          display={total}
          size={gaugeSize}
          thickness={Math.round(gaugeSize * 0.087)}
        />

        <div className="flex-1 space-y-[14px]">
          {breakdown.map((b) => (
            <div key={b.key} className="flex items-center gap-[11px]">
              <span className="h-[23px] w-[5px] shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
              <span className="whitespace-nowrap text-[12.5px] font-medium leading-[18px] text-ink-soft">{b.label}</span>
              <span className="ml-auto text-[13px] font-semibold leading-[18px] text-ink">{b.value}</span>
              <span className="rounded-[6px] bg-brand-soft px-[8px] py-[3px] text-[12px] font-medium leading-4 text-brand-link">
                {b.percent}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
