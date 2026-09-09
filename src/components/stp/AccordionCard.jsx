import { useState } from 'react'
import Card from '../ui/Card'
import IconToggle from '../ui/IconToggle'

/** Collapsible panel — collapsed by default, matching the Figma. */
export default function AccordionCard({ title, badge, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Card>
      <div className="flex h-[54px] items-center justify-between px-[15px]">
        <div className="flex items-center gap-[10px]">
          <h3 className="text-[14.5px] font-semibold leading-5 text-ink">{title}</h3>
          {badge}
        </div>
        <IconToggle open={open} onClick={() => setOpen((v) => !v)} label={`Toggle ${title}`} />
      </div>

      <div className={open ? 'border-t border-line px-[15px] py-[15px]' : 'hidden'}>{children}</div>
    </Card>
  )
}
