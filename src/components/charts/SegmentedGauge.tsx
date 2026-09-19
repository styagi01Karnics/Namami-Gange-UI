import { arcPath } from './arc'

/**
 * Half-doughnut: each bucket is its own rounded bar, with a clear gap
 * between colours (same treatment as the Total Employees reference).
 */
export default function SegmentedGauge({
  segments,
  display,
  size = 176,
  thickness = 20,
}) {
  const cx = size / 2
  const cy = size / 2
  const r = cx - thickness / 2 - 4
  const height = cy + thickness / 2 + 4
  const total = segments.reduce((sum, s) => sum + Number(s.value), 0) || 1
  const toDeg = (px) => (px / r) * (180 / Math.PI)

  const n = segments.length
  const visualGapDeg = toDeg(1)
  const capDeg = toDeg(thickness / 2)
  const gapDeg = visualGapDeg + capDeg * 2
  const minSpan = toDeg(thickness * 0.55)

  const available = Math.max(n * minSpan, 180 - gapDeg * Math.max(0, n - 1))
  const floor = Math.min(minSpan, available / n)
  const leftover = Math.max(0, available - floor * n)
  const spans = segments.map((s) => floor + leftover * (Number(s.value) / total))

  let cursor = -90

  return (
    <div className="relative" style={{ width: size, height }}>
      <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
        {segments.map((s, i) => {
          const start = cursor
          const end = cursor + spans[i]
          cursor = end + gapDeg
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
