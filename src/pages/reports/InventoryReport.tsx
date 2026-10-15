import { useMemo, useState } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { stpDetails } from '../../data/mockData'

type InventoryCategory = 'Chemical' | 'Equipment'

function resolveFullStpName(plantLabel?: string, stpId?: string): string {
  if (stpId && stpDetails[stpId]?.name) {
    return stpDetails[stpId].name
  }
  if (!plantLabel || plantLabel.toLowerCase().includes('all stp')) return "All STP's"

  for (const detail of Object.values(stpDetails)) {
    const detailLower = detail.name.toLowerCase()
    const labelLower = plantLabel.toLowerCase()
    if (
      detailLower === labelLower ||
      detailLower.includes(labelLower) ||
      labelLower.includes(detailLower)
    ) {
      return detail.name
    }
  }
  return plantLabel
}

const CHEMICAL_ITEMS = [
  { category: 'Coagulant (Alum Liquid)', opening: 48, received: 510, consumed: 120, closing: 438, lowStock: 0, outOfStock: 0, updated: '15/10/2026 ,10:30 AM' },
  { category: 'Disinfectant (Sodium Hypochlorite)', opening: 52, received: 480, consumed: 90, closing: 442, lowStock: 1, outOfStock: 0, updated: '15/10/2026 ,10:45 AM' },
  { category: 'Polymers (Polyelectrolyte)', opening: 45, received: 550, consumed: 100, closing: 495, lowStock: 0, outOfStock: 0, updated: '15/10/2026 ,10:45 AM' },
  { category: 'pH Adjusters (Caustic Soda)', opening: 30, received: 220, consumed: 75, closing: 175, lowStock: 2, outOfStock: 0, updated: '15/10/2026 ,11:05 AM' },
  { category: 'Others (Antifoam Agents)', opening: 18, received: 140, consumed: 60, closing: 98, lowStock: 0, outOfStock: 1, updated: '15/10/2026 ,11:20 AM' },
]

const EQUIPMENT_ITEMS = [
  { category: 'Raw Sewage & Sludge Pumps', opening: 14, received: 2, consumed: 0, closing: 14, lowStock: 1, outOfStock: 0, updated: '15/10/2026 ,10:30 AM' },
  { category: 'Air Blowers & Diffusers', opening: 8, received: 1, consumed: 0, closing: 8, lowStock: 0, outOfStock: 0, updated: '15/10/2026 ,10:30 AM' },
  { category: 'Mechanical Motors & Mixers', opening: 11, received: 2, consumed: 0, closing: 11, lowStock: 0, outOfStock: 0, updated: '15/10/2026 ,10:45 AM' },
  { category: 'Sensor Probes & Analyzers (pH, DO, TSS)', opening: 18, received: 4, consumed: 1, closing: 18, lowStock: 0, outOfStock: 0, updated: '15/10/2026 ,11:00 AM' },
  { category: 'Valves, Actuators & Flow Meters', opening: 24, received: 6, consumed: 2, closing: 24, lowStock: 1, outOfStock: 1, updated: '15/10/2026 ,11:15 AM' },
]

const INVENTORY_COLUMNS = [
  { key: 'stp', label: 'STP', width: '22%', sortable: true },
  { key: 'category', label: 'Item / Category', width: '20%', sortable: true },
  { key: 'opening', label: 'Opening Stock', width: '10%' },
  { key: 'received', label: 'Received', width: '9%' },
  { key: 'consumed', label: 'Consumed', width: '9%' },
  { key: 'closing', label: 'Closing Stock', width: '10%' },
  { key: 'lowStock', label: 'Low Stock', width: '9%' },
  { key: 'outOfStock', label: 'Out of Stock', width: '9%' },
]

function InventoryReportBody() {
  const { plantLabel, stpId } = useReportFilters()
  const [subTab, setSubTab] = useState<InventoryCategory>('Chemical')

  const fullPlantName = useMemo(() => resolveFullStpName(plantLabel, stpId), [plantLabel, stpId])
  const isAllStp = fullPlantName === "All STP's" || plantLabel?.toLowerCase().includes('all')

  const isChemical = subTab === 'Chemical'

  // Build rows strictly for the selected STP (or for all STPs if "All STP's" chosen)
  const rows = useMemo(() => {
    const baseItems = isChemical ? CHEMICAL_ITEMS : EQUIPMENT_ITEMS

    if (isAllStp) {
      // Cross-STP roll-up
      const allPlants = Object.values(stpDetails).map((d) => {
        const city = d.site?.city ? `, ${d.site.city}` : ''
        return `${d.name}${city}`
      })
      return allPlants.flatMap((plant, pIdx) =>
        baseItems.slice(0, 2).map((item, iIdx) => ({
          id: `inv-${pIdx}-${iIdx}`,
          stp: plant,
          ...item,
        })),
      )
    }

    // STRICTLY the selected STP data
    return baseItems.map((item, idx) => ({
      id: `inv-${idx}-${subTab}`,
      stp: fullPlantName,
      ...item,
    }))
  }, [isChemical, isAllStp, fullPlantName, subTab])

  const title = isChemical ? 'Chemical Inventory Report' : 'Equipment Inventory Report'
  const description = isChemical
    ? 'Chemical stock balances, consumption logs, minimum reserve thresholds, and replenishment orders.'
    : 'Machinery & equipment availability, operational status, maintenance reserves, and spares inventory.'

  return (
    <ReportDownloadScreen
      moduleKey="inventory"
      title={title}
      description={description}
      categoryFilter={{
        label: 'Inventory Type',
        value: subTab,
        options: [
          { id: 'Chemical', label: 'Chemical' },
          { id: 'Equipment', label: 'Equipment' },
        ],
        onChange: (val) => setSubTab(val as InventoryCategory),
      }}
      columns={INVENTORY_COLUMNS}
      rows={rows}
      renderCell={(r, col) => {
        if (col.key === 'closing') {
          return <span className="font-semibold text-[#16A34A]">{r.closing}</span>
        }
        if (col.key === 'lowStock' && Number(r.lowStock) > 0) {
          return <span className="font-bold text-[#D97706]">{r.lowStock}</span>
        }
        if (col.key === 'outOfStock' && Number(r.outOfStock) > 0) {
          return <span className="font-bold text-[#DC2626]">{r.outOfStock}</span>
        }
        return r[col.key]
      }}
      exportTitle={`${title} - ${fullPlantName}`}
      exportFileName={`${subTab.toLowerCase()}-inventory-report-${(plantLabel || 'stp').toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
    />
  )
}

export default function InventoryReport() {
  return (
    <ReportShell>
      <InventoryReportBody />
    </ReportShell>
  )
}
