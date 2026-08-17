import { useEffect, useMemo, useState } from 'react'
import AppLayout from '@/layouts/AppLayout'
import { Card, DateRefreshBar } from '@/components/ui'
import iconSearch from '@/assets/shared/icon-search.svg'
import iconDownload from '@/assets/shared/icon-download.svg'
import chartPresent from '@/assets/manpower/chart-present.svg'
import chartLeave from '@/assets/manpower/chart-leave.svg'
import chartAbsent from '@/assets/manpower/chart-absent.svg'
import chartMarker from '@/assets/manpower/chart-marker.svg'
import chartTooltipLine from '@/assets/manpower/chart-tooltip-line.svg'
import iconPerson from '@/assets/manpower/icon-person.svg'
import tabAllBg from '@/assets/manpower/tab-all-bg.svg'

const ATTENDANCE_API =
  import.meta.env.VITE_ATTENDANCE_API_URL ?? '/api/v1/employee-attendances/daily'

const staffTabs = ['All', 'Present', 'On Leave', 'Absent'] as const

type EmployeeAttendance = {
  empId: string
  empName: string
  department: string
  shift: string
  stp: string
  attendanceDate: string
  attendanceStatus: string
}

type AttendanceApiResponse = {
  success: boolean
  data: EmployeeAttendance[]
}

function getStatusDisplay(status: string) {
  const normalized = status.trim().toUpperCase().replace(/\s+/g, '_')

  if (normalized === 'PRESENT' || normalized === 'ACTIVE') {
    return { label: 'Active', className: 'bg-[#eaf3ec] text-[#168e3f]' }
  }
  if (normalized === 'ON_LEAVE') {
    return { label: 'On Leave', className: 'bg-[#fbf6e8] text-[#fdb93a]' }
  }
  if (normalized === 'ABSENT') {
    return { label: 'Absent', className: 'bg-[#f5e7e7] text-[#dc2626]' }
  }

  return { label: status, className: 'bg-[#f0f0f0] text-[#646464]' }
}

function matchesTab(status: string, tab: (typeof staffTabs)[number]) {
  const normalized = status.trim().toUpperCase().replace(/\s+/g, '_')

  if (tab === 'All') return true
  if (tab === 'Present') {
    return normalized === 'PRESENT' || normalized === 'ACTIVE'
  }
  if (tab === 'On Leave') return normalized === 'ON_LEAVE' || normalized === 'ONLEAVE'
  if (tab === 'Absent') return normalized === 'ABSENT'
  return true
}

