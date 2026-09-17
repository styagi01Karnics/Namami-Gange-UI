import { useId } from 'react'

/**
 * Tiny normalised trend line with a soft gradient fill. Stretches to the width
 * of its container; the stroke stays 1.8px thanks to `vectorEffect`.
 */
export default function Sparkline({ points, color, height = 34 }) {
  const gid = useId()
  const W = 240
  const pad = 3
  const min = Math.min(...points)
  const span = Math.max(...points) - min || 1

  const xy = points.map((v, i) => [
    (i / (points.length - 1)) * W,
    pad + (1 - (v - min) / span) * (height - pad * 2),
  ])

  let d = `M${xy[0][0]},${xy[0][1]}`
  for (let i = 1; i < xy.length; i += 1) {
    const [px, py] = xy[i - 1]
    const [x, y] = xy[i]
    d += ` Q${px},${py} ${(px + x) / 2},${(py + y) / 2}`
  }
  d += ` L${xy[xy.length - 1][0]},${xy[xy.length - 1][1]}`

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className="block"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${W},${height} L0,${height} Z`} fill={`url(#${gid})`} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
