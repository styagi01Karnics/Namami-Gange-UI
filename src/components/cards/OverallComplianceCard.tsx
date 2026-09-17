import Card from '../ui/Card'
import { compliance } from '../../data/mockData'

const DOT = {
  brand: 'bg-brand',
  brandLight: 'bg-brand-light',
}

export default function OverallComplianceCard() {
  return (
    <Card className="flex flex-col p-[15px]">
      <p className="text-[13.5px] font-medium leading-4 text-ink-soft">Overall Compliance</p>
      <p className="mt-[8px] text-[22px] font-bold leading-7 text-danger">{compliance.percent}%</p>
      <button type="button" className="mt-[7px] self-start text-[12px] font-medium leading-4 text-brand-link hover:underline">
        {compliance.scopeLabel}
      </button>

      <div className="mt-[13px] h-[7px] w-full rounded-full bg-[#E3ECF7]">
        <div className="h-full rounded-full bg-brand" style={{ width: `${compliance.barPercent}%` }} />
      </div>

      <div className="mt-[16px] space-y-[14px]">
        {compliance.reasons.map((r) => (
          <div key={r.key}>
            <div className="flex items-center gap-[8px]">
              <span className={`h-[9px] w-[9px] shrink-0 rounded-full ${DOT[r.tone]}`} />
              <span className="text-[12.5px] font-medium leading-4 text-ink-soft">{r.label}</span>
              <span className="ml-auto rounded-full bg-danger-soft px-[9px] py-[3px] text-[10.5px] font-semibold leading-[13px] text-danger">
                Penalty: {r.penalty}
              </span>
            </div>
            <p className="mt-[5px] pl-[17px] text-[13.5px] font-bold leading-[18px] text-ink">{r.stps} STP&rsquo;s</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
