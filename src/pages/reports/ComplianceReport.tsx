import { useEffect, useMemo, useState } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ComplianceTab from '../../components/compliance/ComplianceTab'
import StatCardsRow from '../../components/ui/StatCardsRow'
import ViolationsTable from '../../components/compliance/ViolationsTable'
import { toPenaltyRangeFromLabel } from '../../components/ui/DateRangeField'
import { complianceSummary } from '../../data/mockData'
import {
  fetchPenaltyOccurrences,
  fetchPenaltySummary,
  formatPenaltyAmount,
  type ViolationListItem,
} from '../../api/penalty'
import {
  ALL_STP_FILTER_OPTION,
  fetchDashboardPlants,
  toPlantNameByCode,
} from '../../api/plants'

function ComplianceReportBody() {
  const { stpId, plantCode, plantLabel, stpOptions, range } = useReportFilters()

  // Individual STP → same component + APIs as STP Management → Compliance.
  if (plantCode) {
    return (
      <ComplianceTab
        key={`${plantCode}:${range}`}
        plantCode={plantCode}
        showDetails={false}
        showStpColumn
        exportLabel={plantLabel || plantCode}
        dateRangeLabel={range}
      />
    )
  }

  return (
    <ComplianceReportAllStps
      plantLabel={plantLabel ?? ALL_STP_FILTER_OPTION.label}
      stpOptions={stpOptions}
      stpId={stpId}
      dateRangeLabel={range}
    />
  )
}

function ComplianceReportAllStps({
  plantLabel = ALL_STP_FILTER_OPTION.label,
  stpOptions,
  dateRangeLabel,
}: {
  plantLabel?: string
  stpOptions: Array<{ id: string; label: string; plantCode?: string; stpId?: string }>
  stpId: string
  dateRangeLabel: string
}) {
  const plants = useMemo(
    () =>
      stpOptions.filter(
        (option) => option.id !== ALL_STP_FILTER_OPTION.id && Boolean(option.plantCode),
      ),
    [stpOptions],
  )

  const [rows, setRows] = useState<ViolationListItem[]>([])
  const [totalAssessedAmount, setTotalAssessedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (plants.length === 0) {
      setRows([])
      setTotalAssessedAmount(null)
      setLoading(false)
      return undefined
    }

    let cancelled = false
    setLoading(true)

    async function loadAll() {
      const dashboardPlants = await fetchDashboardPlants()
      const plantNameByCode = toPlantNameByCode(dashboardPlants)
      const selectedRange = toPenaltyRangeFromLabel(dateRangeLabel)
      // Always prefer calendar selection for /penalty/summary (00:00:00 → 23:59:59).
      const apiRange = selectedRange ?? undefined

      const results = await Promise.all(
        plants.map(async (plant) => {
          const code = plant.plantCode!
          const [occurrences, summary] = await Promise.all([
            fetchPenaltyOccurrences(code, apiRange, {
              plantNameByCode,
              plantName: plantNameByCode[code] ?? plant.label,
            }),
            // /api/penalty/summary?stpCode&from&to — from/to from calendar.
            fetchPenaltySummary(code, apiRange),
          ])
          return {
            occurrences,
            assessed: summary?.totalAssessedAmount ?? 0,
          }
        }),
      )

      if (cancelled) return

      setRows(results.flatMap((result) => result.occurrences))
      setTotalAssessedAmount(results.reduce((sum, result) => sum + (result.assessed || 0), 0))
      setLoading(false)
    }

    loadAll()
    return () => {
      cancelled = true
    }
  }, [plants, dateRangeLabel])

  const summary = useMemo(() => {
    const totalPenalty = rows.reduce((sum, row) => {
      const raw = row.penalty?.total?.replace(/[₹,\s]/g, '') ?? '0'
      const amount = Number(raw)
      return sum + (Number.isFinite(amount) ? amount : 0)
    }, 0)

    return complianceSummary.map((item) => {
      const withNote = { ...item, note: 'Across all locations' }
      if (item.key === 'violations') return { ...withNote, value: String(rows.length) }
      if (item.key === 'penalty') {
        return {
          ...withNote,
          value: `₹${totalPenalty.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
        }
      }
      if (item.key === 'payable') {
        return {
          ...withNote,
          value: totalAssessedAmount == null ? '—' : formatPenaltyAmount(totalAssessedAmount),
        }
      }
      return withNote
    })
  }, [rows, totalAssessedAmount])

  return (
    <div className="space-y-[16px]">
      <StatCardsRow items={summary} columns={3} />
      <ViolationsTable
        key="all-stps"
        rows={rows}
        loading={loading}
        source="api"
        showDetails={false}
        showStpColumn
        exportLabel={plantLabel}
      />
    </div>
  )
}

export default function ComplianceReport() {
  return (
    <ReportShell>
      <ComplianceReportBody />
    </ReportShell>
  )
}
