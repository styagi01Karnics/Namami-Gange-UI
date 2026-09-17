import Card from '../ui/Card'
import BuildingIcon from '../ui/BuildingIcon'
import { stpSummary } from '../../data/mockData'

const TONES = {
  ok: { bg: 'bg-ok-soft', chip: 'bg-[#DCEFE3]', text: 'text-ok' },
  slate: { bg: 'bg-slate2-soft', chip: 'bg-[#E1E6EB]', text: 'text-slate2' },
  warn: { bg: 'bg-warn-soft', chip: 'bg-[#FBEBC8]', text: 'text-warn' },
  danger: { bg: 'bg-danger-soft', chip: 'bg-[#FADDDE]', text: 'text-danger' },
}

const BAR = ['bg-ok', 'bg-slate2', 'bg-warn', 'bg-danger']

function MiniStat({ item }) {
  const tone = TONES[item.tone]

  return (
    <div className={`flex items-center gap-[11px] rounded-[11px] ${tone.bg} px-[12px] py-[11px]`}>
      <span className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[9px] ${tone.chip}`}>
        <BuildingIcon size={18} className={tone.text} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-medium leading-4 text-ink-soft">{item.label}</p>
        <p className={`mt-[5px] text-[19px] font-bold leading-6 ${tone.text}`}>{item.value}</p>
      </div>
    </div>
  )
}

export default function TotalStpCard() {
  return (
    <Card className="flex flex-col p-[15px]">
      <div className="flex items-center gap-[12px]">
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-brand-soft">
          <BuildingIcon size={21} className="text-brand" />
        </span>
        <div>
          <p className="text-[13px] font-medium leading-4 text-ink-soft">Total STP</p>
          <p className="mt-[5px] text-[22px] font-bold leading-7 text-ink">{stpSummary.total}</p>
        </div>
      </div>

      {/* segmented distribution bar */}
      <div className="mt-[15px] flex h-[5px] w-full gap-[6px]">
        {stpSummary.breakdown.map((item, i) => (
          <span
            key={item.key}
            style={{ flex: item.value }}
            className={`h-full rounded-full ${BAR[i]}`}
          />
        ))}
      </div>

      <div className="mt-[15px] grid grid-cols-2 gap-[13px]">
        {stpSummary.breakdown.map((item) => (
          <MiniStat key={item.key} item={item} />
        ))}
      </div>
    </Card>
  )
}
