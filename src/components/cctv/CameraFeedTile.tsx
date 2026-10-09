import { useEffect, useState } from 'react'
import PlantScene from './PlantScene'
import MediaMtxWhepPlayer from './MediaMtxWhepPlayer'
import RecordingAutoPlayer from './RecordingAutoPlayer'
import { probeLiveStream, startCameraStream, stopCameraStream } from '../../api/cctv'
import type { CameraPlayer, RecordingTarget } from '../../api/cctv'

const STATUS_DOT = { Live: 'bg-ok', Offline: 'bg-danger' }

export const waterLabel = (location: string) =>
  location === 'Influent' ? 'Sewer Water' : location === 'Effluent' ? 'Treated Water' : location

export type LiveFeed = {
  key: string
  cameraId?: number
  id: string
  location: string
  lastSeen: string
  status: 'Live' | 'Offline' | string
  streamUrl?: string
  player?: CameraPlayer
  image?: string | null
  timecode?: string | null
}

export default function CameraFeedTile({
  feed,
  divider = false,
  recording,
}: {
  feed: LiveFeed
  divider?: boolean
  recording?: RecordingTarget
}) {
  const isOffline = feed.status === 'Offline'
  const [streaming, setStreaming] = useState(!isOffline && Boolean(feed.streamUrl))
  // WHEP (14 MLD) connects in the browser; only iframe/MediaMTX pages need a backend probe.
  const [liveOk, setLiveOk] = useState(feed.player === 'whep')
  const [starting, setStarting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const running = feed.status !== 'Offline' && Boolean(feed.streamUrl)
    setStreaming(running)
    setLiveOk(feed.player === 'whep')
    setMessage('')
  }, [feed.cameraId, feed.status, feed.streamUrl, feed.player])

  useEffect(() => {
    if (!streaming || !feed.streamUrl || isOffline) {
      setLiveOk(false)
      return undefined
    }

    if (feed.player === 'whep') {
      setLiveOk(true)
      return undefined
    }

    setLiveOk(false)
    let cancelled = false
    probeLiveStream(feed.streamUrl).then((ok) => {
      if (!cancelled) setLiveOk(ok)
    })
    return () => {
      cancelled = true
    }
  }, [streaming, feed.streamUrl, feed.player, isOffline])

  async function handleStart() {
    if (!feed.cameraId) {
      setStreaming(true)
      return
    }

    setStarting(true)
    setMessage('')

    try {
      await startCameraStream(feed.cameraId)
      setStreaming(true)
      setMessage('Start command sent. Waiting for stream...')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start camera')
    } finally {
      setStarting(false)
    }
  }

  async function handleStop() {
    if (!feed.cameraId) {
      setStreaming(false)
      return
    }

    setMessage('')

    try {
      await stopCameraStream(feed.cameraId)
      setStreaming(false)
      setMessage('Stop command sent.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to stop camera')
    }
  }

  const showStream = streaming && !isOffline && liveOk && Boolean(feed.streamUrl)
  const showRecording = Boolean(recording) && !showStream

  return (
    <div className="flex min-w-0 flex-col">
      <div className="group relative aspect-[5/3] w-full overflow-hidden rounded-[10px] bg-[#07121e]">
        {showStream && feed.player === 'whep' ? (
          <MediaMtxWhepPlayer
            src={feed.streamUrl!}
            title={feed.location}
            onError={() => setLiveOk(false)}
          />
        ) : showStream ? (
          <iframe
            title={feed.location}
            src={feed.streamUrl}
            allow="autoplay; fullscreen"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : showRecording && recording ? (
          <RecordingAutoPlayer recording={recording} title={feed.location} />
        ) : feed.image ? (
          <img src={feed.image} alt={`${feed.location} camera`} className="h-full w-full object-cover" />
        ) : isOffline || !streaming ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a2430] px-4 text-center">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-wide text-[#9ca3af]">Camera stopped</p>
              {feed.streamUrl && (
                <button
                  type="button"
                  disabled={starting}
                  onClick={handleStart}
                  className="mt-2 text-[12px] font-medium text-brand-link underline disabled:opacity-60"
                >
                  {starting ? 'Starting...' : 'Start camera'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <PlantScene id={`scene-${feed.key}`} />
        )}

        {isOffline && feed.image && <div className="absolute inset-0 bg-white/45" />}

        {!recording && isOffline && (
          <span className="pointer-events-none absolute left-[10px] top-[10px] z-[1] inline-flex items-center gap-[6px] rounded-full bg-danger-soft px-[10px] py-[4px] text-[11.5px] font-semibold leading-4 text-danger shadow-card">
            <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${STATUS_DOT.Offline}`} />
            Non-Active
          </span>
        )}

        {showStream && (
          <button
            type="button"
            onClick={handleStop}
            className="absolute right-[10px] top-[10px] z-[1] rounded-full bg-black/55 px-[10px] py-[4px] text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            Stop
          </button>
        )}

        {message && (
          <div className="absolute inset-x-2 bottom-8 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
            {message}
          </div>
        )}
      </div>

      <dl
        className={`mt-[14px] space-y-[8px] ${
          divider ? 'border-l border-line pl-[16px]' : 'pr-[16px]'
        }`}
      >
        {[['Location:', waterLabel(feed.location)]].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-[10px]">
            <dt className="text-[13px] leading-[18px] text-ink-soft">{label}</dt>
            <dd className="text-right text-[13px] font-semibold leading-[18px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
