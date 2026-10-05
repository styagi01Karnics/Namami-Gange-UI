import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ExportButton from '../ui/ExportButton'
import IconToggle from '../ui/IconToggle'
import SearchInput from '../ui/SearchInput'
import Select from '../ui/Select'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { useTableExport } from '../export/useTableExport'
import { chemicalStatusFilterMap, equipmentInventory } from '../../data/mockData'

type EquipmentInventoryCardProps = {
  open?: boolean
  onToggle?: () => void
}

const STATUS_OPTIONS = [
  { id: 'All', label: 'All Status' },
  { id: 'Adequate', label: 'Adequate' },
  { id: 'Low Stock', label: 'Low Stock' },
  { id: 'Out of Stock', label: 'Out of Stock' },
]

export default function EquipmentInventoryCard({
  open = true,
  onToggle,
}: EquipmentInventoryCardProps) {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: string | null; dir: 'asc' | 'desc' }>({
    key: null,
    dir: 'asc',
  })
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Equipment Status',
    fileName: 'equipment-inventory',
    columns: equipmentInventory.columns,
  })

  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )

  const rows = useMemo(() => {
    const wanted = chemicalStatusFilterMap[filter as keyof typeof chemicalStatusFilterMap]
    const q = query.trim().toLowerCase()

    const list = equipmentInventory.rows.filter((r) => {
      const matchesStatus = !wanted || r.status === wanted
      const matchesQuery = !q || [r.name, r.category, r.status].some((f) => f.toLowerCase().includes(q))
      return matchesStatus && matchesQuery
    })

    if (!sort.key) return list
    const sortKey = sort.key as keyof (typeof equipmentInventory.rows)[number]
    return [...list].sort((a, b) => {
      const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [filter, query, sort])

  return (
    <section
      className={`flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-[#C7DDFB] bg-white/80 ${
        open ? 'h-0 min-h-full' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-[12px] px-[15px] py-[20px]">
        <h3 className="text-[14px] font-semibold leading-[22px] text-[#07121E]">Equipment Status</h3>
        {onToggle ? (
          <IconToggle open={open} onClick={onToggle} label="Toggle Equipment Status" />
        ) : null}
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

          <div className="scroll-thin table-scroll min-h-0 flex-1">
            <table className="w-full min-w-[560px] table-fixed border-collapse">
              <colgroup>
                {equipmentInventory.columns.map((c) => (
                  <col key={c.key} style={{ width: c.width }} />
                ))}
              </colgroup>

              <thead>
                <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF]">
                  {equipmentInventory.columns.map((c) => (
                    <th
                      key={c.key}
                      className="px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636]"
                    >
                      {c.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c.key)}
                          className="flex items-center gap-[5px] transition-colors hover:text-[#0768D2]"
                        >
                          {c.label}
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${
                              sort.key === c.key && sort.dir === 'desc' ? 'rotate-180' : ''
                            } ${sort.key === c.key ? 'text-[#0768D2]' : ''}`}
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
                {rows.map((r, index) => (
                  <tr
                    key={r.name}
                    className={`border border-[#D8EDFF] ${index % 2 === 1 ? 'bg-[rgba(248,248,248,0.9)]' : 'bg-white'}`}
                  >
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">{r.name}</td>
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">{r.category}</td>
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">{r.currentQty}</td>
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">{r.requiredQty}</td>
                    <td className="px-[16px] py-[18px]">
                      <StatusPill
                        tone={statusTone(r.status)}
                        className="h-[32px] min-w-[100px] justify-center px-[8px] text-[14px] leading-4"
                      >
                        {r.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={equipmentInventory.columns.length}
                      className="px-[16px] py-[44px] text-center text-[14px] text-[#646464]"
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
    </section>
  )
}
