const TONE = {
  brand: { bar: 'bg-brand', title: 'text-white' },
  ok: { bar: 'bg-ok', title: 'text-white' },
}

/**
 * Influent / Effluent card heading.
 * - `bar` (default): solid coloured header strip with RPV.png — used by Realtime Parameter Values
 * - `inline`: icon tile + title row — used by Parameter Trend Analysis
 */
export default function StreamHeader({ stream, children = null, variant = 'bar' }) {
  const tone = TONE[stream.tone] ?? TONE.brand

  if (variant === 'inline') {
    return (
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-[10px]">
          <span
            className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-[11px] ${tone.bar}`}
          >
            <img src="/RPV.png" alt="" width={26} height={26} className="object-contain" />
          </span>
          <div>
            <p className={`text-[15px] font-bold leading-5 ${stream.tone === 'ok' ? 'text-ok' : 'text-brand'}`}>
              {stream.title}
            </p>
            {stream.subtitle && (
              <p className="mt-[3px] text-[12.5px] leading-4 text-ink-soft">{stream.subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between gap-3 rounded-t-[12px] px-[14px] py-[12px] ${tone.bar}`}>
      <div className="flex min-w-0 items-center gap-[10px]">
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15">
          <img src="/RPV.png" alt="" width={22} height={22} className="object-contain" />
        </span>
        <p className={`truncate text-[14.5px] font-bold leading-5 ${tone.title}`}>
          {stream.barTitle ?? `${stream.title}${stream.subtitle ? ` (${stream.subtitle})` : ''}`}
        </p>
      </div>
      {children}
    </div>
  )
}
