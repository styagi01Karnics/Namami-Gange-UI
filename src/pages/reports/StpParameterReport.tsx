import { useEffect, useMemo, useState } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { parseDateRangeLabel } from '../../components/ui/DateRangeField'
import { stpParameterReportColumns } from '../../data/mockData'
import {
  fetchAllStpReadings,
  mapStpReadingToParameterReportRow,
  resolveStpSite,
  type StpParameterReportRow,
  type StpReadingResponse,
} from '../../api/stpMonitoring'

type StreamFilter = 'Effluent' | 'Influent' | 'Both'

const PARAM_KEYS = new Set(['bod', 'cod', 'tss', 'ph', 'temp', 'nh4n'])

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function toIsoLocalDateTime(d: Date, hours: number, minutes: number, seconds: number) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
}

/**
 * Converts the UI date/time range label into ISO local date-time strings
 * matching `from=2026-11-01T00:00:00&to=2026-11-03T23:59:59`.
 */
function toReadingsRangeParams(rangeLabel: string): { from: string; to: string } {
  const now = new Date()
  const parsed = parseDateRangeLabel(rangeLabel)

  if (!parsed) {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return {
      from: toIsoLocalDateTime(startOfMonth, 0, 0, 0),
      to: toIsoLocalDateTime(now, 23, 59, 59),
    }
  }

  const start = parsed.from.getTime() <= parsed.to.getTime() ? parsed.from : parsed.to
  const end = parsed.from.getTime() <= parsed.to.getTime() ? parsed.to : parsed.from

  const fromStr = toIsoLocalDateTime(start, start.getHours(), start.getMinutes(), 0)

  // If the end time is midnight (00:00), cover the full end day through 23:59:59
  const endIsMidnight = end.getHours() === 0 && end.getMinutes() === 0
  const toStr = endIsMidnight
    ? toIsoLocalDateTime(end, 23, 59, 59)
    : toIsoLocalDateTime(end, end.getHours(), end.getMinutes(), 59)

  return { from: fromStr, to: toStr }
}

function buildRows(readings: StpReadingResponse[], streamFilter: StreamFilter) {
  const mapped =
    streamFilter === 'Influent'
      ? readings.map((item, idx) => mapStpReadingToParameterReportRow(item, 'inlet', idx))
      : streamFilter === 'Both'
        ? readings.flatMap((item, idx) => [
            mapStpReadingToParameterReportRow(item, 'inlet', idx),
            mapStpReadingToParameterReportRow(item, 'outlet', idx),
          ])
        : readings.map((item, idx) => mapStpReadingToParameterReportRow(item, 'outlet', idx))

  return mapped.map((row, idx) => ({ ...row, sn: idx + 1 }))
}

const FETCH_ERROR = 'Unable to fetch STP parameter records from the API. Please try again later.'
const UNMAPPED_SITE_ERROR = 'The selected STP is not mapped to a monitoring site, so no records can be fetched.'

