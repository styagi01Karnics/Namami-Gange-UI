import { useState } from 'react'
import MetricRingCard from '../ui/MetricRingCard'
import { SoftStatCard, type SoftStatItem } from '../ui/SoftStatCard'
import ChemicalInventoryCard from './ChemicalInventoryCard'
import EquipmentInventoryCard from './EquipmentInventoryCard'
import InventoryByCategoryCard from './InventoryByCategoryCard'
import InventorySubTabs, { type InventorySubTab } from './InventorySubTabs'
import { equipmentSummary, inventoryStats, inventorySummary } from '../../data/mockData'

function bottomCards(): SoftStatItem[] {
  return inventoryStats
    .filter((s) => s.key !== 'value')
    .map((s) => ({
      key: s.key,
      label: s.label,
      value: s.value,
      tone: s.key === 'consumption' ? ('ok' as const) : s.key === 'daysLeft' ? ('danger' as const) : ('brand' as const),
    }))
}

/** Shared by the Inventory page and the Inventory tab in STP Management. */
export default function InventoryTab() {
  const [subTab, setSubTab] = useState<InventorySubTab>('Chemical')
  const [detailsOpen, setDetailsOpen] = useState(true)
  const toggleDetails = () => setDetailsOpen((v) => !v)

  const isChemical = subTab === 'Chemical'
  const summary = isChemical ? inventorySummary : equipmentSummary
  const adequate = summary.breakdown.find((b) => b.key === 'adequate')
  const low = summary.breakdown.find((b) => b.key === 'low')
  const out = summary.breakdown.find((b) => b.key === 'out')

  return (
    <div className="space-y-[14px]">
      <InventorySubTabs active={subTab} onChange={setSubTab} />

      <div className="grid grid-cols-4 gap-[16px]">
        <MetricRingCard label={summary.label} value={summary.total} tone="brand" />
        <MetricRingCard
          label="Adequate"
          value={adequate?.value ?? 0}
          percent={83.33}
          percentLabel={adequate?.percent ?? '83.33%'}
          tone="ok"
        />
        <MetricRingCard
          label="Low Stock"
          value={low?.value ?? 0}
          percent={10}
          percentLabel={low?.percent ?? '10%'}
          tone="orange"
        />
        <MetricRingCard
          label="Out of Stock"
          value={out?.value ?? 0}
          percent={10}
          percentLabel={out?.percent ?? '10%'}
          tone="danger"
        />
      </div>

      {/* Same 4-col grid as the row above — 3 cards + empty 4th slot (Figma). */}
      {isChemical && (
        <div className="grid grid-cols-4 gap-[16px]">
          {bottomCards().map((item) => (
            <SoftStatCard
              key={item.key}
              label={item.label}
              value={item.value}
              tone={item.tone}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-[2.39fr_1fr] items-stretch gap-[14px] [&>*]:min-w-0">
        {isChemical ? (
          <ChemicalInventoryCard open={detailsOpen} onToggle={toggleDetails} />
        ) : (
          <EquipmentInventoryCard open={detailsOpen} onToggle={toggleDetails} />
        )}
        <InventoryByCategoryCard
          open={detailsOpen}
          onToggle={toggleDetails}
          title={isChemical ? 'Chemical by Category' : 'Equipment by Category'}
        />
      </div>
    </div>
  )
}
