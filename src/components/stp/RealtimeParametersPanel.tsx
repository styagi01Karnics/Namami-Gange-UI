import { useEffect, useState } from 'react'
import StreamHeader from './StreamHeader'
import ParamTile from './ParamTile'
import { stpStreams } from '../../data/mockData'
import {
  fetchStpLive,
  getFallbackRealtime,
  type LiveRealtimeData,
} from '../../api/stpLive'

const STREAM_SURFACE = {
  brand: 'bg-[#F4F8FE]',
  ok: 'bg-[#F8FCF9]',
}

export default function RealtimeParametersPanel({
  plantCode,
  refreshTick = 0,
}: {
  plantCode?: string
  refreshTick?: number
}) {
  const [realtime, setRealtime] = useState<LiveRealtimeData>(() => getFallbackRealtime())
  const [loading, setLoading] = useState(false)

  // All STPs (including 68mldjag) → REST /api/dashboard/{plantCode}/live
  useEffect(() => {
    if (!plantCode) return undefined

    let cancelled = false

    async function loadLive() {
      setLoading(true)
      const next = await fetchStpLive(plantCode!)
      if (cancelled) return
      if (next) {
        setRealtime(next)
      } else {
        setRealtime(getFallbackRealtime())
      }
      setLoading(false)
    }

    loadLive()
    return () => {
      cancelled = true
    }
  }, [plantCode, refreshTick])

  return (
    <div className="grid grid-cols-2 gap-[16px]">
      {stpStreams.map((stream) => {
        const data = realtime[stream.key]
        const surface = STREAM_SURFACE[stream.tone] ?? STREAM_SURFACE.brand
        // Remove flow/totalizer subcard so Temperature is displayed in its place.
        // For nitrogen: NH4-N has priority over NO3-N if present.
        const hasNh4n = data.params.some((p) => p.key === 'nh4n' && p.value !== '—')
        const params = data.params
          .filter((param) => param.key !== 'flow' && param.key !== 'totalizer')
          .filter((param) => !hasNh4n || param.key !== 'no3n')

        return (
          <div
            key={stream.key}
            className={`overflow-hidden rounded-[16px] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)] ${surface}`}
          >
            <StreamHeader stream={stream} />

            <div className="p-[12px]">
              <p className="text-[16px] font-semibold leading-[22px] text-[#565656]">Flow</p>
              <p className="mt-[8px] text-[18px] font-bold leading-[22px] text-[#07121E]">
                {loading && !data.flow?.value ? '…' : data.flow.value}
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
