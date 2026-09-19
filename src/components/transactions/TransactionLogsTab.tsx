import { useMemo, useState } from 'react'
import ExportButton from '../ui/ExportButton'
import SearchInput from '../ui/SearchInput'
import { useTableExport } from '../export/useTableExport'
import StreamTransactionPanel from './StreamTransactionPanel'
import { stpStreams, streamTransactions } from '../../data/mockData'

const EXPORT_COLUMNS = [
  { key: 'stream', label: 'Stream' },
  { key: 'txnId', label: 'ID' },
  { key: 'uniqueId', label: 'Unique ID' },
  { key: 'status', label: 'Status' },
  { key: 'timestamp', label: 'Created At' },
]

/**
 * Shared by the Transaction Logs page and its tab in STP Management — the two
 * streams sit side by side so a reading can be compared inlet to outlet.
 */
export default function TransactionLogsTab() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(null)
  const toggleExpanded = (index) => setExpanded((prev) => (prev === index ? null : index))
  const { exportPdf, exportCsv, printNode } = useTableExport({
    title: 'Transaction Logs',
    fileName: 'transaction-logs',
    columns: EXPORT_COLUMNS,
  })

  const q = query.trim().toLowerCase()

  const exportRows = useMemo(
    () =>
      stpStreams.flatMap((stream) => {
        const data = streamTransactions[stream.key]
        return data.rows
          .filter(
            (row) =>
              !q ||
              [stream.title, row.id, row.status, row.timestamp, data.uniqueId].some((f) =>
                String(f).toLowerCase().includes(q),
              ),
          )
          .map((row, i) => ({
            id: `${stream.key}-${i}`,
            txnId: row.id,
            stream: stream.title,
            uniqueId: data.uniqueId,
            status: row.status,
            timestamp: row.timestamp,
          }))
      }),
    [q],
  )

  return (
    <div className="space-y-[14px]">
      <div className="flex items-center justify-end gap-[12px]">
        <SearchInput value={query} onChange={setQuery} className="w-[268px]" />
        <ExportButton label="PDF" onClick={() => exportPdf(exportRows)} />
        <ExportButton label="CSV" onClick={() => exportCsv(exportRows)} />
      </div>
      {printNode}

      <div className="grid grid-cols-2 gap-[14px] [&>*]:min-w-0">
        {stpStreams.map((stream) => (
          <StreamTransactionPanel
            key={stream.key}
            stream={stream}
            data={streamTransactions[stream.key]}
            expanded={expanded}
            onToggleExpanded={toggleExpanded}
          />
        ))}
      </div>
    </div>
  )
}
