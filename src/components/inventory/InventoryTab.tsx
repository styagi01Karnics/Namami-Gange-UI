import { useState } from 'react'
import { ico } from '../ui/Ico'
import GaugeSummaryCard from '../ui/GaugeSummaryCard'
import StatCardsRow from '../ui/StatCardsRow'
import ChemicalInventoryCard from './ChemicalInventoryCard'
import InventoryByCategoryCard from './InventoryByCategoryCard'
import { inventoryStats, inventorySummary } from '../../data/mockData'

const BoxIcon = ico('fluent:box-24-filled')

/** Shared by the Inventory page and the Inventory tab in STP Management. */
export default function InventoryTab() {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const toggleDetails = () => setDetailsOpen((v) => !v)

  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-[0.95fr_1fr] items-stretch gap-[14px] [&>*]:min-w-0">
        <GaugeSummaryCard
          className="h-full"
          icon={BoxIcon}
          label={inventorySummary.label}
          total={inventorySummary.total}
          scopeLabel={inventorySummary.scopeLabel}
          breakdown={inventorySummary.breakdown}
          gaugeSize={172}
        />
        <StatCardsRow className="h-full [&>*]:h-full" items={inventoryStats} columns={2} gap={14} />
      </div>

      <div className="grid grid-cols-[2.39fr_1fr] items-stretch gap-[14px] [&>*]:min-w-0">
        <ChemicalInventoryCard open={detailsOpen} onToggle={toggleDetails} />
        <InventoryByCategoryCard open={detailsOpen} onToggle={toggleDetails} />
      </div>
    </div>
  )
}
