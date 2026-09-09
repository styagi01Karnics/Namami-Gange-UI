import { arcPath } from './arc'

/**
 * Half-doughnut penalty gauge: green body that tips into amber near the top end,
 * with the exposure amount printed inside the arc.
 */
export default function PenaltyGauge({
  value = 85,
  display = '₹1 L',
  size = 128,
  thickness = 13,
  amberFrom = 72,
}) {
  const cx = size / 2
  const cy = size / 2
  const r = cx - thickness / 2 - 1
  const height = cy + thickness / 2 + 2

  const toDeg = (pct) => -90 + (Math.min(Math.max(pct, 0), 100) / 100) * 180
  const clampedAmber = Math.min(amberFrom, value)

  return (
    <div className="relative" style={{ width: size, height }}>
      <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
        {/* track */}
        <path
          d={arcPath(cx, cy, r, -90, 90)}
          stroke="#EDF1F6"
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
        {/* amber tail first so the green cap sits on top of it */}
        {value > clampedAmber && (
          <path
            d={arcPath(cx, cy, r, toDeg(clampedAmber) - 6, toDeg(value))}
            stroke="#F0A32A"
            strokeWidth={thickness}
            strokeLinecap="round"
            fill="none"
          />
        )}
        <path
          d={arcPath(cx, cy, r, -90, toDeg(clampedAmber))}
          stroke="#2E9E5B"
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <span
        className="absolute inset-x-0 text-center text-[15px] font-bold leading-5 text-ink"
        style={{ top: cy - 10 }}
      >
        {display}
      </span>
    </div>
  )
}
