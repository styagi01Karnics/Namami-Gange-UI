import { useMemo, useState } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import MetricRingCard from '../../components/ui/MetricRingCard'
import SoftStatCardsRow, { type SoftStatItem } from '../../components/ui/SoftStatCard'
import PillTabs from '../../components/ui/PillTabs'
import TabSectionHeader from '../../components/stp/TabSectionHeader'
import DateRangeField from '../../components/ui/DateRangeField'
import { StpLink, Tone } from '../../components/reports/cells'
import {
  equipmentSummary,
  inventoryReportColumns,
  inventoryReportRows,
  inventoryStats,
  inventorySummary,
} from '../../data/mockData'

const TONED = { closing: 'green', lowStock: 'amber', outOfStock: 'red' }
const SUB_TABS = ['Chemical', 'Equipment'] as const

function inventoryBottomCards(): SoftStatItem[] {
  return inventoryStats
    .filter((s) => s.key !== 'value')
    .map((s) => ({
      key: s.key,
      label: s.label,
      value: s.value,
      tone: s.key === 'consumption' ? ('ok' as const) : s.key === 'daysLeft' ? ('danger' as const) : ('brand' as const),
    }))
}

function InventoryReportBody() {
  const { range, setRange } = useReportFilters()
  const [subTab, setSubTab] = useState<(typeof SUB_TABS)[number]>('Chemical')
  const isChemical = subTab === 'Chemical'
  const summary = isChemical ? inventorySummary : equipmentSummary
  const adequate = summary.breakdown.find((b) => b.key === 'adequate')
  const low = summary.breakdown.find((b) => b.key === 'low')
  const out = summary.breakdown.find((b) => b.key === 'out')

  const rows = useMemo(() => inventoryReportRows, [])

  const renderCell = (row, col) => {
    if (col.key === 'stp') return <StpLink>{row.stp}</StpLink>
    if (TONED[col.key]) return <Tone tone={TONED[col.key]}>{row[col.key]}</Tone>
    return row[col.key]
  }

  return (
    <>
      <TabSectionHeader
        tab="Inventory"
        right={<DateRangeField value={range} onChange={setRange} className="w-[280px]" />}
      />

      <PillTabs
        tabs={[...SUB_TABS]}
        active={subTab}
        onChange={(t) => setSubTab(t as (typeof SUB_TABS)[number])}
      />

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

      {isChemical && <SoftStatCardsRow items={inventoryBottomCards()} columns={3} gap={16} />}

      <ReportTable
        columns={inventoryReportColumns}
        rows={rows}
        searchKeys={['stp', 'category']}
        renderCell={renderCell}
        minWidth={1020}
        emptyMessage={`No ${subTab.toLowerCase()} records for this period.`}
        exportTitle="Inventory Report"
        exportFileName="inventory-report"
      />
    </>
  )
}

export default function InventoryReport() {
  return (
    <ReportShell>
      <InventoryReportBody />
    </ReportShell>
  )
}
