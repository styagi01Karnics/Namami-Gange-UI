import ReportShell from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import StatCardsRow from '../../components/ui/StatCardsRow'
import { StpLink } from '../../components/reports/cells'
import { cctvReportColumns, cctvReportRows, cctvReportStats } from '../../data/mockData'

export default function CctvReport() {
  const renderCell = (row, col) =>
    col.key === 'stp' ? <StpLink>{row.stp}</StpLink> : row[col.key]

  return (
    <ReportShell>
      <StatCardsRow items={cctvReportStats} noteChip />
      <ReportTable
        columns={cctvReportColumns}
        rows={cctvReportRows}
        searchKeys={['stp', 'cameraId']}
        renderCell={renderCell}
        minWidth={1020}
        emptyMessage="No cameras match your search."
      />
    </ReportShell>
  )
}
