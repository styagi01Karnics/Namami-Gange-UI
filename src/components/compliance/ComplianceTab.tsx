import { useEffect, useMemo, useState } from 'react'
import SoftStatCardsRow from '../ui/SoftStatCard'
import ViolationsTable from './ViolationsTable'
import { toPenaltyRangeFromLabel } from '../ui/DateRangeField'
import {
  complianceSummary,
  monthlyComplianceSummary,
  monthlyViolations,
  stpVendorMonthlyPayments,
  type StpMonthlyViolation,
} from '../../data/mockData'
import {
  defaultOccurrencesRange,
  fetchPenaltyOccurrences,
  type ViolationListItem,
} from '../../api/penalty'
import { fetchDashboardPlants, toPlantNameByCode } from '../../api/plants'

function formatRupees(value: number) {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

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
  const [loading, setLoading] = useState(Boolean(plantCode))

  useEffect(() => {
    if (!plantCode) {
      setRows(monthlyViolations)
      setLoading(false)
      return undefined
    }

    const code = plantCode
    let cancelled = false
    setLoading(true)

    async function loadCompliance() {
      const plants = await fetchDashboardPlants()
      const plantNameByCode = toPlantNameByCode(plants)
      const plantName = exportLabel || plantNameByCode[code]
      const selectedRange = dateRangeLabel ? toPenaltyRangeFromLabel(dateRangeLabel) : null
      // Calendar selection → day bounds (00:00:00 → 23:59:59); else API default window.
      const apiRange = selectedRange ?? defaultOccurrencesRange()

      let nextRows: ViolationListItem[] = []

      try {
        nextRows = await fetchPenaltyOccurrences(code, apiRange, {
          plantNameByCode,
          plantName,
        })
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
        // Fallback to mock violations for THIS selected plant and month only
        const selectedMonth = selectedRange?.from.slice(0, 7)
        const matchingMock = monthlyViolations.filter(
          (v) =>
            v.plantCode === code ||
            (v.stpName && (
              v.stpName.toLowerCase().includes(code.toLowerCase()) ||
              (plantName && v.stpName.toLowerCase().includes(plantName.toLowerCase()))
            )),
        )
          .filter((v) => !selectedMonth || (v.date ?? '').split('/').reverse().join('-').startsWith(selectedMonth))
        setRows(matchingMock)
      }

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

    const now = new Date()
    const paymentMonth = dateRangeLabel
      ? toPenaltyRangeFromLabel(dateRangeLabel)?.from.slice(0, 7)
      : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const payment = (paymentMonth && stpVendorMonthlyPayments[paymentMonth]) || { amount: 0, paid: false }
    const vendorPayment = payment.amount

    const netPayable = Math.max(0, vendorPayment - totalPenalty)

    return complianceSummary.map((item) => {
      if (item.key === 'violations') {
        return { ...item, value: String(rows.length) }
      }
      if (item.key === 'vendorPayment') {
        return { ...item, value: formatRupees(vendorPayment) }
      }
      if (item.key === 'penalty') {
        return { ...item, value: formatRupees(totalPenalty) }
      }
      if (item.key === 'payable') {
        return {
          ...item,
          label: payment.paid ? 'Net Amount Paid' : 'Net Amount to Pay',
          value: formatRupees(netPayable),
        }
      }
      return item
    })
  }, [plantCode, rows, dateRangeLabel])

  return (
    <div className="space-y-[16px]">
      <SoftStatCardsRow
        items={summary}
        columns={plantCode ? 4 : 5}
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
