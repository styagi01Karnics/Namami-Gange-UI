import { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from '../ui/Avatar'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import IconToggle from '../ui/IconToggle'
import StatusPill, { statusTone } from '../ui/StatusPill'
import {
  STAFF_TABS,
  fetchDailyAttendance,
  getAttendanceTimestamp,
  matchesStp,
  matchesTab,
} from '../../api/attendance'

export default function StaffAvailabilityCard({ stpName, stpId }) {
  const [open, setOpen] = useState(true)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sortDir, setSortDir] = useState(null)
  const [staffRows, setStaffRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')

      try {
        const rows = await fetchDailyAttendance()
        if (!cancelled) setStaffRows(rows)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load staff data')
          setStaffRows([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()

    const list = staffRows.filter((r) => {
      if (!matchesTab(r.attendanceStatus, filter)) return false
      if (!matchesStp(r.stp, stpName, stpId)) return false
      if (!q) return true
      return [r.name, r.id, r.empId, r.department, r.stp].some((field) =>
        String(field).toLowerCase().includes(q),
      )
    })

    if (sortDir) {
      return [...list].sort((a, b) =>
        sortDir === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status),
      )
    }

    return [...list].sort(
      (a, b) => getAttendanceTimestamp(b.dateRaw) - getAttendanceTimestamp(a.dateRaw),
    )
  }, [staffRows, filter, query, sortDir, stpName, stpId])

  return (
    <section className="flex flex-col rounded-[12px] border border-line bg-white p-[15px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">Staff Availability</h3>
        <IconToggle open={open} onClick={() => setOpen((v) => !v)} label="Toggle Staff Availability" />
      </div>

      {open && (
        <>
          <div className="mt-[14px] flex items-center gap-[8px]">
            {STAFF_TABS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-[8px] px-[15px] py-[8px] text-[12.5px] font-medium leading-4 transition-colors ${
                  filter === f ? 'bg-brand text-white' : 'text-brand-link hover:bg-brand-soft'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-[14px] flex items-center justify-end gap-[12px]">
            <SearchInput value={query} onChange={setQuery} className="w-[254px]" />
            <ExportButton label="PDF" />
            <ExportButton label="CSV" />
          </div>

          <div className="scroll-thin mt-[14px] max-h-[268px] min-h-[228px] overflow-y-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-line [&>th]:sticky [&>th]:top-0 [&>th]:z-10 [&>th]:bg-white">
                  <th className="w-[12%] pb-[12px] text-left text-[12.5px] font-medium leading-4 text-ink-soft">
                    ID
                  </th>
                  <th className="w-[18%] pb-[12px] text-left text-[12.5px] font-medium leading-4 text-ink-soft">
                    Employee
                  </th>
                  <th className="w-[14%] pb-[12px] text-left text-[12.5px] font-medium leading-4 text-ink-soft">
                    Department
                  </th>
                  <th className="w-[12%] pb-[12px] text-left text-[12.5px] font-medium leading-4 text-ink-soft">
                    Shift
                  </th>
                  <th className="w-[16%] pb-[12px] text-left text-[12.5px] font-medium leading-4 text-ink-soft">
                    STP
                  </th>
                  <th className="w-[13%] pb-[12px] text-left text-[12.5px] font-medium leading-4 text-ink-soft">
                    Date
                  </th>
                  <th className="w-[15%] pb-[12px] text-left text-[12.5px] font-medium leading-4 text-ink-soft">
                    <button
                      type="button"
                      onClick={() => setSortDir((v) => (v === 'asc' ? 'desc' : 'asc'))}
                      className="flex items-center gap-[4px] transition-colors hover:text-brand"
                    >
                      Status
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="py-[36px] text-center text-[12.5px] text-ink-muted">
                      Loading staff availability...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={7} className="py-[36px] text-center text-[12.5px] text-danger">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  rows.map((r) => (
                    <tr key={`${r.empId}-${r.name}-${r.dateRaw}`} className="border-b border-line last:border-0">
                      <td className="py-[12px] text-[12.5px] leading-4 text-ink">{r.id}</td>
                      <td className="py-[12px]">
                        <span className="flex items-center gap-[9px] text-[12.5px] leading-4 text-ink">
                          <Avatar size={24} />
                          {r.name}
                        </span>
                      </td>
                      <td className="truncate py-[12px] text-[12.5px] leading-4 text-ink">{r.department}</td>
                      <td className="truncate py-[12px] text-[12.5px] leading-4 text-ink">{r.shift}</td>
                      <td className="truncate py-[12px] text-[12.5px] leading-4 text-ink">{r.stp}</td>
                      <td className="py-[12px] text-[12.5px] leading-4 text-ink">{r.date}</td>
                      <td className="py-[12px]">
                        <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill>
                      </td>
                    </tr>
                  ))}
                {!loading && !error && rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-[36px] text-center text-[12.5px] text-ink-muted">
                      No staff records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
