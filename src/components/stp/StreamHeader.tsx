const TONE = {
  brand: { bar: 'bg-[#0768D2]', title: 'text-white' },
  ok: { bar: 'bg-[#168E3F]', title: 'text-white' },
}

/**
 * Influent / Effluent card heading.
 * - `bar` (default): solid coloured header strip — used by Realtime Parameter Values
 * - `inline`: title row — used by Parameter Trend Analysis
 */
export default function StreamHeader({ stream, children = null, variant = 'bar' }) {
  const tone = TONE[stream.tone] ?? TONE.brand
  const label =
    stream.barTitle ?? `${stream.title}${stream.subtitle ? ` (${stream.subtitle})` : ''}`

  if (variant === 'inline') {
    return (
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-[15px] font-semibold leading-5 ${stream.tone === 'ok' ? 'text-[#168E3F]' : 'text-[#0768D2]'}`}>
            {label}
          </p>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className={`flex h-[64px] items-center justify-between gap-3 rounded-t-[16px] px-[14px] ${tone.bar}`}>
      <p className={`min-w-0 truncate text-[16px] font-semibold leading-[22px] ${tone.title}`}>{label}</p>
      {children}
    </div>
  )
}