function getAttendanceTimestamp(date: string) {
  if (!date) return 0

  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

function formatAttendanceDate(date: string) {
  if (!date) return '-'

  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const departments = [
  { name: 'Operations', badge: 'Warning', badgeBg: 'bg-[#fdb93a]', cardBg: 'bg-[#f9fcff]' },
  { name: 'Maintenance', badge: 'Critical', badgeBg: 'bg-[#dc2626]', cardBg: 'bg-[#faf6ff]' },
  { name: 'Electrical', badge: 'Good', badgeBg: 'bg-[#168e3f]', cardBg: 'bg-[#f4fff2]' },
  { name: 'Safety', badge: 'Critical', badgeBg: 'bg-[#dc2626]', cardBg: 'bg-[#fffbf7]' },
  { name: 'Quality', badge: 'Good', badgeBg: 'bg-[#168e3f]', cardBg: 'bg-[#f9fcff]' },
  { name: 'Housekeeping', badge: 'Critical', badgeBg: 'bg-[#dc2626]', cardBg: 'bg-[#faf6ff]' },
]

const chartMonths = [
  { label: 'Jan', left: 88 },
  { label: 'Feb', left: 130 },
  { label: 'Mar', left: 175 },
  { label: 'Apr', left: 219 },
  { label: 'May', left: 261 },
  { label: 'Jun', left: 307 },
  { label: 'Jul', left: 352 },
  { label: 'Sept', left: 388 },
  { label: 'Oct', left: 435 },
  { label: 'Nov', left: 480 },
  { label: 'Dec', left: 524 },
]

const attendanceYLabels = [
  { label: '400', top: 67 },
  { label: '300', top: 108 },
  { label: '200', top: 148 },
  { label: '100', top: 190 },
  { label: '0', top: 231 },
]

const attendanceGridTops = [74, 115, 156, 197, 238]

const EMPLOYEE_TOTAL = 98
const employeeGaugeSegments = [
  { value: 82, color: '#11A33E' },
  { value: 8, color: '#F9AE01' },
  { value: 5, color: '#DC2626' },
]

function gaugeArcPoint(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  }
}

function EmployeeGauge() {
  const cx = 90
  const cy = 90
  const r = 68
  const stroke = 16

  let angle = Math.PI
  const arcs = employeeGaugeSegments.map((segment) => {
    const sweep = (segment.value / EMPLOYEE_TOTAL) * Math.PI
    const endAngle = angle - sweep
    const start = gaugeArcPoint(cx, cy, r, angle)
    const end = gaugeArcPoint(cx, cy, r, endAngle)
    const path = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`
    angle = endAngle
    return { path, color: segment.color }
  })

  return (
    <svg viewBox="0 0 180 180" className="size-full" aria-hidden>
      {arcs.map((arc, index) => (
        <path
          key={index}
          d={arc.path}
          fill="none"
          stroke={arc.color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export default function Manpower() {
  const [activeTab, setActiveTab] = useState<(typeof staffTabs)[number]>('All')
  const [staffRows, setStaffRows] = useState<EmployeeAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAttendance() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(ATTENDANCE_API)
        if (!response.ok) {
          throw new Error(`Failed to fetch attendance (${response.status})`)
        }

        const json = (await response.json()) as AttendanceApiResponse
        if (!cancelled) {
          setStaffRows(Array.isArray(json.data) ? json.data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load staff data')
          setStaffRows([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchAttendance()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredRows = useMemo(
    () =>
      staffRows
        .filter((row) => matchesTab(row.attendanceStatus, activeTab))
        .sort(
          (a, b) =>
            getAttendanceTimestamp(b.attendanceDate) - getAttendanceTimestamp(a.attendanceDate),
        ),
    [staffRows, activeTab],
  )

  return (
    <AppLayout
      breadcrumbs={[{ label: 'Manpower', current: true }]}
      toolbar={<DateRefreshBar />}
    >
      <div className="flex flex-col gap-4">
        {/* Row 1: 529px + flex */}
        <div className="flex gap-4">
          {/* Total Employees — 529×282 */}
          <Card className="relative h-[282px] w-[529px] shrink-0 overflow-hidden rounded-[10px] bg-white">
            {/* Header — top-left, stays above gauge */}
            <div className="absolute left-4 top-4 z-10">
              <div className="flex size-8 items-center justify-center rounded bg-[#ebf4fe] opacity-80">
                <img src={iconPerson} alt="" className="size-4" />
              </div>
              <p className="mt-2 text-[14px] font-medium leading-[22px] text-[#646464]">
                Total Employees
              </p>
              <p className="text-[16px] font-semibold leading-[22px] text-[#07121e]">98</p>
              <span className="mt-1 inline-flex h-5 items-center rounded-full bg-[#f4faff] px-1 text-[12px] font-medium text-[#0768d2] opacity-80">
                Across all states
              </span>
            </div>

            {/* Gauge — Figma: left 16px, top 162px, 180×180 */}
            <div className="absolute left-4 top-[162px] size-[180px]">
              <EmployeeGauge />
              <p className="absolute left-1/2 top-[54px] -translate-x-1/2 text-[24px] font-semibold leading-none text-[#07121e]">
                {EMPLOYEE_TOTAL}
              </p>
            </div>

            {/* Legend — Figma: left 235px, rows at top 162 / 199 / 236 */}
            <div className="absolute left-[235px] top-[162px] w-[278px]">
              {[
                { label: 'Present', value: '82', pct: '83.7%', color: 'bg-[#11a33e]', top: 0 },
                { label: 'Absent', value: '8', pct: '8.2%', color: 'bg-[#f9ae01]', top: 37 },
                { label: 'On leave', value: '5', pct: '5.1%', color: 'bg-[#dc2626]', top: 74 },
              ].map((row) => (
                <div
                  key={row.label}
                  className="absolute flex w-full items-center"
                  style={{ top: row.top }}
                >
                  <div className={`h-[29px] w-1 shrink-0 rounded-[20px] ${row.color}`} />
                  <span className="ml-4 w-[72px] text-[14px] font-medium text-[#646464]">
                    {row.label}
                  </span>
                  <span className="w-6 text-[14px] font-semibold text-[#07121e]">{row.value}</span>
                  <span className="ml-auto text-[14px] font-semibold text-[#07121e]">
                    {row.pct}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Attendance Trends — 590×282 */}
          <Card className="relative h-[282px] min-w-[590px] flex-1 overflow-clip rounded-[10px] bg-white">
            <p className="absolute left-4 top-4 text-[14px] font-medium leading-[22px] text-[#646464]">
              Attendance Trends
            </p>
            <div className="absolute right-4 top-[21px] flex items-center gap-4">
              {[
                { label: 'Present', color: 'bg-[#168e3f]' },
                { label: 'On leave', color: 'bg-[#f9ae01]' },
                { label: 'Absent', color: 'bg-[#dc2626]' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className={`size-3 rounded-[2px] ${item.color}`} />
                  <span className="text-[12px] font-medium text-[#646464]">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Y-axis labels — Figma positions */}
            {attendanceYLabels.map((item) => (
              <span
                key={item.label}
                className="absolute left-[46px] w-[22px] -translate-y-1/2 text-right text-[12px] leading-4 text-[#7e7e7e]"
                style={{ top: item.top }}
              >
                {item.label}
              </span>
            ))}

            {/* Grid lines — 475×1 at left 72px */}
            {attendanceGridTops.map((top) => (
              <div
                key={top}
                className="absolute left-[72px] h-px w-[475px] -translate-y-1/2 bg-[rgba(70,78,95,0.04)]"
                style={{ top }}
              />
            ))}

            {/* Chart lines — each SVG at its own Figma inset box */}
            <div className="absolute left-[87px] top-[98px] h-[66px] w-[459px]">
              <img src={chartPresent} alt="" className="block size-full max-w-none" />
            </div>
            <div className="absolute left-[87px] top-[106px] h-[85px] w-[460px]">
              <img src={chartLeave} alt="" className="block size-full max-w-none" />
            </div>
            <div className="absolute left-[87px] top-[98px] h-[110px] w-[460px]">
              <img src={chartAbsent} alt="" className="block size-full max-w-none" />
            </div>

            {/* Tooltip — July peak on Absent line */}
            <div className="absolute left-[329px] top-[69px] flex h-5 w-[61px] items-center justify-center rounded bg-white shadow-[0px_0px_1.72px_0px_rgba(54,154,203,0.25)]">
              <p className="whitespace-nowrap text-[10px] leading-none">
                <span className="font-medium text-[#10172a]">320:</span>
                <span className="font-medium text-[#727983]"> July</span>
              </p>
            </div>
            <div className="absolute left-[360px] top-[84px] flex h-[155px] w-0 items-center justify-center">
              <img src={chartTooltipLine} alt="" className="h-px w-[155px] -rotate-90" />
            </div>
            <img
              src={chartMarker}
              alt=""
              className="absolute left-[353px] top-[95px] h-[13px] w-[14px]"
            />

            {/* X-axis month labels — Figma positions (no Aug) */}
            {chartMonths.map((month) => (
              <span
                key={month.label}
                className="absolute top-[251px] -translate-x-1/2 text-[12px] text-[#7e7e7e]"
                style={{ left: month.left }}
              >
                {month.label}
              </span>
            ))}
          </Card>
        </div>

        {/* Row 2: flex + 382px */}
        <div className="flex gap-4">
          {/* Live Staff Availability — flex × 527 */}
          <Card className="flex h-[527px] min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
            <p className="px-4 pt-4 text-[14px] font-medium leading-[22px] text-[#646464]">
              Live Staff Availability
            </p>

            {/* Tabs row — Figma positions: 59, 146.5, 233.5, 320 */}
            <div className="relative mt-3 h-9 px-4">
              {staffTabs.map((tab, i) => {
                const positions = [59, 146.5, 233.5, 320]
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="absolute top-0 flex h-9 -translate-x-1/2 items-center justify-center"
                    style={{ left: positions[i] }}
                  >
                    {activeTab === tab && tab === 'All' && (
                      <img src={tabAllBg} alt="" className="absolute h-9 w-[87px]" />
                    )}
                    {activeTab === tab && tab !== 'All' && (
                      <span className="absolute h-9 w-[87px] rounded-full bg-[#0768d2]" />
                    )}
                    <span
                      className={`relative z-10 text-[14px] font-medium ${
                        activeTab === tab ? 'text-white' : 'text-[#0768d2]'
                      }`}
                    >
                      {tab}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search + export row */}
            <div className="mt-3 flex items-center justify-between px-4">
              <div className="relative flex h-[33px] w-[350px] items-center rounded border border-[#eff0f6] bg-white px-3">
                <span className="text-[12px] font-medium text-[#646464]">Search</span>
                <img
                  src={iconSearch}
                  alt=""
                  className="absolute right-3 top-1/2 size-4 -translate-y-1/2"
                />
              </div>
              <div className="flex items-center gap-3">
                {['PDF', 'CSV'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="flex h-[33px] items-center gap-2 rounded border border-[#0768d2] px-3"
                  >
                    <span className="text-[12px] font-medium text-[#0768d2]">{label}</span>
                    <img src={iconDownload} alt="" className="size-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Table — scrollable body */}
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-[#f5f5f5]">
                  <tr>
                    {['ID', 'Employee', 'Department', 'Shift', 'STP', 'Date', 'Status'].map(
                      (h) => (
                      <th
                        key={h}
                        className="px-4 py-4 text-[14px] font-medium leading-[22px] text-[#7e7e7e]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-[14px] font-medium text-[#646464]"
                      >
                        Loading staff availability...
                      </td>
                    </tr>
                  )}
                  {!loading && error && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-[14px] font-medium text-[#dc2626]"
                      >
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading && !error && filteredRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-[14px] font-medium text-[#646464]"
                      >
                        No staff records found.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    !error &&
                    filteredRows.map((row) => {
                      const status = getStatusDisplay(row.attendanceStatus)
                      return (
                        <tr
                          key={`${row.empId}-${row.empName}`}
                          className="h-[92px] border border-[#d8edff] bg-white"
                        >
                          <td className="px-4 text-[14px] font-medium text-[#07121e]">
                            #{row.empId}
                          </td>
                          <td className="px-4">
                            <div className="flex items-center gap-3">
                              {/* <img
                                src={staffAvatar}
                                alt=""
                                className="size-8 rounded-full object-cover"
                              /> */}
                              <span className="text-[14px] font-medium text-[#07121e]">
                                {row.empName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 text-[14px] font-medium text-[#07121e]">
                            {row.department}
                          </td>
                          <td className="px-4 text-[14px] font-medium text-[#07121e]">
                            {row.shift}
                          </td>
                          <td className="px-4 text-[14px] font-medium text-[#07121e]">
                            {row.stp}
                          </td>
                          <td className="px-4 text-[14px] font-medium text-[#07121e]">
                            {formatAttendanceDate(row.attendanceDate)}
                          </td>
                          <td className="px-4">
                            <span
                              className={`inline-flex h-8 min-w-[93px] items-center justify-center rounded-full px-1.5 text-[14px] font-semibold ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Department Manpower Status — 382×527 */}
          <Card className="h-[527px] w-[382px] shrink-0 overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)] p-4">
            <p className="text-[14px] font-medium leading-[22px] text-[#646464]">
              Department Manpower Status
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {departments.map((dept) => (
                <div
                  key={dept.name}
                  className={`h-[144px] rounded-lg border border-[#f6f6f6] p-3 ${dept.cardBg}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-[14px] font-medium leading-[22px] text-[#07121e]">
                      {dept.name}
                    </p>
                    <span
                      className={`inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[10px] font-medium text-white ${dept.badgeBg}`}
                    >
                      {dept.badge}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    {[
                      { label: 'Required', value: '82' },
                      { label: 'Present', value: '8' },
                      { label: 'Shortage', value: '5' },
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-[#646464]">
                          {metric.label}
                        </span>
                        <span className="text-[12px] font-semibold text-[#07121e]">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
