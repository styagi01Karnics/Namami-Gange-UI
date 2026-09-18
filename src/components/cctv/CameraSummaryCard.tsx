import { ico } from '../ui/Ico'
import { cctvSummary } from '../../data/mockData'

const CameraIcon = ico('fluent:camera-20-filled')
const CameraOffIcon = ico('fluent:camera-off-20-filled')
const MaintenanceIcon = ico('fluent:square-32-filled')

const TONES = {
  ok: { bg: 'bg-ok-soft', chip: 'bg-ok', text: 'text-ok', icon: CameraIcon },
  danger: { bg: 'bg-danger-soft', chip: 'bg-danger', text: 'text-danger', icon: CameraOffIcon },
  warn: { bg: 'bg-warn-soft', chip: 'bg-warn', text: 'text-warn', icon: MaintenanceIcon },
}

function MiniStat({ item, className = '' }) {
  const tone = TONES[item.tone]
  const Icon = tone.icon

  return (
    <div className={`flex h-full flex-col items-center justify-center rounded-[11px] px-[13px] py-[13px] text-center ${tone.bg} ${className}`}>
      <span className={`mx-auto flex h-[26px] w-[26px] items-center justify-center rounded-full ${tone.chip}`}>
        <Icon size={14} className="text-white" />
      </span>
      <p className="mt-[13px] text-[12.5px] font-medium leading-4 text-ink-soft">{item.label}</p>
      <p className={`mt-[8px] text-[17px] font-bold leading-6 ${tone.text}`}>{item.value}</p>
    </div>
  )
}

export default function CameraSummaryCard() {
  const [online, offline, maintenance] = cctvSummary.breakdown

  return (
    <section className="flex h-full flex-col rounded-[12px] border border-line bg-white p-[15px] shadow-card">
      <div className="flex items-center gap-[11px]">
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-brand-soft">
          <CameraIcon size={22} className="text-brand" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-5 text-ink-soft">Total Cameras</p>
          <p className="text-[20px] font-bold leading-7 text-ink">{cctvSummary.total}</p>
        </div>
      </div>

      {/* Indented to sit under the label rather than the icon. */}
      <div className="mt-[9px] pl-[53px]">
        <span className="inline-flex rounded-full bg-[#EEF6FD] px-[9px] py-[4px] text-[12px] font-medium leading-4 text-[#0768D2]">
          {cctvSummary.scopeLabel}
        </span>
      </div>

      <div className="mt-[14px] grid flex-1 grid-cols-2 gap-[13px]">
        <MiniStat item={online} />
        <MiniStat item={offline} />
      </div>
      <MiniStat item={maintenance} className="mt-[13px] flex-1" />
    </section>
  )
}
