import { useState } from 'react'
import { ico } from '../ui/Ico'
import { AttachmentRow, SectionLabel } from './parts'

const SendIcon = ico('fluent:send-24-filled')
const SmileIcon = ico('fluent:emoji-24-filled')
const PlusIcon = ico('fluent:add-24-filled')

function Bubble({ message, onRemoveAttachment }) {
  const mine = message.side === 'left'

  return (
    <li className={`flex gap-[11px] ${mine ? '' : 'flex-row-reverse'}`}>
      <span className="mt-[2px] h-[34px] w-[34px] shrink-0 rounded-full bg-[#D9DFE7]" />

      <div className={`min-w-0 max-w-[86%] ${mine ? '' : 'flex flex-col items-end'}`}>
        <div className={`flex items-center gap-[14px] ${mine ? '' : 'flex-row-reverse'}`}>
          <span className="text-[13px] font-semibold leading-[18px] text-ink">{message.author}</span>
          <span className="text-[11.5px] leading-4 text-ink-muted">{message.time}</span>
        </div>

        <div
          className={`mt-[7px] rounded-[10px] px-[14px] py-[11px] text-[13px] leading-[19px] text-ink ${
            mine ? 'bg-[#EAF3FE]' : 'bg-[#FDF3E2]'
          }`}
        >
          <p>{message.text}</p>

          {message.attachments?.length > 0 && (
            <>
              <p className="mt-[9px] text-[12.5px] font-medium leading-4 text-brand-link">
                Attachments ({message.attachments.length})
              </p>
              <div className="mt-[7px] space-y-[8px]">
                {message.attachments.map((file) => (
                  <AttachmentRow
                    key={file.name}
                    file={file}
                    onRemove={() => onRemoveAttachment?.(message.id, file.name)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

/** Chat thread plus composer. Replies are kept locally — there is no API yet. */
export default function TicketConversation({ violationId, messages }) {
  const [thread, setThread] = useState(messages)
  const [draft, setDraft] = useState('')

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setThread((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        author: 'You',
        side: 'left',
        time: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        text,
      },
    ])
    setDraft('')
  }

  const removeAttachment = (messageId, fileName) =>
    setThread((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, attachments: m.attachments.filter((f) => f.name !== fileName) } : m,
      ),
    )

  return (
    <div className="flex flex-col rounded-[12px] border border-line bg-white p-[16px] shadow-card">
      <SectionLabel>Conversation</SectionLabel>
      <p className="mt-[6px] text-[12.5px] leading-4 text-ink-soft">
        Violation ID : <span className="font-semibold text-danger">{violationId}</span>
      </p>

      <ul className="scroll-thin mt-[16px] max-h-[420px] flex-1 space-y-[18px] overflow-y-auto pr-[4px]">
        {thread.map((message) => (
          <Bubble key={message.id} message={message} onRemoveAttachment={removeAttachment} />
        ))}
      </ul>

      <div className="mt-[16px] rounded-[10px] border border-line bg-white px-[14px] pb-[10px] pt-[12px]">
        <div className="flex items-start gap-[10px]">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            rows={1}
            placeholder="Type a message"
            aria-label="Type a message"
            className="scroll-thin max-h-[90px] min-h-[22px] flex-1 resize-none bg-transparent text-[13px] leading-[22px] text-ink outline-none placeholder:text-ink-muted"
          />
          <button
            type="button"
            onClick={send}
            aria-label="Send message"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#4A5A6D] text-white transition-colors hover:bg-ink"
          >
            <SendIcon size={15} />
          </button>
        </div>

        <div className="mt-[10px] flex items-center gap-[10px] text-ink-muted">
          <button type="button" aria-label="Add emoji" className="transition-colors hover:text-brand">
            <SmileIcon size={17} />
          </button>
          <span className="h-[17px] w-[17px] rounded-full border border-[#C9D4E0]" />
          <button type="button" aria-label="Add attachment" className="transition-colors hover:text-brand">
            <PlusIcon size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
