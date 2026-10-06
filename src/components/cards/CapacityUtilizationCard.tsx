import { arcPath } from '../charts/arc'
import { capacityUtilization } from '../../data/mockData'
import Card from '../ui/Card'

const SIZE = 168
const CX = SIZE / 2
const CY = SIZE / 2
const R = 58
const STROKE = 22

export default function CapacityUtilizationCard() {
  const { used, total } = capacityUtilization
  const percent = total.mld > 0 ? (used.mld / total.mld) * 100 : 0
  const usedSweep = (percent / 100) * 360
  const usedPath = arcPath(CX, CY, R, 0, usedSweep)
  const restPath = arcPath(CX, CY, R, usedSweep, 360)

  return (
    <Card className="flex h-full min-h-[220px] flex-col rounded-[16px] px-[14px] py-[12px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)] xl:min-h-[230px]">
      <p className="text-[16px] font-semibold leading-5 text-[#07121E]">Capacity Utilization</p>

      <div className="mt-[4px] flex flex-1 items-center gap-[16px]">
        <div className="relative shrink-0">
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="overflow-visible">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#EEF5FE" strokeWidth={STROKE} />
            <path d={restPath} fill="none" stroke="#D4E8FB" strokeWidth={STROKE} strokeLinecap="butt" />
            <path d={usedPath} fill="none" stroke="#0768D2" strokeWidth={STROKE} strokeLinecap="butt" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[12px] font-medium leading-none text-[#07121E]">Used</p>
            <p className="mt-[4px] text-[20px] font-semibold leading-none text-[#07121E]">
              {percent.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div>
            <div className="flex items-center gap-[8px]">
              <span className="size-[9px] rounded-full bg-[#0768D2]" />
              <p className="text-[13px] font-semibold text-[#363636]">{used.stps} STPs</p>
            </div>
            <p className="mt-[4px] text-[18px] font-bold text-[#07121E]">{used.mld} MLD</p>
            <span className="mt-[6px] inline-flex h-[18px] items-center rounded-full bg-[#EAF3EC] px-[4px] text-[11px] font-semibold text-[#168E3F]">
              {used.status}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-[8px]">
              <span className="size-[9px] rounded-full bg-[#D4E8FB]" />
              <p className="text-[13px] font-semibold text-[#363636]">{total.stps} STPs</p>
            </div>
            <p className="mt-[4px] text-[18px] font-bold text-[#07121E]">{total.mld} MLD</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
