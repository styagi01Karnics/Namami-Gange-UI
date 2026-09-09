import Card from '../ui/Card'
import PenaltyGauge from '../charts/PenaltyGauge'
import { compliance } from '../../data/mockData'

const DOT = {
  brand: 'bg-brand',
  brandLight: 'bg-brand-light',
}

const EDGE = {
  ok: 'border-ok',
  warn: 'border-warn',
}

export default function OverallComplianceCard() {
  return (
    <Card className="flex flex-col p-[15px]">
      <p className="text-[13.5px] font-medium leading-4 text-ink-soft">Overall Compliance</p>
      <p className="mt-[8px] text-[22px] font-bold leading-7 text-danger">{compliance.percent}%</p>
      <button type="button" className="mt-[7px] self-start text-[12px] font-medium leading-4 text-brand-link hover:underline">
        {compliance.scopeLabel}
      </button>

      <div className="mt-[11px] h-[7px] w-full rounded-full bg-[#E3ECF7]">
        <div className="h-full rounded-full bg-brand" style={{ width: `${compliance.barPercent}%` }} />
      </div>

      <div className="mt-[13px] space-y-[11px]">
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

      <div className="dashed-divider mt-[13px]" />

      <div className="mt-[10px] flex items-stretch">
        <div className="flex flex-1 flex-col items-center">
          <PenaltyGauge
            value={compliance.penaltyExposure.percent}
            display={compliance.penaltyExposure.display}
            size={124}
            thickness={13}
            amberFrom={70}
          />
          <p className="mt-[4px] whitespace-nowrap text-[12px] font-medium leading-4 text-ink-soft">
            Penalty Exposure
          </p>
        </div>

        <div className="my-[2px] w-px bg-line" />

        <div className="flex w-[104px] shrink-0 flex-col justify-center gap-[6px] pl-[13px]">
          {compliance.recovery.map((item, i) => (
            <div key={item.label}>
              <div className={`border-l-[3px] pl-[9px] ${EDGE[item.tone]}`}>
                <p className="text-[12px] font-medium leading-4 text-ink-soft">{item.label}</p>
                <p className={`mt-[3px] text-[14px] font-bold leading-[18px] ${item.tone === 'ok' ? 'text-ok' : 'text-warn'}`}>
                  {item.value}
                </p>
              </div>
              {i === 0 && <div className="mt-[7px] border-t border-line" />}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
