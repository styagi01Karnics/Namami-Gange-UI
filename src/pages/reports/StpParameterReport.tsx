import ReportShell from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { stpParameterReportColumns, stpParameterReportRows } from '../../data/mockData'

export default function StpParameterReport() {
  const isNonComplyingCell = (r: { status?: string }, key: string) =>
    (key === 'bod' || key === 'cod' || key === 'tss') && r.status === 'Non-Complying'

  return (
    <ReportShell>
      <ReportDownloadScreen
        moduleKey="parameters"
        title="STP Parameter Report"
        description="Official water quality compliance data including BOD, COD, TSS, pH, Temperature, and NH₄-N."
        columns={stpParameterReportColumns}
        rows={stpParameterReportRows}
        renderCell={(r, col) => {
          if (col.key === 'bod' || col.key === 'cod' || col.key === 'tss') {
            const isNonComplying = isNonComplyingCell(r, col.key)
            return (
              <span className={isNonComplying ? 'font-bold text-[#DC2626]' : 'font-medium text-[#111827]'}>
                {r[col.key]}
              </span>
            )
          }
          return r[col.key]
        }}
        cellTone={(r, col) => (isNonComplyingCell(r, col.key) ? 'red' : null)}
        exportTitle="STP Parameter Compliance Report"
        exportFileName="stp-parameter-report"
        withTimeRange
        qrEnabled
      />
    </ReportShell>
  )
}
