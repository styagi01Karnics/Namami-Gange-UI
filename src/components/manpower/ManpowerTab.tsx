import { useMemo, useState } from 'react'
import MetricRingCard from '../ui/MetricRingCard'
import StaffAvailabilityCard from './StaffAvailabilityCard'
import { buildTodayManpower } from './todayManpower'
import { stpDetails } from '../../data/mockData'

const pct = (value: number, total: number) => (total ? (value / total) * 100 : 0)

/** Today's live manpower for the selected STP; shared with the standalone Manpower page. */
export default function ManpowerTab({ stpId, plantCode }: { stpId?: string; plantCode?: string }) {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const key = stpId ?? plantCode ?? 'default'
  const today = useMemo(
    () => buildTodayManpower(key, stpDetails[key]?.name ?? plantCode ?? key),
    [key, plantCode],
  )
  const { required, present, absent, leave } = today

  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-4 gap-[16px]">
        <MetricRingCard label="Total Employees (Required)" value={required} tone="brand" />
        <MetricRingCard
          label="Present Today"
          value={present}
          percent={pct(present, required)}
          percentLabel={`${pct(present, required).toFixed(0)}%`}
          tone="ok"
        />
        <MetricRingCard
          label="Absent"
          value={absent}
          percent={pct(absent, required)}
          percentLabel={`${pct(absent, required).toFixed(0)}%`}
          tone="danger"
        />
        <MetricRingCard
          label="On Leave"
          value={leave}
          percent={pct(leave, required)}
          percentLabel={`${pct(leave, required).toFixed(0)}%`}
          tone="orange"
        />
      </div>

      <StaffAvailabilityCard
        rows={today.rows}
        dateLabel={today.date}
        open={detailsOpen}
        onToggle={() => setDetailsOpen((v) => !v)}
      />
    </div>
  )
}
