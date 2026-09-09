import ReportShell from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import StatCardsRow from '../../components/ui/StatCardsRow'
import ManpowerTrendCard from '../../components/reports/ManpowerTrendCard'
import { Sparkline, StpLink, Tone } from '../../components/reports/cells'
import { manpowerReportColumns, manpowerReportRows, manpowerReportStats } from '../../data/mockData'

const TONED = { present: 'green', absent: 'red', leave: 'amber' }

export default function ManpowerReport() {
  const renderCell = (row, col) => {
    if (col.key === 'stp') return <StpLink>{row.stp}</StpLink>
    if (TONED[col.key]) return <Tone tone={TONED[col.key]}>{row[col.key]}</Tone>
    if (col.key === 'attendance') {
      return (
        <span className="flex items-center gap-[12px]">
          <Sparkline points={row.spark} />
          <span className="text-[13px] leading-[18px] text-ink">{row.attendance}</span>
        </span>
      )
    }
    return row[col.key]
  }

  return (
    <ReportShell>
      <div className="grid grid-cols-2 items-stretch gap-[16px] [&>*]:min-w-0">
        <StatCardsRow items={manpowerReportStats} columns={2} noteChip />
        <ManpowerTrendCard />
      </div>

      <ReportTable
        columns={manpowerReportColumns}
        rows={manpowerReportRows}
        searchKeys={['date', 'stp']}
        renderCell={renderCell}
        minWidth={1080}
        emptyMessage="No manpower records match your search."
      />
    </ReportShell>
  )
}
