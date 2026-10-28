import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTableExport } from '../components/export/useTableExport'
import ExportButton from '../components/ui/ExportButton'
import {
  complianceExportFileName,
  filterViolationRows,
  normalizeViolations,
} from '../components/compliance/ViolationsTable'
import { fetchPenaltyOccurrences } from '../api/penalty'
import { fetchDashboardPlants, toPlantNameByCode } from '../api/plants'
import { monthlyViolationColumns, monthlyViolations, type StpMonthlyViolation } from '../data/mockData'
import { formatParameterName } from '../lib/parameters'
import { parseViolationReportLink, parseViolationTablePayload, type ViolationReportLink, type ViolationReportMeta } from '../lib/violationTableQr'

type ReportState =
  | { status: 'loading' }
  | { status: 'invalid' }
  | { status: 'ready'; title: string; meta: ViolationReportMeta; rows: StpMonthlyViolation[] }

/** Re-loads the same rows the Violation tab shows (API first, then mock for this plant). */
async function loadReportRows(link: ViolationReportLink): Promise<StpMonthlyViolation[]> {
  const plants = await fetchDashboardPlants().catch(() => [])
  const plantNameByCode = toPlantNameByCode(plants)
  const plantName = link.title || plantNameByCode[link.plantCode]

  const apiRows = await fetchPenaltyOccurrences(
    link.plantCode,
    { from: link.from, to: link.to },
    { plantNameByCode, plantName },
  )

  const rows = apiRows.length
    ? normalizeViolations(apiRows, link.plantCode)
    : monthlyViolations.filter(
        (v) =>
          v.plantCode === link.plantCode ||
          (v.stpName &&
            (v.stpName.toLowerCase().includes(link.plantCode.toLowerCase()) ||
              (plantName && v.stpName.toLowerCase().includes(plantName.toLowerCase())))),
      )
  return filterViolationRows(rows, link.query)
}

export default function ViolationReport() {
  const [searchParams] = useSearchParams()
  const paramString = searchParams.toString()
  const [state, setState] = useState<ReportState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams(paramString)
    const encoded = params.get('d')
    const link = parseViolationReportLink(params)
    const run = async () => {
      if (encoded) {
        const data = await parseViolationTablePayload(encoded)
        if (!cancelled) setState(data ? { status: 'ready', ...data } : { status: 'invalid' })
        return
      }
      if (link) {
        setState({ status: 'loading' })
        const rows = await loadReportRows(link)
        if (!cancelled) setState({ status: 'ready', title: link.title, meta: link.meta, rows })
        return
      }
      if (!cancelled) setState({ status: 'invalid' })
    }
    run()
    return () => {
      cancelled = true
    }
    // Keyed on the query string so a new link always reloads.
  }, [paramString])

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[#EEF8FC] p-[16px] sm:p-[32px]">
      <div className="w-full max-w-[1100px] overflow-hidden rounded-[12px] border border-[#C7DDFB] bg-white shadow-sm">
        <div className="bg-[#0B3B6F] px-[20px] py-[14px] text-white">
          <p className="text-[12px] font-semibold uppercase tracking-wide opacity-80">Namami Gange</p>
          <h1 className="text-[18px] font-semibold">Non-complying Parameters Report</h1>
        </div>

        {state.status === 'loading' && (
          <div className="p-[24px] text-[14px] text-[#646464]">Loading report…</div>
        )}

        {state.status === 'invalid' && (
          <div className="p-[24px] text-[14px] text-[#646464]">
            This report link is invalid or incomplete. Please scan the QR code again.
          </div>
        )}

        {state.status === 'ready' && (
          <ViolationReportView title={state.title} meta={state.meta} rows={state.rows} />
        )}
      </div>
    </div>
  )
}

function ViolationReportView({
  title,
  meta,
  rows,
}: {
  title: string
  meta: ViolationReportMeta
  rows: StpMonthlyViolation[]
}) {
  const stpName = rows[0]?.stpName || title
  const metaOverride = useMemo(
    () => ({ rangeLabel: meta.rangeLabel || undefined, address: meta.address, badge: meta.badge, badgeTone: meta.badgeTone }),
    [meta],
  )
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Ganga Pulse Portal - Non-Complying STPs Report',
    fileName: () => complianceExportFileName(title),
    columns: monthlyViolationColumns,
    metaOverride,
    getValue: (row: StpMonthlyViolation, col) => {
      if (col.key === 'parameters') {
        return row.parameters.map((p) => `${formatParameterName(p.name)}: ${p.observedValue}`).join(', ') || '—'
      }
      if (col.key === 'range') {
        return row.parameters.map((p) => p.range).join(', ') || '—'
      }
      return undefined
    },
  })

  return (
    <div className="flex flex-col gap-[16px] p-[20px]">
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <h2 className="text-[15px] font-semibold text-[#07121E]">
          {stpName} — Non-complying Parameters ({rows.length})
        </h2>
        <div className="flex items-center gap-[10px]">
          <ExportButton label="PDF" onClick={() => exportPdf(rows)} />
          <ExportButton label="CSV" onClick={() => exportCsv(rows)} />
        </div>
      </div>
      {printNode}

      <div className="overflow-x-auto rounded-[10px] border border-[#D8EDFF]">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="border-b border-[#D8EDFF] bg-[#EFF7FF]">
              {monthlyViolationColumns.map((c) => (
                <th key={c.key} className="px-[12px] py-[12px] text-left text-[13px] font-semibold text-[#363636]">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((v, index) => (
              <tr key={v.id} className={`border-b border-[#D8EDFF] ${index % 2 === 1 ? 'bg-[#F8F8F8]' : 'bg-white'}`}>
                <td className="px-[12px] py-[14px] text-[13px] text-[#07121E]">{v.sn}</td>
                <td className="px-[12px] py-[14px] text-[13px] font-semibold text-[#07121E]">{v.stpName}</td>
                <td className="px-[12px] py-[14px] text-[13px] text-[#07121E]">{v.capacity}</td>
                <td className="px-[12px] py-[14px] text-[13px] text-[#07121E]">{v.district}</td>
                <td className="px-[12px] py-[14px] text-[13px] text-[#07121E]">{v.omDepartment}</td>
                <td className="px-[12px] py-[14px]">
                  <div className="flex flex-col gap-[6px]">
                    {v.parameters.map((p, i) => (
                      <div key={i} className="text-[13px] font-bold text-[#07121E]">
                        <span>{formatParameterName(p.name)}: </span>
                        <span className="text-[#DC2626]">{p.observedValue}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-[12px] py-[14px]">
                  <div className="flex flex-col gap-[6px]">
                    {v.parameters.map((p, i) => (
                      <div key={i} className="whitespace-nowrap text-[13px] text-[#363636]">
                        {p.range}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-[12px] py-[14px] text-[13px] font-semibold text-[#0768D2]">
                  {v.date || '—'}
                </td>
                <td className="whitespace-nowrap px-[12px] py-[14px] text-[13px] text-[#07121E]">
                  {v.nonComplianceTime || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/dashboard" className="text-[13px] font-semibold text-[#0768D2] hover:underline">
        Go to dashboard
      </Link>
    </div>
  )
}
