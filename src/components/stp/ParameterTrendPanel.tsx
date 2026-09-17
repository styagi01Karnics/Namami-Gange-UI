import { useState } from 'react'
import Sparkline from '../charts/Sparkline'
import LivePill from './LivePill'
import StreamHeader from './StreamHeader'
import { stpStreams, stpTrendRanges, stpTrends } from '../../data/mockData'

const VALUE_TONE = { ok: 'text-ok', breach: 'text-danger', ink: 'text-ink' }

function RangeTabs({ value, onChange }) {
  return (
    <div className="flex shrink-0 items-center gap-[2px] rounded-[8px] border border-line bg-card p-[3px]">
      {stpTrendRanges.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`h-[26px] rounded-[6px] px-[11px] text-[12px] font-semibold leading-4 transition-colors ${
            value === r ? 'bg-brand text-white' : 'text-ink-soft hover:bg-brand-soft'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

function StreamTrends({ stream }) {
  const [range, setRange] = useState(stpTrendRanges[stpTrendRanges.length - 1])
  const { rows } = stpTrends[stream.key]

  return (
    <div className="rounded-[12px] border border-line bg-[#F7FAFF] p-[14px]">
      <StreamHeader stream={stream}>
        <div className="flex shrink-0 items-center gap-[10px]">
          <LivePill />
          <RangeTabs value={range} onChange={setRange} />
        </div>
      </StreamHeader>

      <div className="mt-[14px] flex flex-col gap-[10px]">
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[74px_minmax(0,1fr)_138px] items-center gap-[12px]"
          >
            <div>
              <p className="text-[13px] font-semibold leading-[18px] text-ink">{row.label}</p>
              <p className="text-[11px] leading-4 text-ink-muted">({row.unit})</p>
            </div>

            <Sparkline points={row.points} color={row.color} />

            <div className="text-right">
              <p className={`text-[13px] font-semibold leading-[18px] ${VALUE_TONE[row.tone]}`}>
                {row.value}
              </p>
              <p className="mt-[2px] text-[11px] leading-4 text-ink-muted">{stpTrends.at}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ParameterTrendPanel() {
  return (
    <div className="grid grid-cols-2 gap-[14px]">
      {stpStreams.map((stream) => (
        <StreamTrends key={stream.key} stream={stream} />
      ))}
    </div>
  )
}
