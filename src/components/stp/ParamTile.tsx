import { Icon } from '@iconify/react'

const PARAM_ICON = {
  bod: { icon: 'fluent:leaf-two-32-filled', box: 'bg-[#EFE9FF]', glyph: 'text-[#7C5CFC]' },
  ph: { icon: 'fluent:drop-32-filled', box: 'bg-[#E4F0FF]', glyph: 'text-brand' },
  totalizer: { src: '/totalizer.svg', box: 'bg-[#E7F6EC]' },
  tss: { icon: 'fluent:circle-hint-32-filled', box: 'bg-[#FDF0DC]', glyph: 'text-orange' },
  cod: { icon: 'fluent:beaker-32-filled', box: 'bg-[#E7F6EC]', glyph: 'text-ok' },
  no3n: { icon: 'fluent:gas-propane-20-filled', box: 'bg-[#FDECEE]', glyph: 'text-danger' },
}

const VALUE_TONE = { ok: 'text-ok', breach: 'text-danger', ink: 'text-ink' }

/** One reading: icon, label, value and its ideal range. */
export default function ParamTile({ param }) {
  const { icon, src, box, glyph } = PARAM_ICON[param.icon]

  return (
    <div className="rounded-[10px] border border-line bg-card p-[11px]">
      <div className="flex items-start gap-[10px]">
        <span className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[12px] ${box}`}>
          {src ? (
            <img src={src} alt="" width={26} height={26} className="shrink-0" />
          ) : (
            <Icon icon={icon} width={26} height={26} className={`shrink-0 ${glyph}`} />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-4 text-ink">{param.label}</p>
          <p className={`mt-[6px] text-[13.5px] font-semibold leading-[18px] ${VALUE_TONE[param.tone]}`}>
            {param.value}
          </p>
        </div>
      </div>
      {param.note && (
        <span className="mt-[8px] inline-flex rounded-full bg-[#EEF6FD] px-[8px] py-[3px] text-[11.5px] font-medium leading-4 text-[#0768D2]">
          {param.note}
        </span>
      )}
    </div>
  )
}
