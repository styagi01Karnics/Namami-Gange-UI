import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PanelHeading } from './parts'
import { trendHourTicks } from '../../data/mockData'

const LEGEND = [
  { label: 'pH Value', color: '#1668E3' },
  { label: 'Lower Limit', color: '#2E9E5B' },
  { label: 'Upper Limit', color: '#E5484D' },
  { label: 'Violation Period', color: '#F6C9CB' },
]

function PeakTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[7px] bg-[#DCEAFB] px-[10px] py-[6px] text-center shadow-pop">
      <p className="text-[11.5px] font-semibold leading-4 text-ink">
        {payload[0].value} {unit}
      </p>
      <p className="text-[10.5px] leading-[14px] text-ink-soft">{label}</p>
    </div>
  )
}

export default function ParameterTrendChart({ trend }) {
  const legend = [{ ...LEGEND[0], label: `${trend.unit} Value` }, ...LEGEND.slice(1)]
  const ticks = trend.series.length > 10 ? trendHourTicks : trend.series.map((p) => p.t)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PanelHeading>Parameter Trend</PanelHeading>
        <div className="flex flex-wrap items-center gap-[14px]">
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-[6px] text-[11.5px] font-medium leading-4 text-ink-soft">
              <span className="h-[9px] w-[9px] rounded-[2px]" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-[12px] h-[178px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend.series} margin={{ top: 8, right: 26, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="violationBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5484D" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#E5484D" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#EDF2F8" vertical={false} />

            <XAxis
              dataKey="t"
              ticks={ticks}
              tickLine={false}
              axisLine={{ stroke: '#E7EEF7' }}
              tick={{ fill: '#7B8A9C', fontSize: 11 }}
              tickMargin={9}
              interval={0}
            />
            <YAxis
              domain={trend.domain}
              ticks={trend.ticks}
              tickFormatter={(v) => (v === 0 ? '0' : v.toFixed(1))}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#7B8A9C', fontSize: 11 }}
              width={44}
            />

            <ReferenceArea
              x1={trend.violationFrom}
              x2={trend.violationTo}
              fill="url(#violationBand)"
              stroke="#F0AFB2"
              strokeOpacity={0.35}
            />
            <ReferenceLine y={trend.lowerLimit} stroke="#2E9E5B" strokeDasharray="5 4" strokeWidth={1.4} />
            <ReferenceLine y={trend.upperLimit} stroke="#E5484D" strokeDasharray="5 4" strokeWidth={1.4} />

            <Tooltip
              content={<PeakTooltip unit={trend.unit} />}
              cursor={{ stroke: '#C3D5EA', strokeDasharray: '3 3' }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#1668E3"
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 4, fill: '#fff', stroke: '#1668E3', strokeWidth: 2.5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
