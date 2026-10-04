import { useEffect, useState } from 'react'
import StreamHeader from './StreamHeader'
import ParamTile from './ParamTile'
import { stpStreams } from '../../data/mockData'
import {
  fetchStpLive,
  getFallbackRealtime,
  type LiveRealtimeData,
} from '../../api/stpLive'

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
    if (!plantCode || refreshTick < 1) return undefined

    let cancelled = false

    async function loadLive() {
      if (refreshTick === 1) setLoading(true)
      const next = await fetchStpLive(plantCode!)
      if (cancelled) return
      if (next) setRealtime(next)
      setLoading(false)
    }

    loadLive()
    return () => {
      cancelled = true
    }
  }, [plantCode, refreshTick])

  return (
    <div className="grid grid-cols-2 gap-[14px]">
      {stpStreams.map((stream) => {
        const data = realtime[stream.key]

        return (
          <div
            key={stream.key}
            className="overflow-hidden rounded-[12px] border border-line bg-[#F7FAFF]"
          >
            <StreamHeader stream={stream} />

            <div className="p-[14px]">
              <p className="text-[13px] leading-[18px] text-ink-soft">
                Flow{' '}
                <span className="font-bold text-ink">
                  {loading && !data.flow?.value ? '…' : data.flow.value}
                  <span className="ml-[4px] text-[14px] font-semibold">{data.flow.unit}</span>
                </span>
              </p>

              <div className="mt-[12px] grid grid-cols-3 gap-[10px]">
                {data.params.map((p) => (
                  <ParamTile
                    key={p.key}
                    param={stream.key === 'influent' ? { ...p, tone: 'ok' } : p}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
