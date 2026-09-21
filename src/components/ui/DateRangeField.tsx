import { useEffect, useMemo, useRef, useState } from 'react'
import { ico } from './Ico'

const CalendarIcon = ico('fluent:calendar-32-filled')

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

type DateRangeFieldProps = {
  value: string
  onChange?: (value: string) => void
  className?: string
  compact?: boolean
}

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

function toInputDate(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function formatDisplayDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function formatRangeLabel(from: Date, to: Date) {
  return `${formatDisplayDate(from)} - ${formatDisplayDate(to)}`
}

function parseLooseDate(raw: string): Date | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  // ISO: 2026-05-06
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return Number.isNaN(date.getTime()) ? null : date
  }

  // Display: 6 May 2026
  const match = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/)
  if (!match) return null

  const day = Number(match[1])
  const year = Number(match[3])
  const monthToken = match[2].slice(0, 3).toLowerCase()
  const monthIndex = MONTHS.findIndex((month) => month.toLowerCase() === monthToken)
  if (monthIndex < 0) return null

  const date = new Date(year, monthIndex, day)
  return Number.isNaN(date.getTime()) ? null : date
}

export function parseDateRangeLabel(value: string): { from: Date; to: Date } | null {
  const parts = String(value ?? '').split(/\s*-\s*/)
  if (parts.length < 2) return null
  const from = parseLooseDate(parts[0])
  const to = parseLooseDate(parts.slice(1).join(' - '))
  if (!from || !to) return null
  return { from, to }
}

import { toPenaltyApiDayRange } from '../../api/penalty'

/** Convert UI range label into penalty API from/to (00:00:00 → 23:59:59). */
export function toPenaltyRangeFromLabel(value: string) {
  const parsed = parseDateRangeLabel(value)
  if (!parsed) return null
  return toPenaltyApiDayRange(parsed.from, parsed.to)
}

export default function DateRangeField({ value, onChange, className = '', compact = false }: DateRangeFieldProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const parsed = useMemo(() => parseDateRangeLabel(value), [value])
  const [fromValue, setFromValue] = useState(() => (parsed ? toInputDate(parsed.from) : ''))
  const [toValue, setToValue] = useState(() => (parsed ? toInputDate(parsed.to) : ''))

  useEffect(() => {
    if (!open) return
    const next = parseDateRangeLabel(value)
    setFromValue(next ? toInputDate(next.from) : '')
    setToValue(next ? toInputDate(next.to) : '')
  }, [open, value])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const applyRange = () => {
    const from = parseLooseDate(fromValue)
    const to = parseLooseDate(toValue)
    if (!from || !to) return

    const start = from.getTime() <= to.getTime() ? from : to
    const end = from.getTime() <= to.getTime() ? to : from
    onChange?.(formatRangeLabel(start, end))
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        className={`relative flex items-center rounded-[9px] border border-line bg-white pl-[14px] pr-[38px] ${
          compact ? 'h-[32px]' : 'h-[38px]'
        }`}
      >
        <input
          value={value}
          readOnly
          onClick={() => setOpen(true)}
          className="w-full cursor-pointer bg-transparent text-[13px] font-medium text-ink outline-none"
          aria-label="Date range"
        />
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open calendar"
          aria-expanded={open}
          className="absolute right-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-[7px] text-[#5B6B7F] transition-colors hover:bg-[#EEF5FE] hover:text-brand"
        >
          <CalendarIcon size={16} />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 z-30 mt-[8px] w-[280px] rounded-[12px] border border-line bg-white p-[14px] shadow-pop">
          <p className="text-[12px] font-semibold leading-4 text-ink-soft">Select date range</p>

          <label className="mt-[12px] block">
            <span className="mb-[6px] block text-[12px] font-medium text-ink-soft">From</span>
            <input
              type="date"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="h-[36px] w-full rounded-[8px] border border-line bg-white px-[10px] text-[13px] text-ink outline-none focus:border-brand"
            />
          </label>

          <label className="mt-[10px] block">
            <span className="mb-[6px] block text-[12px] font-medium text-ink-soft">To</span>
            <input
              type="date"
              value={toValue}
              onChange={(e) => setToValue(e.target.value)}
              className="h-[36px] w-full rounded-[8px] border border-line bg-white px-[10px] text-[13px] text-ink outline-none focus:border-brand"
            />
          </label>

          <div className="mt-[14px] flex justify-end gap-[8px]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-[32px] rounded-[8px] border border-line px-[12px] text-[12.5px] font-semibold text-ink-soft hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyRange}
              disabled={!fromValue || !toValue}
              className="h-[32px] rounded-[8px] bg-brand px-[12px] text-[12.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
