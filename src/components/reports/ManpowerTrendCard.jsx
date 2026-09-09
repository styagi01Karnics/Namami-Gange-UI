import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { manpowerTrend } from '../../data/mockData'

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const present = payload.find((p) => p.dataKey === 'present') ?? payload[0]

  return (
    <div className="rounded-[8px] bg-[#E7F0FC] px-[14px] py-[8px] text-center shadow-pop">
      <p className="text-[13px] font-semibold leading-5 text-brand-link">{present.value}</p>
      <p className="text-[11.5px] leading-4 text-brand-link">{label}, {manpowerTrend.marker.stamp.split(' ')[1]}</p>
    </div>
  )
}

export default function ManpowerTrendCard() {
  const { legend, series, domain, ticks, axisTicks } = manpowerTrend

  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-[12px] border border-line bg-white p-[16px]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-semibold leading-5 text-brand-link">Manpower Trend Analysis</h3>
        <div className="flex items-center gap-[16px]">
          {legend.map((l) => (
            <span key={l.key} className="flex items-center gap-[7px] text-[12px] font-medium leading-4 text-ink-soft">
              <svg width="22" height="8" viewBox="0 0 22 8">
                <line
                  x1="0"
                  y1="4"
                  x2="22"
                  y2="4"
                  stroke={l.color}
                  strokeWidth="2"
                  strokeDasharray={l.dashed ? '2 3' : undefined}
                  strokeLinecap="round"
                />
              </svg>
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-[16px] h-[248px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 10, right: 28, left: 2, bottom: 0 }}>
            <CartesianGrid stroke="#EDF2F8" vertical={false} />
            <XAxis
              dataKey="t"
              ticks={axisTicks}
              tickLine={false}
              axisLine={{ stroke: '#E7EEF7' }}
              tick={{ fill: '#7B8A9C', fontSize: 11.5 }}
              tickMargin={10}
              interval={0}
            />
            <YAxis
              domain={domain}
              ticks={ticks}
              tickFormatter={(v) => v.toLocaleString('en-IN')}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#7B8A9C', fontSize: 11.5 }}
              width={52}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#C3D5EA', strokeDasharray: '3 3' }} />

            <Line type="linear" dataKey="required" stroke="#2C3644" strokeWidth={1.6} strokeDasharray="2 3" dot={false} isAnimationActive={false} />
            <Line type="linear" dataKey="present" stroke="#2E9E5B" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
