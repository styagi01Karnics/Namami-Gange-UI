import DataTable from '../ui/DataTable'
import StatusPill, { statusTone } from '../ui/StatusPill'

/** Ticket id rendered as the link that opens the ticket detail page. */
export function TicketIdLink({ id, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[13px] font-medium leading-[18px] text-brand-link hover:underline"
    >
      {id}
    </button>
  )
}

export default function SupportTicketTable({ onOpen, ...props }: any) {
  const renderCell = (row, col) => {
    if (col.key === 'id') return <TicketIdLink id={row.id} onClick={() => onOpen?.(row)} />
    if (col.key === 'priority' || col.key === 'status') {
      return <StatusPill tone={statusTone(row[col.key])}>{row[col.key]}</StatusPill>
    }
    return undefined
  }

  return <DataTable renderCell={renderCell} {...props} />
}
