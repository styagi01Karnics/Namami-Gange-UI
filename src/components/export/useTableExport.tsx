import { useMemo, useState } from 'react'
import { downloadCsv } from '../../lib/csv'
import { defaultDateRange } from '../../data/mockData'
import PrintDocument from './PrintDocument'
import { useExportMeta } from './exportMeta'

const SKIP_KEYS = new Set(['details', 'action', 'actions'])

function toExportColumns(columns) {
  return columns.filter((c) => !SKIP_KEYS.has(c.key)).map(({ key, label, align }) => ({ key, label, align }))
}

function formatExportValue(row, col, getValue) {
  const custom = getValue?.(row, col)
  if (custom !== undefined) return custom == null || custom === '' ? '—' : custom

  const value = row[col.key]
  if (value == null || value === '') return '—'
  if (typeof value === 'object') {
    if (value.amount != null) return value.date ? `${value.amount} (${value.date})` : String(value.amount)
    if (value.value != null) return String(value.value)
  }
  return String(value)
}

/**
 * PDF uses the same PrintDocument letterhead as Support Tickets.
 * CSV is a UTF-8 download of the same columns/rows.
 */
export function useTableExport({
  title,
  fileName,
  columns,
  getValue,
  rangeLabel,
}: {
  title: string
  fileName: string
  columns: { key: string; label: string; align?: string }[]
  getValue?: (row: any, col: { key: string; label: string; align?: string }) => unknown
  rangeLabel?: string
}) {
  const meta = useExportMeta()
  const [doc, setDoc] = useState(null)
  const cols = useMemo(() => toExportColumns(columns), [columns])

  const valueOf = (row, col) => formatExportValue(row, col, getValue)

  const exportPdf = (rows, extra = null) => setDoc({ id: Date.now(), rows, extra })
  const exportCsv = (rows) => downloadCsv(fileName, cols, rows, valueOf)

  const printNode = doc ? (
    <PrintDocument
      key={doc.id}
      title={title}
      badge={meta.badge}
      badgeTone={meta.badgeTone}
      address={meta.address}
      rangeLabel={rangeLabel ?? meta.rangeLabel ?? defaultDateRange}
      columns={cols}
      rows={doc.rows}
      renderCell={valueOf}
      onDone={() => setDoc(null)}
    >
      {doc.extra}
    </PrintDocument>
  ) : null

  return { exportPdf, exportCsv, printNode }
}
