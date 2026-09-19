import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import BillingStepCard from './BillingStepCard'
import CalculationSummaryCard from './CalculationSummaryCard'
import BillingLogsCard from './BillingLogsCard'
import { stpBilling } from '../../data/mockData'

function FlowArrow() {
  return (
    <div className="flex shrink-0 items-center px-[10px]">
      <ArrowRight size={18} strokeWidth={1.8} className="text-[#98AABB]" />
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
            <Fragment key={step.key}>
              <BillingStepCard step={step} />
              {i < steps.length - 1 && <FlowArrow />}
            </Fragment>
          ))}
        </div>
      </div>

      <CalculationSummaryCard />
      <BillingLogsCard />
    </div>
  )
}
