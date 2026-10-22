import { Building2, Droplets, type LucideIcon } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'
import { capacityUtilization } from '../../data/mockData'

const MONITORED_COLOR = '#1268E8'
const GAP_COLOR = '#FBBF24'

type StatTileProps = {
  icon: LucideIcon
  label: string
  value: number
  unit?: string
  chipClass: string
  tileClass: string
}

function StatTile({ icon: Icon, label, value, unit, chipClass, tileClass }: StatTileProps) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 rounded-[12px] border p-2.5 ${tileClass}`}>
      <span className={`grid size-9 shrink-0 place-items-center rounded-full ${chipClass}`}>
        <Icon size={17} strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10.5px] font-medium text-[#7085A2]">{label}</p>
        <p className="whitespace-nowrap text-[15px] font-extrabold leading-5 tracking-[-0.02em] text-[#102653]">
          {value}
          {unit && <span className="ml-1 text-[11px] font-semibold text-[#7085A2]">{unit}</span>}
        </p>
      </div>
    </div>
  )
}

export default function MonitoringCoverageCard({ className = '' }: { className?: string }) {
  const { used, total } = capacityUtilization
  const remainingMld = total.mld - used.mld
  const { percent } = capacityUtilization

  const capacityData = [
    { name: 'Monitored', value: used.mld },
    { name: 'Not monitored', value: remainingMld },
  ]

  return (
    <Card
      className={`flex flex-col rounded-[18px] border border-[#DDECFB] bg-gradient-to-br from-white via-white to-[#F7FBFF] p-4 shadow-[0_5px_20px_rgba(7,104,210,0.10)] sm:p-5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-bold leading-6 tracking-[-0.01em] text-[#102653] sm:text-[16px]">
            Monitoring Coverage
          </h2>
          <p className="text-[11px] font-medium text-[#7085A2]">Capacity and STP coverage</p>
        </div>
        <span className="inline-flex h-7 items-center gap-2 rounded-full bg-[#E6F8F0] px-2.5 text-[11px] font-semibold text-[#07875F]">
          <span className="size-2 rounded-full bg-[#12B981] shadow-[0_0_0_3px_rgba(18,185,129,0.12)]" />
          {percent.toFixed(2)}% covered
        </span>
      </div>

      <div className="mt-4 grid flex-1 grid-cols-[132px_minmax(0,1fr)] items-center gap-4">
        <div className="relative size-[132px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={capacityData}
                dataKey="value"
                innerRadius={44}
                outerRadius={62}
                startAngle={90}
                endAngle={-270}
                paddingAngle={3}
                cornerRadius={8}
                stroke="none"
                isAnimationActive={false}
              >
                <Cell fill={MONITORED_COLOR} />
                <Cell fill={GAP_COLOR} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-[17px] font-extrabold leading-none tracking-[-0.03em] text-[#102653]">
                {percent.toFixed(2)}%
              </p>
              <p className="mt-1 text-[10px] font-medium text-[#7085A2]">of capacity</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <StatTile
            icon={Droplets}
            label="Monitored capacity"
            value={used.mld}
            unit="MLD"
            chipClass="bg-[#DCEBFF] text-[#1268E8]"
            tileClass="border-[#DCEBFF] bg-[#F3F8FF]"
          />
          <StatTile
            icon={Building2}
            label="STPs monitored"
            value={used.stps}
            chipClass="bg-[#D9F5F7] text-[#0E7490]"
            tileClass="border-[#D9F5F7] bg-[#F2FCFD]"
          />
        </div>
      </div>
    </Card>
  )
}
