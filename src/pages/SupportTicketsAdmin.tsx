import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DateRangeField, { parseDateRangeLabel } from '../components/ui/DateRangeField'
import SoftStatCardsRow from '../components/ui/SoftStatCard'
import AdminTicketDetailPanel from '../components/support/AdminTicketDetailPanel'
import AdminTicketTable from '../components/support/AdminTicketTable'
import {
  type AdminTicketRow,
  type ApiCategory,
  type SupportTicketDetail,
  adminTicketApi,
  downloadAdminTicketAttachment,
  fetchAdminTicketRows,
  fetchAdminTicketView,
  fetchTicketCategories,
  toIsoDate,
} from '../api/supportTickets'
import { defaultDateRange } from '../data/mockData'

const adminTicketColumns = [
  { key: 'id', label: 'Ticket ID', width: '10%', sortable: true },
  { key: 'createdOn', label: 'Created On', width: '16%' },
  { key: 'contractor', label: 'Raised By', width: '14%' },
  { key: 'stpName', label: 'STP Name', width: '18%' },
  { key: 'category', label: 'Category', width: '11%' },
  { key: 'status', label: 'Status', width: '13%' },
  { key: 'assignee', label: 'Assigned To', width: '13%' },
  { key: 'details', label: 'Details', width: '5%' },
]

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback
}

/** Summary cards above the admin table, counted off the loaded rows. */
function buildAdminStats(rows: AdminTicketRow[]) {
  const count = (status: string) => rows.filter((r) => r.status === status).length

  return [
    { key: 'total', label: 'Total Tickets', value: rows.length, tone: 'brand' as const },
    { key: 'open', label: 'Open Tickets', value: count('Open'), tone: 'ok' as const },
    { key: 'progress', label: 'In Progress', value: count('In Progress'), tone: 'warn' as const },
    { key: 'closed', label: 'Closed Tickets', value: count('Closed'), tone: 'danger' as const },
    { key: 'action', label: 'Action Required', value: count('Action Required'), tone: 'violet' as const },
  ]
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-[10px] border border-danger-soft bg-white px-[14px] py-[10px] text-[13px] leading-5 text-danger">
      {message}
    </p>
  )
}

export default function SupportTicketsAdmin() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [range, setRange] = useState(defaultDateRange)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [rows, setRows] = useState<AdminTicketRow[]>([])
  const [listKey, setListKey] = useState(0)
  const [listError, setListError] = useState('')
  const [detail, setDetail] = useState<SupportTicketDetail | null>(null)
  const [detailKey, setDetailKey] = useState(0)
  const [detailError, setDetailError] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    fetchTicketCategories()
      .then(setCategories)
      .catch((err) => setListError(errorMessage(err, 'Could not load ticket categories.')))
  }, [])

  useEffect(() => {
    const parsed = parseDateRangeLabel(range)
    if (!parsed) return

    let cancelled = false
    setListError('')
    fetchAdminTicketRows({ from: toIsoDate(parsed.from), to: toIsoDate(parsed.to) })
      .then((next) => {
        if (!cancelled) setRows(next)
      })
      .catch((err) => {
        if (!cancelled) setListError(errorMessage(err, 'Could not load tickets.'))
      })
    return () => {
      cancelled = true
    }
  }, [range, listKey])

  useEffect(() => {
    if (!ticketId) return

    let cancelled = false
    setDetailError('')
    setActionError('')
    fetchAdminTicketView(ticketId, categories)
      .then((next) => {
        if (!cancelled) setDetail(next)
      })
      .catch((err) => {
        if (!cancelled) {
          setDetail(null)
          setDetailError(errorMessage(err, 'Could not load this ticket.'))
        }
      })
    return () => {
      cancelled = true
    }
  }, [ticketId, categories, detailKey])

  const stats = buildAdminStats(rows)
  const currentDetail = detail && detail.id === ticketId ? detail : null
  const id = ticketId ?? ''

  // Runs an admin write, then reloads the open ticket and the list. Resolves false on failure.
  const perform = async (task: () => Promise<unknown>) => {
    setActionError('')
    try {
      await task()
      setDetailKey((k) => k + 1)
      setListKey((k) => k + 1)
      return true
    } catch (err) {
      setActionError(errorMessage(err, 'Action failed. Please try again.'))
      return false
    }
  }

  // Throwing keeps the composer's draft so the reply can be retried.
  const sendReply = async (text: string) => {
    if (!(await perform(() => adminTicketApi.postMessage(id, text)))) throw new Error('Reply not sent')
  }

  const markPending = () => perform(() => adminTicketApi.updateStatus(id, 'ACTION_REQUIRED'))

  const closeTicket = async () => {
    if (await perform(() => adminTicketApi.updateStatus(id, 'CLOSED'))) navigate('/support-tickets-admin')
  }

  const downloadAttachment = (file: { id: number; name: string }) =>
    downloadAdminTicketAttachment(id, file).catch((err) =>
      setActionError(errorMessage(err, 'Could not download the attachment.')),
    )

  if (ticketId) {
    if (!currentDetail) return detailError ? <ErrorBanner message={detailError} /> : null

    return (
      <div className="flex flex-col gap-[16px] pb-[22px]">
        {actionError && <ErrorBanner message={actionError} />}
        <AdminTicketDetailPanel
          ticket={currentDetail}
          onMarkPending={markPending}
          onClose={closeTicket}
          onSend={sendReply}
          onDownloadAttachment={downloadAttachment}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <div className="flex justify-end">
        <DateRangeField value={range} onChange={setRange} className="w-[280px]" />
      </div>

      {listError && <ErrorBanner message={listError} />}

      <SoftStatCardsRow items={stats} columns={5} gap={14} />

      <AdminTicketTable
        columns={adminTicketColumns}
        rows={rows}
        searchKeys={['id', 'contractor', 'stpName', 'category', 'status', 'assignee']}
        onOpen={(row) => navigate(`/support-tickets-admin/${row.id}`)}
        emptyMessage="No tickets match your search."
      />
    </div>
  )
}
