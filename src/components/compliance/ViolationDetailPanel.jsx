import ViolationSummaryStrip from './ViolationSummaryStrip'
import RecoveryTimeline from './RecoveryTimeline'
import PenaltyInformation from './PenaltyInformation'
import ParameterTrendChart from './ParameterTrendChart'
import { LabelRow, PanelHeading } from './parts'

export default function ViolationDetailPanel({ violation }) {
  const { summary, tracking, recovery, penalty, trend } = violation

  return (
    <div className="space-y-[14px]">
      <ViolationSummaryStrip items={summary} />

      <div className="grid grid-cols-[1.78fr_1fr] rounded-[12px] border border-line bg-white p-[18px]">
        {/* left region: tracking + timeline, with the trend chart underneath */}
        <div className="pr-[20px]">
          <div className="grid grid-cols-[1.45fr_1fr]">
            <div className="pr-[20px]">
              <PanelHeading>Violation Tracking</PanelHeading>
              <div className="mt-[13px] space-y-[12px]">
                {tracking.rows.map((row) => (
                  <LabelRow key={row.label} label={row.label} value={row.value} />
                ))}
              </div>

              <p className="mt-[16px] text-[13px] leading-[18px] text-ink-soft">Remarks</p>
              <p className="mt-[8px] rounded-[9px] border border-line bg-[#F7F9FC] px-[13px] py-[11px] text-[13px] leading-[18px] text-ink">
                {tracking.remarks}
              </p>
            </div>

            <div className="border-l border-line pl-[20px]">
              <PanelHeading>Recovery Tracking</PanelHeading>
              <div className="mt-[13px]">
                <RecoveryTimeline steps={recovery} />
              </div>
            </div>
          </div>

          <div className="mt-[20px]">
            <ParameterTrendChart trend={trend} />
          </div>
        </div>

        <div className="border-l border-line pl-[20px]">
          <PenaltyInformation penalty={penalty} />
        </div>
      </div>
    </div>
  )
}
