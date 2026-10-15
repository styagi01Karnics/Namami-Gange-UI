import { useMemo } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { complianceReportColumns, complianceReportRows } from '../../data/mockData'

function ComplianceReportBody() {
  const { plantLabel } = useReportFilters()

  const rows = useMemo(() => {
    if (!plantLabel) return complianceReportRows
    const filtered = complianceReportRows.filter((r) =>
      r.stp.toLowerCase().includes(plantLabel.toLowerCase()),
    )
    return filtered.length > 0 ? filtered : complianceReportRows
  }, [plantLabel])

  return (
    <ReportDownloadScreen
      moduleKey="violation"
      title="STP Violation & Non-Compliance Report"
      description="Recorded parameter breaches, exceedance values, downtime intervals, penalty assessments, and resolution status."
      columns={complianceReportColumns}
      rows={rows}
      renderCell={(r, col) => {
        if (col.key === 'status') {
          const isPending = r.status === 'Pending'
          return (
            <span
              className={`inline-flex rounded-full px-[10px] py-[3px] text-[12px] font-bold ${
                isPending ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#DCFCE7] text-[#16A34A]'
              }`}
            >
              {r.status}
            </span>
          )
        }
        if (col.key === 'parameter') {
          return <span className="font-bold text-[#DC2626]">{r.parameter}</span>
        }
        if (col.key === 'detectedOn') {
          return `${r.date} ${r.time}`
        }
        return r[col.key]
      }}
      getValue={(r, col) => {
        if (col.key === 'detectedOn') return `${r.date} ${r.time}`
        return r[col.key]
      }}
      exportTitle="STP Violation & Penalty Report"
      exportFileName="violation-report"
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
