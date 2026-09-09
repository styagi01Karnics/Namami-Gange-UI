import { Fragment, useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import Select from '../ui/Select'
import StatusPill, { statusTone } from '../ui/StatusPill'
import ViolationDetailPanel from './ViolationDetailPanel'
import {
  complianceBasisOptions,
  complianceParameters,
  violationColumns,
  violations,
} from '../../data/mockData'
import { filterRowsByStp } from '../../utils/stpScope'

export default function ViolationsTable({ stpId }) {
  const [query, setQuery] = useState('')
  const [basis, setBasis] = useState(complianceBasisOptions[0])
  const [parameter, setParameter] = useState(complianceParameters[0])
  const [sortDir, setSortDir] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const wantedType = basis.replace('Based On ', '')

    const list = filterRowsByStp(violations, stpId).filter((v) => {
      const matchesBasis = v.type === wantedType
      const matchesParam = v.parameter === parameter
      const matchesQuery =
        !q || [v.id, v.type, v.parameter, v.location, v.status].some((f) => f.toLowerCase().includes(q))
      return matchesBasis && matchesParam && matchesQuery
    })

    if (!sortDir) return list
    return [...list].sort((a, b) =>
      sortDir === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status),
    )
  }, [query, basis, parameter, sortDir, stpId])

  useEffect(() => {
    setExpanded(filterRowsByStp(violations, stpId)[0]?.id ?? null)
  }, [stpId])

  return (
    <div className="rounded-[12px] border border-line bg-white">
      <div className="flex flex-wrap items-center justify-end gap-[12px] p-[15px]">
        <SearchInput value={query} onChange={setQuery} className="w-[268px]" />
        <Select
          options={complianceBasisOptions}
          value={basis}
          onChange={setBasis}
          className="w-[234px]"
          buttonClassName="h-[34px]"
          align="right"
        />
        <ExportButton label="PDF" />
        <ExportButton label="CSV" />
      </div>

      <div className="flex flex-wrap items-center gap-[4px] px-[15px] pb-[15px]">
        {complianceParameters.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setParameter(p)}
            className={`rounded-[8px] px-[13px] py-[7px] text-[12.5px] font-medium leading-4 transition-colors ${
              parameter === p ? 'bg-brand text-white' : 'text-ink hover:bg-brand-soft'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed border-collapse">
          <colgroup>
            {violationColumns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-y border-line bg-[#F7F9FC]">
              {violationColumns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[16px] py-[15px] text-[13px] font-medium leading-4 text-ink-soft ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => setSortDir((v) => (v === 'asc' ? 'desc' : 'asc'))}
                      className="flex items-center gap-[5px] transition-colors hover:text-brand"
                    >
                      {c.label}
                      <ChevronDown size={14} className={`transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    c.label
                  )}
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
                        <ArrowUpRight size={12} strokeWidth={2.6} />
                        {v.exceedance}
                      </span>
                    </td>
                    <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.location}</td>
                    <td className="px-[16px] py-[15px] text-[13px] font-medium leading-[18px] text-orange">{v.downtime}</td>
                    <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.detectedOn}</td>
                    <td className="px-[16px] py-[15px]">
                      <StatusPill tone={statusTone(v.status)}>{v.status}</StatusPill>
                    </td>
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
                      <td colSpan={violationColumns.length} className="px-[16px] pb-[18px] pt-[4px]">
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
                  No violations for {parameter} under &ldquo;{basis}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
