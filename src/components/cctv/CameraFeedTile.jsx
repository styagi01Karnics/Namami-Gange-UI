import { useEffect, useState } from 'react'
import PlantScene from './PlantScene'
import MediaMtxWhepPlayer from './MediaMtxWhepPlayer'
import { startCameraStream, stopCameraStream } from '../../api/cctv'

const STATUS_DOT = { Live: 'bg-ok', Offline: 'bg-danger' }

function formatLiveTimestamp(date) {
  return date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export default function CameraFeedTile({ feed, divider = false }) {
  const isOffline = feed.status === 'Offline'
  const [streaming, setStreaming] = useState(!isOffline && Boolean(feed.streamUrl))
  const [starting, setStarting] = useState(false)
  const [message, setMessage] = useState('')
  const [timestamp, setTimestamp] = useState(() => formatLiveTimestamp(new Date()))

  useEffect(() => {
    setStreaming(feed.status !== 'Offline' && Boolean(feed.streamUrl))
    setMessage('')
  }, [feed.cameraId, feed.status, feed.streamUrl])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(formatLiveTimestamp(new Date()))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

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

  const showStream = streaming && !isOffline && feed.streamUrl

  return (
    <div className="flex min-w-0 flex-col">
      <div className="group relative aspect-[5/3] w-full overflow-hidden rounded-[10px] bg-[#07121e]">
        {showStream && feed.player === 'whep' ? (
          <MediaMtxWhepPlayer src={feed.streamUrl} title={feed.location} />
        ) : showStream ? (
          <iframe
            title={feed.location}
            src={feed.streamUrl}
            allow="autoplay; fullscreen"
            className="absolute inset-0 h-full w-full border-0"
          />
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

        <span className="pointer-events-none absolute left-[10px] top-[10px] z-[1] inline-flex max-w-[calc(100%-5.5rem)] items-center gap-[6px] rounded-full bg-white/95 px-[10px] py-[4px] text-[11.5px] font-semibold leading-4 text-ink shadow-card opacity-0 transition-opacity group-hover:opacity-100">
          <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${STATUS_DOT[feed.status] ?? 'bg-danger'}`} />
          <span className="truncate">{feed.status}</span>
        </span>

        {showStream && (
          <button
            type="button"
            onClick={handleStop}
            className="absolute right-[10px] top-[10px] z-[1] rounded-full bg-black/55 px-[10px] py-[4px] text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            Stop
          </button>
        )}

        {showStream && feed.player !== 'whep' && (
          <span className="pointer-events-none absolute bottom-[9px] left-1/2 z-[1] inline-flex -translate-x-1/2 items-center gap-[5px] text-[11px] font-medium leading-4 text-white opacity-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] transition-opacity group-hover:opacity-100">
            <span className="h-[5px] w-[5px] rounded-full bg-danger" />
            {timestamp}
          </span>
        )}

        {!showStream && feed.timecode && (
          <span className="absolute bottom-[9px] left-1/2 inline-flex -translate-x-1/2 items-center gap-[5px] text-[11px] font-medium leading-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
            <span className="h-[5px] w-[5px] rounded-full bg-danger" />
            {feed.timecode}
          </span>
        )}

        {message && (
          <div className="absolute inset-x-2 bottom-8 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
            {message}
          </div>
        )}
      </div>

      <dl
        className={`mt-[14px] divide-y divide-line ${
          divider ? 'border-l border-line pl-[16px]' : 'pr-[16px]'
        }`}
      >
        {[
          ['Camera ID:', feed.id],
          ['Location:', feed.location],
          ['Last seen:', feed.lastSeen],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-[10px] py-[10px]">
            <dt className="text-[13px] leading-[18px] text-ink-soft">{label}</dt>
            <dd className="text-right text-[13px] font-semibold leading-[18px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
