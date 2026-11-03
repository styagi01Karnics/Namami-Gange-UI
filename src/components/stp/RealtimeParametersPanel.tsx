import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import StreamHeader from './StreamHeader'
import ParamTile from './ParamTile'
import { stpStreams } from '../../data/mockData'
import {
  fetchStpLive,
  type LiveParam,
  type LiveRealtimeData,
} from '../../api/stpLive'
import {
  fetchStpMonitoringRealtime,
  resolveStpSite,
  type StpSite,
} from '../../api/stpMonitoring'
import { useFifteenMinuteInterval } from '../../hooks/useFifteenMinuteInterval'

const NO_DATA_MESSAGE = 'Unable to fetch realtime parameter values for this STP.'

const STREAM_SURFACE = {
  brand: 'bg-[#F4F8FE]',
  ok: 'bg-[#F8FCF9]',
}

/** The only parameters shown for influent and effluent, in display order. */
const REALTIME_PARAM_KEYS = ['bod', 'ph', 'temp', 'tss', 'cod', 'nh4n']

/** Placeholder tile when the source has no reading for one of the six parameters (e.g. only Total Nitrogen is reported). */
const EMPTY_PARAMS: Record<string, LiveParam> = {
  bod: { key: 'bod', label: 'BOD', icon: 'bod', value: '— mg/L', tone: 'ok', note: 'Ideal: 0 – 10' },
  ph: { key: 'ph', label: 'pH', icon: 'ph', value: '— pH', tone: 'ok', note: 'Ideal: 5.5 - 9' },
  temp: { key: 'temp', label: 'Temperature', icon: 'temp', value: '— °C', tone: 'ok', note: 'Ideal: 15 – 35' },
  tss: { key: 'tss', label: 'TSS', icon: 'tss', value: '— mg/L', tone: 'ok', note: 'Ideal: 0 – 20' },
  cod: { key: 'cod', label: 'COD', icon: 'cod', value: '— mg/L', tone: 'ok', note: 'Ideal: 0 – 50' },
  nh4n: { key: 'nh4n', label: 'NH₄-N', icon: 'nh4n', value: '— mg/L', tone: 'ok', note: 'Ideal: 0 – 10' },
}

const IDEAL_RANGES: Record<string, { min?: number; max?: number }> = {
  bod: { min: 0, max: 10 },
  ph: { min: 5.5, max: 9 },
  temp: { min: 15, max: 35 },
  temperature: { min: 15, max: 35 },
  tss: { min: 0, max: 20 },
  cod: { min: 0, max: 50 },
  nh4n: { min: 0, max: 10 },
  nh4: { min: 0, max: 10 },
  no3n: { min: 0, max: 10 },
  tn: { min: 0, max: 10 },
  tp: { min: 0, max: 5 },
}

function parseRangeFromNote(note?: string): { min?: number; max?: number } | null {
  if (!note) return null
  const match = note.match(/(-?\d+(?:\.\d+)?)\s*[-–—to]+\s*(-?\d+(?:\.\d+)?)/i)
  if (match) {
    const min = parseFloat(match[1])
    const max = parseFloat(match[2])
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return { min, max }
    }
  }
  return null
}

function extractNumericValue(val: unknown): number | null {
  if (typeof val === 'number') return Number.isFinite(val) ? val : null
  if (typeof val === 'string' && val.trim() !== '' && val.trim() !== '—') {
    const match = val.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)
    if (match) {
      const num = parseFloat(match[0])
      if (Number.isFinite(num)) return num
    }
  }
  return null
}

function isExceedingIdeal(key: string, valueStr: string, note?: string): boolean {
  const num = extractNumericValue(valueStr)
  if (num == null) return false
  const range = parseRangeFromNote(note) || IDEAL_RANGES[key.toLowerCase()]
  if (!range) return false
  if (range.min !== undefined && num < range.min) return true
  if (range.max !== undefined && num > range.max) return true
  return false
}

function hasAnyReading(data: LiveRealtimeData): boolean {
  return [data.influent, data.effluent].some(
    (stream) =>
      extractNumericValue(stream.flow?.value) != null ||
      stream.params.some((param) => extractNumericValue(param.value) != null),
  )
}

