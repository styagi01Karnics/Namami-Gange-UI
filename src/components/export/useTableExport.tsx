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
  renderPdfCell,
  rangeLabel,
  resolveBadge,
}: {
  title: string
  fileName: string | (() => string)
  columns: { key: string; label: string; align?: string }[]
  getValue?: (row: any, col: { key: string; label: string; align?: string }) => unknown
  /** Optional rich cell renderer for PDF (falls back to getValue / plain text). */
  renderPdfCell?: (row: any, col: { key: string; label: string; align?: string }) => unknown
  rangeLabel?: string
  /** Override letterhead badge from the rows being exported. */
  resolveBadge?: (rows: any[]) => { badge: string | null; badgeTone?: string } | null | undefined
}) {
  const meta = useExportMeta()
  const [doc, setDoc] = useState<{
    id: number
    rows: any[]
    extra: any
    fileName: string
    badge: string | null
    badgeTone: string
  } | null>(null)
  const cols = useMemo(() => toExportColumns(columns), [columns])

  const valueOf = (row, col) => formatExportValue(row, col, getValue)
  const pdfCell = (row, col) => {
    const rich = renderPdfCell?.(row, col)
    if (rich !== undefined) return rich
    return valueOf(row, col)
  }

  const resolveFileName = () => (typeof fileName === 'function' ? fileName() : fileName)

  const exportPdf = (rows, extra = null) => {
    const badgeMeta = resolveBadge?.(rows)
    setDoc({
      id: Date.now(),
      rows,
      extra,
      fileName: resolveFileName(),
      badge: badgeMeta?.badge !== undefined ? badgeMeta.badge : meta.badge,
      badgeTone: badgeMeta?.badgeTone ?? meta.badgeTone,
    })
  }
  const exportCsv = (rows) => downloadCsv(resolveFileName(), cols, rows, valueOf)

  const printNode = doc ? (
    <PrintDocument
      key={doc.id}
      title={title}
      fileName={doc.fileName}
      badge={doc.badge}
      badgeTone={doc.badgeTone}
      address={meta.address}
      rangeLabel={rangeLabel ?? meta.rangeLabel ?? defaultDateRange}
      columns={cols}
      rows={doc.rows}
      renderCell={pdfCell}
      onDone={() => setDoc(null)}
    >
      {doc.extra}
    </PrintDocument>
  ) : null

  return { exportPdf, exportCsv, printNode }
}
