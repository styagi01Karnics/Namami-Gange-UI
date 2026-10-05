import PillTabs from '../ui/PillTabs'

export const INVENTORY_SUB_TABS = ['Chemical', 'Equipment'] as const
export type InventorySubTab = (typeof INVENTORY_SUB_TABS)[number]

/** Chemical / Equipment switch — shared by STP Management and Data Reports. */
export default function InventorySubTabs({
  active,
  onChange,
}: {
  active: string
  onChange: (tab: InventorySubTab) => void
}) {
  return (
    <PillTabs
      variant="segmented"
      tabs={[...INVENTORY_SUB_TABS]}
      active={active}
      onChange={(t) => onChange(t as InventorySubTab)}
      className="w-[302px]"
    />
  )
}
