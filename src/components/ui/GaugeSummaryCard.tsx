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
  comfortable?: boolean
}

export default function GaugeSummaryCard({
  icon: Icon,
  label,
  total,
  scopeLabel,
  breakdown,
  className = '',
  gaugeSize = 172,
  comfortable = false,
}: GaugeSummaryCardProps) {
  return (
    <section
      className={`flex h-full flex-col rounded-[12px] border border-line bg-white shadow-card ${
        comfortable ? 'p-[20px]' : 'p-[15px]'
      } ${className}`}
    >
      <div className="flex items-start gap-[12px]">
        <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[12px] bg-brand-soft">
          <Icon size={26} strokeWidth={2.2} className="text-brand" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-5 text-ink-soft">{label}</p>
          <p className="mt-[6px] text-[20px] font-bold leading-7 text-ink">{total}</p>
          <span className="mt-[12px] inline-flex rounded-full bg-[#EEF6FD] px-[9px] py-[4px] text-[12px] font-medium leading-4 text-[#0768D2]">
            {scopeLabel}
          </span>
        </div>
      </div>

      <div className={`flex flex-1 items-center ${comfortable ? 'mt-[20px] gap-[22px]' : 'mt-[10px] gap-[16px]'}`}>
        <SegmentedGauge
          segments={breakdown}
          display={total}
          size={gaugeSize}
          thickness={Math.round(gaugeSize * 0.055)}
        />

        <div className={`flex-1 ${comfortable ? 'space-y-[20px]' : 'space-y-[14px]'}`}>
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
