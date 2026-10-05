const TONE = {
  brand: { bar: 'bg-[#0768D2]', title: 'text-white' },
  ok: { bar: 'bg-[#168E3F]', title: 'text-white' },
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
            <p className={`text-[15px] font-bold leading-5 ${stream.tone === 'ok' ? 'text-[#168E3F]' : 'text-[#0768D2]'}`}>
              {stream.title}
            </p>
            {stream.subtitle && (
              <p className="mt-[3px] text-[12.5px] leading-4 text-[#646464]">{stream.subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className={`flex h-[64px] items-center justify-between gap-3 rounded-t-[16px] px-[12px] ${tone.bar}`}>
      <div className="flex min-w-0 items-center gap-[12px]">
        <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15">
          <img src="/RPV.png" alt="" width={28} height={28} className="object-contain" />
        </span>
        <p className="truncate text-[20px] font-bold leading-[22px] text-white">
          {stream.title}
          {stream.subtitle ? (
            <span className="ml-[8px] text-[14px] font-medium">({stream.subtitle})</span>
          ) : null}
        </p>
      </div>
      {children}
    </div>
  )
}
