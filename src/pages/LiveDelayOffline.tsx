import { useMemo, useState } from 'react'
import DataTable from '../components/ui/DataTable'
import DateRangeField from '../components/ui/DateRangeField'
import StatCardsRow from '../components/ui/StatCardsRow'
import StatusPill from '../components/ui/StatusPill'
import PrintDocument from '../components/export/PrintDocument'
import { downloadCsv } from '../lib/csv'
import { buildLiveDelayStats, defaultDateRange, liveDelayColumns, liveDelayRows } from '../data/mockData'

/** Offline reads grey out rather than alarm — the delay state is the one to chase. */
const STATUS_TONE = { Online: 'ok', Offline: 'slate', Delay: 'warn' }

const CSV_COLUMNS = liveDelayColumns.map((c) => ({ key: c.key, label: c.label }))

export default function LiveDelayOffline() {
  const [range, setRange] = useState(defaultDateRange)
  const [printRows, setPrintRows] = useState(null)

  const stats = useMemo(() => buildLiveDelayStats(liveDelayRows), [])

  const renderCell = (row, col) =>
    col.key === 'status' ? <StatusPill tone={STATUS_TONE[row.status]}>{row.status}</StatusPill> : undefined

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <StatCardsRow items={stats} columns={4} gap={14} noteChip />

      <div className="flex justify-end">
        <DateRangeField value={range} onChange={setRange} className="w-[280px]" />
      </div>

      <DataTable
        columns={liveDelayColumns}
        rows={liveDelayRows}
        searchKeys={['stp', 'status', 'statusFrom', 'statusTo']}
        renderCell={renderCell}
        onExportCsv={(visible) => downloadCsv('live-delay-offline', CSV_COLUMNS, visible)}
        onExportPdf={(visible) => setPrintRows({ id: Date.now(), rows: visible })}
        emptyMessage="No STPs match your search."
      />

      {printRows && (
        <PrintDocument
          key={printRows.id}
          title="Live Delay / Offline"
          rangeLabel={range}
          columns={CSV_COLUMNS}
          rows={printRows.rows}
          onDone={() => setPrintRows(null)}
        />
      )}
    </div>
  )
}
