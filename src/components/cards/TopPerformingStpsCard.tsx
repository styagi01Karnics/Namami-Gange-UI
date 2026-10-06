import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { topPerformingStps } from '../../data/mockData'
import { stpCompliancePath } from '../../routes'
import Card from '../ui/Card'

const RANGES = ['Weekly', 'Last 30 Days', 'Last 90 Days'] as const
const TOP_COUNT = 10

export default function TopPerformingStpsCard() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('Weekly')
  const [open, setOpen] = useState(false)
  const rows = topPerformingStps.slice(0, TOP_COUNT)

  return (
    <Card className="flex h-[400px] flex-col overflow-hidden rounded-[16px] px-[16px] py-[14px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)]">
      <div className="flex shrink-0 items-start justify-between gap-[12px]">
        <div>
          <p className="text-[16px] font-semibold leading-5 text-[#07121E]">Top 10 Performing STPs</p>
          <p className="mt-[2px] text-[13px] font-medium leading-5 text-[#646464]">By Compliance Score</p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-[6px] text-[12px] font-medium text-[#07121E]"
          >
            {range}
            <ChevronDown size={14} className={open ? 'rotate-180' : ''} />
          </button>
          {open && (
            <div className="absolute right-0 z-10 mt-[6px] min-w-[140px] overflow-hidden rounded-[8px] border border-line bg-white py-[4px] shadow-pop">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRange(r)
                    setOpen(false)
                  }}
                  className={`block w-full px-[12px] py-[8px] text-left text-[12px] hover:bg-[#EEF5FE] ${
                    r === range ? 'font-semibold text-brand' : 'text-ink'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ul className="scroll-thin mt-[16px] flex min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto pr-[4px]">
        {rows.map((row) => (
          <li key={`${row.rank}-${row.name}`} className="flex shrink-0 items-center gap-[12px] py-[6px]">
            <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-[#0768D2] text-[14px] font-semibold text-white">
              {row.rank}
            </span>
            <Link
              to={stpCompliancePath(row.plantCode)}
              className="w-[140px] shrink-0 truncate text-[14px] font-semibold text-[#0768D2] hover:underline"
            >
              {row.name}
            </Link>
            <div className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-[16px] bg-[#EAF3EC]">
              <div
                className="h-full rounded-[16px] bg-[#168E3F]"
                style={{ width: `${row.score}%` }}
              />
            </div>
            <span className="w-[36px] shrink-0 text-right text-[14px] font-bold text-[#168E3F]">
              {row.score}%
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
