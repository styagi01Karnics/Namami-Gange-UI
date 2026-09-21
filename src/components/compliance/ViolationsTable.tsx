import { Fragment, useEffect, useMemo, useState } from 'react'
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
  violations as mockViolations,
} from '../../data/mockData'
import type { ViolationListItem } from '../../api/penalty'

const ArrowOutIcon = ico('fluent:arrow-up-right-24-filled')
const ALL_PARAMETERS = 'All'
const STP_COLUMN = { key: 'stp', label: 'STP', width: '18%' } as const

/** Data Reports → Compliance PDF columns. */
const REPORT_PDF_COLUMNS = [
  { key: 'stp', label: 'STP' },
  { key: 'type', label: 'Type' },
  { key: 'parameter', label: 'Parameter' },
  { key: 'location', label: 'Location' },
  { key: 'downtime', label: 'Downtime Duration' },
  { key: 'penaltyAmount', label: 'Penalty' },
]

/** STP Management → Compliance PDF columns. */
const STP_PDF_COLUMNS = [
  { key: 'detectedOn', label: 'Timestamp' },
  { key: 'type', label: 'Type' },
  { key: 'parameter', label: 'Parameter' },
  { key: 'location', label: 'Location' },
  { key: 'downtime', label: 'Downtime' },
  { key: 'penaltyAmount', label: 'Penalty' },
]

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

