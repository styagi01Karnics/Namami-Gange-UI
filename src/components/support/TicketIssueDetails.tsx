import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { AttachmentRow, SectionLabel } from './parts'

/** Collapsible description + attachment block that sits under the ticket header. */
export default function TicketIssueDetails({ description, attachments = [] }) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-[6px] text-[13.5px] font-medium leading-5 text-ink underline underline-offset-[3px] transition-colors hover:text-brand"
      >
        Issue Details
        <ChevronUp size={16} strokeWidth={2.2} className={`transition-transform ${open ? '' : 'rotate-180'}`} />
      </button>

      {open && (
        <div className="mt-[11px] rounded-[12px] bg-white p-[16px]">
          <SectionLabel>Description</SectionLabel>
          <p className="mt-[9px] rounded-[10px] bg-[#F1F7FE] px-[15px] py-[14px] text-[13px] leading-[22px] text-ink">
            {description}
          </p>

          {attachments.length > 0 && (
            <>
              <SectionLabel className="mt-[16px]">Attachement</SectionLabel>
              <div className="mt-[9px] grid grid-cols-2 gap-[12px]">
                {attachments.map((file) => (
                  <AttachmentRow key={file.name} file={file} className="border-transparent bg-[#F7FAFE]" />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
