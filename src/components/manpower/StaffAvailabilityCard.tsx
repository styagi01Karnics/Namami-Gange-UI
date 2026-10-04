import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from '../ui/Avatar'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import PillTabs from '../ui/PillTabs'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { useTableExport } from '../export/useTableExport'
import { staffAvailability, staffStatusFilterMap } from '../../data/mockData'

const STAFF_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Employee' },
  { key: 'role', label: 'Role' },
  { key: 'dept', label: 'Department' },
  { key: 'status', label: 'Status' },
]

export default function StaffAvailabilityCard({ open = true, onToggle }) {
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
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-[12px] p-[15px]">
        <PillTabs tabs={staffAvailability.filters} active={filter} onChange={setFilter} />

        <div className="flex items-center gap-[12px]">
          <SearchInput value={query} onChange={setQuery} className="w-[254px]" />
          <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
          <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
        </div>
      </div>
      {printNode}

      {open && (
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full table-fixed border-collapse" style={{ minWidth: 720 }}>
            <thead>
              <tr className="border-y border-line bg-canvas [&>th]:sticky [&>th]:top-0 [&>th]:z-10 [&>th]:bg-canvas">
                <th className="w-[14%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  ID
                </th>
                <th className="w-[26%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Employee
                </th>
                <th className="w-[22%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Role
                </th>
                <th className="w-[20%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
                  Department
                </th>
                <th className="w-[18%] px-[16px] py-[15px] text-left text-[12.5px] font-semibold leading-4 text-ink-soft">
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
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-[16px] py-[12px] text-[12.5px] font-semibold leading-4 text-brand-link underline">
                    {r.id}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className="flex items-center gap-[9px] text-[12.5px] leading-4 text-ink">
                      <Avatar size={24} />
                      {r.name}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12.5px] leading-4 text-ink">{r.role}</td>
                  <td className="px-[16px] py-[12px] text-[12.5px] leading-4 text-ink">{r.dept}</td>
                  <td className="px-[16px] py-[12px]">
                    <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-[16px] py-[36px] text-center text-[12.5px] text-ink-muted">
                    No staff match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Keep onToggle available for callers that still pass it; no visible toggle in the new design. */}
      {onToggle ? null : null}
    </section>
  )
}
