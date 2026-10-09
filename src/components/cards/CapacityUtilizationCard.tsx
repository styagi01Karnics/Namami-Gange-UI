import { Building2, Database } from 'lucide-react'
import { capacityUtilization } from '../../data/mockData'
import Card from '../ui/Card'

export default function CapacityUtilizationCard() {
  const { used, total } = capacityUtilization
  const percent = 76.75

  return (
    <Card className="flex h-full min-h-[430px] flex-col rounded-[18px] border border-[#DDECFB] bg-gradient-to-br from-white via-white to-[#F7FBFF] p-5 shadow-[0_5px_20px_rgba(7,104,210,0.10)] sm:p-6 xl:min-h-[470px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[16px] font-bold leading-6 tracking-[-0.01em] text-[#102653] sm:text-[17px]">
          STP Monitoring
        </h2>
        <span className="inline-flex h-8 items-center gap-2 rounded-full bg-[#E6F8F0] px-3 text-[11px] font-semibold text-[#07875F]">
          <span className="size-2.5 rounded-full bg-[#12B981] shadow-[0_0_0_4px_rgba(18,185,129,0.12)]" />
          {used.status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:mt-8 sm:gap-6">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[#7085A2]">Monitored</p>
          <p className="mt-1 whitespace-nowrap text-[24px] font-extrabold leading-tight tracking-[-0.03em] text-[#102653] sm:text-[27px]">
            <span className="text-[#1268E8]">{used.mld}</span> <span className="text-[17px] sm:text-[18px]">MLD</span>
          </p>
        </div>
        <span className="h-14 w-px bg-[#DCE9F7]" />
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[#7085A2]">Total Capacity</p>
          <p className="mt-1 whitespace-nowrap text-[24px] font-extrabold leading-tight tracking-[-0.03em] text-[#102653] sm:text-[27px]">
            {total.mld} <span className="text-[17px] sm:text-[18px]">MLD</span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 sm:mt-8 sm:gap-4">
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-[#E6F1FB] sm:h-[14px]"
          role="progressbar"
          aria-label="Capacity utilization"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1268E8] to-[#20A9E8]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[22px] font-extrabold leading-none tracking-[-0.03em] text-[#07976B] sm:text-[24px]">{percent.toFixed(2)}%</p>
          <p className="mt-1 text-[11px] font-medium text-[#7085A2]"></p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-4 rounded-[14px] bg-gradient-to-r from-[#F0F7FF] to-[#F1FBF8] p-4 sm:mt-7 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#DCEEFF] text-[#1268E8] sm:size-11">
            <Building2 size={21} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium leading-4 text-[#7085A2]">STPs Under Monitoring</p>
            <p className="mt-0.5 whitespace-nowrap text-[14px] font-bold leading-5 text-[#102653] sm:text-[15px]">
              <span className="text-[#1268E8]">{used.stps}</span> of {total.stps} STPs
            </p>
          </div>
        </div>
        <span className="hidden h-10 w-px bg-[#DCE9F7] sm:block" />
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#DDF8EF] text-[#07976B] sm:size-11">
            <Database size={21} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium leading-4 text-[#7085A2]">Monitored Capacity</p>
            <p className="mt-0.5 whitespace-nowrap text-[14px] font-bold leading-5 text-[#102653] sm:text-[15px]">
              <span className="text-[#07976B]">{used.mld}</span> of {total.mld} MLD
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
