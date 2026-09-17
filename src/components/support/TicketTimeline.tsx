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
    <div className="rounded-[12px] border border-line bg-white p-[16px] shadow-card">
      <SectionLabel tone="muted">Ticket Timeline</SectionLabel>

      <ol className="mt-[16px]">
        {steps.map((step, i) => {
          const Icon = ICONS[step.icon] ?? ICONS.raised
          const last = i === steps.length - 1

          return (
            <li key={step.key} className="flex gap-[11px]">
              <span className="flex flex-col items-center">
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-[#EAF2FD] text-brand">
                  <Icon size={14} />
                </span>
                {!last && <span className="w-px flex-1 bg-line" />}
              </span>

              <span className={`min-w-0 ${last ? '' : 'pb-[16px]'}`}>
                <span className="block text-[12.5px] leading-[17px] text-ink-soft">{step.label}</span>
                <span className="mt-[3px] block text-[13px] font-medium leading-[18px] text-ink">{step.time}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
