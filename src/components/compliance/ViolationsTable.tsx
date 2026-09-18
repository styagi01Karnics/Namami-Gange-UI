import { Fragment, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ico } from '../ui/Ico'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import Select from '../ui/Select'
import GroupedTabs from '../ui/GroupedTabs'
import { useTableExport } from '../export/useTableExport'
import ViolationDetailPanel from './ViolationDetailPanel'
import {
  complianceParameters,
  complianceTypes,
  violationColumns,
  violations,
} from '../../data/mockData'

const ArrowOutIcon = ico('fluent:arrow-up-right-24-filled')

export default function ViolationsTable() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState(complianceTypes[0])
  const [parameter, setParameter] = useState(complianceParameters[0])
  const [expanded, setExpanded] = useState(violations[0]?.id ?? null)
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Violations',
    fileName: 'violations',
    columns: violationColumns,
    getValue: (row, col) => (col.key === 'parameter' ? `${row.parameter} (${row.exceedance})` : undefined),
  })

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()

    const list = violations.filter((v) => {
      const matchesType = v.type === type
      const matchesParam = v.parameter === parameter
      const matchesQuery =
        !q || [v.id, v.type, v.parameter, v.location].some((f) => f.toLowerCase().includes(q))
      return matchesType && matchesParam && matchesQuery
    })

    return list
  }, [query, type, parameter])

  return (
    <div className="rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex flex-wrap items-center gap-[12px] p-[15px]">
        <GroupedTabs tabs={complianceTypes} active={type} onChange={setType} />
        <div className="ml-auto flex flex-wrap items-center justify-end gap-[12px]">
          <SearchInput value={query} onChange={setQuery} className="w-[268px]" />
          <Select
            options={complianceParameters}
            value={parameter}
            onChange={setParameter}
            className="w-[140px]"
            buttonClassName="h-[34px]"
            align="right"
          />
          <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
          <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
        </div>
      </div>
      {printNode}

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed border-collapse">
          <colgroup>
            {violationColumns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-y border-line bg-canvas">
              {violationColumns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[16px] py-[15px] text-[13px] font-semibold leading-4 text-ink-soft ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((v) => {
              const isOpen = expanded === v.id
              return (
                <Fragment key={v.id}>
                  <tr className="border-b border-line">
                    <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.id}</td>
                    <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.type}</td>
                    <td className="px-[16px] py-[15px]">
                      <span className="inline-flex rounded-[6px] bg-brand-soft px-[9px] py-[3px] text-[12px] font-semibold leading-4 text-brand">
                        {v.parameter}
                      </span>
                      <span className="mt-[6px] flex w-fit items-center gap-[2px] rounded-[6px] bg-danger-soft px-[7px] py-[3px] text-[11.5px] font-semibold leading-4 text-danger">
                        <ArrowOutIcon size={12} />
                        {v.exceedance}
                      </span>
                    </td>
                    <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.location}</td>
                    <td className="px-[16px] py-[15px] text-[13px] font-medium leading-[18px] text-orange">{v.downtime}</td>
                    <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.detectedOn}</td>
                    <td className="px-[16px] py-[15px] text-right">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : v.id)}
                        aria-label={`${isOpen ? 'Hide' : 'Show'} details for ${v.id}`}
                        aria-expanded={isOpen}
                        className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-line bg-[#F5F7FA] text-[#5B6B7F] transition-colors hover:border-brand hover:text-brand"
                      >
                        <ChevronDown size={17} strokeWidth={2.1} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="border-b border-line">
                      <td colSpan={violationColumns.length} className="px-[16px] pb-[18px] pt-[16px]">
                        <ViolationDetailPanel violation={v} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={violationColumns.length} className="px-[16px] py-[48px] text-center text-[13px] text-ink-muted">
                  No violations for {parameter} under &ldquo;{type}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
