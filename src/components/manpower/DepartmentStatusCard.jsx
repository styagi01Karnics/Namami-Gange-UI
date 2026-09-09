import { useState } from 'react'
import IconToggle from '../ui/IconToggle'
import { departmentManpower, getStpPageMetrics } from '../../data/mockData'

const TONES = {
  blue: 'bg-[#EFF3FA]',
  violet: 'bg-[#F3F1FA]',
  rose: 'bg-[#FCF0F1]',
  amber: 'bg-[#FDF8E9]',
  green: 'bg-[#F1F7EF]',
  peach: 'bg-[#FDF1EE]',
}

function Metric({ label, value }) {
  return (
    <div className="min-w-0 flex-1 rounded-[8px] bg-white px-[9px] py-[8px]">
      <p className="text-[11px] font-medium leading-[14px] text-ink-soft">{label}</p>
      <p className="mt-[4px] text-[13px] font-bold leading-4 text-orange">{value}</p>
    </div>
  )
}

export default function DepartmentStatusCard({ stpId }) {
  const [open, setOpen] = useState(true)
  const departments = getStpPageMetrics(stpId)?.departments ?? departmentManpower

  return (
    <section className="flex flex-col rounded-[12px] border border-line bg-white p-[15px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold leading-5 text-ink">Department Manpower Status</h3>
        <IconToggle open={open} onClick={() => setOpen((v) => !v)} label="Toggle Department Manpower Status" />
      </div>

      {open && (
        <div className="mt-[14px] grid grid-cols-2 gap-[12px]">
          {departments.map((d) => (
            <div key={d.key} className={`rounded-[10px] p-[11px] ${TONES[d.tone]}`}>
              <p className="text-[13px] font-semibold leading-4 text-ink">{d.name}</p>
              <p className="mt-[6px] text-[14px] font-bold leading-5 text-ink">{d.total}</p>
              <div className="mt-[12px] flex gap-[7px]">
                <Metric label="Required" value={d.required} />
                <Metric label="Shortage" value={d.shortage} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
