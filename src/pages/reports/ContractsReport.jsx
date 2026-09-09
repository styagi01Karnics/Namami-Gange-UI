import ReportShell from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import StatCardsRow from '../../components/ui/StatCardsRow'
import StatusPill, { statusTone } from '../../components/ui/StatusPill'
import { DownloadAction, StpLink } from '../../components/reports/cells'
import { contractsReportColumns, contractsReportRows, contractsSummary } from '../../data/mockData'

export default function ContractsReport() {
  const renderCell = (row, col) => {
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
        return <DownloadAction label={`Download ${row.id}`} />
      default:
        return row[col.key]
    }
  }

  return (
    <ReportShell>
      <StatCardsRow items={contractsSummary} noteChip />
      <ReportTable
        columns={contractsReportColumns}
        rows={contractsReportRows}
        searchKeys={['id', 'name', 'vendor', 'stp', 'status']}
        renderCell={renderCell}
        minWidth={1080}
        emptyMessage="No contracts match your search."
      />
    </ReportShell>
  )
}
