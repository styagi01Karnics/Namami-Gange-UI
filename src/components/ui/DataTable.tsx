import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import SearchInput from './SearchInput'
import ExportButton from './ExportButton'
import Pagination from './Pagination'
import type { TableColumn } from '../../types'

type DataRow = {
  id: string | number
  [key: string]: any
}

type CellApi = {
  expanded: boolean
  toggleExpanded: () => void
}

type DataTableProps<T extends DataRow> = {
  columns: TableColumn[]
  rows: T[]
  searchKeys?: string[]
  renderCell?: (row: T, col: TableColumn, api: CellApi) => ReactNode
  renderExpanded?: (row: T) => ReactNode
  filters?: ReactNode
  onExportPdf?: (rows: T[]) => void
  onExportCsv?: (rows: T[]) => void
  emptyMessage?: string
  minWidth?: number
  pageSize?: number
  toolbarFill?: boolean
}

export default function DataTable<T extends DataRow>({
  columns,
  rows,
  searchKeys = [],
  renderCell,
  renderExpanded,
  filters,
  onExportPdf,
  onExportCsv,
  emptyMessage = 'Nothing matches the current filters.',
  minWidth = 980,
  pageSize: initialPageSize = 5,
  toolbarFill = false,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: string | null; dir: 'asc' | 'desc' }>({ key: null, dir: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [expanded, setExpanded] = useState<string | number | null>(null)

  const toggleSort = (key: string) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? rows.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)))
      : rows

    if (!sort.key) return list
    return [...list].sort((a, b) => {
      const cmp = String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? ''), undefined, { numeric: true })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, query, sort, searchKeys])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const onSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const onPageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const toggleExpanded = (id: string | number) => setExpanded((prev) => (prev === id ? null : id))

  const cell = (row: T, col: TableColumn) => {
    const custom = renderCell?.(row, col, { expanded: expanded === row.id, toggleExpanded: () => toggleExpanded(row.id) })
    return custom === undefined ? row[col.key] : custom
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-line bg-white shadow-card">
      <div
        className={`flex items-center gap-[14px] px-[16px] pb-[16px] pt-[16px] ${
          toolbarFill ? '' : filters ? 'flex-wrap justify-between' : 'flex-wrap justify-end'
        }`}
      >
        <div className={`flex items-center gap-[14px] ${toolbarFill ? 'min-w-0 flex-1' : 'flex-wrap'}`}>
          <SearchInput
            value={query}
            onChange={onSearch}
            placeholder="Search"
            size={toolbarFill ? 'comfortable' : 'default'}
            className={
              toolbarFill ? 'min-w-0 flex-1' : filters ? 'w-[260px] max-w-full' : 'w-[440px] max-w-full'
            }
          />
          {toolbarFill ? <div className="flex min-w-0 flex-1 items-center gap-[14px]">{filters}</div> : filters}
        </div>

        {(onExportPdf || onExportCsv) && (
          <div className="flex shrink-0 items-center gap-[14px]">
            {onExportPdf && <ExportButton label="PDF" onClick={() => onExportPdf(filtered)} />}
            {onExportCsv && <ExportButton label="CSV" onClick={() => onExportCsv(filtered)} />}
          </div>
        )}
      </div>

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full table-fixed border-collapse" style={{ minWidth }}>
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-y border-line bg-canvas">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-[16px] py-[16px] text-left text-[13px] font-semibold leading-4 text-ink-soft"
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="flex items-center gap-[5px] transition-colors hover:text-brand"
                    >
                      {c.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          sort.key === c.key && sort.dir === 'desc' ? 'rotate-180' : ''
                        } ${sort.key === c.key ? 'text-brand' : ''}`}
                      />
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {slice.map((row) => (
              <Fragment key={row.id}>
                <tr className={expanded === row.id ? '' : 'border-b border-line last:border-0'}>
                  {columns.map((c) => (
                    <td key={c.key} className="px-[16px] py-[18px] align-middle text-[13px] leading-[18px] text-ink">
                      {cell(row, c)}
                    </td>
                  ))}
                </tr>

                {expanded === row.id && renderExpanded && (
                  <tr className="border-b border-line last:border-0">
                    <td colSpan={columns.length} className="px-[16px] pb-[18px] pt-[16px]">
                      {renderExpanded(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {slice.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-[16px] py-[48px] text-center text-[13px] text-ink-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={safePage}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
