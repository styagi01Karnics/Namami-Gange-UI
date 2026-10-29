import { useEffect, useMemo, useState } from 'react'
import SoftStatCardsRow from '../ui/SoftStatCard'
import ViolationsTable from './ViolationsTable'
import { toPenaltyRangeFromLabel } from '../ui/DateRangeField'
import {
  complianceSummary,
  monthlyComplianceSummary,
  monthlyViolations,
  type StpMonthlyViolation,
} from '../../data/mockData'
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
  const [rows, setRows] = useState<Array<StpMonthlyViolation | ViolationListItem>>(() => {
    if (!plantCode) return monthlyViolations
    return monthlyViolations.filter(
      (v) =>
        v.plantCode === plantCode ||
        (exportLabel && v.stpName?.toLowerCase().includes(exportLabel.toLowerCase())),
    )
  })
  const [totalAssessedAmount, setTotalAssessedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(Boolean(plantCode))

  useEffect(() => {
    if (!plantCode) {
      setRows(monthlyViolations)
      setTotalAssessedAmount(null)
      setLoading(false)
      return undefined
    }

    const code = plantCode
    let cancelled = false
    setLoading(true)
    setTotalAssessedAmount(null)

    async function loadCompliance() {
      const plants = await fetchDashboardPlants()
      const plantNameByCode = toPlantNameByCode(plants)
      const plantName = exportLabel || plantNameByCode[code]
      const selectedRange = dateRangeLabel ? toPenaltyRangeFromLabel(dateRangeLabel) : null
      // Calendar selection → day bounds (00:00:00 → 23:59:59); else API default window.
      const apiRange = selectedRange ?? defaultOccurrencesRange()

      let nextRows: ViolationListItem[] = []
      let penaltySummaryData: { totalAssessedAmount: number } | null = null

      try {
        const [apiRows, apiSummary] = await Promise.all([
          fetchPenaltyOccurrences(code, apiRange, {
            plantNameByCode,
            plantName,
          }),
          fetchPenaltySummary(code, apiRange),
        ])
        nextRows = apiRows
        penaltySummaryData = apiSummary
      } catch {
        nextRows = []
      }

      if (cancelled) return

      if (nextRows.length > 0) {
        setRows(
          nextRows.map((row) => ({
            ...row,
            stp: row.stp || plantName || code,
          })),
        )
      } else {
        // Fallback to mock violations for THIS selected plant only
        const matchingMock = monthlyViolations.filter(
          (v) =>
            v.plantCode === code ||
            (v.stpName && (
              v.stpName.toLowerCase().includes(code.toLowerCase()) ||
              (plantName && v.stpName.toLowerCase().includes(plantName.toLowerCase()))
            )),
        )
        setRows(matchingMock)
      }

      setTotalAssessedAmount(penaltySummaryData ? penaltySummaryData.totalAssessedAmount : null)
      setLoading(false)
    }

    loadCompliance()
    return () => {
      cancelled = true
    }
  }, [plantCode, showStpColumn, dateRangeLabel, exportLabel])

  const summary = useMemo(() => {
    if (!plantCode) {
      const uniqueStps = new Set(monthlyViolations.map((r) => r.stpName)).size
      return monthlyComplianceSummary.map((item) => {
        if (item.key === 'noncomplying') {
          return { ...item, value: String(uniqueStps) }
        }
        return item
      })
    }

    const totalPenalty = rows.reduce((sum, row) => {
      let penaltyStr = ''
      if ('penalty' in row && row.penalty?.total) {
        penaltyStr = row.penalty.total
      } else if ('totalPenalty' in row && (row as StpMonthlyViolation).totalPenalty) {
        penaltyStr = (row as StpMonthlyViolation).totalPenalty!
      }
      const raw = penaltyStr.replace(/[₹,\s]/g, '') || '0'
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
          value:
            totalAssessedAmount == null
              ? totalPenalty > 0
                ? `₹${totalPenalty.toLocaleString('en-IN')}`
                : '—'
              : formatPenaltyAmount(totalAssessedAmount),
        }
      }
      return item
    })
  }, [plantCode, rows, totalAssessedAmount])

  return (
    <div className="space-y-[16px]">
      <SoftStatCardsRow
        items={summary}
        columns={plantCode ? 3 : 5}
        gap={16}
      />
      <ViolationsTable
        key={plantCode || 'all-stps-month'}
        rows={rows}
        loading={loading}
        source={plantCode ? 'api' : 'mock'}
        showDetails={showDetails}
        showStpColumn={showStpColumn}
        exportLabel={exportLabel || (rows[0] as StpMonthlyViolation)?.stpName}
        stpManagementPdf={stpManagementPdf}
        plantCode={plantCode}
        dateRangeLabel={dateRangeLabel}
      />
    </div>
  )
}
