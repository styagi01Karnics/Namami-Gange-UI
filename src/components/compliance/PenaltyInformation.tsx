import PdfIcon from '../ui/PdfIcon'
import { LabelRow, PanelHeading } from './parts'

export default function PenaltyInformation({ penalty }) {
  return (
    <div>
      <PanelHeading>Penalty Information</PanelHeading>

      <div className="mt-[13px] rounded-[9px] bg-danger-soft px-[13px] py-[11px]">
        <p className="text-[13px] leading-[18px] text-ink">Total Penalty Amount</p>
        <p className="mt-[5px] text-[15px] font-bold leading-5 text-danger">{penalty.total}</p>
      </div>

      <div className="mt-[13px] space-y-[11px]">
        {penalty.amounts.map((row) => (
          <LabelRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>

      <div className="dashed-divider my-[14px]" />

      <PanelHeading>Penalty Calculation</PanelHeading>
      <div className="mt-[12px] space-y-[11px]">
        {penalty.calculation.map((row) => (
          <LabelRow key={row.label} label={row.label} value={row.value} tone={row.tone} />
        ))}
      </div>

      <div className="dashed-divider my-[14px]" />

      <PanelHeading>Recovery Details</PanelHeading>
      <div className="mt-[12px] space-y-[11px]">
        {penalty.recoveryDetails.map((row) => (
          <LabelRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>

      <button
        type="button"
        className="mt-[13px] flex w-full items-center gap-[9px] rounded-[9px] border border-line bg-[#F7F9FC] px-[12px] py-[11px] text-left text-[13px] font-medium leading-[18px] text-ink transition-colors hover:border-brand hover:text-brand"
      >
        <PdfIcon size={15} />
        {penalty.document}
      </button>
    </div>
  )
}
