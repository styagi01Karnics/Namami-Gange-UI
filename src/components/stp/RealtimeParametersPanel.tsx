import { useEffect, useState } from 'react'
import { ico } from '../ui/Ico'
import StreamHeader from './StreamHeader'
import ParamTile from './ParamTile'
import { stpStreams } from '../../data/mockData'
import {
  fetchStpLive,
  getFallbackRealtime,
  mergeRealtimeReadings,
  MQTT_LIVE_PLANT_CODE,
  subscribeMqttLive,
  usesMqttLiveStream,
  type LiveRealtimeData,
} from '../../api/stpLive'

const ClockIcon = ico('fluent:clock-32-filled')

export default function RealtimeParametersPanel({
  plantCode,
  refreshTick = 0,
}: {
  plantCode?: string
  refreshTick?: number
}) {
  const [realtime, setRealtime] = useState<LiveRealtimeData>(() => getFallbackRealtime())
  const [loading, setLoading] = useState(false)
  const is68MldMqtt = usesMqttLiveStream(plantCode)

  // ONLY 68mldjag → MQTT SSE http://45.195.229.15:18087/api/mqtt/68mldjag/live
  useEffect(() => {
    if (!is68MldMqtt || plantCode !== MQTT_LIVE_PLANT_CODE) return undefined

    let cancelled = false
    setLoading(true)

    // Seed from REST live so the panel isn't empty while waiting for the next MQTT push.
    fetchStpLive(MQTT_LIVE_PLANT_CODE).then((next) => {
      if (cancelled || !next) return
      setRealtime((prev) => mergeRealtimeReadings(prev, next))
      setLoading(false)
    })

    const unsubscribe = subscribeMqttLive(
      MQTT_LIVE_PLANT_CODE,
      (next) => {
        if (cancelled) return
        // Merge so inlet-only / outlet-only MQTT slave packets don't wipe each other.
        setRealtime((prev) => mergeRealtimeReadings(prev, next))
        setLoading(false)
      },
      () => {
        if (!cancelled) setLoading(false)
      },
    )

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [is68MldMqtt, plantCode])

  // All other STPs → REST /dashboard/{plantCode}/live (never MQTT)
  useEffect(() => {
    if (!plantCode || is68MldMqtt || refreshTick < 1) return undefined

    let cancelled = false
    setRealtime(getFallbackRealtime())

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
  }, [plantCode, refreshTick, is68MldMqtt])

  return (
    <div className="grid grid-cols-2 gap-[14px]">
      {stpStreams.map((stream) => {
        const data = realtime[stream.key]

        return (
          <div key={stream.key} className="rounded-[12px] border border-line bg-[#F7FAFF] p-[14px]">
            <StreamHeader stream={stream}>
              <span
                className={`flex shrink-0 items-center gap-[6px] text-[12.5px] font-medium leading-4 ${
                  stream.tone === 'ok' ? 'text-ok' : 'text-brand'
                }`}
              >
                <ClockIcon size={15} />
                {loading && !data.at ? 'Loading...' : data.at}
              </span>
            </StreamHeader>

            <p className="mt-[14px] text-[13.5px] leading-[18px] text-ink-soft">Flow</p>
            <p className="mt-[4px] text-[21px] font-bold leading-7 text-ink">
              {data.flow.value}
              <span className="ml-[4px] text-[15px] font-semibold">{data.flow.unit}</span>
            </p>

            <div className="mt-[13px] grid grid-cols-3 gap-[10px]">
              {data.params.map((p) => (
                <ParamTile key={p.key} param={p} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
