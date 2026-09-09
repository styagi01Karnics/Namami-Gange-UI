import { useEffect, useState } from 'react'
import { AlertTriangle, CalendarDays, ChevronDown, MapPin } from 'lucide-react'
import Card from '../ui/Card'
import StatusPill, { statusTone } from '../ui/StatusPill'

function formatNow() {
  const now = new Date()
  const date = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  return `${date} ,${time}`
}

function Stamp({ label, value }) {
  return (
    <span className="flex items-center gap-[6px]">
      <CalendarDays size={14} strokeWidth={1.9} className="text-[#8B99AA]" />
      <span className="text-[12.5px] leading-4 text-ink-muted">{label} :</span>
      <span className="text-[12.5px] font-semibold leading-4 text-ink">{value}</span>
    </span>
  )
}

export default function StpHeaderCard({ stp, showPenalty = true }) {
  const [showDetails, setShowDetails] = useState(false)
  const [now, setNow] = useState(formatNow)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(formatNow()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <Card className="p-[15px]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[17px] font-bold leading-6 text-brand">{stp.name}</h2>
            <StatusPill tone={statusTone(stp.status)}>{stp.status}</StatusPill>
          </div>

          <p className="mt-[9px] flex items-center gap-[6px] text-[13px] font-medium leading-4 text-orange">
            <MapPin size={15} strokeWidth={2} className="shrink-0" />
            {stp.address}
          </p>

          <div className="mt-[9px] flex flex-wrap items-center gap-x-[22px] gap-y-[6px]">
            <Stamp label="Created on" value={stp.createdOn} />
            <Stamp label="Last seen" value={now} />
          </div>

          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
            className="mt-[13px] flex items-center gap-[4px] text-[13px] font-medium leading-4 text-brand-link underline decoration-brand-link/60 underline-offset-[3px]"
          >
            Details
            <ChevronDown size={15} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showPenalty && (
          <div className="w-[152px] shrink-0 rounded-[10px] bg-danger-soft p-[13px]">
            <div className="flex items-center gap-[8px]">
              <AlertTriangle size={17} strokeWidth={2.1} className="shrink-0 text-danger" />
              <span className="text-[12.5px] font-medium leading-4 text-ink">Total Penalty</span>
            </div>
            <p className="mt-[7px] pl-[25px] text-[15px] font-bold leading-5 text-ink">{stp.penalty.amount}</p>
            <p className="mt-[7px] pl-[25px] text-[11.5px] font-medium leading-4 text-danger">
              {stp.penalty.reason}
            </p>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-[15px] grid grid-cols-4 gap-x-[18px] gap-y-[14px] border-t border-line pt-[15px]">
          {stp.details.map((d) => (
            <div key={d.label}>
              <p className="text-[11.5px] font-medium leading-4 text-ink-muted">{d.label}</p>
              <p className="mt-[4px] text-[13px] font-semibold leading-[18px] text-ink">{d.value}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
