import { Download } from 'lucide-react'

export const TONE = {
  ink: 'text-ink',
  green: 'text-ok',
  red: 'text-danger',
  amber: 'text-[#C4890B]',
  orange: 'text-orange',
  blue: 'text-brand-link',
}

/** STP names are links back to the per-STP section in every report table. */
export function StpLink({ children }) {
  return (
    <button type="button" className="text-left text-[13px] font-medium leading-[18px] text-brand-link hover:underline">
      {children}
    </button>
  )
}

export function Tone({ tone = 'ink', children }) {
  return <span className={`text-[13px] font-medium leading-[18px] ${TONE[tone]}`}>{children}</span>
}

export function TwoLineDate({ date, time }) {
  return (
    <span className="text-[13px] leading-[19px] text-ink">
      {date} ,<br />
      {time}
    </span>
  )
}

export function DownloadAction({ label = 'Download row' }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#BFD8F8] bg-white text-brand transition-colors hover:bg-brand-soft"
    >
      <Download size={16} strokeWidth={2.2} />
    </button>
  )
}

/** Small filled sparkline used in the Manpower attendance column. */
export function Sparkline({ points, width = 84, height = 28, color = '#3F86E0' }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const step = width / (points.length - 1)

  const coords = points.map((p, i) => [i * step, height - 2 - ((p - min) / span) * (height - 6)])
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <path d={area} fill={color} opacity="0.13" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
