import { useMemo } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { manpowerReportColumns, stpDetails } from '../../data/mockData'
import { parseDateRangeLabel } from '../../components/ui/DateRangeField'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function resolveFullStpName(plantLabel?: string, stpId?: string): string {
  if (stpId && stpDetails[stpId]?.name) {
    return stpDetails[stpId].name
  }
  if (!plantLabel) return '68 MLD STP, Jagjeetpur, Haridwar'

  for (const detail of Object.values(stpDetails)) {
    const detailLower = detail.name.toLowerCase()
    const labelLower = plantLabel.toLowerCase()
    if (
      detailLower === labelLower ||
      detailLower.includes(labelLower) ||
      labelLower.includes(detailLower)
    ) {
      return detail.name
    }
  }
  return plantLabel
}

function getDatesInRange(rangeStr?: string): Date[] {
  const now = new Date()
  const parsed = rangeStr ? parseDateRangeLabel(rangeStr) : null
  const from = parsed?.from ?? new Date(now.getFullYear(), now.getMonth(), 1)
  const to = parsed?.to ?? now

  const start = from.getTime() <= to.getTime() ? from : to
  const end = from.getTime() <= to.getTime() ? to : from

  const dates: Date[] = []
  const current = new Date(end)
  let count = 0
  // Generate date-wise records in descending chronological order (up to 60 days)
  while (current.getTime() >= start.getTime() && count < 60) {
    dates.push(new Date(current))
    current.setDate(current.getDate() - 1)
    count++
  }
  return dates.length > 0 ? dates : [now]
}

function buildStpManpowerRows(plantName: string, rangeStr?: string) {
  const dates = getDatesInRange(rangeStr)
  const cap = Number(plantName.match(/[\d.]+/)?.[0] ?? 20)
  const baseRequired = cap >= 60 ? 35 : cap >= 25 ? 28 : cap >= 15 ? 22 : 16

  return dates.map((d, index) => {
    const dateStr = `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
    const h = hashString(`${plantName}-${dateStr}`)
    const required = baseRequired + (h % 3) - 1
    const absent = (h % 3) + 1
    const leave = ((h >> 2) % 3) + 1
    const present = Math.max(1, required - absent - leave)
    const total = present + leave
    const shortage = Math.max(0, required - present)
    const attendance = `${((present / required) * 100).toFixed(2)}%`

    return {
      id: `mp-${index}-${dateStr.replace(/\s+/g, '-')}`,
      date: dateStr,
      stp: plantName,
      required,
      total,
      shortage,
      present,
      absent,
      leave,
      attendance,
      spark: [present - 2, present - 1, present, present + 1, present, present - 1, present],
    }
  })
}

function ManpowerReportBody() {
  const { plantLabel, stpId, range } = useReportFilters()

  const fullPlantName = useMemo(() => resolveFullStpName(plantLabel, stpId), [plantLabel, stpId])

  const rows = useMemo(() => {
    return buildStpManpowerRows(fullPlantName, range)
  }, [fullPlantName, range])

  return (
    <ReportDownloadScreen
      moduleKey="manpower"
      title="Manpower Attendance Report"
      description="Daily personnel deployment, attendance tracking, shift compliance, and staff shortage records."
      columns={manpowerReportColumns}
      rows={rows}
      renderCell={(r, col) => {
        if (col.key === 'present') {
          return <span className="font-semibold text-[#16A34A]">{r.present}</span>
        }
        if (col.key === 'absent') {
          return <span className="font-semibold text-[#DC2626]">{r.absent}</span>
        }
        if (col.key === 'shortage' && Number(r.shortage) > 0) {
          return <span className="font-bold text-[#DC2626]">{r.shortage}</span>
        }
        return r[col.key]
      }}
      exportTitle={`Manpower Attendance & Deployment Report - ${fullPlantName}`}
      exportFileName={`manpower-report-${(plantLabel || 'stp').toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      qrEnabled
      cellTone={(r, col) => {
        if (col.key === 'present') return 'green'
        if (col.key === 'absent') return 'red'
        if (col.key === 'shortage' && Number(r.shortage) > 0) return 'red'
        return null
      }}
    />
  )
}

export default function ManpowerReport() {
  return (
    <ReportShell>
      <ManpowerReportBody />
    </ReportShell>
  )
}
