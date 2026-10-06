import { useState, type ReactNode } from 'react'
import Card from '../ui/Card'
import IconToggle from '../ui/IconToggle'

/** Collapsible panel — collapsed by default, matching the Figma. */
export default function AccordionCard({
  id,
  title,
  badge,
  defaultOpen = false,
  children,
}: {
  id?: string
  title: string
  badge?: ReactNode
  defaultOpen?: boolean
  children?: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Card id={id} className="scroll-mt-[24px] rounded-[12px] border-0 shadow-card">
      <div className="flex h-[54px] items-center justify-between px-[16px]">
        <div className="flex items-center gap-[10px]">
          <h3 className="text-[16px] font-semibold leading-[22px] text-[#07121E]">{title}</h3>
          {badge}
        </div>
        <IconToggle open={open} onClick={() => setOpen((v) => !v)} label={`Toggle ${title}`} />
      </div>

      {open && <div className="border-t border-[#E7EEF7] px-[16px] py-[16px]">{children}</div>}
    </Card>
  )
}
