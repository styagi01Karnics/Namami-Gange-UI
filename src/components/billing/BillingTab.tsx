import { ChevronRight } from 'lucide-react'
import BillingStepCard from './BillingStepCard'
import CalculationSummaryCard from './CalculationSummaryCard'
import BillingLogsCard from './BillingLogsCard'
import { stpBilling } from '../../data/mockData'

function FlowArrow() {
  return (
    <div className="flex shrink-0 items-center px-[6px] pt-[28px]">
      <div className="flex items-center gap-[2px]">
        <span className="h-px w-[18px] border-t border-dashed border-[#B8C9DC]" />
        <ChevronRight size={16} strokeWidth={2.2} className="text-[#98AABB]" />
      </div>
    </div>
  )
}

/** Shared by STP Management — vendor billing approval workflow. */
export default function BillingTab() {
  const { steps } = stpBilling

  return (
    <div className="space-y-[14px]">
      <div className="scroll-thin overflow-x-auto pb-[4px]">
        <div className="flex min-w-[920px] items-stretch">
          {steps.map((step, i) => (
            <div key={step.key} className="flex flex-1 items-stretch">
              <BillingStepCard step={step} />
              {i < steps.length - 1 && <FlowArrow />}
            </div>
          ))}
        </div>
      </div>

      <CalculationSummaryCard />
      <BillingLogsCard />
    </div>
  )
}
