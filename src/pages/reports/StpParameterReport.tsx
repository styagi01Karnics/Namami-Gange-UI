import ReportShell from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { stpParameterReportColumns, stpParameterReportRows } from '../../data/mockData'

export default function StpParameterReport() {
  return (
    <ReportShell>
      <ReportDownloadScreen
        moduleKey="parameters"
        title="STP Parameter Report"
        description="Official water quality compliance data including BOD, COD, TSS, pH, Temperature, and NH₄-N."
        columns={stpParameterReportColumns}
        rows={stpParameterReportRows}
        renderCell={(r, col) => {
          if (col.key === 'status') {
            const isNonComplying = r.status === 'Non-Complying'
            return (
              <span
                className={`inline-flex rounded-full px-[10px] py-[3px] text-[12px] font-bold ${
                  isNonComplying ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#DCFCE7] text-[#16A34A]'
                }`}
              >
                {r.status}
              </span>
            )
          }
          if (col.key === 'bod' || col.key === 'cod' || col.key === 'tss') {
            const isNonComplying = r.status === 'Non-Complying'
            return (
              <span className={isNonComplying ? 'font-bold text-[#DC2626]' : 'font-medium text-[#111827]'}>
                {r[col.key]}
              </span>
            )
          }
          return r[col.key]
        }}
        exportTitle="STP Parameter Compliance Report"
        exportFileName="stp-parameter-report"
      />
    </ReportShell>
  )
}
