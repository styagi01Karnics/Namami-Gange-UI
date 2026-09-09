import { User } from 'lucide-react'
import Card from '../ui/Card'
import { chemicals } from '../../data/mockData'

const TONES = {
  ok: { text: 'text-ok', bar: 'bg-ok' },
  danger: { text: 'text-danger', bar: 'bg-danger' },
  warn: { text: 'text-warn', bar: 'bg-warn' },
}

export default function TotalChemicalCard() {
  return (
    <Card className="p-[15px]">
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-brand-soft">
        <User size={17} strokeWidth={2} className="text-brand" />
      </span>

      <p className="mt-[13px] text-[13px] font-medium leading-4 text-ink-soft">Total Chemical</p>
      <p className="mt-[6px] text-[22px] font-bold leading-7 text-ink">{chemicals.total}</p>

      <div className="mt-[16px] space-y-[15px]">
        {chemicals.rows.map((row) => {
          const tone = TONES[row.tone]
          return (
            <div key={row.key}>
              <div className="flex items-baseline justify-between">
                <span className="text-[12.5px] font-medium leading-4 text-ink-soft">{row.label}</span>
                <span className={`text-[13px] font-bold leading-4 ${tone.text}`}>{row.percent}</span>
              </div>
              <p className={`mt-[4px] text-[13px] font-bold leading-4 ${tone.text}`}>{row.value}</p>
              <div className="mt-[6px] h-[4px] w-full rounded-full bg-[#EDF2F8]">
                <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${row.fill}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
