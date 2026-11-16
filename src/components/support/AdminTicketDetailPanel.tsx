import Button from '../ui/Button'
import TicketConversation from './TicketConversation'
import TicketIssueDetails from './TicketIssueDetails'
import TicketTimeline from './TicketTimeline'
import { ticketCardClass } from './TicketDetailPanel'
import { LastUpdatedCard, PersonCard, TicketIdentity } from './parts'

/**
 * Ticket detail as the support desk sees it — who raised it, who owns it and
 * the two controls that move it along. Data and actions come from the page.
 */
export default function AdminTicketDetailPanel({
  ticket,
  onMarkPending,
  onClose,
  onSend,
  onDownloadAttachment,
}: {
  ticket: any
  onMarkPending: () => void
  onClose: () => void
  onSend: (text: string) => Promise<void>
  onDownloadAttachment: (attachment: any) => void
}) {
  const closed = ticket.status === 'Closed'

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <div className={ticketCardClass}>
        <div className="flex flex-wrap items-start justify-between gap-[16px]">
          <TicketIdentity ticket={ticket} />

          <div className="flex items-center gap-[10px]">
            <Button variant="warning" onClick={onMarkPending} disabled={closed}>
              Mark as Pending
            </Button>
            <Button variant="success" onClick={onClose} disabled={closed}>
              {closed ? 'Ticket Closed' : 'Close Ticket'}
            </Button>
          </div>
        </div>

        <div className="mt-[16px] grid grid-cols-3 gap-[16px]">
          <PersonCard label="Raised By" person={ticket.raisedBy} />
          <PersonCard label="Assigned To" person={ticket.assignedTo} />
          <LastUpdatedCard update={ticket.lastUpdate} />
        </div>

        <div className="mt-[16px]">
          <TicketIssueDetails description={ticket.description} attachments={ticket.attachments} />
        </div>
      </div>

      <div className="grid grid-cols-[1.9fr_1fr] items-stretch gap-[16px]">
        <TicketConversation
          violationId={ticket.violationId}
          messages={ticket.conversation}
          onSend={onSend}
          onDownloadAttachment={onDownloadAttachment}
        />
        <TicketTimeline steps={ticket.timeline} />
      </div>
    </div>
  )
}
