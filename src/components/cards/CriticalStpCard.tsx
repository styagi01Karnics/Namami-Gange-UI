import { useState } from 'react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import { criticalStps } from '../../data/mockData'

const ArrowOutIcon = ico('fluent:arrow-up-right-24-filled')

export default function CriticalStpCard() {
  const [tab, setTab] = useState(criticalStps.tabs[0])
  const rows = criticalStps[tab]

  return (
    // inline so the red surface wins over Card's own bg/border utilities
    <Card className="flex flex-col p-[15px]" style={{ background: '#FDECEA', borderColor: '#F6D3D0' }}>
      <h3 className="text-[15px] font-semibold leading-5 text-danger">Critical STP&rsquo;s</h3>

      <div className="mt-[13px] flex items-center gap-[4px] rounded-[10px] bg-white p-[3px]">
        {criticalStps.tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-[8px] px-[10px] py-[8px] text-[12.5px] font-medium leading-4 transition-colors ${
              tab === t ? 'bg-brand text-white' : 'text-ink hover:bg-brand-soft/70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="scroll-thin mt-[12px] max-h-[196px] space-y-[8px] overflow-y-auto pr-[2px]">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center rounded-[9px] bg-white px-[13px] py-[11px]"
          >
            <span className="text-[13px] font-semibold leading-4 text-ink">{row.name}</span>
            <span className="ml-auto text-[12.5px] font-semibold leading-4 text-brand-link">
              {row.stps} STP&rsquo;s
            </span>
            <span className="ml-[26px] flex w-[64px] items-center justify-end gap-[3px] text-[12.5px] font-semibold leading-4 text-danger">
              <ArrowOutIcon size={13} />
              {row.delta}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
