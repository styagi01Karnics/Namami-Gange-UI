import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Icon } from '@iconify/react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import StatusPill, { statusTone } from '../ui/StatusPill'

const CalendarIcon = ico('fluent:calendar-32-filled')
const PinIcon = ico('fluent:location-24-filled')

function Stamp({ label, value }) {
  return (
    <span className="flex items-center gap-[6px]">
      <CalendarIcon size={14} className="text-[#8B99AA]" />
      <span className="text-[12.5px] leading-4 text-ink-muted">{label} :</span>
      <span className="text-[12.5px] font-semibold leading-4 text-ink">{value}</span>
    </span>
  )
}

export default function StpHeaderCard({ stp, showPenalty = true }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="bg-gradient-to-r from-[#FFFFFF] to-[#DFF5FE] p-[15px]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[17px] font-bold leading-6 text-brand">{stp.name}</h2>
            <StatusPill tone={statusTone(stp.status)}>{stp.status}</StatusPill>
          </div>

          <p className="mt-[9px] flex items-center gap-[6px] text-[13px] font-medium leading-4 text-orange">
            <PinIcon size={15} className="shrink-0" />
            {stp.address}
          </p>

          <div className="mt-[9px] flex flex-wrap items-center gap-x-[22px] gap-y-[6px]">
            <Stamp label="Created on" value={stp.createdOn} />
            <Stamp label="Last seen" value={stp.lastSeen} />
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
          <div className="w-[196px] shrink-0 rounded-[10px] bg-[#FFF8F8] p-[16px] shadow-[0px_0px_3px_1px_#DC26261A]">
            <div className="flex items-center gap-[10px]">
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[4px] bg-[#FDE6E6]">
                <Icon icon="clarity:warning-standard-solid" width={18} height={18} className="text-danger" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-4 text-ink">Total Penalty</p>
                <p className="mt-[4px] text-[16px] font-bold leading-5 text-ink">{stp.penalty.amount}</p>
              </div>
            </div>
            <div className="mt-[10px] flex justify-end">
              <span className="rounded-[6px] bg-[#F4FAFF] px-[8px] py-[4px] text-[11.5px] font-medium leading-4 text-[#0768D2]">
                Across all location
              </span>
            </div>
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
