import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from '../ui/Avatar'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import IconToggle from '../ui/IconToggle'
import GroupedTabs from '../ui/GroupedTabs'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { useTableExport } from '../export/useTableExport'
import { staffAvailability, staffStatusFilterMap } from '../../data/mockData'

const STAFF_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Employee' },
  { key: 'role', label: 'Role' },
  { key: 'dept', label: 'Dept' },
  { key: 'date', label: 'Date' },
  { key: 'punchTime', label: 'Punch Time' },
  { key: 'status', label: 'Status' },
]

export default function StaffAvailabilityCard({ open, onToggle }) {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sortDir, setSortDir] = useState(null)
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Staff Availability',
    fileName: 'staff-availability',
    columns: STAFF_COLUMNS,
  })

  const rows = useMemo(() => {
    const wanted = staffStatusFilterMap[filter]
    const q = query.trim().toLowerCase()

    const list = staffAvailability.rows.filter((r) => {
      const matchesStatus = !wanted || r.status === wanted
      const matchesQuery =
        !q ||
        [r.name, r.id, r.role, r.dept].some((v) => String(v ?? '').toLowerCase().includes(q))
      return matchesStatus && matchesQuery
    })

    if (!sortDir) return list
    return [...list].sort((a, b) =>
      sortDir === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status),
    )
  }, [filter, query, sortDir])

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex items-center justify-between p-[15px]">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">Staff Availability</h3>
        <IconToggle open={open} onClick={onToggle} label="Toggle Staff Availability" />
      </div>

      {open && (
        <div className="flex min-h-0 flex-1 flex-col">
          <GroupedTabs className="px-[15px]" tabs={staffAvailability.filters} active={filter} onChange={setFilter} />

          <div className="mt-[14px] flex items-center justify-end gap-[12px] px-[15px] pb-[14px]">
            <SearchInput value={query} onChange={setQuery} className="w-[254px]" />
            <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
            <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
          </div>
          {printNode}

          <div className="relative min-h-0 flex-1">
            {/* Absolutely filled so the table grows with Department Status
                instead of leaving a gap or stretching the row on its own. */}
            <div className="scroll-thin absolute inset-0 overflow-x-auto overflow-y-auto">
            <table className="w-full table-fixed border-collapse" style={{ minWidth: 740 }}>
              <thead>
                <tr className="border-y border-line bg-canvas [&>th]:sticky [&>th]:top-0 [&>th]:z-10 [&>th]:bg-canvas">
                  <th className="w-[12%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">ID</th>
                  <th className="w-[18%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">Employee</th>
                  <th className="w-[16%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">Role</th>
                  <th className="w-[14%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">Dept</th>
                  <th className="w-[14%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">Date</th>
                  <th className="w-[12%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">Punch Time</th>
                  <th className="w-[14%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                    <button
                      type="button"
                      onClick={() => setSortDir((v) => (v === 'asc' ? 'desc' : 'asc'))}
                      className="flex items-center gap-[4px] transition-colors hover:text-brand"
                    >
                      Status
                      <ChevronDown size={14} className={`transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-[16px] py-[12px] text-[12.5px] leading-4 text-ink">{r.id}</td>
                    <td className="px-[16px] py-[12px]">
                      <span className="flex items-center gap-[9px] text-[12.5px] leading-4 text-ink">
                        <Avatar size={24} />
                        {r.name}
                      </span>
                    </td>
                    <td className="px-[16px] py-[12px] text-[12.5px] leading-4 text-ink">{r.role}</td>
                    <td className="px-[16px] py-[12px] text-[12.5px] leading-4 text-ink">{r.dept}</td>
                    <td className="px-[16px] py-[12px] text-[12.5px] leading-4 text-ink">{r.date}</td>
                    <td className="px-[16px] py-[12px] text-[12.5px] leading-4 text-ink">{r.punchTime}</td>
                    <td className="px-[16px] py-[12px]">
                      <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-[16px] py-[36px] text-center text-[12.5px] text-ink-muted">
                      No staff match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
