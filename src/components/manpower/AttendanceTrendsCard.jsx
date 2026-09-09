import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { attendanceTrends, getStpPageMetrics } from '../../data/mockData'
import { scaleTrendSeries } from '../../utils/stpScope'

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[8px] border border-line bg-white px-[11px] py-[8px] shadow-pop">
      <p className="mb-[5px] text-[11.5px] font-semibold text-ink">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-[7px] text-[11.5px] leading-[17px] text-ink-soft">
          <span className="h-[8px] w-[8px] rounded-[2px]" style={{ background: p.stroke }} />
          <span className="capitalize">{p.dataKey === 'leave' ? 'On leave' : p.dataKey}</span>
          <span className="ml-auto font-semibold text-ink">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function AttendanceTrendsCard({ stpId }) {
  const factor = getStpPageMetrics(stpId)?.attendanceFactor ?? 1
  const { legend, series, marker } = attendanceTrends
  const scaledSeries = factor === 1 ? series : scaleTrendSeries(series, factor)
  const scaledMarker = {
    ...marker,
    value: Math.round(marker.value * factor),
    label: `${Math.round(marker.value * factor)}: July`,
  }

  return (
    <section className="flex flex-col rounded-[12px] border border-line bg-white p-[15px]">
      <div className="flex items-start justify-between">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">Attendance Trends</h3>
        <div className="flex items-center gap-[14px]">
          {legend.map((l) => (
            <span key={l.key} className="flex items-center gap-[6px] text-[11.5px] font-medium leading-4 text-ink-soft">
              <span className="h-[9px] w-[9px] rounded-[2px]" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-[14px] h-[188px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scaledSeries} margin={{ top: 22, right: 10, left: -14, bottom: 0 }}>
            <CartesianGrid stroke="#EDF2F8" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#E7EEF7' }}
              tick={{ fill: '#7B8A9C', fontSize: 11 }}
              tickMargin={9}
              interval={0}
            />
            <YAxis
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#7B8A9C', fontSize: 11 }}
              width={42}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#C3D5EA', strokeDasharray: '3 3' }} />

            <ReferenceLine
              x={scaledMarker.month}
              stroke="#B9C7D6"
              strokeDasharray="4 4"
              label={{
                value: scaledMarker.label,
                position: 'top',
                fill: '#22303F',
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            <Line type="monotone" dataKey="present" stroke="#2E9E5B" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="leave" stroke="#F5B417" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="absent" stroke="#E5484D" strokeWidth={2} dot={false} isAnimationActive={false} />

            <ReferenceDot
              x={scaledMarker.month}
              y={scaledMarker.value}
              r={5}
              fill="#E5484D"
              stroke="#fff"
              strokeWidth={2}
              isFront
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
