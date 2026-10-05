import { TrendingUp } from 'lucide-react'
import Card from '../ui/Card'

type Props = {
  activePercent: number
  nonActivePercent: number
  activeDelta: string
  nonActiveDelta: string
}

function TrackBar({
  percent,
  fill,
  track,
}: {
  percent: number
  fill: string
  track: string
}) {
  const height = Math.max(10, Math.min(100, percent))

  return (
    <div
      className="relative h-[172px] w-[80px] overflow-hidden rounded-[12px]"
      style={{ background: track }}
    >
      <div
        className="absolute inset-x-0 bottom-0 rounded-[12px] transition-[height] duration-500"
        style={{ height: `${height}%`, background: fill }}
      />
    </div>
  )
}

function SideCopy({
  label,
  percent,
  delta,
  tone,
  align,
}: {
  label: string
  percent: number
  delta: string
  tone: 'ok' | 'danger'
  align: 'left' | 'right'
}) {
  const toneClass = tone === 'ok' ? 'text-[#168E3F]' : 'text-[#DC2626]'
  const alignClass = align === 'right' ? 'items-end text-right' : 'items-start text-left'

  return (
    <div className={`flex flex-col justify-center ${alignClass}`}>
      <p className="text-[16px] font-semibold leading-[19px] text-[#07121E]">{label}</p>
      <p className={`mt-[8px] text-[32px] font-semibold leading-[38px] ${toneClass}`}>{percent}%</p>
      <span className="mt-[12px] inline-flex h-[20px] items-center gap-[4px] rounded-full bg-[#EAF3EC] px-[4px] text-[12px] font-semibold leading-[14px] text-[#168E3F]">
        <TrendingUp size={12} strokeWidth={2.4} />
        {delta} vs yesterday
      </span>
    </div>
  )
}

export default function StpPerformanceCard({
  activePercent,
  nonActivePercent,
  activeDelta,
  nonActiveDelta,
}: Props) {
  return (
    <Card className="flex h-full items-center justify-center rounded-[16px] px-[16px] py-[16px]">
      <div className="flex items-center gap-[48px]">
        <SideCopy
          label="Active STP's"
          percent={activePercent}
          delta={activeDelta}
          tone="ok"
          align="right"
        />

        <TrackBar percent={activePercent} fill="#168E3F" track="#EAF3EC" />
        <TrackBar percent={nonActivePercent} fill="#DC2626" track="#F5E7E7" />

        <SideCopy
          label="Non-Active STP's"
          percent={nonActivePercent}
          delta={nonActiveDelta}
          tone="danger"
          align="left"
        />
      </div>
    </Card>
  )
}
