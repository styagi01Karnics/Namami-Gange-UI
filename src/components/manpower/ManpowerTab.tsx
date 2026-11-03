import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import MetricRingCard from '../ui/MetricRingCard'
import StaffAvailabilityCard from './StaffAvailabilityCard'
import { todayLabel, type TodayStaffRow } from './todayManpower'
import { stpDetails } from '../../data/mockData'
import { fetchManpowerRows, resolveManpowerStpId } from '../../api/manpower'

const pct = (value: number, total: number) => (total ? (value / total) * 100 : 0)

const NO_DATA_MESSAGE = 'Unable to fetch manpower data for this STP.'

/** Today's manpower for the selected STP, straight from the manpower API (no local fallback data). */
export default function ManpowerTab({ stpId, plantCode }: { stpId?: string; plantCode?: string }) {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const [result, setResult] = useState<{ key: string; rows: TodayStaffRow[] | null } | null>(null)
  const key = stpId ?? plantCode ?? 'default'
  const stpName = stpDetails[key]?.name ?? plantCode ?? key
  const manpowerStpId = resolveManpowerStpId(plantCode, stpId)

  useEffect(() => {
    setResult(null)
    if (manpowerStpId === null) return undefined

    let cancelled = false
    fetchManpowerRows(manpowerStpId).then((rows) => {
      if (!cancelled) setResult({ key, rows })
    })
    return () => {
      cancelled = true
    }
  }, [manpowerStpId, key])

  const loaded = result !== null && result.key === key
  const apiRows = loaded ? result.rows : null
  const hasData = Boolean(apiRows && apiRows.length > 0)
  const isLoading = manpowerStpId !== null && !loaded

  const today = useMemo(() => {
    const rows = apiRows ?? []
    const count = (status: TodayStaffRow['status']) => rows.filter((row) => row.status === status).length
    const present = count('Active')
    return {
      required: rows.length,
      present,
      absent: count('Absent'),
      leave: count('On Leave'),
      rows,
      date: todayLabel(),
    }
  }, [apiRows])
  const { required, present, absent, leave } = today

  if (!hasData) {
    return (
      <div
        role={isLoading ? 'status' : 'alert'}
        className="flex min-h-[200px] flex-col items-center justify-center rounded-[12px] border border-line bg-white py-[48px] text-center shadow-card"
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-[14px] text-ink-muted">
            <RefreshCw size={18} className="animate-spin text-brand" />
            Loading manpower data...
          </div>
        ) : (
          <>
            <p className="text-[14.5px] font-medium text-ink-muted">{NO_DATA_MESSAGE}</p>
            <p className="mt-1 text-[12.5px] text-ink-soft">Please try again later.</p>
          </>
        )}
      </div>
    )
  }

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
        seed={key}
        stpName={stpName}
        open={detailsOpen}
        onToggle={() => setDetailsOpen((v) => !v)}
      />
    </div>
  )
}
