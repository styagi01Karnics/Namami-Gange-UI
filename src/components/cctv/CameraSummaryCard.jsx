import { Camera, CameraOff, Video, VideoOff } from 'lucide-react'

const TONES = {
  ok: { bg: 'bg-ok-soft', chip: 'bg-ok', text: 'text-ok', icon: Camera },
  danger: { bg: 'bg-danger-soft', chip: 'bg-danger', text: 'text-danger', icon: CameraOff },
  record: { bg: 'bg-brand-soft', chip: 'bg-brand', text: 'text-brand', icon: Video },
  warn: { bg: 'bg-warn-soft', chip: 'bg-warn', text: 'text-warn', icon: VideoOff },
}

function MiniStat({ item }) {
  const tone = TONES[item.tone]
  const Icon = tone.icon

  return (
    <div className={`rounded-[11px] px-[13px] py-[13px] text-center ${tone.bg}`}>
      <span className={`mx-auto flex h-[26px] w-[26px] items-center justify-center rounded-full ${tone.chip}`}>
        <Icon size={14} strokeWidth={2.3} className="text-white" />
      </span>
      <p className="mt-[13px] text-[12.5px] font-medium leading-4 text-ink-soft">{item.label}</p>
      <p className={`mt-[8px] text-[17px] font-bold leading-6 ${tone.text}`}>{item.value}</p>
    </div>
  )
}

export default function CameraSummaryCard({
  total = 0,
  scopeLabel = 'Across all area',
  breakdown = [],
}) {
  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px]">
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-brand-soft">
        <Camera size={17} strokeWidth={2} className="text-brand" />
      </span>

      <p className="mt-[13px] text-[13px] font-medium leading-4 text-ink-soft">Total Camera</p>
      <p className="mt-[6px] text-[22px] font-bold leading-7 text-ink">{total}</p>
      <span className="mt-[7px] inline-block text-[12px] font-medium leading-4 text-brand-link">
        {scopeLabel}
      </span>

      <div className="mt-[14px] grid grid-cols-2 gap-[13px]">
        {breakdown.map((item) => (
          <MiniStat key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}
