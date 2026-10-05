import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import SoftStatCardsRow from '../../components/ui/SoftStatCard'
import StatusPill, { statusTone } from '../../components/ui/StatusPill'
import TabSectionHeader from '../../components/stp/TabSectionHeader'
import DateRangeField from '../../components/ui/DateRangeField'
import { DownloadAction, StpLink } from '../../components/reports/cells'
import { contractsReportColumns, contractsReportRows, contractsSummary } from '../../data/mockData'

function ContractsReportBody() {
  const { range, setRange } = useReportFilters()

  const renderCell = (row: any, col: any, { exportRow }: { exportRow?: () => void } = {}) => {
    switch (col.key) {
      case 'id':
        return (
          <button
            type="button"
            className="text-[14px] font-semibold leading-[22px] text-[#ED7831] hover:underline"
          >
            {row.id}
          </button>
        )
      case 'stp':
        return <StpLink>{row.stp}</StpLink>
      case 'status':
        return (
          <StatusPill
            tone={statusTone(row.status)}
            className="h-[32px] min-w-[88px] justify-center px-[8px] text-[14px] leading-4"
          >
            {row.status}
          </StatusPill>
        )
      case 'duration':
        return (
          <span className="text-[14px] font-medium leading-[22px] text-[#07121E]">
            {row.startDate} -<br />
            {row.endDate}
          </span>
        )
      case 'action':
        return <DownloadAction label={`Download ${row.id}`} onClick={exportRow} />
      default:
        return row[col.key]
    }
  }

  return (
    <>
      <TabSectionHeader
        tab="Contracts"
        right={<DateRangeField value={range} onChange={setRange} className="w-[280px]" />}
      />

      <SoftStatCardsRow items={contractsSummary} columns={4} gap={16} tall />

      <ReportTable
        columns={contractsReportColumns}
        rows={contractsReportRows}
        searchKeys={['id', 'name', 'vendor', 'stp', 'status']}
        renderCell={renderCell}
        minWidth={1080}
        emptyMessage="No contracts match your search."
        exportTitle="Contracts Report"
        exportFileName="contracts-report"
        exportValue={(row, col) =>
          col.key === 'duration' ? `${row.startDate} - ${row.endDate}` : undefined
        }
      />
    </>
  )
}

export default function ContractsReport() {
  return (
    <ReportShell>
      <ContractsReportBody />
    </ReportShell>
  )
}
