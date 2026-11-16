import { useMemo } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { complianceReportColumns, complianceReportRows } from '../../data/mockData'
import { formatParameterName } from '../../lib/parameters'

function ComplianceReportBody() {
  const { plantLabel } = useReportFilters()

  const rows = useMemo(() => {
    if (!plantLabel) return complianceReportRows
    const filtered = complianceReportRows.filter((r) =>
      r.stpName.toLowerCase().includes(plantLabel.toLowerCase()),
    )
    return filtered.length > 0 ? filtered : complianceReportRows
  }, [plantLabel])

  return (
    <ReportDownloadScreen
      moduleKey="violation"
      title="STP Violation & Non-Compliance Report"
      description="Non-complying STPs with observed parameter values, permissible range, date and non-compliance time."
      columns={complianceReportColumns}
      rows={rows}
      renderCell={(r, col) => {
        if (col.key === 'parameters') {
          return (
            <div className="flex flex-col gap-[6px]">
              {r.parameters.map((p, i) => (
                <div key={i} className="text-[13.5px] font-bold leading-[22px] text-[#07121E]">
                  <span>{formatParameterName(p.name)}: </span>
                  <span className="font-bold text-[#DC2626]">{p.observedValue}</span>
                </div>
              ))}
            </div>
          )
        }
        if (col.key === 'range') {
          return (
            <div className="flex flex-col gap-[6px]">
              {r.parameters.map((p, i) => (
                <div key={i} className="whitespace-nowrap text-[13.5px] font-normal leading-[22px] text-[#363636]">
                  {p.range}
                </div>
              ))}
            </div>
          )
        }
        if (col.key === 'date') {
          return <span className="font-semibold text-[#0768D2] whitespace-nowrap">{r.date || '—'}</span>
        }
        if (col.key === 'nonComplianceTime') {
          return <span className="whitespace-nowrap">{r.nonComplianceTime || '—'}</span>
        }
        return undefined
      }}
      getValue={(r, col) => {
        if (col.key === 'parameters') {
          return r.parameters.map((p) => `${formatParameterName(p.name)}: ${p.observedValue}`).join(', ')
        }
        if (col.key === 'range') return r.parameters.map((p) => p.range).join(', ')
        return undefined
      }}
      exportTitle="STP Violation & Penalty Report"
      exportFileName="violation-report"
      qrEnabled
    />
  )
}

export default function ComplianceReport() {
  return (
    <ReportShell>
      <ComplianceReportBody />
    </ReportShell>
  )
}