/** Safe download stem: dropdown label + current timestamp. */
export function complianceExportFileName(selectionLabel: string, now = new Date()) {
  const stamp = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}_${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`
  const label = String(selectionLabel || 'Compliance')
    .replace(/[<>:"/\\|?*]+/g, '')
    .trim()
    .replace(/\s+/g, ' ')
  return `${label}_${stamp}`
}

function renderCompliancePdfCell(
  row: ViolationListItem,
  col: { key: string },
  options?: { boldTimestamp?: boolean },
) {
  if (col.key === 'stp') {
    return <span className="font-bold text-[#1F2A37]">{row.stp || '—'}</span>
  }
  if (col.key === 'detectedOn') {
    const value = row.detectedOn || '—'
    return options?.boldTimestamp ? <span className="font-bold text-[#1F2A37]">{value}</span> : value
  }
  if (col.key === 'parameter') {
    return (
      <span className="inline-flex flex-col items-start gap-[4px]">
        <span className="inline-flex rounded-[6px] bg-[#E6F4FE] px-[8px] py-[2px] text-[11px] font-semibold leading-4 text-[#0768D2]">
          {row.parameter}
        </span>
        {row.exceedance && row.exceedance !== '—' && (
          <span className="inline-flex items-center gap-[2px] rounded-[6px] bg-[#FDECEE] px-[7px] py-[2px] text-[10.5px] font-semibold leading-4 text-[#E5484D]">
            <ArrowOutIcon size={11} />
            {row.exceedance}
          </span>
        )}
      </span>
    )
  }
  if (col.key === 'penaltyAmount') {
    const amount = row.penalty?.total && row.penalty.total !== '—' ? row.penalty.total : '—'
    return (
      <span
        className="font-bold text-[#F5B417]"
        style={{ color: '#F5B417', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        {amount}
      </span>
    )
  }
  return undefined
}

export default function ViolationsTable({
  rows: incomingRows,
  loading = false,
  source = 'mock',
  showDetails = true,
  showStpColumn = false,
  exportLabel,
  /** STP Management → Compliance only: Timestamp-first PDF + plant letterhead. */
  stpManagementPdf = false,
}: {
  rows?: ViolationListItem[]
  loading?: boolean
  source?: 'api' | 'mock'
  showDetails?: boolean
  /** Data Reports → Compliance: first column from plants API plantName via stp_code. */
  showStpColumn?: boolean
  /** STP dropdown / plant label used in PDF/CSV filename. */
  exportLabel?: string
  stpManagementPdf?: boolean
} = {}) {
  const sourceRows = incomingRows ?? (mockViolations as unknown as ViolationListItem[])
  const [query, setQuery] = useState('')
  const [type, setType] = useState(complianceTypes[0])
  const [parameter, setParameter] = useState(source === 'api' ? ALL_PARAMETERS : complianceParameters[0])
  const [expanded, setExpanded] = useState<string | null>(null)
  const columns = useMemo(() => {
    const base = showDetails ? violationColumns : violationColumns.filter((c) => c.key !== 'details')
    return showStpColumn ? [STP_COLUMN, ...base] : base
  }, [showDetails, showStpColumn])

  // Report PDF (STP column) vs STP Management PDF (Timestamp-first) — mutually exclusive.
  const exportColumns = stpManagementPdf
    ? STP_PDF_COLUMNS
    : showStpColumn
      ? REPORT_PDF_COLUMNS
      : columns
  const useStyledCompliancePdf = stpManagementPdf || showStpColumn
  const { exportPdf, exportCsv, printNode } = useTableExport({
    // STP Management letterhead: plant name; Data Reports keeps "Compliance Report".
    title: stpManagementPdf && exportLabel ? exportLabel : 'Compliance Report',
    fileName: () =>
      useStyledCompliancePdf && exportLabel ? complianceExportFileName(exportLabel) : 'violations',
    columns: exportColumns,
    getValue: (row, col) => {
      if (col.key === 'parameter') {
        return row.exceedance && row.exceedance !== '—'
          ? `${row.parameter} (${row.exceedance})`
          : row.parameter
      }
      if (col.key === 'penaltyAmount') {
        return row.penalty?.total && row.penalty.total !== '—' ? row.penalty.total : '—'
      }
      if (col.key === 'stp') return row.stp || exportLabel || '—'
      if (col.key === 'detectedOn') return row.detectedOn || '—'
      return undefined
    },
    renderPdfCell: useStyledCompliancePdf
      ? (row, col) =>
          renderCompliancePdfCell(
            { ...row, stp: row.stp || exportLabel || '—' },
            col,
            { boldTimestamp: stpManagementPdf },
          )
      : undefined,
    // Location badge in letterhead — STP Management Compliance only.
    resolveBadge: stpManagementPdf
      ? (exportRows) => {
          const location = exportRows.find((row) => row.location)?.location
          if (!location) return { badge: null }
          const tone = /influent|inlet/i.test(String(location)) ? 'brand' : 'ok'
          return { badge: String(location), badgeTone: tone }
        }
      : undefined,
  })

  const parameterOptions = useMemo(() => {
    if (source !== 'api') return complianceParameters
    const unique = Array.from(new Set(sourceRows.map((row) => row.parameter).filter(Boolean))).sort()
    return [ALL_PARAMETERS, ...unique]
  }, [source, sourceRows])

  useEffect(() => {
    if (!parameterOptions.includes(parameter)) {
      setParameter(parameterOptions[0] ?? ALL_PARAMETERS)
    }
  }, [parameter, parameterOptions])

  useEffect(() => {
    setExpanded(null)
  }, [sourceRows])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()

    return sourceRows.filter((v) => {
      const matchesType = source === 'api' ? (v.typeGroup ?? v.type) === type : v.type === type
      const matchesParam =
        parameter === ALL_PARAMETERS || v.parameter === parameter || v.parameter?.toLowerCase() === parameter.toLowerCase()
      const matchesQuery =
        !q ||
        [v.stp, v.id, v.type, v.parameter, v.location, v.detectedOn].some((f) =>
          String(f ?? '')
            .toLowerCase()
            .includes(q),
        )
      return matchesType && matchesParam && matchesQuery
    })
  }, [query, type, parameter, sourceRows, source])

  return (
    <div className="rounded-[12px] border border-line bg-white shadow-card">
      <div className="flex flex-wrap items-center gap-[12px] p-[15px]">
        <GroupedTabs tabs={complianceTypes} active={type} onChange={setType} />
        <div className="ml-auto flex flex-wrap items-center justify-end gap-[12px]">
          <SearchInput value={query} onChange={setQuery} className="w-[268px]" />
          <Select
            options={parameterOptions}
            value={parameter}
            onChange={setParameter}
            className="w-[160px]"
            buttonClassName="h-[34px]"
            align="right"
          />
          <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
          <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
        </div>
      </div>
      {printNode}

      <div className="scroll-thin max-h-[560px] overflow-auto">
        <table className="w-full min-w-[980px] table-fixed border-collapse">
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-[1]">
            <tr className="border-y border-line bg-canvas">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[16px] py-[15px] text-[13px] font-semibold leading-4 text-ink-soft ${
                    'align' in c && c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-[16px] py-[48px] text-center text-[13px] text-ink-muted">
                  Loading violations…
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((v) => {
                const rowKey = `${v.stpCode || v.stp || 'stp'}::${v.id}`
                const isOpen = showDetails && expanded === rowKey
                return (
                  <Fragment key={rowKey}>
                    <tr className="border-b border-line">
                      {showStpColumn && (
                        <td
                          className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink"
                          title={String(v.stp || '').length > 21 ? String(v.stp) : undefined}
                        >
                          {String(v.stp || '').length > 21
                            ? `${String(v.stp).slice(0, 21)}...`
                            : v.stp || '—'}
                        </td>
                      )}
                      <td
                        className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink"
                        title={String(v.id).length > 10 ? String(v.id) : undefined}
                      >
                        {String(v.id).length > 10 ? `${String(v.id).slice(0, 10)}...` : v.id}
                      </td>
                      <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.type}</td>
                      <td className="px-[16px] py-[15px]">
                        <span className="inline-flex rounded-[6px] bg-brand-soft px-[9px] py-[3px] text-[12px] font-semibold leading-4 text-brand">
                          {v.parameter}
                        </span>
                        {v.exceedance && v.exceedance !== '—' && (
                          <span className="mt-[6px] flex w-fit items-center gap-[2px] rounded-[6px] bg-danger-soft px-[7px] py-[3px] text-[11.5px] font-semibold leading-4 text-danger">
                            <ArrowOutIcon size={12} />
                            {v.exceedance}
                          </span>
                        )}
                      </td>
                      <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.location}</td>
                      <td className="px-[16px] py-[15px]">
                        <div className="text-[13px] font-medium leading-[18px] text-orange">{v.downtime}</div>
                        {showStpColumn && v.penalty?.total && v.penalty.total !== '—' && (
                          <span className="mt-[6px] inline-flex rounded-[6px] bg-danger-soft px-[7px] py-[3px] text-[11.5px] font-semibold leading-4 text-danger">
                            Penalty : {v.penalty.total}
                          </span>
                        )}
                      </td>
                      <td className="px-[16px] py-[15px] text-[13px] leading-[18px] text-ink">{v.detectedOn}</td>
                      {showDetails && (
                        <td className="px-[16px] py-[15px] text-right">
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : rowKey)}
                            aria-label={`${isOpen ? 'Hide' : 'Show'} details for ${v.id}`}
                            aria-expanded={isOpen}
                            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-line bg-[#F5F7FA] text-[#5B6B7F] transition-colors hover:border-brand hover:text-brand"
                          >
                            <ChevronDown size={17} strokeWidth={2.1} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </td>
                      )}
                    </tr>

                    {isOpen && (
                      <tr className="border-b border-line">
                        <td colSpan={columns.length} className="px-[16px] pb-[18px] pt-[16px]">
                          <ViolationDetailPanel violation={v} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-[16px] py-[48px] text-center text-[13px] text-ink-muted">
                  No violations{parameter !== ALL_PARAMETERS ? ` for ${parameter}` : ''} under &ldquo;{type}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
