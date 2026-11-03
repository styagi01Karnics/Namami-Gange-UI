import { useEffect, useMemo, useState } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { toPenaltyRangeFromLabel } from '../../components/ui/DateRangeField'
import { normalizeViolations } from '../../components/compliance/ViolationsTable'
import { complianceReportColumns, type StpMonthlyViolation } from '../../data/mockData'
import { defaultOccurrencesRange, fetchPenaltyOccurrences } from '../../api/penalty'
import { fetchDashboardPlants, toPlantNameByCode } from '../../api/plants'
import { formatParameterName } from '../../lib/parameters'

const FETCH_ERROR = 'Unable to fetch STP violation records from the API. Please try again later.'

function ComplianceReportBody() {
  const { stpId, plantCode, plantLabel, range } = useReportFilters()
  const effectiveCode = plantCode || stpId

  const apiRange = useMemo(
    () => (range ? toPenaltyRangeFromLabel(range) : null) ?? defaultOccurrencesRange(),
    [range],
  )
  const requestKey = `${effectiveCode ?? ''}|${apiRange.from}|${apiRange.to}`

  const [fetchState, setFetchState] = useState<{
    key: string
    rows: StpMonthlyViolation[] | null
    error: string | null
  } | null>(null)

  const fetchViolationRows = async (): Promise<StpMonthlyViolation[] | null> => {
    if (!effectiveCode) return []
    try {
      const plants = await fetchDashboardPlants()
      const plantNameByCode = toPlantNameByCode(plants)
      const plantName = plantLabel || plantNameByCode[effectiveCode]
      const occurrences = await fetchPenaltyOccurrences(effectiveCode, apiRange, {
        plantNameByCode,
        plantName,
      })
      return normalizeViolations(occurrences, effectiveCode)
    } catch {
      return null
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchViolationRows().then((loaded) => {
      if (cancelled) return
      if (loaded) {
        setFetchState({ key: requestKey, rows: loaded, error: null })
      } else {
        setFetchState({ key: requestKey, rows: null, error: FETCH_ERROR })
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const isCurrentRequest = fetchState?.key === requestKey
  const loading = Boolean(effectiveCode) && !isCurrentRequest
  const loadError = isCurrentRequest ? fetchState.error : null
  const rows = isCurrentRequest && fetchState.rows ? fetchState.rows : []

  const loadRows = async () => {
    const loaded = await fetchViolationRows()
    if (!loaded) return null
    setFetchState({ key: requestKey, rows: loaded, error: null })
    return loaded
  }

  return (
    <ReportDownloadScreen
      moduleKey="violation"
      title="STP Violation & Non-Compliance Report"
      description="Non-complying STPs with observed parameter values, permissible range, date and non-compliance time."
      columns={complianceReportColumns}
      rows={rows}
      loadRows={loadRows}
      loading={loading}
      error={loadError}
      renderCell={(r, col) => {
        if (col.key === 'parameters') {
          return (
            <div className="flex flex-col gap-[6px]">
              {r.parameters.map((p, i) => (
                <div key={i} className="text-[13.5px] font-bold leading-[22px] text-[#07121E]">
                  <span>{formatParameterName(p.name)}: </span>
                  <span className="font-bold text-[#DC2626]">{p.observedValue}</span>
                </div>
              ))}
            </div>
          )
        }
        if (col.key === 'range') {
          return (
            <div className="flex flex-col gap-[6px]">
              {r.parameters.map((p, i) => (
                <div key={i} className="whitespace-nowrap text-[13.5px] font-normal leading-[22px] text-[#363636]">
                  {p.range}
                </div>
              ))}
            </div>
          )
        }
        if (col.key === 'date') {
          return <span className="font-semibold text-[#0768D2] whitespace-nowrap">{r.date || '—'}</span>
        }
        if (col.key === 'nonComplianceTime') {
          return <span className="whitespace-nowrap">{r.nonComplianceTime || '—'}</span>
        }
        return undefined
      }}
      getValue={(r, col) => {
        if (col.key === 'parameters') {
          return r.parameters.map((p) => `${formatParameterName(p.name)}: ${p.observedValue}`).join(', ')
        }
        if (col.key === 'range') return r.parameters.map((p) => p.range).join(', ')
        return undefined
      }}
      exportTitle="STP Violation & Penalty Report"
      exportFileName="violation-report"
      qrEnabled
    />
  )
}

export default function ComplianceReport() {
  return (
    <ReportShell>
      <ComplianceReportBody />
    </ReportShell>
  )
}
