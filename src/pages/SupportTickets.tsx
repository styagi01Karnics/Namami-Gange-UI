import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ico } from '../components/ui/Ico'
import Button from '../components/ui/Button'
import DateRangeField from '../components/ui/DateRangeField'
import StatCardsRow from '../components/ui/StatCardsRow'
import RaiseTicketModal from '../components/support/RaiseTicketModal'
import SupportTicketTable from '../components/support/SupportTicketTable'
import TicketDetailPanel from '../components/support/TicketDetailPanel'
import {
  buildSupportTicketStats,
  buildTicketDetail,
  defaultDateRange,
  supportTicketColumns,
  supportTicketRows,
} from '../data/mockData'

const PlusIcon = ico('fluent:add-24-filled')

function nextTicketId(rows) {
  const max = rows.reduce((n, r) => {
    const num = Number(String(r.id).replace(/\D/g, ''))
    return Number.isFinite(num) ? Math.max(n, num) : n
  }, 10200)
  return `TKT-${max + 1}`
}

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function SupportTickets() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [range, setRange] = useState(defaultDateRange)
  const [rows, setRows] = useState(supportTicketRows)
  const [modalOpen, setModalOpen] = useState(false)

  const stats = useMemo(() => buildSupportTicketStats(rows), [rows])
  const selected = ticketId ? rows.find((r) => r.id === ticketId) : null
  const detail = useMemo(() => (selected ? buildTicketDetail(selected) : null), [selected])

  const handleSubmit = (ticket) => {
    const today = todayLabel()
    setRows((prev) => [
      {
        id: nextTicketId(prev),
        category: ticket.category,
        issue: ticket.issue,
        date: today,
        priority: ticket.priority,
        status: 'Open',
        updatedOn: today,
        description: ticket.description,
        attachments: ticket.attachments,
      },
      ...prev,
    ])
  }

  if (ticketId && !selected) return <Navigate to="/support-tickets" replace />
  if (detail) return <TicketDetailPanel ticket={detail} />

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <div className="flex flex-wrap items-center justify-end gap-[14px]">
        <DateRangeField value={range} onChange={setRange} className="w-[280px]" />
        <Button onClick={() => setModalOpen(true)}>
          Raise Ticket
          <PlusIcon size={16} />
        </Button>
      </div>

      <StatCardsRow items={stats} columns={5} gap={14} size="comfortable" />

      <SupportTicketTable
        columns={supportTicketColumns}
        rows={rows}
        searchKeys={['id', 'issue', 'category', 'status', 'priority']}
        onOpen={(row) => navigate(`/support-tickets/${row.id}`)}
        emptyMessage="No tickets match your search."
      />

      <RaiseTicketModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  )
}
