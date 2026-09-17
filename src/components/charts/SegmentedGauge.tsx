import { arcPath } from './arc'

/**
 * Half-doughnut split into one coloured band per bucket (Present / Absent /
 * On leave), with the headline number printed inside the arc.
 */
export default function SegmentedGauge({
  segments,
  display,
  size = 176,
  thickness = 16,
  gapDeg = 3,
}) {
  const cx = size / 2
  const cy = size / 2
  const r = cx - thickness / 2 - 2
  const height = cy + thickness / 2 + 4
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1

  let cursor = -90

  return (
    <div className="relative" style={{ width: size, height }}>
      <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
        <path
          d={arcPath(cx, cy, r, -90, 90)}
          stroke="#EDF1F6"
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
        {segments.map((s, i) => {
          const span = (s.value / total) * 180
          const start = cursor + (i === 0 ? 0 : gapDeg / 2)
          const end = cursor + span - (i === segments.length - 1 ? 0 : gapDeg / 2)
          cursor += span
          return (
            <path
              key={s.key ?? i}
              d={arcPath(cx, cy, r, start, end)}
              stroke={s.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
          )
        })}
      </svg>

      <span
        className="absolute inset-x-0 text-center text-[22px] font-bold leading-7 text-ink"
        style={{ top: cy - 26 }}
      >
        {display}
      </span>
    </div>
  )
}
