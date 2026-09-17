import { ico } from '../ui/Ico'
import GaugeSummaryCard from '../ui/GaugeSummaryCard'
import StatCardsRow from '../ui/StatCardsRow'
import ChemicalInventoryCard from './ChemicalInventoryCard'
import InventoryByCategoryCard from './InventoryByCategoryCard'
import { inventoryStats, inventorySummary } from '../../data/mockData'

const BoxIcon = ico('fluent:box-24-filled')

/** Shared by the Inventory page and the Inventory tab in STP Management. */
export default function InventoryTab() {
  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-[0.95fr_1fr] items-start gap-[14px] [&>*]:min-w-0">
        <GaugeSummaryCard
          icon={BoxIcon}
          label={inventorySummary.label}
          total={inventorySummary.total}
          scopeLabel={inventorySummary.scopeLabel}
          breakdown={inventorySummary.breakdown}
        />
        <StatCardsRow items={inventoryStats} columns={2} gap={14} />
      </div>

      <div className="grid grid-cols-[2.39fr_1fr] items-start gap-[14px] [&>*]:min-w-0">
        <ChemicalInventoryCard />
        <InventoryByCategoryCard />
      </div>
    </div>
  )
}
