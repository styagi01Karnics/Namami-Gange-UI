import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ico } from '../components/ui/Ico'
import Button from '../components/ui/Button'
import DateRangeField, { parseDateRangeLabel } from '../components/ui/DateRangeField'
import SoftStatCardsRow from '../components/ui/SoftStatCard'
import RaiseTicketModal from '../components/support/RaiseTicketModal'
import SupportTicketTable from '../components/support/SupportTicketTable'
import TicketDetailPanel from '../components/support/TicketDetailPanel'
import {
  type ApiCategory,
  type ApiSummary,
  type CreateTicketInput,
  type SupportTicketDetail,
  type SupportTicketRow,
  confirmTicketResolution,
  createTicket,
  downloadTicketAttachment,
  fetchTicketCategories,
  fetchTicketRows,
  fetchTicketSummary,
  fetchTicketView,
  postTicketMessage,
  toIsoDate,
} from '../api/supportTickets'
import { defaultDateRange } from '../data/mockData'

const PlusIcon = ico('fluent:add-24-filled')

const supportTicketColumns = [
  { key: 'id', label: 'Ticket ID', width: '12%', sortable: true },
  { key: 'issue', label: 'Issue Raised', width: '24%' },
  { key: 'stpName', label: 'STP Name', width: '22%' },
  { key: 'date', label: 'Date', width: '13%', sortable: true },
  { key: 'status', label: 'Status', width: '14%' },
  { key: 'updatedOn', label: 'Last Updated On', width: '15%' },
]

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback
}

function buildStats(summary: ApiSummary | null) {
  const byStatus = summary?.byStatus ?? {}
  const count = (key: string) => byStatus[key] ?? 0

  return [
    { key: 'total', label: 'Total Tickets', value: summary?.total ?? 0, tone: 'brand' as const },
    { key: 'open', label: 'Open Tickets', value: count('OPEN'), tone: 'ok' as const },
    { key: 'progress', label: 'In Progress', value: count('IN_PROGRESS'), tone: 'warn' as const },
    { key: 'closed', label: 'Closed Tickets', value: count('CLOSED'), tone: 'danger' as const },
    { key: 'action', label: 'Action Required', value: count('ACTION_REQUIRED'), tone: 'violet' as const },
  ]
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-[10px] border border-danger-soft bg-white px-[14px] py-[10px] text-[13px] leading-5 text-danger">
      {message}
    </p>
  )
}

export default function SupportTickets() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [range, setRange] = useState(defaultDateRange)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [rows, setRows] = useState<SupportTicketRow[]>([])
  const [summary, setSummary] = useState<ApiSummary | null>(null)
  const [listKey, setListKey] = useState(0)
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [detail, setDetail] = useState<SupportTicketDetail | null>(null)
  const [detailKey, setDetailKey] = useState(0)
  const [detailError, setDetailError] = useState('')
  const [actionError, setActionError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchTicketCategories()
      .then(setCategories)
      .catch((err) => setListError(errorMessage(err, 'Could not load ticket categories.')))
  }, [])

  useEffect(() => {
    const parsed = parseDateRangeLabel(range)
    if (!parsed) return

    let cancelled = false
    const from = toIsoDate(parsed.from)
    const to = toIsoDate(parsed.to)
    setListLoading(true)
    setListError('')
    Promise.all([fetchTicketRows({ from, to }), fetchTicketSummary(from, to)])
      .then(([nextRows, nextSummary]) => {
        if (cancelled) return
        setRows(nextRows)
        setSummary(nextSummary)
      })
      .catch((err) => {
        if (!cancelled) setListError(errorMessage(err, 'Could not load tickets.'))
      })
      .finally(() => {
        if (!cancelled) setListLoading(false)
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
    fetchTicketView(ticketId, categories)
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

  const stats = buildStats(summary)
  const currentDetail = detail && detail.id === ticketId ? detail : null

  const handleCreate = async (input: CreateTicketInput) => {
    await createTicket(input)
    setListKey((k) => k + 1)
  }

  const handleSendMessage = async (text: string) => {
    if (!ticketId) return
    try {
      await postTicketMessage(ticketId, text)
      setDetailKey((k) => k + 1)
    } catch (err) {
      setActionError(errorMessage(err, 'Could not send your message.'))
      throw err
    }
  }

  const handleConfirmResolution = async () => {
    if (!ticketId) return
    try {
      await confirmTicketResolution(ticketId)
      setListKey((k) => k + 1)
      setDetailKey((k) => k + 1)
    } catch (err) {
      setActionError(errorMessage(err, 'Could not confirm the resolution.'))
    }
  }

  const handleDownloadAttachment = (attachment: { id: number; name: string }) => {
    if (!ticketId) return
    downloadTicketAttachment(ticketId, attachment).catch((err) =>
      setActionError(errorMessage(err, 'Could not download the attachment.')),
    )
  }

  if (ticketId) {
    if (currentDetail) {
      return (
        <div className="flex flex-col gap-[16px] pb-[22px]">
          {actionError && <ErrorBanner message={actionError} />}
          <TicketDetailPanel
            ticket={currentDetail}
            onSendMessage={handleSendMessage}
            onConfirmResolution={handleConfirmResolution}
            onDownloadAttachment={handleDownloadAttachment}
          />
        </div>
      )
    }

    if (detailError) {
      return (
        <div className="flex flex-col items-start gap-[12px] pb-[22px]">
          <ErrorBanner message={detailError} />
          <Button variant="ghost" onClick={() => navigate('/support-tickets')}>
            Back to tickets
          </Button>
        </div>
      )
    }

    return <p className="text-[13px] leading-5 text-ink-soft">Loading ticket…</p>
  }

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      {listError && <ErrorBanner message={listError} />}

      <div className="flex flex-wrap items-center justify-end gap-[14px]">
        <DateRangeField value={range} onChange={setRange} className="w-[280px]" />
        <Button onClick={() => setModalOpen(true)}>
          Raise Ticket
          <PlusIcon size={16} />
        </Button>
      </div>

      <SoftStatCardsRow items={stats} columns={5} gap={14} />

      <SupportTicketTable
        columns={supportTicketColumns}
        rows={rows}
        searchKeys={['id', 'issue', 'category', 'status']}
        onOpen={(row) => navigate(`/support-tickets/${row.id}`)}
        emptyMessage={listLoading ? 'Loading tickets…' : 'No tickets match your search.'}
      />

      <RaiseTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        categories={categories}
      />
    </div>
  )
}
