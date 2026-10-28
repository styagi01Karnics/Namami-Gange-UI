import { useMemo, useState } from 'react'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import { useTableExport } from '../export/useTableExport'
import {
  monthlyViolationColumns,
  monthlyViolations,
  PLANT_METADATA,
  type StpMonthlyViolation,
  type StpViolationParameter,
} from '../../data/mockData'
import { defaultOccurrencesRange, type ViolationListItem } from '../../api/penalty'
import { toPenaltyRangeFromLabel } from '../ui/DateRangeField'
import { formatParameterName } from '../../lib/parameters'
import ViolationTableQr from './ViolationTableQr'

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

/** Safe download stem: dropdown label + current timestamp. */
export function complianceExportFileName(selectionLabel: string, now = new Date()) {
  const stamp = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}_${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`
  const label = String(selectionLabel || 'Non_Complying_STPs')
    .replace(/[<>:"/\\|?*]+/g, '')
    .trim()
    .replace(/\s+/g, '_')
  return `${label}_${stamp}`
}

function parseCapacityFromText(name: string): string | number {
  const match = name.match(/(\d+(?:\.\d+)?)\s*MLD/i)
  return match ? Number(match[1]) : '—'
}

function resolvePlantMeta(nameOrCode: string) {
  const clean = String(nameOrCode || '').toLowerCase().trim()
  for (const [key, meta] of Object.entries(PLANT_METADATA)) {
    if (
      clean.includes(key.toLowerCase()) ||
      meta.name.toLowerCase().includes(clean) ||
      clean.includes(meta.name.toLowerCase())
    ) {
      return meta
    }
  }

  // Fallbacks by city/district keywords
  let district = 'Haridwar'
  if (clean.includes('dehradun') || clean.includes('rishikesh') || clean.includes('moth')) {
    district = 'Dehradun'
  } else if (clean.includes('gangotri') || clean.includes('uttarkashi')) {
    district = 'Uttarkashi'
  } else if (clean.includes('tapovan') || clean.includes('tehri') || clean.includes('devprayag')) {
    district = 'Tehri Garhwal'
  } else if (clean.includes('haldwani') || clean.includes('nainital')) {
    district = 'Nainital'
  } else if (clean.includes('kashipur') || clean.includes('bazpur')) {
    district = 'Udham Singh Nagar'
  }

  const omDepartment = clean.includes('ujs') || clean.includes('sansthan')
    ? 'Uttarakhand Jal Sansthan'
    : 'Uttarakhand Peyjal Nigam'

  return {
    name: nameOrCode,
    capacity: parseCapacityFromText(nameOrCode),
    district,
    omDepartment,
  }
}

/**
 * Normalizes incoming data into StpMonthlyViolation rows.
 * If raw individual parameter breach items are passed, groups them by STP + Date
 * into a single row containing all exceeded parameters for that day.
 */
export function normalizeViolations(
  incoming: Array<StpMonthlyViolation | ViolationListItem> | undefined,
  plantCode?: string,
): StpMonthlyViolation[] {
  if (incoming === undefined) {
    if (!plantCode) return monthlyViolations
    return monthlyViolations.filter(
      (v) =>
        v.plantCode === plantCode ||
        (v.stpName && v.stpName.toLowerCase().includes(plantCode.toLowerCase())),
    )
  }

  if (incoming.length === 0) {
    return []
  }

  // Check if first item is already a monthly violation with parameters array
  const first = incoming[0] as StpMonthlyViolation
  if (first && Array.isArray(first.parameters)) {
    const list = incoming as StpMonthlyViolation[]
    const filtered = plantCode
      ? list.filter(
          (v) =>
            v.plantCode === plantCode ||
            (v.stpName && v.stpName.toLowerCase().includes(plantCode.toLowerCase())),
        )
      : list
    return filtered.map((v, i) => ({
      ...v,
      sn: i + 1,
    }))
  }

  // Otherwise, group raw ViolationListItem entries by STP + Date
  const rawList = incoming as ViolationListItem[]
  const groups = new Map<string, {
    stpName: string
    plantCode?: string
    date: string
    parameters: StpViolationParameter[]
    timeSlots: string[]
    totalPenaltySum: number
  }>()

  for (const item of rawList) {
    const pCode = item.stpCode
    if (plantCode && pCode && pCode.toLowerCase() !== plantCode.toLowerCase()) {
      continue
    }
    const plantName = item.stp || item.stpCode || 'Unknown STP'
    // Extract date from detectedOn "15/02/2026 ,10:30 AM"
    const datePart = (item.detectedOn ?? '').split(',')[0]?.trim() || '03/10/2026'
    const key = `${plantName}::${datePart}`

    const observedStr = item.summary?.find((s) => /current|exceed/i.test(s.label))?.value || '—'
    const idealStr = item.summary?.find((s) => /ideal|range/i.test(s.label))?.value || '0 – 50'

    const paramObj: StpViolationParameter = {
      name: item.parameter || 'Parameter',
      observedValue: observedStr,
      range: idealStr,
    }

    const penaltyNum = Number(item.penalty?.total?.replace(/[₹,\s]/g, '') ?? '0')

    const existing = groups.get(key)
    if (existing) {
      // Avoid duplicate parameter entry for the exact same occurrence
      if (!existing.parameters.some((p) => p.name === paramObj.name)) {
        existing.parameters.push(paramObj)
      }
      if (item.downtime && !existing.timeSlots.includes(item.downtime)) {
        existing.timeSlots.push(item.downtime)
      }
      if (Number.isFinite(penaltyNum)) {
        existing.totalPenaltySum += penaltyNum
      }
    } else {
      groups.set(key, {
        stpName: plantName,
        plantCode: item.stpCode,
        date: datePart,
        parameters: [paramObj],
        timeSlots: item.downtime ? [item.downtime] : [],
        totalPenaltySum: Number.isFinite(penaltyNum) ? penaltyNum : 0,
      })
    }
  }

  let index = 1
  const result: StpMonthlyViolation[] = []
  for (const [key, group] of groups.entries()) {
    const meta = resolvePlantMeta(group.stpName)
    result.push({
      id: `GROUPED-${key}`,
      sn: index++,
      date: group.date,
      stpName: meta.name || group.stpName,
      plantCode: group.plantCode,
      capacity: meta.capacity,
      district: meta.district,
      omDepartment: meta.omDepartment,
      parameters: group.parameters,
      nonComplianceTime: group.timeSlots.length > 0 ? group.timeSlots.join(', ') : '12:15 PM',
      totalPenalty: group.totalPenaltySum > 0 ? `₹${group.totalPenaltySum.toLocaleString('en-IN')}` : undefined,
    })
  }

  return result
}

/** Search across the visible columns; empty query returns all rows. */
export function filterViolationRows(rows: StpMonthlyViolation[], query: string): StpMonthlyViolation[] {
  const q = query.trim().toLowerCase()
  if (!q) return rows

  return rows.filter((v) => {
    const inStp = String(v.stpName ?? '').toLowerCase().includes(q)
    const inDistrict = String(v.district ?? '').toLowerCase().includes(q)
    const inDept = String(v.omDepartment ?? '').toLowerCase().includes(q)
    const inCapacity = String(v.capacity ?? '').toLowerCase().includes(q)
    const inDate = String(v.date ?? '').toLowerCase().includes(q)
    const inTime = String(v.nonComplianceTime ?? '').toLowerCase().includes(q)
    const inParams = v.parameters?.some((p) =>
      `${p.name} ${p.observedValue} ${p.range}`.toLowerCase().includes(q),
    )
    return inStp || inDistrict || inDept || inCapacity || inDate || inTime || inParams
  })
}

export default function ViolationsTable({
  rows: incomingRows,
  loading = false,
  exportLabel = 'Non_Complying_STPs',
  stpManagementPdf = false,
  plantCode,
  dateRangeLabel,
}: {
  rows?: Array<StpMonthlyViolation | ViolationListItem>
  loading?: boolean
  source?: 'api' | 'mock'
  showDetails?: boolean
  showStpColumn?: boolean
  /** STP dropdown / plant label used in PDF/CSV filename. */
  exportLabel?: string
  stpManagementPdf?: boolean
  plantCode?: string
  /** Date-range field label (From – To); drives the API window the QR report reloads. */
  dateRangeLabel?: string
} = {}) {
  const [query, setQuery] = useState('')

  const baseRows = useMemo(() => normalizeViolations(incomingRows, plantCode), [incomingRows, plantCode])

  const filteredRows = useMemo(() => filterViolationRows(baseRows, query), [query, baseRows])

  const [qrOpen, setQrOpen] = useState(false)
  const reportRange = useMemo(
    () => (dateRangeLabel ? toPenaltyRangeFromLabel(dateRangeLabel) : null) ?? defaultOccurrencesRange(),
    [dateRangeLabel],
  )
  const reportLink = useMemo(
    () => ({
      plantCode: plantCode ?? '',
      from: reportRange.from,
      to: reportRange.to,
      query,
      title: exportLabel,
    }),
    [plantCode, reportRange, query, exportLabel],
  )

  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Ganga Pulse Portal - Non-Complying STPs Report',
    fileName: () => complianceExportFileName(exportLabel),
    columns: monthlyViolationColumns,
    getValue: (row, col) => {
      const v = row as StpMonthlyViolation
      if (col.key === 'sn') {
        const idx = filteredRows.indexOf(v)
        return idx >= 0 ? idx + 1 : 1
      }
      if (col.key === 'parameters') {
        return v.parameters?.map((p) => `${p.name}: ${p.observedValue}`).join(', ') || '—'
      }
      if (col.key === 'range') {
        return v.parameters?.map((p) => p.range).join(', ') || '—'
      }
      if (col.key === 'range') {
        return (
          <div className="flex flex-col gap-[3px]">
            {v.parameters?.map((p, i) => (
              <span key={i} className="text-[#374151]">
                {p.range}
              </span>
            ))}
          </div>
        )
      }
      if (col.key === 'date') {
        return <span className="font-semibold text-[#0768D2]">{v.date || '—'}</span>
      }
      if (col.key === 'nonComplianceTime') {
        return <span>{v.nonComplianceTime || '—'}</span>
      }
      return undefined
    },
  })

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#C7DDFB] bg-white/80">
      {/* Top Header: Count + Search + Export actions (parameter selector removed as requested) */}
      <div className="flex flex-wrap items-center justify-between gap-[16px] p-[16px]">
        <div className="flex items-center gap-[12px]">
          <h3 className="text-[15px] font-semibold text-[#07121E]">
            {plantCode
              ? `Non-complying Parameters (${filteredRows.length})`
              : `Non-complying STPs (${filteredRows.length})`}
          </h3>
        </div>
        <div className="flex items-center gap-[12px]">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={
              plantCode
                ? 'Search parameter, date, range...'
                : 'Search STP, district, parameter...'
            }
            className="w-[320px]"
          />
          <ExportButton label="PDF" onClick={() => exportPdf(filteredRows)} />
          <ExportButton label="CSV" onClick={() => exportCsv(filteredRows)} />
          {plantCode && (
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              aria-label="Show QR code for this table"
              title="Show QR code for this table"
              className="flex h-[34px] shrink-0 items-center rounded-[8px] border border-[#BFD8F8] bg-white px-[11px] text-[13px] font-semibold text-brand transition-colors hover:bg-brand-soft"
            >
              QR code
            </button>
          )}
        </div>
      </div>
      {printNode}
      {qrOpen && (
        <ViolationTableQr
          rows={filteredRows}
          reportLink={reportLink}
          title={exportLabel}
          fileName={complianceExportFileName(`QR_${exportLabel}`)}
          onClose={() => setQrOpen(false)}
        />
      )}

      <div className="scroll-thin table-scroll">
        <table className="w-full min-w-[1060px] table-fixed border-collapse">
          <colgroup>
            {monthlyViolationColumns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-[1]">
            <tr className="border-y border-[#D8EDFF] bg-[#EFF7FF]">
              {monthlyViolationColumns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[16px] py-[16px] text-left text-[14px] font-semibold leading-[22px] text-[#363636] ${
                    c.key === 'date' || c.key === 'nonComplianceTime' ? 'whitespace-nowrap' : ''
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
                <td
                  colSpan={monthlyViolationColumns.length}
                  className="px-[16px] py-[48px] text-center text-[14px] text-[#646464]"
                >
                  Loading violations…
                </td>
              </tr>
            )}

            {!loading &&
              filteredRows.map((v, index) => {
                return (
                  <tr
                    key={v.id || index}
                    className={`border border-[#D8EDFF] transition-colors hover:bg-[#F3F8FF] ${
                      index % 2 === 1 ? 'bg-[rgba(248,248,248,0.9)]' : 'bg-white'
                    }`}
                  >
                    {/* S/N */}
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {index + 1}
                    </td>

                    {/* Name of STP */}
                    <td className="px-[16px] py-[18px] text-[14px] font-semibold leading-[22px] text-[#07121E]">
                      {v.stpName}
                    </td>

                    {/* Capacity (MLD) */}
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {v.capacity}
                    </td>

                    {/* District */}
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {v.district}
                    </td>

                    {/* O&M department */}
                    <td className="px-[16px] py-[18px] text-[14px] font-medium leading-[22px] text-[#07121E]">
                      {v.omDepartment}
                    </td>

                    {/* Non-complying parameters */}
                    <td className="px-[16px] py-[18px]">
                      <div className="flex flex-col gap-[6px]">
                        {v.parameters.map((p, i) => (
                          <div
                            key={i}
                            className="text-[13.5px] font-bold leading-[22px] text-[#07121E]"
                          >
                            <span>{formatParameterName(p.name)}: </span>
                            <span className="text-[#DC2626] font-bold">{p.observedValue}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Range */}
                    <td className="px-[16px] py-[18px]">
                      <div className="flex flex-col gap-[6px]">
                        {v.parameters.map((p, i) => (
                          <div
                            key={i}
                            className="text-[13.5px] font-normal leading-[22px] text-[#363636]"
                          >
                            {p.range}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-[16px] py-[18px] text-[13px] font-semibold leading-[20px] text-[#0768D2] whitespace-nowrap">
                      {v.date || '—'}
                    </td>

                    {/* Non-compliance time */}
                    <td className="px-[16px] py-[18px] text-[13px] font-medium leading-[20px] text-[#07121E] whitespace-nowrap">
                      {v.nonComplianceTime || '—'}
                    </td>
                  </tr>
                )
              })}

            {!loading && filteredRows.length === 0 && (
              <tr>
                <td
                  colSpan={monthlyViolationColumns.length}
                  className="px-[16px] py-[48px] text-center text-[14px] text-[#646464]"
                >
                  No violations found{query ? ` matching "${query}"` : plantCode ? ' for this STP' : ' for last month'}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
