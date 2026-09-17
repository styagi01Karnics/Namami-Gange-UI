import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

type PageToken = number | '…'

/** 1 … 4 5 6 … 40 — first, last and a window around the current page. */
function pageList(page: number, pageCount: number): PageToken[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, '…', pageCount]
  if (page >= pageCount - 3) return [1, '…', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, '…', page - 1, page, page + 1, '…', pageCount]
}

const arrowClass =
  'flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-line text-ink-soft transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-ink-soft'

type PaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-[14px] px-[16px] py-[15px]">
      <p className="flex items-center gap-[7px] text-[12.5px] leading-4 text-ink-soft">
        Showing data {first} to {last}
        <span className="relative inline-flex items-center gap-[4px] rounded-[7px] border border-line pl-[9px] pr-[7px]">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Rows per page"
            className="bare h-[26px] cursor-pointer bg-transparent pr-[2px] text-[12.5px] font-medium text-ink outline-none"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="pointer-events-none text-[#5B6B7F]" />
        </span>
        of {total} entries
      </p>

      <div className="flex items-center gap-[6px]">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={arrowClass}
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
        </button>

        {pageList(page, pageCount).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-[4px] text-[12.5px] text-ink-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`h-[30px] min-w-[30px] rounded-[8px] px-[8px] text-[12.5px] font-semibold transition-colors ${
                p === page ? 'bg-brand text-white' : 'text-ink-soft hover:bg-[#F4F7FB] hover:text-brand'
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className={arrowClass}
        >
          <ChevronRight size={16} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
