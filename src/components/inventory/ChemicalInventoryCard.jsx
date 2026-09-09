import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import IconToggle from '../ui/IconToggle'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { chemicalInventory, chemicalStatusFilterMap } from '../../data/mockData'
import { filterRowsByStp } from '../../utils/stpScope'

export default function ChemicalInventoryCard({ stpId }) {
  const [open, setOpen] = useState(true)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })

  const toggleSort = (key) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  const rows = useMemo(() => {
    const wanted = chemicalStatusFilterMap[filter]
    const q = query.trim().toLowerCase()

    const list = filterRowsByStp(chemicalInventory.rows, stpId).filter((r) => {
      const matchesStatus = !wanted || r.status === wanted
      const matchesQuery = !q || [r.name, r.category, r.status].some((f) => f.toLowerCase().includes(q))
      return matchesStatus && matchesQuery
    })

    if (!sort.key) return list
    return [...list].sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [filter, query, sort, stpId])

  return (
    <section className="flex min-w-0 flex-col rounded-[12px] border border-line bg-white">
      <div className="flex items-center justify-between p-[15px]">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">Chemical Inventory Status</h3>
        <IconToggle open={open} onClick={() => setOpen((v) => !v)} label="Toggle Chemical Inventory Status" />
      </div>

      {open && (
        <>
          <div className="flex items-center gap-[8px] px-[15px]">
            {chemicalInventory.filters.map((f) => (
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

          <div className="flex items-center justify-center gap-[12px] px-[15px] py-[15px]">
            <SearchInput value={query} onChange={setQuery} className="w-[268px]" />
            <ExportButton label="PDF" />
            <ExportButton label="CSV" />
          </div>

          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[560px] table-fixed border-collapse">
              <colgroup>
                {chemicalInventory.columns.map((c) => (
                  <col key={c.key} style={{ width: c.width }} />
                ))}
              </colgroup>

              <thead>
                <tr className="border-y border-line bg-[#F7F9FC]">
                  {chemicalInventory.columns.map((c) => (
                    <th key={c.key} className="px-[16px] py-[15px] text-left text-[13px] font-medium leading-4 text-ink-soft">
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
                    <td className="px-[16px] py-[18px] text-[13px] leading-[18px] text-ink">{r.daysLeft}</td>
                    <td className="px-[16px] py-[18px]">
                      <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={chemicalInventory.columns.length} className="px-[16px] py-[44px] text-center text-[13px] text-ink-muted">
                      No chemicals match this filter.
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
