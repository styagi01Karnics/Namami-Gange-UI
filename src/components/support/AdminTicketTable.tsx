import { ico } from '../ui/Ico'
import DataTable from '../ui/DataTable'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { TicketIdLink } from './SupportTicketTable'

const TimerIcon = ico('fluent:timer-24-filled')
const EyeIcon = ico('fluent:eye-24-filled')

export default function AdminTicketTable({ onOpen, ...props }: any) {
  const renderCell = (row, col) => {
    if (col.key === 'id') return <TicketIdLink id={row.id} onClick={() => onOpen?.(row)} />

    if (col.key === 'createdOn') {
      return (
        <span className="block">
          <span className="block text-[13px] leading-[18px] text-ink">{row.createdOn}</span>
          <span className="mt-[3px] block text-[11.5px] leading-4 text-orange">{row.dueOn}</span>
        </span>
      )
    }

    if (col.key === 'priority' || col.key === 'status') {
      return <StatusPill tone={statusTone(row[col.key])}>{row[col.key]}</StatusPill>
    }

    if (col.key === 'sla') {
      if (!row.sla) return <span className="text-ink-muted">—</span>
      return (
        <span className="flex items-center gap-[6px] text-[12.5px] font-medium leading-4 text-danger">
          <TimerIcon size={15} />
          {row.sla}
        </span>
      )
    }

    if (col.key === 'details') {
      return (
        <button
          type="button"
          onClick={() => onOpen?.(row)}
          aria-label={`Open ${row.id}`}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#BFD8F8] bg-white text-brand transition-colors hover:bg-brand-soft"
        >
          <EyeIcon size={15} />
        </button>
      )
    }

    return undefined
  }

  return <DataTable renderCell={renderCell} minWidth={1180} {...props} />
}
