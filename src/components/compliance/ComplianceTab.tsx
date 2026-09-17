import StatCardsRow from '../ui/StatCardsRow'
import ViolationsTable from './ViolationsTable'
import { complianceSummary } from '../../data/mockData'

/** Shared by the Compliance page and the Compliance tab in STP Management. */
export default function ComplianceTab() {
  return (
    <div className="space-y-[16px]">
      <StatCardsRow items={complianceSummary} />
      <ViolationsTable />
    </div>
  )
}
