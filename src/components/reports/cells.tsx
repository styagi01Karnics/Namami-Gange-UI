import { ico } from '../ui/Ico'

const DownloadIcon = ico('fluent:arrow-download-16-filled')

export const TONE = {
  ink: 'text-[#07121E]',
  green: 'text-[#168E3F]',
  red: 'text-[#DC2626]',
  amber: 'text-[#E89802]',
  orange: 'text-[#ED7831]',
  blue: 'text-[#0768D2]',
}

/** STP names are links back to the per-STP section in every report table. */
export function StpLink({ children }) {
  return (
    <button
      type="button"
      className="text-left text-[14px] font-medium leading-[22px] text-[#0768D2] underline hover:opacity-90"
    >
      {children}
    </button>
  )
}

export function Tone({ tone = 'ink', children }) {
  return <span className={`text-[14px] font-medium leading-[22px] ${TONE[tone]}`}>{children}</span>
}

export function TwoLineDate({ date, time }) {
  return (
    <span className="text-[14px] font-medium leading-[22px] text-[#07121E]">
      {date} ,<br />
      {time}
    </span>
  )
}

export function DownloadAction({ label = 'Download row', onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#D7EDFF] p-[6px] text-[#0768D2] transition-opacity hover:opacity-90"
    >
      <DownloadIcon size={20} />
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
