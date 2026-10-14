import { useMemo } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { inventoryReportColumns, inventoryReportRows } from '../../data/mockData'

function InventoryReportBody() {
  const { plantLabel } = useReportFilters()

  const rows = useMemo(() => {
    if (!plantLabel) return inventoryReportRows
    const filtered = inventoryReportRows.filter((r) =>
      r.stp.toLowerCase().includes(plantLabel.toLowerCase()),
    )
    return filtered.length > 0 ? filtered : inventoryReportRows
  }, [plantLabel])

  return (
    <ReportDownloadScreen
      moduleKey="inventory"
      title="Chemical & Equipment Inventory Report"
      description="Stock balances, consumption logs, minimum reserve thresholds, and replenishment orders."
      columns={inventoryReportColumns}
      rows={rows}
      renderCell={(r, col) => {
        if (col.key === 'lowStock' && Number(r.lowStock) > 0) {
          return <span className="font-semibold text-[#D97706]">{r.lowStock}</span>
        }
        if (col.key === 'outOfStock' && Number(r.outOfStock) > 0) {
          return <span className="font-bold text-[#DC2626]">{r.outOfStock}</span>
        }
        return r[col.key]
      }}
      exportTitle="Inventory Stock & Consumption Report"
      exportFileName="inventory-report"
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
