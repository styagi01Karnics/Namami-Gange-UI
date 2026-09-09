import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../ui/Card'
import Select from '../ui/Select'
import { flowTrend, flowTrendRanges, flowTrendTicks } from '../../data/mockData'

function ValueTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const point = payload.find((p) => p.dataKey === 'inlet') ?? payload[0]

  return (
    <div className="relative -translate-y-[6px]">
      <div className="rounded-[6px] bg-brand px-[10px] py-[4px] text-[12px] font-semibold leading-4 text-white shadow-pop">
        {point.value}
      </div>
      <span className="absolute left-1/2 top-full h-[7px] w-[7px] -translate-x-1/2 -translate-y-[4px] rotate-45 rounded-[1px] bg-brand" />
    </div>
  )
}

export default function InletOutletChart() {
  const [range, setRange] = useState(flowTrendRanges[0])

  return (
    <Card className="flex h-full flex-col p-[15px]">
      <div className="flex items-start justify-between">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">
          Inlet vs Outlet Flow <span className="text-[13px] font-normal text-ink-muted">(MLD)</span>
        </h3>

        <Select options={flowTrendRanges} value={range} onChange={setRange} className="w-[194px]" align="right" />
      </div>

      <div className="mt-[14px] h-[248px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={flowTrend} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="outletFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7FC47A" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#7FC47A" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="inletFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7FB3F0" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#7FB3F0" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#EDF2F8" strokeWidth={1} vertical={false} />

            <XAxis
              dataKey="t"
              ticks={flowTrendTicks}
              tickLine={false}
              axisLine={{ stroke: '#E7EEF7' }}
              tick={{ fill: '#7B8A9C', fontSize: 11.5 }}
              tickMargin={10}
              interval={0}
            />
            <YAxis
              domain={[0, 1500]}
              ticks={[0, 300, 600, 900, 1200, 1500]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#7B8A9C', fontSize: 11.5 }}
              tickMargin={6}
              width={44}
            />

            <Tooltip
              content={<ValueTooltip />}
              cursor={{ stroke: '#C3D5EA', strokeWidth: 1, strokeDasharray: '3 3' }}
            />

            <Area
              type="monotone"
              dataKey="outlet"
              stroke="#5FAE57"
              strokeWidth={1.8}
              fill="url(#outletFill)"
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 5, fill: '#fff', stroke: '#5FAE57', strokeWidth: 3 }}
            />
            <Area
              type="monotone"
              dataKey="inlet"
              stroke="#3F86E0"
              strokeWidth={1.8}
              fill="url(#inletFill)"
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 5, fill: '#fff', stroke: '#3F86E0', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
