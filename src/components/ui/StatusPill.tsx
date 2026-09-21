import type { ReactNode } from 'react'

const TONES = {
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-[#C4890B]',
  danger: 'bg-danger-soft text-danger',
  slate: 'bg-slate2-soft text-slate2',
  brand: 'bg-brand-soft text-brand',
  orange: 'bg-[#FDF0E1] text-orange',
  violet: 'bg-[#F0EBFD] text-[#7A5AF8]',
} as const

export type StatusTone = keyof typeof TONES

/** Maps the status strings used across the mock data to a tone. */
export const statusTone = (status: string): StatusTone =>
  ({
    Online: 'ok',
    Live: 'ok',
    Recovered: 'ok',
    Successful: 'ok',
    Invited: 'warn',
    Failed: 'danger',
    Pending: 'warn',
    Active: 'ok',
    Present: 'ok',
    Adequate: 'ok',
    'Low Stock': 'warn',
    'Out of Stock': 'danger',
    'On Leave': 'warn',
    'Under Maintenance': 'warn',
    Absent: 'danger',
    Offline: 'danger',
    Inactive: 'slate',
    Open: 'danger',
    'In Progress': 'orange',
    'Action Required': 'warn',
    Closed: 'ok',
    Low: 'ok',
    Mid: 'warn',
    High: 'danger',
    Raised: 'warn',
    Approved: 'brand',
    Applied: 'danger',
    Paid: 'ok',
  } as Record<string, StatusTone>)[status] ?? 'slate'

type StatusPillProps = {
  children?: ReactNode
  tone?: StatusTone | string
  className?: string
}

export default function StatusPill({ children, tone, className = '' }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-[11px] py-[3px] text-[11.5px] font-semibold leading-[16px] ${
        TONES[tone as StatusTone] ?? TONES.slate
      } ${className}`}
    >
      {children}
    </span>
  )
}
