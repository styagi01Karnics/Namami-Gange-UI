import SegmentedGauge from '../charts/SegmentedGauge'

/**
 * Headline number + segmented gauge + colour-coded legend.
 * Shared by Manpower ("Total Employees") and Inventory ("Total Chemical").
 */
export default function GaugeSummaryCard({
  icon: Icon,
  label,
  total,
  scopeLabel,
  breakdown,
  className = '',
  gaugeSize = 172,
  noteChip = false,
}) {
  return (
    <section className={`rounded-[12px] border border-line bg-white p-[15px] ${className}`}>
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-brand-soft">
        <Icon size={17} strokeWidth={2} className="text-brand" />
      </span>

      <p className="mt-[13px] text-[13px] font-medium leading-4 text-ink-soft">{label}</p>
      <p className="mt-[6px] text-[22px] font-bold leading-7 text-ink">{total}</p>
      <button
        type="button"
        className={`mt-[7px] text-[12px] font-medium leading-4 text-brand-link ${
          noteChip ? 'rounded-[6px] bg-brand-soft px-[8px] py-[4px] hover:bg-[#DCE9FB]' : 'hover:underline'
        }`}
      >
        {scopeLabel}
      </button>

      <div className="mt-[8px] flex items-center gap-[16px]">
        <SegmentedGauge
          segments={breakdown}
          display={total}
          size={gaugeSize}
          thickness={Math.round(gaugeSize * 0.087)}
        />

        <div className="flex-1 space-y-[14px]">
          {breakdown.map((b) => (
            <div key={b.key} className="flex items-center border-l-[3px] pl-[11px]" style={{ borderColor: b.color }}>
              <span className="whitespace-nowrap text-[12.5px] font-medium leading-[18px] text-ink-soft">{b.label}</span>
              <span className="ml-auto text-[13px] font-semibold leading-[18px] text-ink">{b.value}</span>
              <span className="ml-[18px] w-[46px] text-right text-[12.5px] font-medium leading-[18px] text-ink-soft">
                {b.percent}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
