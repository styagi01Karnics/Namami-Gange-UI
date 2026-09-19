import { ico } from '../ui/Ico'
import { SectionLabel } from './parts'

const ICONS = {
  raised: ico('fluent:diamond-24-filled'),
  assigned: ico('fluent:layer-24-filled'),
  reply: ico('fluent:chat-24-filled'),
  info: ico('fluent:chat-bubbles-question-24-filled'),
  document: ico('fluent:checkmark-circle-32-filled'),
  resolution: ico('fluent:settings-32-filled'),
  confirmation: ico('fluent:chat-multiple-24-filled'),
}

/** Vertical activity log on the right of both ticket detail pages. */
export default function TicketTimeline({ steps }) {
  return (
    <div className="flex h-[560px] min-h-0 flex-col overflow-hidden rounded-[12px] border border-line bg-white p-[16px] shadow-card">
      <SectionLabel tone="muted">Ticket Timeline</SectionLabel>

      <ol className="scroll-thin mt-[16px] min-h-0 flex-1 overflow-y-auto">
        {steps.map((step, i) => {
          const Icon = ICONS[step.icon] ?? ICONS.raised
          const last = i === steps.length - 1

          return (
            <li key={step.key} className="flex gap-[16px]">
              <span className="flex flex-col items-center">
                <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] bg-[#EAF2FD] text-brand">
                  <Icon size={18} />
                </span>
                {!last && <span className="w-px flex-1 bg-line" />}
              </span>

              <span className={`min-w-0 ${last ? '' : 'pb-[24px]'}`}>
                <span className="block text-[14.5px] leading-[21px] text-ink-soft">{step.label}</span>
                <span className="mt-[6px] block text-[15px] font-medium leading-[22px] text-ink">{step.time}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
