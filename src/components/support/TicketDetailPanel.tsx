import TicketConversation from './TicketConversation'
import TicketIssueDetails from './TicketIssueDetails'
import TicketTimeline from './TicketTimeline'
import { LastUpdatedCard, TicketIdentity } from './parts'
import Button from '../ui/Button'

export const ticketCardClass =
  'rounded-[14px] border border-[#DCEAFB] bg-gradient-to-b from-[#F2F8FF] to-[#FCFDFF] p-[18px] shadow-card'

/** Ticket detail as the contractor sees it — read-only, no assignment info. */
export default function TicketDetailPanel({ ticket, onSendMessage, onConfirmResolution, onDownloadAttachment }) {
  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <div className={ticketCardClass}>
        <TicketIdentity ticket={ticket} />

        {ticket.status === 'Action Required' && onConfirmResolution && (
          <div className="mt-[16px] flex justify-end">
            <Button onClick={onConfirmResolution}>Confirm resolution</Button>
          </div>
        )}

        <div className="mt-[16px]">
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
          onSend={onSendMessage}
          onDownloadAttachment={onDownloadAttachment}
        />
        <TicketTimeline steps={ticket.timeline} />
      </div>
    </div>
  )
}
