import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import DateRangeField from '../components/ui/DateRangeField'
import StatCardsRow from '../components/ui/StatCardsRow'
import AdminTicketDetailPanel from '../components/support/AdminTicketDetailPanel'
import AdminTicketTable from '../components/support/AdminTicketTable'
import {
  adminTicketColumns,
  adminTicketRows,
  buildAdminTicketStats,
  buildTicketDetail,
  defaultDateRange,
} from '../data/mockData'

export default function SupportTicketsAdmin() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [range, setRange] = useState(defaultDateRange)
  const [rows, setRows] = useState(adminTicketRows)

  const stats = useMemo(() => buildAdminTicketStats(rows), [rows])
  const selected = ticketId ? rows.find((r) => r.id === ticketId) : null
  const detail = useMemo(() => (selected ? buildTicketDetail(selected) : null), [selected])

  const setStatus = (status) => setRows((prev) => prev.map((r) => (r.id === ticketId ? { ...r, status } : r)))

  if (ticketId && !selected) return <Navigate to="/support-tickets-admin" replace />

  if (detail) {
    return (
      <AdminTicketDetailPanel
        ticket={detail}
        onMarkPending={() => setStatus('Pending')}
        onClose={() => {
          setStatus('Closed')
          navigate('/support-tickets-admin')
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <div className="flex justify-end">
        <DateRangeField value={range} onChange={setRange} className="w-[280px]" />
      </div>

      <StatCardsRow items={stats} columns={5} gap={14} />

      <AdminTicketTable
        columns={adminTicketColumns}
        rows={rows}
        searchKeys={['id', 'contractor', 'category', 'status', 'priority', 'assignee']}
        onOpen={(row) => navigate(`/support-tickets-admin/${row.id}`)}
        emptyMessage="No tickets match your search."
      />
    </div>
  )
}
