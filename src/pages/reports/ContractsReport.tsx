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
          <button type="button" className="text-[13px] font-semibold leading-[18px] text-orange hover:underline">
            {row.id}
          </button>
        )
      case 'stp':
        return <StpLink>{row.stp}</StpLink>
      case 'status':
        return <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
      case 'duration':
        return (
          <span className="text-[13px] leading-[20px] text-ink">
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

      <SoftStatCardsRow items={contractsSummary} columns={4} gap={16} />

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
