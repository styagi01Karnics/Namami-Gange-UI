import { type ReactNode } from 'react'
import SegmentedGauge from '../charts/SegmentedGauge'
import type { IconComponent } from '../../types'

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
    <section className={`flex h-full flex-col rounded-[12px] border border-line bg-white p-[15px] shadow-card ${className}`}>
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
        <span className="inline-flex rounded-full bg-[#EEF6FD] px-[9px] py-[4px] text-[12px] font-medium leading-4 text-[#0768D2]">
          {scopeLabel}
        </span>
      </div>

      <div className="mt-[10px] flex flex-1 items-center gap-[16px]">
        <SegmentedGauge
          segments={breakdown}
          display={total}
          size={gaugeSize}
          thickness={Math.round(gaugeSize * 0.087)}
        />

        <div className="flex-1 space-y-[14px]">
          {breakdown.map((b) => (
            <div key={b.key} className="grid grid-cols-3 items-center gap-[10px]">
              <span className="flex min-w-0 items-center gap-[11px]">
                <span className="h-[23px] w-[5px] shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
                <span className="whitespace-nowrap text-[12.5px] font-medium leading-[18px] text-ink-soft">{b.label}</span>
              </span>
              <span className="text-center text-[13px] font-semibold tabular-nums leading-[18px] text-ink">{b.value}</span>
              <span className="justify-self-end rounded-full bg-[#EEF6FD] px-[8px] py-[3px] text-[12px] font-medium leading-4 text-brand-link">
                {b.percent}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
