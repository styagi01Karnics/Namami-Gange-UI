import { useMemo } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { contractsReportColumns, contractsReportRows } from '../../data/mockData'

function ContractsReportBody() {
  const { plantLabel } = useReportFilters()

  const rows = useMemo(() => {
    if (!plantLabel) return contractsReportRows
    const filtered = contractsReportRows.filter((r) =>
      r.stp.toLowerCase().includes(plantLabel.toLowerCase()),
    )
    return filtered.length > 0 ? filtered : contractsReportRows
  }, [plantLabel])

  return (
    <ReportDownloadScreen
      moduleKey="contracts"
      title="STP Operation & Maintenance Contracts Report"
      description="Agency agreements, vendor SLAs, O&M scope of work, duration timelines, and contract values."
      columns={contractsReportColumns.filter((c) => c.key !== 'action')}
      rows={rows}
      renderCell={(r, col) => {
        if (col.key === 'status') {
          const isComplete = r.status === 'Completed'
          return (
            <span
              className={`inline-flex rounded-full px-[10px] py-[3px] text-[12px] font-bold ${
                isComplete ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'
              }`}
            >
              {r.status}
            </span>
          )
        }
        if (col.key === 'id') {
          return <span className="font-semibold text-[#ED7831]">{r.id}</span>
        }
        if (col.key === 'duration') {
          return (
            <span>
              {r.startDate} to {r.endDate}
            </span>
          )
        }
        return r[col.key]
      }}
      exportTitle="Contracts & SLAs Report"
      exportFileName="contracts-report"
    />
  )
}

export default function ContractsReport() {
  return (
    <ReportShell>
      <ContractsReportBody />
    </ReportShell>
  )
}
