import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import Select from '../ui/Select'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { useTableExport } from '../export/useTableExport'
import { chemicalStatusFilterMap, equipmentInventory } from '../../data/mockData'

const STATUS_OPTIONS = [
  { id: 'All', label: 'All Status' },
  { id: 'Adequate', label: 'Adequate' },
  { id: 'Low Stock', label: 'Low Stock' },
  { id: 'Out of Stock', label: 'Out of Stock' },
]

export default function EquipmentInventoryCard({ open = true, onToggle }) {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Equipment Status',
    fileName: 'equipment-inventory',
    columns: equipmentInventory.columns,
  })

  const toggleSort = (key) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  const rows = useMemo(() => {
    const wanted = chemicalStatusFilterMap[filter]
    const q = query.trim().toLowerCase()

    const list = equipmentInventory.rows.filter((r) => {
      const matchesStatus = !wanted || r.status === wanted
      const matchesQuery = !q || [r.name, r.category, r.status].some((f) => f.toLowerCase().includes(q))
      return matchesStatus && matchesQuery
    })

    if (!sort.key) return list
    return [...list].sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [filter, query, sort])

  return (
    <section className="flex h-0 min-h-full min-w-0 flex-col overflow-hidden rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex items-center justify-between gap-[12px] p-[15px]">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">Equipment Status</h3>
      </div>

      {open && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center justify-end gap-[12px] px-[15px] pb-[15px]">
            <SearchInput value={query} onChange={setQuery} className="w-[220px]" />
            <Select options={STATUS_OPTIONS} value={filter} onChange={setFilter} className="w-[140px]" />
            <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
            <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
          </div>
          {printNode}

          <div className="scroll-thin min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[560px] table-fixed border-collapse">
              <colgroup>
                {equipmentInventory.columns.map((c) => (
                  <col key={c.key} style={{ width: c.width }} />
                ))}
              </colgroup>

              <thead>
                <tr className="border-y border-line bg-canvas">
                  {equipmentInventory.columns.map((c) => (
                    <th
                      key={c.key}
                      className="px-[16px] py-[15px] text-left text-[13px] font-semibold leading-4 text-ink-soft"
                    >
                      {c.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c.key)}
                          className="flex items-center gap-[5px] transition-colors hover:text-brand"
                        >
                          {c.label}
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${
                              sort.key === c.key && sort.dir === 'desc' ? 'rotate-180' : ''
                            } ${sort.key === c.key ? 'text-brand' : ''}`}
                          />
                        </button>
                      ) : (
                        c.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-b border-line last:border-0">
                    <td className="px-[16px] py-[18px] text-[13px] leading-[18px] text-ink">{r.name}</td>
                    <td className="px-[16px] py-[18px] text-[13px] leading-[18px] text-ink">{r.category}</td>
                    <td className="px-[16px] py-[18px] text-[13px] leading-[18px] text-ink">{r.currentQty}</td>
                    <td className="px-[16px] py-[18px] text-[13px] leading-[18px] text-ink">{r.requiredQty}</td>
                    <td className="px-[16px] py-[18px]">
                      <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={equipmentInventory.columns.length}
                      className="px-[16px] py-[44px] text-center text-[13px] text-ink-muted"
                    >
                      No equipment match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {onToggle ? null : null}
    </section>
  )
}
