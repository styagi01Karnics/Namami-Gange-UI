import SoftStatCardsRow from '../ui/SoftStatCard'
import ContractsTable from './ContractsTable'
import { contractsSummary } from '../../data/mockData'

/** Shared by the Contracts page and the Contracts tab in STP Management. */
export default function ContractsTab() {
  return (
    <div className="space-y-[16px]">
      <SoftStatCardsRow items={contractsSummary} columns={4} gap={16} />
      <ContractsTable />
    </div>
  )
}