export default function RealtimeParametersPanel({
  plantCode,
  stpId,
  plantName,
  site,
  refreshTick = 0,
}: {
  plantCode?: string
  stpId?: string
  plantName?: string
  site?: string
  refreshTick?: number
}) {
  const [realtime, setRealtime] = useState<LiveRealtimeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Resolve matching backend StpSite enum constant
  const resolvedSite: StpSite | null = useMemo(() => {
    return resolveStpSite(site || plantCode || stpId || plantName)
  }, [site, plantCode, stpId, plantName])

  // Never show the previous plant's readings while another plant loads
  useEffect(() => {
    setRealtime(null)
    setError(null)
  }, [resolvedSite, plantCode, site, stpId])

  // Fetch logic with 8909 monitoring endpoint as primary, dashboard /live as fallback
  const loadData = useCallback(async () => {
    const queryKey = resolvedSite || plantCode || site || stpId
    if (!queryKey) return

    setLoading(true)
    try {
      // 1. Primary: fetch from STP monitoring service (http://45.195.229.15:8909/api/stp/${site}/latest)
      const monitoringData = await fetchStpMonitoringRealtime(queryKey)
      if (monitoringData && hasAnyReading(monitoringData)) {
        setRealtime(monitoringData)
        setError(null)
        return
      }

      // 2. Secondary: fall back to dashboard /live endpoint
      if (plantCode) {
        const liveData = await fetchStpLive(plantCode)
        if (liveData && hasAnyReading(liveData)) {
          setRealtime(liveData)
          setError(null)
          return
        }
      }

      // 3. Nothing returned by either source
      setRealtime(null)
      setError(NO_DATA_MESSAGE)
    } catch {
      setRealtime(null)
      setError(NO_DATA_MESSAGE)
    } finally {
      setLoading(false)
    }
  }, [resolvedSite, plantCode, site, stpId])

  // Hook executes immediately on plant/site change and on each 15-minute DB interval mark
  const { isFetching } = useFifteenMinuteInterval(
    loadData,
    Boolean(resolvedSite || plantCode || site || stpId),
    `${resolvedSite || plantCode || ''}-${refreshTick}`,
  )

  const isLoading = loading || isFetching

  if (!realtime) {
    return (
      <div
        role={error ? 'alert' : 'status'}
        className="flex min-h-[200px] flex-col items-center justify-center rounded-[12px] border border-line bg-white py-[48px] text-center"
      >
        {error ? (
          <>
            <p className="text-[14.5px] font-medium text-ink-muted">{error}</p>
            <p className="mt-1 text-[12.5px] text-ink-soft">Please try again later.</p>
          </>
        ) : (
          <div className="flex items-center gap-2 text-[14px] text-ink-muted">
            <RefreshCw size={18} className="animate-spin text-brand" />
            Loading realtime parameter values...
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-[16px]">
      {stpStreams.map((stream) => {
        const data = realtime[stream.key]
        const surface = STREAM_SURFACE[stream.tone] ?? STREAM_SURFACE.brand
        const isInfluent = stream.key === 'influent'
        const params = REALTIME_PARAM_KEYS.map((key) => data.params.find((param) => param.key === key) ?? EMPTY_PARAMS[key])
          .map((param) => {
            if (isInfluent) {
              return { ...param, tone: 'ok' as const }
            }
            // In effluent: if any parameter exceeds ideal values -> show in Red color ('breach'), else Green ('ok')
            const exceeds = isExceedingIdeal(param.key, param.value, param.note)
            return {
              ...param,
              tone: exceeds ? ('breach' as const) : ('ok' as const),
            }
          })

        return (
          <div
            key={stream.key}
            className={`overflow-hidden rounded-[16px] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)] ${surface}`}
          >
            <StreamHeader stream={stream} />

            <div className="p-[12px]">
              <p className="text-[16px] font-semibold leading-[22px] text-[#565656]">Flow</p>
              <p className="mt-[8px] text-[18px] font-bold leading-[22px] text-[#07121E]">
                {isLoading && !data.flow?.value
                  ? '…'
                  : !data.flow?.value || data.flow.value === '—'
                    ? '0'
                    : data.flow.value}
                <span className="ml-[4px]">{data.flow.unit}</span>
              </p>

              <div className="mt-[16px] grid grid-cols-3 gap-[12px]">
                {params.map((p) => (
                  <ParamTile key={p.key} param={p} />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
