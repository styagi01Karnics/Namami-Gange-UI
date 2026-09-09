import StatCardsRow from '../ui/StatCardsRow'
import ViolationsTable from './ViolationsTable'
import { complianceSummary, getStpPageMetrics } from '../../data/mockData'

export default function ComplianceTab({ stpId }) {
  const summary = getStpPageMetrics(stpId)?.complianceSummary ?? complianceSummary

  return (
    <div className="space-y-[16px]">
      <StatCardsRow items={summary} />
      <ViolationsTable stpId={stpId} />
    </div>
  )
}
