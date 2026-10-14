import { useMemo } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { manpowerReportColumns, manpowerReportRows } from '../../data/mockData'

function ManpowerReportBody() {
  const { plantLabel } = useReportFilters()

  const rows = useMemo(() => {
    if (!plantLabel) return manpowerReportRows
    const filtered = manpowerReportRows.filter((r) =>
      r.stp.toLowerCase().includes(plantLabel.toLowerCase()),
    )
    return filtered.length > 0 ? filtered : manpowerReportRows
  }, [plantLabel])

  return (
    <ReportDownloadScreen
      moduleKey="manpower"
      title="Manpower Attendance Report"
      description="Daily personnel deployment, attendance tracking, shift compliance, and staff shortage records."
      columns={manpowerReportColumns}
      rows={rows}
      renderCell={(r, col) => {
        if (col.key === 'present') {
          return <span className="font-semibold text-[#16A34A]">{r.present}</span>
        }
        if (col.key === 'absent') {
          return <span className="font-semibold text-[#DC2626]">{r.absent}</span>
        }
        if (col.key === 'shortage' && Number(r.shortage) > 0) {
          return <span className="font-bold text-[#DC2626]">{r.shortage}</span>
        }
        return r[col.key]
      }}
      exportTitle="Manpower Attendance & Deployment Report"
      exportFileName="manpower-report"
    />
  )
}

export default function ManpowerReport() {
  return (
    <ReportShell>
      <ManpowerReportBody />
    </ReportShell>
  )
}
