import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from '../ui/Avatar'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import PillTabs from '../ui/PillTabs'
import IconToggle from '../ui/IconToggle'
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
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[10px] border border-[#C7DDFB] bg-white/80">
      <div className="flex items-center justify-between gap-[12px] px-[15px] py-[20px]">
        <h3 className="text-[16px] font-semibold leading-[22px] text-[#07121E]">Staff Availability</h3>
        {onToggle ? (
          <IconToggle open={open} onClick={onToggle} label="Toggle Staff Availability" />
        ) : null}
      </div>

      {open && (
        <>
          <div className="flex flex-col gap-[24px] px-[15px] pb-[16px]">
            <PillTabs
              variant="segmented"
              tabs={staffAvailability.filters}
              active={filter}
              onChange={setFilter}
              className="w-[387px]"
            />

            <div className="flex items-center justify-end gap-[12px]">
              <SearchInput value={query} onChange={setQuery} className="w-[350px]" />
              <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
              <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
            </div>
          </div>
          {printNode}

          <div className="scroll-thin table-scroll">
            <table className="w-full table-fixed border-collapse" style={{ minWidth: 720 }}>
              <thead className="sticky top-0 z-[1]">
                <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF] [&>th]:bg-[#EFF7FF]">
                  <th className="w-[14%] px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                    ID
                  </th>
                  <th className="w-[26%] px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                    Employee
                  </th>
                  <th className="w-[22%] px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                    Role
                  </th>
                  <th className="w-[20%] px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                    Department
                  </th>
                  <th className="w-[18%] px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]">
                    <button
                      type="button"
                      onClick={() => setSortDir((v) => (v === 'asc' ? 'desc' : 'asc'))}
                      className="flex items-center gap-[4px] transition-colors hover:text-[#0768D2]"
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
                {rows.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`border border-[#D8EDFF] ${index % 2 === 1 ? 'bg-[rgba(248,248,248,0.9)]' : 'bg-white'}`}
                  >
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#0768D2] underline">
                      {r.id}
                    </td>
                    <td className="px-[16px] py-[18px]">
                      <span className="flex items-center gap-[9px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                        <Avatar size={24} />
                        {r.name}
                      </span>
                    </td>
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {r.role}
                    </td>
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {r.dept}
                    </td>
                    <td className="px-[16px] py-[18px]">
                      <StatusPill
                        tone={statusTone(r.status)}
                        className="h-[32px] min-w-[88px] justify-center px-[8px] text-[14px] leading-4"
                      >
                        {r.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-[16px] py-[36px] text-center text-[14px] text-[#646464]">
                      No staff match this filter.
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
