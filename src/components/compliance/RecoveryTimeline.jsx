import { TONE_TEXT } from './parts'

const SWATCH = {
  danger: 'bg-danger-soft',
  warn: 'bg-warn-soft',
  ok: 'bg-ok-soft',
  muted: 'bg-slate2-soft',
}

export default function RecoveryTimeline({ steps }) {
  return (
    <ol className="space-y-[13px]">
      {steps.map((step) => (
        <li key={step.label} className="flex items-start gap-[11px]">
          <span className={`mt-[2px] h-[22px] w-[22px] shrink-0 rounded-[6px] ${SWATCH[step.tone] ?? SWATCH.muted}`} />
          <span className="min-w-0">
            <span className="block text-[13px] leading-[18px] text-ink">{step.label}</span>
            <span className={`mt-[3px] block text-[12.5px] font-medium leading-[17px] ${TONE_TEXT[step.tone]}`}>
              {step.time}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}
