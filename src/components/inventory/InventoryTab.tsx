import { useState } from 'react'
import ChemicalOverviewCard from './ChemicalOverviewCard'
import EquipmentOverviewCard from './EquipmentOverviewCard'
import InventorySubTabs, { type InventorySubTab } from './InventorySubTabs'

/** Shared by the Inventory page and the Inventory tab in STP Management. */
export default function InventoryTab() {
  const [subTab, setSubTab] = useState<InventorySubTab>('Chemical')

  const isChemical = subTab === 'Chemical'

  return (
    <div className="space-y-[14px]">
      <InventorySubTabs active={subTab} onChange={setSubTab} />

      {isChemical ? (
        <ChemicalOverviewCard />
      ) : (
        <EquipmentOverviewCard />
      )}
    </div>
  )
}
