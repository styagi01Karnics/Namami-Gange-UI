import { Building2, Database } from 'lucide-react'
import { capacityUtilization } from '../../data/mockData'
import Card from '../ui/Card'

export default function CapacityUtilizationCard() {
  const { used, total } = capacityUtilization
  const percent = 76.75

  return (
    <Card className="flex flex-col rounded-[18px] border border-[#DDECFB] bg-gradient-to-br from-white via-white to-[#F7FBFF] p-4 shadow-[0_5px_20px_rgba(7,104,210,0.10)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold leading-6 tracking-[-0.01em] text-[#102653] sm:text-[16px]">
          STP Monitoring
        </h2>
        <span className="inline-flex h-7 items-center gap-2 rounded-full bg-[#E6F8F0] px-2.5 text-[11px] font-semibold text-[#07875F]">
          <span className="size-2 rounded-full bg-[#12B981] shadow-[0_0_0_3px_rgba(18,185,129,0.12)]" />
          {used.status}
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:mt-4 sm:gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#7085A2]">Monitored</p>
          <p className="mt-0.5 whitespace-nowrap text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-[#102653] sm:text-[24px]">
            <span className="text-[#1268E8]">{used.mld}</span> <span className="text-[15px] sm:text-[16px]">MLD</span>
          </p>
        </div>
        <span className="h-10 w-px bg-[#DCE9F7]" />
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#7085A2]">Total Capacity</p>
          <p className="mt-0.5 whitespace-nowrap text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-[#102653] sm:text-[24px]">
            {total.mld} <span className="text-[15px] sm:text-[16px]">MLD</span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 sm:mt-3.5 sm:gap-4">
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E6F1FB] sm:h-3"
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
          <p className="text-[19px] font-extrabold leading-none tracking-[-0.03em] text-[#07976B] sm:text-[21px]">{percent.toFixed(2)}%</p>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-2.5 rounded-[12px] bg-gradient-to-r from-[#F0F7FF] to-[#F1FBF8] p-2.5 sm:mt-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3 sm:p-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#DCEEFF] text-[#1268E8] sm:size-9">
            <Building2 size={18} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-[10.5px] font-medium leading-3.5 text-[#7085A2]">STPs Under Monitoring</p>
            <p className="mt-0.5 whitespace-nowrap text-[13px] font-bold leading-4 text-[#102653] sm:text-[14px]">
              <span className="text-[#1268E8]">{used.stps}</span> of {total.stps} STPs
            </p>
          </div>
        </div>
        <span className="hidden h-8 w-px bg-[#DCE9F7] sm:block" />
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#DDF8EF] text-[#07976B] sm:size-9">
            <Database size={18} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-[10.5px] font-medium leading-3.5 text-[#7085A2]">Monitored Capacity</p>
            <p className="mt-0.5 whitespace-nowrap text-[13px] font-bold leading-4 text-[#102653] sm:text-[14px]">
              <span className="text-[#07976B]">{used.mld}</span> of {total.mld} MLD
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
