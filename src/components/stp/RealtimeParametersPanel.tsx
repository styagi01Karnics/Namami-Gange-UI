import { useCallback, useMemo, useState } from 'react'
import StreamHeader from './StreamHeader'
import ParamTile from './ParamTile'
import { stpStreams } from '../../data/mockData'
import {
  fetchStpLive,
  getFallbackRealtime,
  type LiveRealtimeData,
} from '../../api/stpLive'
import {
  fetchStpMonitoringRealtime,
  resolveStpSite,
  type StpSite,
} from '../../api/stpMonitoring'
import { useFifteenMinuteInterval } from '../../hooks/useFifteenMinuteInterval'

const STREAM_SURFACE = {
  brand: 'bg-[#F4F8FE]',
  ok: 'bg-[#F8FCF9]',
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
  const [realtime, setRealtime] = useState<LiveRealtimeData>(() => getFallbackRealtime())
  const [loading, setLoading] = useState(false)

  // Resolve matching backend StpSite enum constant
  const resolvedSite: StpSite | null = useMemo(() => {
    return resolveStpSite(site || plantCode || stpId || plantName)
  }, [site, plantCode, stpId, plantName])

  // Fetch logic with 8909 monitoring endpoint as primary, dashboard /live as fallback
  const loadData = useCallback(async () => {
    const queryKey = resolvedSite || plantCode || site || stpId
    if (!queryKey) return

    setLoading(true)
    try {
      // 1. Primary: fetch from STP monitoring service (http://localhost:8909/api/stp/${site}/latest)
      const monitoringData = await fetchStpMonitoringRealtime(queryKey)
      if (monitoringData) {
        setRealtime(monitoringData)
        return
      }

      // 2. Secondary: fall back to dashboard /live endpoint
      if (plantCode) {
        const liveData = await fetchStpLive(plantCode)
        if (liveData) {
          setRealtime(liveData)
          return
        }
      }

      // 3. Fallback mock if both fail
      setRealtime(getFallbackRealtime())
    } catch {
      setRealtime(getFallbackRealtime())
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

  return (
    <div className="grid grid-cols-2 gap-[16px]">
      {stpStreams.map((stream) => {
        const data = realtime[stream.key]
        const surface = STREAM_SURFACE[stream.tone] ?? STREAM_SURFACE.brand
        // For nitrogen: NH4-N has priority over NO3-N if present.
        const hasNh4n = data.params.some((p) => p.key === 'nh4n' && p.value !== '—')
        const isInfluent = stream.key === 'influent'
        const params = data.params
          .filter((param) => param.key !== 'flow' && param.key !== 'totalizer')
          .filter((param) => !hasNh4n || param.key !== 'no3n')
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
