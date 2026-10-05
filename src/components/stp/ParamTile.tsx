const VALUE_TONE = {
  ok: 'text-[#168E3F]',
  breach: 'text-[#DC2626]',
  ink: 'text-[#07121E]',
  brand: 'text-[#0768D2]',
}

/** One reading: label, value and its ideal range — matches the RPV redesign. */
export default function ParamTile({ param }) {
  return (
    <div className="rounded-[12px] bg-white px-[12px] py-[8px] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
      <p className="text-[14px] font-semibold leading-[22px] text-[#565656]">{param.label}</p>
      <p className={`mt-[6px] text-[16px] font-semibold leading-[22px] ${VALUE_TONE[param.tone] ?? VALUE_TONE.ink}`}>
        {param.value}
      </p>
      {param.note && (
        <span className="mt-[8px] inline-flex h-[20px] items-center rounded-full bg-[#F4FAFF] px-[4px] text-[12px] font-semibold leading-[14px] text-[#0768D2] opacity-80">
          {param.note}
        </span>
      )}
    </div>
  )
}
