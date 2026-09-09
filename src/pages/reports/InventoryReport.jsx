import { useMemo, useState } from 'react'
import { User } from 'lucide-react'
import ReportShell from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import StatCardsRow from '../../components/ui/StatCardsRow'
import GaugeSummaryCard from '../../components/ui/GaugeSummaryCard'
import Select from '../../components/ui/Select'
import { StpLink, Tone } from '../../components/reports/cells'
import {
  inventoryReportColumns,
  inventoryReportFilterOptions,
  inventoryReportRows,
  inventoryStats,
  inventorySummary,
} from '../../data/mockData'

const TONED = { closing: 'green', lowStock: 'amber', outOfStock: 'red' }

export default function InventoryReport() {
  const [category, setCategory] = useState(inventoryReportFilterOptions[0])

  const rows = useMemo(
    () =>
      category === 'All Inventory'
        ? inventoryReportRows
        : inventoryReportRows.filter((r) => r.category === category),
    [category],
  )

  const renderCell = (row, col) => {
    if (col.key === 'stp') return <StpLink>{row.stp}</StpLink>
    if (TONED[col.key]) return <Tone tone={TONED[col.key]}>{row[col.key]}</Tone>
    return row[col.key]
  }

  return (
    <ReportShell>
      <div className="grid grid-cols-[0.95fr_1fr] items-start gap-[16px] [&>*]:min-w-0">
        <GaugeSummaryCard
          icon={User}
          label={inventorySummary.label}
          total={inventorySummary.total}
          scopeLabel={inventorySummary.scopeLabel}
          breakdown={inventorySummary.breakdown}
          gaugeSize={240}
          noteChip
        />
        <StatCardsRow items={inventoryStats} columns={2} noteChip />
      </div>

      <ReportTable
        columns={inventoryReportColumns}
        rows={rows}
        searchKeys={['stp', 'category']}
        toolbar={
          <Select
            options={inventoryReportFilterOptions}
            value={category}
            onChange={setCategory}
            className="w-[210px]"
            buttonClassName="h-[34px]"
          />
        }
        renderCell={renderCell}
        minWidth={1020}
        emptyMessage={`No ${category} records for this period.`}
      />
    </ReportShell>
  )
}
