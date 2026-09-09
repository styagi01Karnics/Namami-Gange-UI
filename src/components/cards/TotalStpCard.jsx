import { Building2, Check, X, Wrench, AlertCircle } from 'lucide-react'
import Card from '../ui/Card'
import { stpSummary } from '../../data/mockData'

const TONES = {
  ok: { bg: 'bg-ok-soft', chip: 'bg-ok', text: 'text-ok', icon: Check },
  slate: { bg: 'bg-slate2-soft', chip: 'bg-slate2', text: 'text-slate2', icon: X },
  warn: { bg: 'bg-warn-soft', chip: 'bg-warn', text: 'text-warn', icon: Wrench },
  danger: { bg: 'bg-danger-soft', chip: 'bg-danger', text: 'text-danger', icon: AlertCircle },
}

const BAR = ['bg-ok', 'bg-slate2', 'bg-warn', 'bg-danger']

function MiniStat({ item }) {
  const tone = TONES[item.tone]
  const Icon = tone.icon

  return (
    <div className={`rounded-[11px] ${tone.bg} px-[13px] pb-[13px] pt-[12px]`}>
      <span className={`flex h-[26px] w-[26px] items-center justify-center rounded-[8px] ${tone.chip}`}>
        <Icon size={15} strokeWidth={2.6} className="text-white" />
      </span>
      <p className="mt-[13px] text-[12.5px] font-medium leading-4 text-ink-soft">{item.label}</p>
      <p className={`mt-[6px] text-[19px] font-bold leading-6 ${tone.text}`}>{item.value}</p>
    </div>
  )
}

export default function TotalStpCard() {
  return (
    <Card className="flex flex-col p-[15px]">
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-brand-soft">
        <Building2 size={17} strokeWidth={2} className="text-brand" />
      </span>

      <p className="mt-[14px] text-[13px] font-medium leading-4 text-ink-soft">Total STP</p>
      <p className="mt-[6px] text-[22px] font-bold leading-7 text-ink">{stpSummary.total}</p>

      {/* segmented distribution bar */}
      <div className="mt-[13px] flex h-[5px] w-full gap-[6px]">
        {stpSummary.breakdown.map((item, i) => (
          <span
            key={item.key}
            style={{ flex: item.value }}
            className={`h-full rounded-full ${BAR[i]}`}
          />
        ))}
      </div>

      <div className="mt-[14px] grid grid-cols-2 gap-[13px]">
        {stpSummary.breakdown.map((item) => (
          <MiniStat key={item.key} item={item} />
        ))}
      </div>
    </Card>
  )
}
