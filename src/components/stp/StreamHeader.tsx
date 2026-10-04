const TONE = {
  brand: { bar: 'bg-brand', title: 'text-white' },
  ok: { bar: 'bg-ok', title: 'text-white' },
}

/**
 * Influent / Effluent card heading.
 * - `bar` (default): solid coloured header strip — used by Realtime Parameter Values
 * - `inline`: title row — used by Parameter Trend Analysis
 */
export default function StreamHeader({ stream, children = null, variant = 'bar' }) {
  const tone = TONE[stream.tone] ?? TONE.brand

  if (variant === 'inline') {
    return (
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-[15px] font-bold leading-5 ${stream.tone === 'ok' ? 'text-ok' : 'text-brand'}`}>
            {stream.title}
          </p>
          {stream.subtitle && (
            <p className="mt-[3px] text-[12.5px] leading-4 text-ink-soft">{stream.subtitle}</p>
          )}
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between gap-3 rounded-t-[12px] px-[14px] py-[12px] ${tone.bar}`}>
      <p className={`min-w-0 truncate text-[14.5px] font-bold leading-5 ${tone.title}`}>
        {stream.barTitle ?? `${stream.title}${stream.subtitle ? ` (${stream.subtitle})` : ''}`}
      </p>
      {children}
    </div>
  )
}
