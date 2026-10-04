const VALUE_TONE = { ok: 'text-ok', breach: 'text-danger', ink: 'text-ink', brand: 'text-brand' }

/** One reading: label, value and its ideal range — matches the RPV redesign. */
export default function ParamTile({ param }) {
  return (
    <div className="rounded-[10px] border border-line bg-white px-[12px] py-[11px]">
      <p className="text-[12.5px] font-medium leading-4 text-ink-soft">{param.label}</p>
      <p className={`mt-[6px] text-[15px] font-bold leading-5 ${VALUE_TONE[param.tone] ?? VALUE_TONE.ink}`}>
        {param.value}
      </p>
      {param.note && (
        <p className="mt-[5px] text-[11.5px] font-medium leading-4 text-brand-link">{param.note}</p>
      )}
    </div>
  )
}
