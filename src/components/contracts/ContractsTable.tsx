import { Fragment, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ico } from '../ui/Ico'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { useTableExport } from '../export/useTableExport'
import ContractDetailPanel from './ContractDetailPanel'
import { contractColumns, contracts } from '../../data/mockData'

const DownloadIcon = ico('fluent:arrow-download-16-filled')

const contractValue = (row, col) => {
  if (col.key === 'duration') return `${row.startDate} - ${row.endDate}`
  return undefined
}

export default function ContractsTable() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [expanded, setExpanded] = useState(contracts[0]?.id ?? null)
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Contracts',
    fileName: 'contracts',
    columns: contractColumns,
    getValue: contractValue,
  })

  const toggleSort = (key) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = contracts.filter(
      (c) =>
        !q ||
        [c.id, c.name, c.vendor, c.status].some((field) => field.toLowerCase().includes(q)),
    )

    if (!sort.key) return list
    return [...list].sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [query, sort])

  return (
    <div className="rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex items-center justify-end gap-[14px] p-[15px]">
        <SearchInput value={query} onChange={setQuery} className="w-[390px]" />
        <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
        <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
      </div>
      {printNode}

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[940px] table-fixed border-collapse">
          <colgroup>
            {contractColumns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-y border-line bg-canvas">
              {contractColumns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[18px] py-[15px] text-[13px] font-semibold leading-4 text-ink-soft ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
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
            {rows.map((c) => {
              const isOpen = expanded === c.id
              return (
                <Fragment key={c.id}>
                  <tr className="border-b border-line">
                    <td className="px-[18px] py-[16px] text-[13px] leading-[18px] text-ink">{c.sno}</td>
                    <td className="px-[18px] py-[16px]">
                      <button type="button" className="text-[13px] font-semibold leading-[18px] text-orange hover:underline">
                        {c.id}
                      </button>
                    </td>
                    <td className="px-[18px] py-[16px] text-[13px] leading-[18px] text-ink">{c.name}</td>
                    <td className="px-[18px] py-[16px] text-[13px] leading-[18px] text-ink">{c.vendor}</td>
                    <td className="px-[18px] py-[16px]">
                      <StatusPill tone={statusTone(c.status)}>{c.status}</StatusPill>
                    </td>
                    <td className="px-[18px] py-[16px] text-[13px] leading-[20px] text-ink">
                      {c.startDate} -<br />
                      {c.endDate}
                    </td>
                    <td className="px-[18px] py-[16px] text-right">
                      <div className="inline-flex items-center gap-[8px]">
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : c.id)}
                          aria-label={`${isOpen ? 'Hide' : 'Show'} details for ${c.id}`}
                          aria-expanded={isOpen}
                          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-line bg-[#F5F7FA] text-[#5B6B7F] transition-colors hover:border-brand hover:text-brand"
                        >
                          <ChevronDown size={17} strokeWidth={2.1} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                          <button
                          type="button"
                          onClick={() =>
                            exportPdf(
                              [c],
                              <div className="mt-[18px]">
                                <ContractDetailPanel groups={c.detail} description={c.description} />
                              </div>,
                            )
                          }
                          aria-label={`Download ${c.id}`}
                          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#BFD8F8] bg-white text-brand transition-colors hover:bg-brand-soft"
                        >
                          <DownloadIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="border-b border-line">
                      <td colSpan={contractColumns.length} className="px-[18px] pb-[18px] pt-[16px]">
                        <ContractDetailPanel groups={c.detail} description={c.description} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={contractColumns.length} className="px-[18px] py-[48px] text-center text-[13px] text-ink-muted">
                  No contracts match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
