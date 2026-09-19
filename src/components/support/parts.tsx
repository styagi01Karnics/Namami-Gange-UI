import { ico } from '../ui/Ico'
import FileBadgeIcon from '../ui/FileBadgeIcon'
import StatusPill, { statusTone } from '../ui/StatusPill'

const CalendarIcon = ico('fluent:calendar-32-filled')
const WarningIcon = ico('clarity:warning-standard-solid')

/** Sub-heading used throughout both ticket detail pages. */
export function SectionLabel({ children, tone = 'brand', className = '' }) {
  const color = tone === 'brand' ? 'text-brand-link' : 'text-ink-soft'
  return <p className={`text-[13.5px] font-semibold leading-5 ${color} ${className}`}>{children}</p>
}

/** Muted line with a calendar glyph — "Created On: 12/02/2026 ,10:30 AM". */
export function DateLine({ label, value, className = '' }) {
  return (
    <p className={`flex items-center gap-[6px] text-[12px] leading-4 text-ink-soft ${className}`}>
      <CalendarIcon size={13} className="text-ink-muted" />
      {label}: <span className="font-medium text-ink">{value}</span>
    </p>
  )
}

/** Ticket id, its two pills and the issue category — the top strip of the header card. */
export function TicketIdentity({ ticket }) {
  return (
    <div className="flex flex-wrap items-start gap-x-[48px] gap-y-[14px]">
      <div>
        <div className="flex items-center gap-[8px]">
          <span className="text-[13px] leading-[18px] text-ink-soft">Ticket ID</span>
          <StatusPill tone={statusTone(ticket.status)}>{ticket.status}</StatusPill>
          <StatusPill tone={statusTone(ticket.priority)}>{ticket.priority}</StatusPill>
        </div>
        <p className="mt-[7px] text-[17px] font-bold leading-6 text-brand-link">{ticket.id}</p>
        <DateLine label="Created On" value={ticket.createdOn} className="mt-[7px]" />
      </div>

      <div>
        <SectionLabel>Issue Category</SectionLabel>
        <div className="mt-[9px] flex items-start gap-[9px]">
          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-danger-soft text-danger">
            <WarningIcon size={15} />
          </span>
          <span>
            <span className="block text-[13.5px] font-semibold leading-[18px] text-ink">{ticket.category.title}</span>
            <span className="block text-[12px] leading-4 text-ink-muted">{ticket.category.group}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/** Avatar + name + phone card used by "Raised By" and "Assigned To". */
export function PersonCard({ label, person }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-[9px] rounded-[10px] border border-[#BFD8F8] bg-white px-[13px] py-[12px]">
        <p className="text-[12.5px] leading-4 text-ink-soft">
          User ID : <span className="font-semibold text-brand-link">{person.userId}</span>
        </p>
        <div className="mt-[10px] flex items-center gap-[10px]">
          <span className="h-[36px] w-[36px] shrink-0 rounded-full bg-[#D9DFE7]" />
          <span className="min-w-0">
            <span className="block truncate text-[13.5px] font-semibold leading-[18px] text-ink">{person.name}</span>
            <span className="block text-[12.5px] leading-4 text-ink-soft">{person.phone}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export function LastUpdatedCard({ update }) {
  return (
    <div>
      <SectionLabel>Last Updated</SectionLabel>
      <div className="mt-[9px] rounded-[10px] border border-[#BFD8F8] bg-white px-[13px] py-[12px]">
        <p className="truncate text-[13.5px] font-semibold leading-5 text-ink">{update.message}</p>
        <DateLine label="Last Update On" value={update.on} className="mt-[9px]" />
      </div>
    </div>
  )
}

const fileKind = (name) => (name.toLowerCase().endsWith('.csv') ? 'csv' : 'pdf')

/** Attachment row — in the issue card it is read-only, in chat it can be cleared. */
export function AttachmentRow({ file, onRemove, className = '' }: { file: any; onRemove?: () => void; className?: string }) {
  return (
    <div
      className={`flex items-center gap-[10px] rounded-[9px] px-[12px] py-[10px] ${className || 'border border-line bg-white'}`}
    >
      <FileBadgeIcon kind={fileKind(file.name)} size={18} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium leading-[18px] text-brand-link">{file.name}</span>
        <span className="block text-[11.5px] leading-4 text-ink-muted">{file.size}</span>
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
          className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[6px] text-ink-soft transition-colors hover:text-danger"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
