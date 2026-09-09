const TONES = {
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-[#C4890B]',
  danger: 'bg-danger-soft text-danger',
  slate: 'bg-slate2-soft text-slate2',
  brand: 'bg-brand-soft text-brand',
}

/** Maps the status strings used across the mock data to a tone. */
export const statusTone = (status) =>
  ({
    Online: 'ok',
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
  })[status] ?? 'slate'

export default function StatusPill({ children, tone, className = '' }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-[11px] py-[3px] text-[11.5px] font-semibold leading-[16px] ${
        TONES[tone] ?? TONES.slate
      } ${className}`}
    >
      {children}
    </span>
  )
}
