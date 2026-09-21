import { useEffect, useMemo, useState } from 'react'
import StatCardsRow from '../ui/StatCardsRow'
import ViolationsTable from './ViolationsTable'
import { toPenaltyRangeFromLabel } from '../ui/DateRangeField'
import { complianceSummary, violations as mockViolations } from '../../data/mockData'
import {
  defaultOccurrencesRange,
  fetchPenaltyOccurrences,
  fetchPenaltySummary,
  formatPenaltyAmount,
  type ViolationListItem,
} from '../../api/penalty'
import { fetchDashboardPlants, toPlantNameByCode } from '../../api/plants'

/** Shared by the Compliance page and the Compliance tab in STP Management. */
export default function ComplianceTab({
  plantCode,
  showDetails = true,
  showStpColumn = false,
  exportLabel,
  dateRangeLabel,
  stpManagementPdf = false,
}: {
  plantCode?: string
  showDetails?: boolean
  /** Data Reports → Compliance: show STP column from plants API plantName. */
  showStpColumn?: boolean
  /** STP dropdown / plant label for PDF/CSV filename + STP column. */
  exportLabel?: string
  /** Date-range field label (From – To). */
  dateRangeLabel?: string
  /** STP Management → Compliance PDF layout only. */
  stpManagementPdf?: boolean
} = {}) {
  const [rows, setRows] = useState<ViolationListItem[]>(() =>
    plantCode ? [] : (mockViolations as unknown as ViolationListItem[]),
  )
  const [totalAssessedAmount, setTotalAssessedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(Boolean(plantCode))

  useEffect(() => {
    if (!plantCode) {
      setRows(mockViolations as unknown as ViolationListItem[])
      setTotalAssessedAmount(null)
      setLoading(false)
      return undefined
    }

    const code = plantCode
    let cancelled = false
    setLoading(true)
    setRows([])
    setTotalAssessedAmount(null)

    async function loadCompliance() {
      const plants = await fetchDashboardPlants()
      const plantNameByCode = toPlantNameByCode(plants)
      const plantName = exportLabel || plantNameByCode[code]
      const selectedRange = dateRangeLabel ? toPenaltyRangeFromLabel(dateRangeLabel) : null
      // Calendar selection → day bounds (00:00:00 → 23:59:59); else API default window.
      const apiRange = selectedRange ?? defaultOccurrencesRange()

      const [nextRows, summary] = await Promise.all([
        fetchPenaltyOccurrences(code, apiRange, {
          plantNameByCode,
          plantName,
        }),
        fetchPenaltySummary(code, apiRange),
      ])
      if (cancelled) return
      setRows(
        nextRows.map((row) => ({
          ...row,
          stp: row.stp || plantName || code,
        })),
      )
      setTotalAssessedAmount(summary ? summary.totalAssessedAmount : null)
      setLoading(false)
    }

    loadCompliance()
    return () => {
      cancelled = true
    }
  }, [plantCode, showStpColumn, dateRangeLabel, exportLabel])

  const summary = useMemo(() => {
    if (!plantCode) return complianceSummary

    const totalPenalty = rows.reduce((sum, row) => {
      const raw = row.penalty?.total?.replace(/[₹,\s]/g, '') ?? '0'
      const amount = Number(raw)
      return sum + (Number.isFinite(amount) ? amount : 0)
    }, 0)

    return complianceSummary.map((item) => {
      if (item.key === 'violations') {
        return { ...item, value: String(rows.length) }
      }
      if (item.key === 'penalty') {
        return {
          ...item,
          value: `₹${totalPenalty.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
          })}`,
        }
      }
      if (item.key === 'payable') {
        return {
          ...item,
          value: totalAssessedAmount == null ? '—' : formatPenaltyAmount(totalAssessedAmount),
        }
      }
      return item
    })
  }, [plantCode, rows, totalAssessedAmount])

  return (
    <div className="space-y-[16px]">
      <StatCardsRow items={summary} columns={3} />
      <ViolationsTable
        key={plantCode || 'mock'}
        rows={rows}
        loading={loading}
        source={plantCode ? 'api' : 'mock'}
        showDetails={showDetails}
        showStpColumn={showStpColumn}
        exportLabel={exportLabel || rows[0]?.stp}
        stpManagementPdf={stpManagementPdf}
      />
    </div>
  )
}
