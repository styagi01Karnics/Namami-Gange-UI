import type { ReactNode } from 'react'
import clsx from 'clsx'
import iconSearch from '@/assets/shared/icon-search.svg'
import iconDownload from '@/assets/shared/icon-download.svg'
import iconCalendar from '@/assets/shared/icon-calendar.svg'
import iconRefresh from '@/assets/shared/icon-refresh.svg'
import iconChevron from '@/assets/shared/icon-chevron-sm.svg'

export function Card({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'rounded-[10px] bg-white shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({
  icon,
  iconBg,
  label,
  value,
  valueClassName,
  link = 'Across all states',
}: {
  icon: string
  iconBg: string
  label: string
  value: string
  valueClassName?: string
  link?: string
}) {
  return (
    <Card className="flex min-h-[153px] flex-1 flex-col p-4">
      <div
        className="flex size-8 items-center justify-center rounded opacity-80"
        style={{ backgroundColor: iconBg }}
      >
        <div className="relative flex size-5 items-center justify-center overflow-clip">
          <img src={icon} alt="" className="max-h-4 max-w-4" />
        </div>
      </div>
      <p className="mt-2 text-[14px] font-medium leading-[22px] text-[#646464]">
        {label}
      </p>
      <p
        className={clsx(
          'mt-1 text-[16px] font-semibold leading-[22px]',
          valueClassName ?? 'text-[#07121e]',
        )}
      >
        {value}
      </p>
      <span className="mt-2 inline-flex h-5 w-fit items-center justify-center rounded-full bg-[#f4faff] px-1 opacity-80">
        <span className="px-0.5 text-[12px] font-medium leading-[14px] text-[#0768d2]">
          {link}
        </span>
      </span>
    </Card>
  )
}

export function DateRefreshBar() {
  return (
    <div className="flex items-center justify-end gap-3">
      <div className="relative flex h-9 w-[371px] items-center rounded border border-[#eff0f6] bg-white px-3">
        <span className="text-[12px] font-medium leading-6 text-[#646464]">
          19 May 2026, 05:30 PM - 19 May 2026, 07:30 PM
        </span>
        <img
          src={iconCalendar}
          alt=""
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2"
        />
      </div>
      <button
        type="button"
        className="flex h-9 items-center gap-2 rounded border border-[#0768d2] bg-white px-3"
      >
        <span className="text-[12px] font-medium leading-6 text-[#0768d2]">
          Refresh
        </span>
        <img src={iconRefresh} alt="" className="size-4" />
      </button>
    </div>
  )
}

export function SearchExportBar({
  extra,
  className,
}: {
  extra?: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('flex flex-wrap items-center justify-end gap-3', className)}>
      {extra}
      <div className="relative flex h-[33px] w-[350px] items-center rounded border border-[#eff0f6] bg-white px-3">
        <span className="text-[12px] font-medium leading-6 text-[#646464]">
          Search
        </span>
        <img
          src={iconSearch}
          alt=""
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2"
        />
      </div>
      <button
        type="button"
        className="flex h-[33px] items-center gap-2 rounded border border-[#0768d2] px-3"
      >
        <span className="text-[12px] font-medium leading-6 text-[#0768d2]">
          PDF
        </span>
        <img src={iconDownload} alt="" className="size-4" />
      </button>
      <button
        type="button"
        className="flex h-[33px] items-center gap-2 rounded border border-[#0768d2] px-3"
      >
        <span className="text-[12px] font-medium leading-6 text-[#0768d2]">
          CSV
        </span>
        <img src={iconDownload} alt="" className="size-4" />
      </button>
    </div>
  )
}

export function StatusPill({
  label,
  tone,
}: {
  label: string
  tone: 'green' | 'red' | 'orange' | 'gray' | 'blue'
}) {
  const tones = {
    green: 'bg-[#e8f8ee] text-[#168e3f]',
    red: 'bg-[#fde8e8] text-[#dc2626]',
    orange: 'bg-[#fff4e5] text-[#f69a30]',
    gray: 'bg-[#f0f0f0] text-[#646464]',
    blue: 'bg-[#edf3fd] text-[#0768d2]',
  }
  return (
    <span
      className={clsx(
        'inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium',
        tones[tone],
      )}
    >
      {label}
    </span>
  )
}

export function ParamChip({
  label,
  active,
}: {
  label: string
  active?: boolean
}) {
  return (
    <span
      className={clsx(
        'inline-flex h-8 items-center rounded border px-2 text-[12px] font-medium',
        active
          ? 'border-[#0768d2] bg-[#edf3fd] text-[#0768d2]'
          : 'border-[#eff0f6] bg-white text-[#646464]',
      )}
    >
      {label}
    </span>
  )
}

export function SortHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[14px] font-medium leading-[22px] text-[#646464]">
        {label}
      </span>
      <img src={iconChevron} alt="" className="size-4" />
    </div>
  )
}

export function StatesDropdown() {
  return (
    <div className="relative ml-auto flex h-9 w-[198px] items-center rounded border border-[#eff0f6] bg-white px-3">
      <span className="text-[12px] font-medium leading-6 text-[#646464]">
        All States
      </span>
      <img
        src={iconChevron}
        alt=""
        className="absolute right-3 top-1/2 size-4 -translate-y-1/2"
      />
    </div>
  )
}
