import { arcPath } from './arc'

/**
 * Nested radial bars — one concentric ring per attendance bucket.
 * `rings` = [{ percent, color, track }] ordered outermost first.
 */
export default function NestedDonut({
  rings,
  size = 118,
  thickness = 7,
  gap = 4,
  startDeg = 135,
  sweepDeg = 270,
}) {
  const cx = size / 2
  const cy = size / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((ring, i) => {
        const r = cx - thickness / 2 - i * (thickness + gap)
        const end = startDeg + (Math.min(Math.max(ring.percent, 0), 100) / 100) * sweepDeg
        return (
          <g key={i}>
            <path
              d={arcPath(cx, cy, r, startDeg, startDeg + sweepDeg)}
              stroke={ring.track}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={arcPath(cx, cy, r, startDeg, end)}
              stroke={ring.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )
      })}
    </svg>
  )
}
