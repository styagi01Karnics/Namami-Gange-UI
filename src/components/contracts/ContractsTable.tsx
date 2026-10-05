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
    <div className="overflow-hidden rounded-[10px] border border-[#C7DDFB] bg-white/80">
      <div className="flex items-center justify-end gap-[12px] p-[15px]">
        <SearchInput value={query} onChange={setQuery} className="w-[350px]" />
        <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
        <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
      </div>
      {printNode}

      <div className="scroll-thin table-scroll">
        <table className="w-full min-w-[940px] table-fixed border-collapse">
          <colgroup>
            {contractColumns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-[1]">
            <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF]">
              {contractColumns.map((c) => (
                <th
                  key={c.key}
                  className={`bg-[#EFF7FF] px-[16px] py-[16px] text-[14px] font-semibold leading-[22px] text-[#363636] ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
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
            {rows.map((c, index) => {
              const isOpen = expanded === c.id
              return (
                <Fragment key={c.id}>
                  <tr
                    className={`border border-[#D8EDFF] ${
                      index % 2 === 1 ? 'bg-[rgba(248,248,248,0.9)]' : 'bg-white'
                    }`}
                  >
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {c.sno}
                    </td>
                    <td className="px-[16px] py-[18px]">
                      <button
                        type="button"
                        className="text-[14px] font-semibold leading-[22px] text-[#ED7831] hover:underline"
                      >
                        {c.id}
                      </button>
                    </td>
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {c.name}
                    </td>
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {c.vendor}
                    </td>
                    <td className="px-[16px] py-[18px]">
                      <StatusPill
                        tone={statusTone(c.status)}
                        className="h-[32px] min-w-[88px] justify-center px-[8px] text-[14px] leading-4"
                      >
                        {c.status}
                      </StatusPill>
                    </td>
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {c.startDate} -<br />
                      {c.endDate}
                    </td>
                    <td className="px-[16px] py-[18px] text-right">
                      <div className="inline-flex items-center gap-[8px]">
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : c.id)}
                          aria-label={`${isOpen ? 'Hide' : 'Show'} details for ${c.id}`}
                          aria-expanded={isOpen}
                          className="inline-flex items-center justify-center rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#D7EDFF] p-[6px] text-[#0768D2] transition-opacity hover:opacity-90"
                        >
                          <ChevronDown
                            size={20}
                            strokeWidth={2}
                            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
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
                          className="inline-flex items-center justify-center rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#D7EDFF] p-[6px] text-[#0768D2] transition-opacity hover:opacity-90"
                        >
                          <DownloadIcon size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="border border-[#D8EDFF]">
                      <td colSpan={contractColumns.length} className="px-[16px] pb-[18px] pt-[16px]">
                        <ContractDetailPanel groups={c.detail} description={c.description} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={contractColumns.length}
                  className="px-[16px] py-[48px] text-center text-[14px] text-[#646464]"
                >
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
