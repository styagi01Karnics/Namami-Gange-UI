import Card from '../ui/Card'
import { inventoryStock } from '../../data/mockData'

const TONES = {
  ok: { text: 'text-ok', bar: 'bg-ok', track: 'bg-[#DDF0E5]' },
  danger: { text: 'text-danger', bar: 'bg-danger', track: 'bg-[#FADDDE]' },
  warn: { text: 'text-warn', bar: 'bg-warn', track: 'bg-[#FBEBC8]' },
}

export default function TotalInventoryCard() {
  return (
    <Card className="p-[15px]">
      <div className="flex items-center gap-[12px]">
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-brand-soft">
          <img src="/inventorybox.svg" alt="" width={23} height={23} className="shrink-0" />
        </span>
        <div>
          <p className="text-[13px] font-medium leading-4 text-ink-soft">Total Inventory</p>
          <p className="mt-[5px] text-[22px] font-bold leading-7 text-ink">{inventoryStock.total}</p>
        </div>
      </div>

      <div className="mt-[18px] space-y-[16px]">
        {inventoryStock.rows.map((row) => {
          const tone = TONES[row.tone]
          return (
            <div key={row.key}>
              <div className="flex items-center justify-between gap-[10px]">
                <div>
                  <p className="text-[12.5px] font-medium leading-4 text-ink-soft">{row.label}</p>
                  <p className={`mt-[5px] text-[13px] font-semibold leading-4 ${tone.text}`}>{row.value}</p>
                </div>
                <span className={`text-[14px] font-bold leading-5 ${tone.text}`}>{row.percent}</span>
              </div>
              <div className={`mt-[8px] h-[4px] w-full rounded-full ${tone.track}`}>
                <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${row.fill}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
