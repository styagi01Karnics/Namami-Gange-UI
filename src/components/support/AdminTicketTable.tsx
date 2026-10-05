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
          <span className="block text-[14px] font-medium leading-[22px] text-[#07121E]">{row.createdOn}</span>
          <span className="mt-[3px] block text-[12px] font-medium leading-4 text-[#ED7831]">{row.dueOn}</span>
        </span>
      )
    }

    if (col.key === 'priority' || col.key === 'status') {
      return (
        <StatusPill
          tone={statusTone(row[col.key])}
          className="h-[32px] min-w-[88px] justify-center px-[8px] text-[14px] leading-4"
        >
          {row[col.key]}
        </StatusPill>
      )
    }

    if (col.key === 'sla') {
      if (!row.sla) return <span className="text-[#646464]">—</span>
      return (
        <span className="flex items-center gap-[6px] text-[14px] font-medium leading-[22px] text-[#DC2626]">
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
          className="inline-flex items-center justify-center rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#D7EDFF] p-[6px] text-[#0768D2] transition-opacity hover:opacity-90"
        >
          <EyeIcon size={20} />
        </button>
      )
    }

    return undefined
  }

  return <DataTable renderCell={renderCell} minWidth={1180} {...props} />
}
