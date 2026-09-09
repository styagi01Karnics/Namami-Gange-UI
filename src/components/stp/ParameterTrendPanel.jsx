import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { ArrowRight, Undo2 } from 'lucide-react'
import LivePill from './LivePill'
import { fetchStpTrend, getStpDeviceId } from '../../api/stpRealtime'
import { parameterTrendAnalysis } from '../../data/mockData'

function Sparkline({ data, color }) {
  return (
    <div className="h-[36px] w-full max-w-[168px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function RangeToggle({ value, onChange, ranges }) {
  return (
    <div className="flex items-center rounded-[8px] bg-white p-[3px]">
      {ranges.map((range) => {
        const active = range === value
        return (
          <button
            key={range}
            type="button"
            onClick={() => onChange(range)}
            className={`h-[26px] min-w-[38px] rounded-[6px] px-[8px] text-[11.5px] font-semibold leading-4 ${
              active ? 'bg-brand text-white' : 'text-brand hover:bg-brand-soft'
            }`}
          >
            {range}
          </button>
        )
      })}
    </div>
  )
}

function TrendRow({ row, range }) {
  const valueClass =
    row.tone === 'plain' ? 'text-ink' : row.alert ? 'text-danger' : 'text-ok'

  return (
    <div className="grid grid-cols-[118px_1fr_150px] items-center gap-[10px] border-b border-white/70 py-[10px] last:border-0">
      <div>
        <p className="text-[13px] font-semibold leading-4 text-ink">{row.label}</p>
        <p className="mt-[2px] text-[11.5px] leading-4 text-ink-muted">({row.unit})</p>
      </div>

      <Sparkline data={row.spark[range] ?? row.spark['3M']} color={row.color} />

      <div className="text-right">
        <p className={`text-[14px] font-bold leading-5 ${valueClass}`}>
          {row.value}
          <span className="ml-[4px] text-[11.5px] font-medium text-ink-muted">{row.unit}</span>
        </p>
        <p className="mt-[2px] text-[11px] leading-4 text-ink-muted">{row.timestamp}</p>
      </div>
    </div>
  )
}

function TrendColumn({ stream, variant }) {
  const [range, setRange] = useState(parameterTrendAnalysis.defaultRange)
  const isInfluent = variant === 'influent'
  const Icon = isInfluent ? ArrowRight : Undo2

  return (
    <section
      className={`min-w-0 rounded-[12px] border p-[14px] ${
        isInfluent ? 'border-[#D6E8FB] bg-[#F3F9FF]' : 'border-[#D3EEDC] bg-[#F3FBF4]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-[10px]">
          <span
            className={`mt-[1px] flex h-[32px] w-[32px] items-center justify-center rounded-[8px] ${
              isInfluent ? 'bg-brand text-white' : 'bg-ok text-white'
            }`}
          >
            <Icon size={16} strokeWidth={2.3} />
          </span>
          <div>
            <h4 className={`text-[15px] font-bold leading-5 ${isInfluent ? 'text-brand' : 'text-ok'}`}>
              {stream.title}
            </h4>
            <p className="mt-[2px] text-[12px] font-medium leading-4 text-ink-muted">{stream.subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[8px]">
          <LivePill />
          <RangeToggle ranges={parameterTrendAnalysis.ranges} value={range} onChange={setRange} />
        </div>
      </div>

      <div className="mt-[8px]">
        {stream.rows.map((row) => (
          <TrendRow key={row.key} row={row} range={range} />
        ))}
      </div>
    </section>
  )
}

export default function ParameterTrendPanel({ stpId = 'jagjeetpur-68' }) {
  const [trend, setTrend] = useState(parameterTrendAnalysis)
  const deviceId = getStpDeviceId(stpId)

  useEffect(() => {
    setTrend(parameterTrendAnalysis)

    if (!deviceId) {
      return undefined
    }

    let cancelled = false

    async function load() {
      try {
        const next = await fetchStpTrend(parameterTrendAnalysis, stpId)
        if (!cancelled) setTrend(next)
      } catch {
        if (!cancelled) setTrend(parameterTrendAnalysis)
      }
    }

    load()
    const timer = window.setInterval(load, 30000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [stpId, deviceId])

  return (
    <div className="grid grid-cols-2 gap-[15px]">
      <TrendColumn stream={trend.influent} variant="influent" />
      <TrendColumn stream={trend.effluent} variant="effluent" />
    </div>
  )
}
