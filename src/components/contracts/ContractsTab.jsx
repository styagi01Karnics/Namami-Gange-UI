import StatCardsRow from '../ui/StatCardsRow'
import ContractsTable from './ContractsTable'
import { contractsSummary, getStpPageMetrics } from '../../data/mockData'

export default function ContractsTab({ stpId }) {
  const summary = getStpPageMetrics(stpId)?.contractsSummary ?? contractsSummary

  return (
    <div className="space-y-[16px]">
      <StatCardsRow items={summary} />
      <ContractsTable stpId={stpId} />
    </div>
  )
}
