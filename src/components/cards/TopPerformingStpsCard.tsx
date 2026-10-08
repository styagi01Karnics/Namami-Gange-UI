import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Trophy } from 'lucide-react'
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
    <Card className="flex h-[400px] flex-col overflow-hidden rounded-[14px] px-[12px] py-[12px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)]">
      <div className="flex shrink-0 items-start justify-between gap-[12px]">
        <div className="flex items-start gap-2">
          <Trophy size={22} className="mt-0.5 shrink-0 fill-[#F7B81B] text-[#F7B81B]" />
          <div>
            <p className="text-[15px] font-bold leading-5 text-[#102653]">Top 10 Performing STPs</p>
            <p className="mt-[1px] text-[11px] font-medium leading-4 text-[#64748B]">By Compliance Score</p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-[5px] rounded-[7px] border border-[#E3ECF6] px-2 py-1 text-[11px] font-medium text-[#24384F]"
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

      <div className="mt-2 grid grid-cols-[30px_minmax(0,1fr)_90px] items-center gap-x-2 border-y border-[#D8EDFF] bg-[#EFF7FF] px-2 py-2 text-[11px] font-semibold text-[#4A5E76]">
        <span>#</span>
        <span>STP Name</span>
        <span className="text-right">Compliance</span>
      </div>

      <ol className="mt-1 flex min-h-0 flex-1 flex-col divide-y divide-[#E8F0F8] overflow-hidden">
        {rows.map((row) => (
          <li key={`${row.rank}-${row.name}`} className="grid min-h-0 flex-1 grid-cols-[30px_minmax(0,1fr)_90px] items-center gap-x-2 px-2 py-1">
            <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#0768D2] text-[11px] font-bold text-white">
              {row.rank}
            </span>
            <Link
              to={stpCompliancePath(row.plantCode)}
              className="truncate text-[12px] font-semibold text-[#0768D2] hover:underline"
              title={row.name}
            >
              {row.name}
            </Link>
            <div className="flex items-center gap-1.5">
              <div className="h-[5px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#E4EEF7]">
                <div className="h-full rounded-full bg-[#16A765]" style={{ width: `${row.score}%` }} />
              </div>
              <span className="w-[32px] shrink-0 text-right text-[11px] font-bold text-[#168E3F]">{row.score}%</span>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
