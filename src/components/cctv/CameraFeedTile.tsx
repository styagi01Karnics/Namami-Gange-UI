import { useEffect, useState } from 'react'
import PlantScene from './PlantScene'
import MediaMtxWhepPlayer from './MediaMtxWhepPlayer'
import RecordingAutoPlayer from './RecordingAutoPlayer'
import { probeLiveStream, startCameraStream, stopCameraStream } from '../../api/cctv'
import type { CameraPlayer, RecordingTarget } from '../../api/cctv'

const STATUS_DOT = { Live: 'bg-ok', Offline: 'bg-danger' }

export const waterLabel = (location: string) =>
  location === 'Influent' ? 'Sewage Water' : location === 'Effluent' ? 'Treated Water' : location

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
  const hasLiveUrl = Boolean(feed.streamUrl)
  // WHEP and HLS connect in the browser; only iframe/MediaMTX pages need a backend probe.
  const browserPlayer = feed.player === 'whep' || feed.player === 'hls'
  const [liveOk, setLiveOk] = useState(browserPlayer && hasLiveUrl)
  const [liveFailed, setLiveFailed] = useState(false)
  const [starting, setStarting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setLiveFailed(false)
    if (!hasLiveUrl) {
      setLiveOk(false)
      return undefined
    }

    if (browserPlayer) {
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
  }, [hasLiveUrl, feed.streamUrl, feed.player, browserPlayer])

  async function handleStart() {
    if (!feed.cameraId) {
      setLiveFailed(false)
      return
    }

    setStarting(true)
    setMessage('')

    try {
      await startCameraStream(feed.cameraId)
      setLiveFailed(false)
      setMessage('Start command sent. Waiting for stream...')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start camera')
    } finally {
      setStarting(false)
    }
  }

  async function handleStop() {
    if (!feed.cameraId) {
      setLiveFailed(true)
      return
    }

    setMessage('')

    try {
      await stopCameraStream(feed.cameraId)
      setLiveFailed(true)
      setMessage('Stop command sent.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to stop camera')
    }
  }

  // Priority 1: Live streaming
  const showStream = hasLiveUrl && liveOk && !liveFailed
  // Priority 2: Recording (fallback if live streaming is not working)
  const showRecording = Boolean(recording) && !showStream

  return (
    <div className="flex min-w-0 flex-col">
      <div className="group relative aspect-[5/3] w-full overflow-hidden rounded-[10px] bg-[#07121e]">
        {showStream && browserPlayer ? (
          <MediaMtxWhepPlayer
            src={feed.streamUrl!}
            protocol={feed.player === 'hls' ? 'hls' : 'whep'}
            title={feed.location}
            onError={() => setLiveFailed(true)}
          />
        ) : showStream ? (
          <iframe
            title={feed.location}
            src={feed.streamUrl}
            allow="autoplay; fullscreen"
            onError={() => setLiveFailed(true)}
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : showRecording && recording ? (
          <RecordingAutoPlayer recording={recording} title={feed.location} />
        ) : feed.image ? (
          <img src={feed.image} alt={`${feed.location} camera`} className="h-full w-full object-cover" />
        ) : (
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
        className={`mt-[14px] space-y-[8px] ${divider ? 'border-l border-line pl-[16px]' : 'pr-[16px]'
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
