import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import BuildingIcon from '../ui/BuildingIcon'
import { ico } from '../ui/Ico'
import Logo from '../ui/Logo'
import StatusPill from '../ui/StatusPill'

const PinIcon = ico('fluent:location-24-filled')
const CalendarIcon = ico('fluent:calendar-32-filled')

/**
 * Letterhead rendered into #print-root for browser "Save as PDF".
 * Prints only the `columns` + `rows` passed in — never a hardcoded table.
 */
export default function PrintDocument({
  title,
  fileName = null,
  badge = null,
  badgeTone = 'brand',
  address = null,
  rangeLabel = null,
  columns,
  rows,
  renderCell = (row, col) => row[col.key] ?? '—',
  onDone,
  children = null,
}) {
  const target = document.getElementById('print-root')
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    let finished = false
    let fallbackId = 0
    const previousTitle = document.title

    const finish = () => {
      if (finished) return
      finished = true
      window.clearTimeout(fallbackId)
      window.removeEventListener('afterprint', finish)
      document.title = previousTitle
      onDoneRef.current?.()
    }

    // Browser "Save as PDF" often uses document.title as the suggested filename.
    if (fileName) {
      document.title = String(fileName).replace(/\.pdf$/i, '')
    }

    // Wait for the portal paint before opening the print dialog.
    const startId = window.setTimeout(() => {
      window.addEventListener('afterprint', finish)
      window.print()
      // Long fallback only for browsers that never fire afterprint.
      fallbackId = window.setTimeout(finish, 60_000)
    }, 250)

    return () => {
      window.clearTimeout(startId)
      window.clearTimeout(fallbackId)
      window.removeEventListener('afterprint', finish)
      document.title = previousTitle
    }
  }, [fileName])

  if (!target || !columns?.length) return null

  return createPortal(
    <article className="px-[4px] py-[2px] font-sans text-ink">
      <header className="flex items-start justify-between gap-[24px]">
        <Logo />
        <div className="text-right">
          <p className="text-[16px] font-bold leading-6 text-brand">National Mission for Clean Ganga</p>
          <p className="mt-[4px] text-[12.5px] leading-4 text-ink-soft">
            Ministry of Jal Shakti, Government of India
          </p>
        </div>
      </header>

      <div className="dashed-divider my-[18px]" />

      <div className="flex items-start justify-between gap-[24px]">
        <div className="min-w-0">
          <p className="flex items-center gap-[8px]">
            <BuildingIcon size={16} className="shrink-0 text-brand" />
            <span className="text-[14px] font-bold leading-5 text-brand">{title}</span>
            {badge && <StatusPill tone={badgeTone}>{badge}</StatusPill>}
          </p>
          {address && (
            <p className="mt-[7px] flex items-center gap-[8px] text-[12.5px] font-medium leading-4 text-orange">
              <PinIcon size={15} className="shrink-0" />
              {address}
            </p>
          )}
        </div>

        {rangeLabel && (
          <div className="flex shrink-0 items-center gap-[10px] rounded-[10px] bg-[#EEF5FE] px-[14px] py-[11px]">
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-white">
              <CalendarIcon size={16} className="text-brand" />
            </span>
            <span>
              <span className="block text-[11.5px] leading-4 text-ink-soft">Date Range</span>
              <span className="block text-[13px] font-bold leading-[18px] text-brand">{rangeLabel}</span>
            </span>
          </div>
        )}
      </div>

      <table className="mt-[20px] w-full border-collapse border border-[#B8C9DC]">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`border border-[#B8C9DC] bg-[#E6F4FE] px-[12px] py-[11px] text-[11.5px] font-bold leading-4 text-[#1F2A37] ${
                  c.align === 'right' ? 'text-right' : 'text-left'
                }`}
                style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="break-inside-avoid">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`border border-[#B8C9DC] px-[12px] py-[12px] align-middle text-[11.5px] leading-4 text-[#1F2A37] ${
                    c.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {renderCell(row, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {children}
    </article>,
    target,
  )
}
