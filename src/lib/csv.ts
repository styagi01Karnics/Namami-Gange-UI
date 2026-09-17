import type { TableColumn } from '../types'

const escape = (value: unknown) => {
  const text = value == null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

type CsvRow = Record<string, unknown>
type GetValue<T extends CsvRow> = (row: T, col: TableColumn) => unknown

/**
 * Plain comma-separated export of whatever the table is currently showing.
 * The BOM keeps Excel happy with the ₹ sign and other non-ASCII characters.
 */
export function downloadCsv<T extends CsvRow>(
  fileName: string,
  columns: TableColumn[],
  rows: T[],
  getValue: GetValue<T> = (row, col) => row[col.key],
) {
  const lines = [
    columns.map((c) => escape(c.label)).join(','),
    ...rows.map((row) => columns.map((c) => escape(getValue(row, c))).join(',')),
  ]

  const url = URL.createObjectURL(new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
