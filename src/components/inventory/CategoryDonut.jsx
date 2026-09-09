import { arcPath, polar } from '../charts/arc'

const SIZE = 200
const THICKNESS = 26
const GAP_DEG = 2.6

/**
 * Ring chart with a "%" pill sitting on the outer edge of each segment.
 * Hand-rolled so the pills can be placed exactly on the arc midpoints.
 */
export default function CategoryDonut({ data }) {
  const cx = SIZE / 2
  const cy = SIZE / 2
  const r = cx - THICKNESS / 2 - 6
  const total = data.reduce((sum, d) => sum + d.share, 0) || 1

  let cursor = -90
  const segments = data.map((d) => {
    const span = (d.share / total) * 360
    const seg = { ...d, start: cursor + GAP_DEG / 2, end: cursor + span - GAP_DEG / 2, mid: cursor + span / 2 }
    cursor += span
    return seg
  })

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {segments.map((s) => (
          <path
            key={s.key}
            d={arcPath(cx, cy, r, s.start, s.end)}
            stroke={s.color}
            strokeWidth={THICKNESS}
            strokeLinecap="butt"
            fill="none"
          />
        ))}
      </svg>

      {segments.map((s) => {
        const p = polar(cx, cy, r + THICKNESS / 2 - 1, s.mid)
        return (
          <span
            key={s.key}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-[8px] py-[2px] text-[11px] font-semibold leading-[16px] text-ink shadow-card"
            style={{ left: p.x, top: p.y }}
          >
            {s.percent}
          </span>
        )
      })}
    </div>
  )
}
