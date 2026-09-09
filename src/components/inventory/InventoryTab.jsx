import { User } from 'lucide-react'
import GaugeSummaryCard from '../ui/GaugeSummaryCard'
import StatCardsRow from '../ui/StatCardsRow'
import ChemicalInventoryCard from './ChemicalInventoryCard'
import InventoryByCategoryCard from './InventoryByCategoryCard'
import { getStpPageMetrics, inventoryStats, inventorySummary } from '../../data/mockData'

export default function InventoryTab({ stpId }) {
  const metrics = getStpPageMetrics(stpId)
  const summary = metrics?.inventorySummary ?? inventorySummary
  const stats = metrics?.inventoryStats ?? inventoryStats

  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-[0.95fr_1fr] items-start gap-[14px] [&>*]:min-w-0">
        <GaugeSummaryCard
          icon={User}
          label={summary.label}
          total={summary.total}
          scopeLabel={summary.scopeLabel}
          breakdown={summary.breakdown}
        />
        <StatCardsRow items={stats} columns={2} gap={14} />
      </div>

      <div className="grid grid-cols-[2.39fr_1fr] items-start gap-[14px] [&>*]:min-w-0">
        <ChemicalInventoryCard stpId={stpId} />
        <InventoryByCategoryCard stpId={stpId} />
      </div>
    </div>
  )
}
