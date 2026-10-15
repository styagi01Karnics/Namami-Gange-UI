import { useState } from 'react'
import ChemicalOverviewCard from './ChemicalOverviewCard'
import EquipmentOverviewCard from './EquipmentOverviewCard'
import InventorySubTabs, { type InventorySubTab } from './InventorySubTabs'

/** Shared by the Inventory page and the Inventory tab in STP Management. */
export default function InventoryTab({ stpId, plantCode }: { stpId?: string; plantCode?: string } = {}) {
  const [subTab, setSubTab] = useState<InventorySubTab>('Chemical')

  const isChemical = subTab === 'Chemical'

  return (
    <div className="space-y-[14px]">
      <InventorySubTabs active={subTab} onChange={setSubTab} />

      {isChemical ? (
        <ChemicalOverviewCard stpId={stpId} plantCode={plantCode} />
      ) : (
        <EquipmentOverviewCard />
      )}
    </div>
  )
}
