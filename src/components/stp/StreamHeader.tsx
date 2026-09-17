import { Icon } from '@iconify/react'

const TONE = {
  brand: { box: 'bg-brand', title: 'text-brand' },
  ok: { box: 'bg-ok', title: 'text-ok' },
}

const ICON = { in: 'akar-icons:arrow-forward', out: 'akar-icons:arrow-back' }

/** Influent / Effluent card heading — icon, title, subtitle and a right-hand slot. */
export default function StreamHeader({ stream, children }) {
  const tone = TONE[stream.tone]

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-[10px]">
        <span className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[11px] ${tone.box}`}>
          <Icon icon={ICON[stream.icon]} width={24} height={24} className="text-white" />
        </span>
        <div>
          <p className={`text-[15px] font-bold leading-5 ${tone.title}`}>{stream.title}</p>
          <p className="mt-[3px] text-[12.5px] leading-4 text-ink-soft">{stream.subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  )
}
