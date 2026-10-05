import DataTable from '../ui/DataTable'
import StatusPill, { statusTone } from '../ui/StatusPill'

/** Ticket id rendered as the link that opens the ticket detail page. */
export function TicketIdLink({ id, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[14px] font-medium leading-[22px] text-[#0768D2] underline hover:opacity-90"
    >
      {id}
    </button>
  )
}

export default function SupportTicketTable({ onOpen, ...props }: any) {
  const renderCell = (row, col) => {
    if (col.key === 'id') return <TicketIdLink id={row.id} onClick={() => onOpen?.(row)} />
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
    return undefined
  }

  return <DataTable renderCell={renderCell} {...props} />
}
