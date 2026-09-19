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
        className="flex items-center gap-[6px] text-[13.5px] font-medium leading-5 text-brand-link underline underline-offset-[3px] transition-colors hover:text-brand"
      >
        Issue Details
        <ChevronUp size={16} strokeWidth={2.2} className={`transition-transform ${open ? '' : 'rotate-180'}`} />
      </button>

      {open && (
        <div className="mt-[14px] rounded-[12px] border border-[#BFD8F8] bg-white p-[18px]">
          <SectionLabel>Description</SectionLabel>
          <p className="mt-[12px] rounded-[10px] bg-[#F1F7FE] px-[16px] py-[16px] text-[13px] leading-[24px] text-ink">
            {description}
          </p>

          {attachments.length > 0 && (
            <>
              <SectionLabel className="mt-[20px]">Attachement</SectionLabel>
              <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                {attachments.map((file) => (
                  <AttachmentRow key={file.name} file={file} className="border-0 bg-[#F1F7FE]" />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
