import { ArrowUpRight } from 'lucide-react'

export const TONE_TEXT = {
  ink: 'text-ink',
  danger: 'text-danger',
  ok: 'text-ok',
  warn: 'text-[#C4890B]',
  brand: 'text-brand-link',
  muted: 'text-ink-muted',
}

/** Blue sub-heading used throughout the expanded violation panel. */
export function PanelHeading({ children, className = '' }) {
  return (
    <h4 className={`text-[13.5px] font-semibold leading-5 text-brand-link ${className}`}>{children}</h4>
  )
}

/** label on the left, value pushed to the right — the panel's workhorse row. */
export function LabelRow({ label, value, tone = 'ink' }) {
  return (
    <div className="flex items-start justify-between gap-[12px]">
      <span className="text-[13px] leading-[18px] text-ink-soft">{label}</span>
      <span className={`text-right text-[13px] font-medium leading-[18px] ${TONE_TEXT[tone]}`}>{value}</span>
    </div>
  )
}

export function TrendValue({ value, tone = 'danger' }) {
  return (
    <span className={`inline-flex items-center gap-[3px] ${TONE_TEXT[tone]}`}>
      <ArrowUpRight size={15} strokeWidth={2.6} />
      {value}
    </span>
  )
}
