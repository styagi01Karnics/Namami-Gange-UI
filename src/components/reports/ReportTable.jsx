import { Fragment, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SearchInput from '../ui/SearchInput'
import ExportButton from '../ui/ExportButton'

/**
 * Config-driven table used by every Data Reports sub-page.
 * The page owns the data and cell rendering; this owns the chrome,
 * the search box and the sort state.
 *
 *  columns    [{ key, label, width, sortable, align }]
 *  rows       already filtered by whatever page-level controls exist
 *  searchKeys row fields the search box matches against
 *  toolbar    optional node dropped between Search and the PDF/CSV buttons
 *  filters    optional node rendered on its own line under the toolbar
 *  renderCell (row, column, { isExpanded, toggle }) => node
 *  renderDetail  optional (row) => node; supplying it makes rows expandable
 */
export default function ReportTable({
  columns,
  rows,
  searchKeys = [],
  toolbar = null,
  filters = null,
  renderCell,
  renderDetail = null,
  rowKey = (row, i) => row.id ?? i,
  defaultExpandedKey = null,
  showSearch = true,
  searchPlaceholder = 'Search',
  nested = false,
  minWidth = 980,
  emptyMessage = 'Nothing matches the current filters.',
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [expanded, setExpanded] = useState(defaultExpandedKey)

  const toggleSort = (key) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  const visible = useMemo(() => {
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

  return (
    <div
      className={`overflow-hidden rounded-[12px] border border-line bg-white ${
        nested ? '' : 'shadow-card'
      }`}
    >
      <div className="flex flex-wrap items-center justify-end gap-[14px] px-[16px] pb-[16px] pt-[16px]">
        {showSearch && (
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={searchPlaceholder}
            className="w-[440px] max-w-full"
          />
        )}
        {toolbar}
        <ExportButton label="PDF" />
        <ExportButton label="CSV" />
      </div>

      {filters && <div className="px-[16px] pb-[16px]">{filters}</div>}

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full table-fixed border-collapse" style={{ minWidth }}>
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-y border-line bg-[#F7F9FC]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-[16px] py-[16px] text-[13px] font-medium leading-4 text-ink-soft ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
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
            {visible.map((row, i) => {
              const key = rowKey(row, i)
              const isExpanded = renderDetail && expanded === key
              const toggle = () => setExpanded(isExpanded ? null : key)

              return (
                <Fragment key={key}>
                  <tr className="border-b border-line last:border-0">
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-[16px] py-[18px] align-middle text-[13px] leading-[18px] text-ink ${
                          c.align === 'right' ? 'text-right' : ''
                        }`}
                      >
                        {renderCell(row, c, { isExpanded, toggle })}
                      </td>
                    ))}
                  </tr>

                  {isExpanded && (
                    <tr className="border-b border-line last:border-0">
                      <td colSpan={columns.length} className="px-[16px] pb-[18px] pt-[2px]">
                        {renderDetail(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}

            {visible.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-[16px] py-[48px] text-center text-[13px] text-ink-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