function StpParameterReportBody() {
  const { stpId, plantCode, plantLabel, range } = useReportFilters()
  const [streamFilter, setStreamFilter] = useState<StreamFilter>('Effluent')

  const resolvedSite = useMemo(
    () => resolveStpSite(plantCode || stpId || plantLabel),
    [plantCode, stpId, plantLabel],
  )

  const { from, to } = useMemo(() => toReadingsRangeParams(range), [range])
  const requestKey = `${resolvedSite ?? ''}|${from}|${to}`

  const [fetchState, setFetchState] = useState<{
    key: string
    readings: StpReadingResponse[] | null
    error: string | null
  } | null>(null)

  // Records for the current STP and date range; shown on the page and refreshed on every View/QR/Email/Download.
  useEffect(() => {
    if (!resolvedSite) return undefined

    let cancelled = false
    fetchAllStpReadings({ site: resolvedSite, from, to }).then((readings) => {
      if (cancelled) return
      if (readings) {
        setFetchState({ key: requestKey, readings, error: null })
      } else {
        setFetchState({ key: requestKey, readings: null, error: FETCH_ERROR })
      }
    })

    return () => {
      cancelled = true
    }
  }, [resolvedSite, from, to, requestKey])

  const isCurrentRequest = fetchState?.key === requestKey
  const loading = Boolean(resolvedSite) && !isCurrentRequest
  const loadError = !resolvedSite
    ? UNMAPPED_SITE_ERROR
    : isCurrentRequest
      ? fetchState.error
      : null

  const loadRows = async () => {
    if (!resolvedSite) return null
    const readings = await fetchAllStpReadings({ site: resolvedSite, from, to })
    if (!readings) return null
    setFetchState({ key: requestKey, readings, error: null })
    return buildRows(readings, streamFilter)
  }

  const columns = useMemo(() => {
    if (streamFilter === 'Both') {
      return [
        stpParameterReportColumns[0],
        stpParameterReportColumns[1],
        stpParameterReportColumns[2],
        { key: 'stream', label: 'Stream', width: '10%' },
        ...stpParameterReportColumns.slice(3),
      ]
    }
    return stpParameterReportColumns
  }, [streamFilter])

  const readings = isCurrentRequest ? fetchState.readings : null
  const rows = useMemo(
    () => (readings ? buildRows(readings, streamFilter) : []),
    [readings, streamFilter],
  )

  const isNonComplyingCell = (
    r: Partial<StpParameterReportRow> & { status?: string },
    key: string,
  ) => {
    if (!PARAM_KEYS.has(key)) return false
    if (r.breaches && key in r.breaches) {
      return Boolean(r.breaches[key])
    }
    return (key === 'bod' || key === 'cod' || key === 'tss') && r.status === 'Non-Complying'
  }

  return (
    <ReportDownloadScreen
      moduleKey="parameters"
      title="STP Parameter Report"
      description="Official water quality compliance data including BOD, COD, TSS, pH, Temperature, and NH₄-N."
      categoryFilter={{
        label: 'Stream Type',
        value: streamFilter,
        options: [
          { id: 'Effluent', label: 'Effluent (Treated Water)' },
          { id: 'Influent', label: 'Influent (Sewage Water)' },
          { id: 'Both', label: 'Both (Influent & Effluent)' },
        ],
        onChange: (val) => setStreamFilter(val as StreamFilter),
      }}
      columns={columns}
      rows={rows}
      loadRows={loadRows}
      loading={loading}
      error={loadError}
      qrReportLink={
        resolvedSite
          ? {
              site: resolvedSite,
              from,
              to,
              stream: streamFilter,
            }
          : undefined
      }
      renderCell={(r, col) => {
        if (col.key === 'stream') {
          const isInfluent = r.stream === 'Influent'
          return (
            <span
              className={`inline-flex rounded-full px-[10px] py-[2px] text-[12px] font-semibold ${
                isInfluent ? 'bg-[#EBF5FF] text-[#0768D2]' : 'bg-[#DCFCE7] text-[#15803D]'
              }`}
            >
              {r.stream}
            </span>
          )
        }
        if (PARAM_KEYS.has(col.key)) {
          const isNonComplying = isNonComplyingCell(r, col.key)
          return (
            <span className={isNonComplying ? 'font-bold text-[#DC2626]' : 'font-medium text-[#111827]'}>
              {r[col.key]}
            </span>
          )
        }
        return r[col.key]
      }}
      cellTone={(r, col) => (isNonComplyingCell(r, col.key) ? 'red' : null)}
      exportTitle="STP Parameter Compliance Report"
      exportFileName={`stp-parameter-report-${(plantLabel || resolvedSite || 'stp').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      withTimeRange
      qrEnabled
    />
  )
}

export default function StpParameterReport() {
  return (
    <ReportShell>
      <StpParameterReportBody />
    </ReportShell>
  )
}
