import { TONE_TEXT, TrendValue } from './parts'

export default function ViolationSummaryStrip({ items }) {
  return (
    <div className="grid grid-cols-5 rounded-[12px] border border-line bg-white">
      {items.map((item, i) => (
        <div key={item.label} className={`px-[20px] py-[13px] ${i > 0 ? 'border-l border-line' : ''}`}>
          <p className="text-[13px] leading-[18px] text-ink-soft">{item.label}</p>
          <p className={`mt-[7px] text-[14px] font-semibold leading-5 ${TONE_TEXT[item.tone]}`}>
            {item.trend === 'up' ? <TrendValue value={item.value} tone={item.tone} /> : item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
