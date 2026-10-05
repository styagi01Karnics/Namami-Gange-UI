type MetricRingCardProps = {
  label: string
  value: string | number
  /** 0–100; omit for a plain value card (no ring). */
  percent?: number
  percentLabel?: string
  tone?: 'brand' | 'ok' | 'danger' | 'warn' | 'orange'
  className?: string
}

const TONE = {
  brand: {
    value: 'text-[#0768D2]',
    ring: '#0768D2',
    track: 'rgba(7, 104, 210, 0.12)',
    border: 'rgba(7, 104, 210, 0.2)',
    // Tint on top of white — CSS paints first layer above later ones.
    background:
      'linear-gradient(116.19deg, rgba(7, 104, 210, 0.05) 0.16%, rgba(7, 104, 210, 0) 100%), #FFFFFF',
  },
  ok: {
    value: 'text-[#168E3F]',
    ring: '#168E3F',
    track: 'rgba(22, 142, 63, 0.12)',
    border: 'rgba(22, 142, 63, 0.2)',
    background:
      'linear-gradient(116.19deg, rgba(22, 142, 63, 0.05) 0.16%, rgba(22, 142, 63, 0) 100%), #FFFFFF',
  },
  danger: {
    value: 'text-[#DC2626]',
    ring: '#DC2626',
    track: 'rgba(220, 38, 38, 0.12)',
    border: 'rgba(197, 15, 31, 0.2)',
    background:
      'linear-gradient(116.19deg, rgba(220, 38, 38, 0.05) 0.16%, rgba(220, 38, 38, 0) 100%), #FFFFFF',
  },
  warn: {
    value: 'text-[#E89802]',
    ring: '#E89802',
    track: 'rgba(232, 152, 2, 0.12)',
    border: 'rgba(232, 152, 2, 0.2)',
    background:
      'linear-gradient(116.19deg, rgba(232, 152, 2, 0.05) 0.16%, rgba(232, 152, 2, 0) 100%), #FFFFFF',
  },
  orange: {
    value: 'text-[#E89802]',
    ring: '#E89802',
    track: 'rgba(232, 152, 2, 0.12)',
    border: 'rgba(232, 152, 2, 0.2)',
    background:
      'linear-gradient(116.19deg, rgba(232, 152, 2, 0.05) 0.16%, rgba(232, 152, 2, 0) 100%), #FFFFFF',
  },
}

/** KPI summary card used across STP Management tabs. */
export default function MetricRingCard({
  label,
  value,
  percent,
  percentLabel,
  tone = 'brand',
  className = '',
}: MetricRingCardProps) {
  const t = TONE[tone]
  const size = 70
  const stroke = 5.5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, percent ?? 0))
  const offset = c - (pct / 100) * c
  const showRing = percent != null

  return (
    <div
      className={`flex h-[110px] min-w-0 items-center justify-between gap-[20px] rounded-[10px] p-[20px] ${className}`}
      style={{
        background: t.background,
        border: `1px solid ${t.border}`,
      }}
    >
      <div className="min-w-0">
        <p className="text-[14px] font-semibold leading-normal text-[#07121E]">{label}</p>
        <p className={`mt-[8px] text-[24px] font-bold leading-[30px] ${t.value}`}>{value}</p>
      </div>

      {showRing && (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.track} strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={t.ring}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold leading-none text-[#333333]">
            {percentLabel ?? `${pct}%`}
          </span>
        </div>
      )}
    </div>
  )
}
