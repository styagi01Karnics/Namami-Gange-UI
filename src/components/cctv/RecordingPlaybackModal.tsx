import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ico } from '../ui/Ico'
import MediaMtxWhepPlayer from './MediaMtxWhepPlayer'
import PlantScene from './PlantScene'
import type { CameraPlayer, PlaybackClip } from '../../api/cctv'

const PinIcon = ico('fluent:location-20-filled')

export type PlaybackFeed = {
  cameraId?: number | string
  id: string
  location: string
  streamUrl?: string
  player?: CameraPlayer
  status?: string
  clips?: PlaybackClip[]
}

function formatTimestamp(date: Date) {
  const h = date.getHours() % 12 || 12
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  const cs = String(Math.floor(date.getMilliseconds() / 10)).padStart(2, '0')
  return `${h}:${m}:${s}:${cs}`
}

/** Live / playback viewer opened from Recording Playback → Play Recording. */
export default function RecordingPlaybackModal({
  feed,
  onClose,
}: {
  feed: PlaybackFeed
  onClose: () => void
}) {
  const [timestamp, setTimestamp] = useState(() => formatTimestamp(new Date()))
  const [clipIndex, setClipIndex] = useState(0)
  const clips = feed.clips ?? []
  const activeClip = clips[clipIndex]
  const mp4Url = activeClip?.streamUrl ?? (feed.player === 'mp4' ? feed.streamUrl : undefined)
  const showStream = Boolean(mp4Url || feed.streamUrl) && feed.status !== 'Offline'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const timer = window.setInterval(() => setTimestamp(formatTimestamp(new Date())), 80)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-[24px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Camera ${feed.id} recording playback`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[720px] rounded-[18px] bg-white p-[18px] shadow-pop"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold leading-5 text-ink">
              CAM ID:{' '}
              <span className="text-brand-link">{feed.cameraId ?? feed.id}</span>
            </h3>
            <p className="mt-[6px] flex items-center gap-[5px] text-[13px] font-semibold leading-4 text-orange">
              <PinIcon size={15} className="text-orange" />
              {feed.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close recording playback"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-ink transition-colors hover:bg-[#F3F7FC]"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="relative mt-[14px] aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-[#07121e]">
          {showStream && feed.player === 'whep' ? (
            <MediaMtxWhepPlayer src={feed.streamUrl!} title={feed.location} />
          ) : showStream && (feed.player === 'mp4' || mp4Url) ? (
            <video
              key={mp4Url}
              title={feed.location}
              src={mp4Url}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full bg-[#07121e] object-contain"
              onEnded={() => {
                if (clipIndex + 1 < clips.length) setClipIndex(clipIndex + 1)
              }}
            />
          ) : showStream ? (
            <iframe
              title={feed.location}
              src={feed.streamUrl}
              allow="autoplay; fullscreen"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <PlantScene id={`playback-${feed.id}`} />
          )}

          {feed.player !== 'mp4' && (
            <span className="pointer-events-none absolute bottom-[14px] left-1/2 inline-flex -translate-x-1/2 items-center gap-[6px] text-[13px] font-semibold leading-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
              <span className="h-[7px] w-[7px] rounded-full bg-danger" />
              {timestamp}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
