import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Clock3,
  Droplets,
  FlaskConical,
  Gauge,
  Hexagon,
  Layers,
  TestTube,
  Undo2,
} from 'lucide-react'
import { fetchStpRealtime, getStpDeviceId } from '../../api/stpRealtime'
import { realtimeParameters } from '../../data/mockData'

const ICONS = {
  bod: FlaskConical,
  ph: Droplets,
  totalizer: Gauge,
  tss: Layers,
  cod: TestTube,
  no3: Hexagon,
}

const ICON_WRAP = {
  bod: 'bg-[#FDECEC] text-[#E5484D]',
  ph: 'bg-[#E8F1FD] text-[#1668E3]',
  totalizer: 'bg-[#E8F1FD] text-[#1668E3]',
  tss: 'bg-[#FEF7E6] text-[#C4890B]',
  cod: 'bg-[#F3EEFF] text-[#7C5CBF]',
  no3: 'bg-[#EAF7EF] text-[#2E9E5B]',
}

function ParamCard({ param }) {
  const Icon = ICONS[param.icon] ?? Droplets
  const wrap = ICON_WRAP[param.icon] ?? ICON_WRAP.ph
  const valueClass = param.percent ? 'text-ink' : param.alert ? 'text-danger' : 'text-ok'

  return (
    <div className="rounded-[10px] border border-white/80 bg-white px-[12px] py-[11px] shadow-[0_1px_2px_rgba(23,43,77,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <span className={`flex h-[28px] w-[28px] items-center justify-center rounded-[7px] ${wrap}`}>
          <Icon size={14} strokeWidth={2.1} />
        </span>
        <span className="text-[12.5px] font-semibold leading-4 text-ink">{param.label}</span>
      </div>

      <p className={`mt-[10px] text-[18px] font-bold leading-6 ${valueClass}`}>
        {param.value}
        {param.unit && (
          <span className="ml-[4px] text-[12px] font-medium text-ink-muted">{param.unit}</span>
        )}
        {param.percent && (
          <span className="ml-[6px] text-[12.5px] font-semibold text-brand">({param.percent})</span>
        )}
      </p>

      {param.ideal && <p className="mt-[4px] text-[11.5px] font-medium leading-4 text-brand-link">{param.ideal}</p>}
    </div>
  )
}

function StreamColumn({ stream, variant }) {
  const isInfluent = variant === 'influent'
  const Icon = isInfluent ? ArrowRight : Undo2

  return (
    <section
      className={`min-w-0 rounded-[12px] border p-[14px] ${
        isInfluent ? 'border-[#D6E8FB] bg-[#F3F9FF]' : 'border-[#D3EEDC] bg-[#F3FBF4]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-[10px]">
          <span
            className={`mt-[1px] flex h-[32px] w-[32px] items-center justify-center rounded-[8px] ${
              isInfluent ? 'bg-brand text-white' : 'bg-ok text-white'
            }`}
          >
            <Icon size={16} strokeWidth={2.3} />
          </span>
          <div>
            <h4 className={`text-[15px] font-bold leading-5 ${isInfluent ? 'text-brand' : 'text-ok'}`}>
              {stream.title}
            </h4>
            <p className="mt-[2px] text-[12px] font-medium leading-4 text-ink-muted">{stream.subtitle}</p>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-[6px] text-[12px] font-medium text-ink-soft">
          <Clock3 size={13} strokeWidth={2} className="text-ink-muted" />
          {stream.timestamp}
        </span>
      </div>

      <div className="mt-[16px]">
        <p className="text-[12.5px] font-medium leading-4 text-ink-soft">Flow</p>
        <p className="mt-[3px] text-[22px] font-bold leading-7 text-ink">
          {stream.flow}
          <span className="ml-[6px] text-[13px] font-medium text-ink-muted">{stream.flowUnit}</span>
        </p>
      </div>

      <div className="mt-[14px] grid grid-cols-3 gap-[10px]">
        {stream.params.map((param) => (
          <ParamCard key={param.key} param={param} />
        ))}
      </div>
    </section>
  )
}

export default function RealtimeParametersPanel({ stpId = 'jagjeetpur-68' }) {
  const [reading, setReading] = useState(realtimeParameters)
  const deviceId = getStpDeviceId(stpId)

  useEffect(() => {
    setReading(realtimeParameters)

    if (!deviceId) {
      return undefined
    }

    let cancelled = false

    async function load() {
      try {
        const next = await fetchStpRealtime(realtimeParameters, stpId)
        if (!cancelled) setReading(next)
      } catch {
        if (!cancelled) setReading(realtimeParameters)
      }
    }

    load()
    const timer = window.setInterval(load, 30000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [stpId, deviceId])

  return (
    <div className="grid grid-cols-2 gap-[15px]">
      <StreamColumn stream={reading.influent} variant="influent" />
      <StreamColumn stream={reading.effluent} variant="effluent" />
    </div>
  )
}
