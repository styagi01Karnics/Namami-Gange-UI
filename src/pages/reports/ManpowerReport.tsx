import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import SoftStatCardsRow from '../../components/ui/SoftStatCard'
import TabSectionHeader from '../../components/stp/TabSectionHeader'
import DateRangeField from '../../components/ui/DateRangeField'
import { Sparkline, StpLink, Tone } from '../../components/reports/cells'
import { manpowerReportColumns, manpowerReportRows, manpowerReportStats } from '../../data/mockData'

const TONED = { present: 'green', absent: 'red', leave: 'amber' }

function ManpowerReportBody() {
  const { range, setRange } = useReportFilters()

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
    <>
      <TabSectionHeader
        tab="Manpower"
        right={<DateRangeField value={range} onChange={setRange} className="w-[280px]" />}
      />

      <SoftStatCardsRow items={manpowerReportStats} columns={4} gap={16} />

      <ReportTable
        columns={manpowerReportColumns}
        rows={manpowerReportRows}
        searchKeys={['date', 'stp']}
        renderCell={renderCell}
        minWidth={1080}
        emptyMessage="No manpower records match your search."
        exportTitle="Manpower Report"
        exportFileName="manpower-report"
      />
    </>
  )
}

export default function ManpowerReport() {
  return (
    <ReportShell>
      <ManpowerReportBody />
    </ReportShell>
  )
}
