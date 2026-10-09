import { useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2, X } from 'lucide-react'
import { ico } from '../ui/Ico'
import MediaMtxWhepPlayer from './MediaMtxWhepPlayer'
import PlantScene from './PlantScene'
import type { CameraPlayer, PlaybackClip } from '../../api/cctv'

const PinIcon = ico('fluent:location-20-filled')

export type PlaybackFeed = {
  cameraId?: number | string
  id: string
  location: string
  recordingDate?: string
  startTime?: string
  endTime?: string
  streamUrl?: string
  player?: CameraPlayer
  status?: string
  clips?: PlaybackClip[]
}

/** Playback viewer opened from Recording Playback → Play Recording. */
export default function RecordingPlaybackModal({
  feed,
  onClose,
}: {
  feed: PlaybackFeed
  onClose: () => void
}) {
  const playerRef = useRef<HTMLDivElement>(null)
  const [clipIndex, setClipIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const clips = feed.clips ?? []
  const activeClip = clips[clipIndex]
  const mp4Url = activeClip?.streamUrl ?? (feed.player === 'mp4' ? feed.streamUrl : undefined)
  const showStream = Boolean(mp4Url || feed.streamUrl) && feed.status !== 'Offline'
  const recordingDateLabel = feed.recordingDate
    ? new Date(`${feed.recordingDate}T00:00:00`).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Selected date'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    setClipIndex(0)
  }, [feed.id, feed.recordingDate, feed.startTime, feed.streamUrl])

  useEffect(() => {
    const syncFullscreen = () => {
      setFullscreen(document.fullscreenElement === playerRef.current)
    }
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  const toggleFullscreen = async () => {
    if (fullscreen) {
      if (document.fullscreenElement === playerRef.current) {
        await document.exitFullscreen().catch(() => setFullscreen(false))
      } else {
        setFullscreen(false)
      }
      return
    }

    if (playerRef.current?.requestFullscreen) {
      await playerRef.current
        .requestFullscreen()
        .then(() => setFullscreen(true))
        .catch(() => setFullscreen(true))
    } else {
      setFullscreen((value) => !value)
    }
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-[24px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${feed.location} recording playback`}
        onClick={(e) => e.stopPropagation()}
        className={`w-full rounded-[18px] bg-white p-[18px] shadow-pop ${fullscreen ? 'fixed inset-0 z-[60] flex h-dvh max-w-none flex-col rounded-none p-0' : 'max-w-[720px]'}`}
      >
        <div className={`flex shrink-0 items-start justify-between gap-4 ${fullscreen ? 'px-5 py-3' : ''}`}>
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold leading-5 text-ink">Recording Playback</h3>
            <p className="mt-[6px] flex items-center gap-[5px] text-[13px] font-semibold leading-4 text-orange">
              <PinIcon size={15} className="text-orange" />
              {feed.location}
            </p>
            {(feed.startTime || feed.endTime || recordingDateLabel) && (
              <p className="mt-[4px] text-[12px] font-medium text-ink-soft">
                {recordingDateLabel}
                {feed.startTime || feed.endTime
                  ? ` · ${feed.startTime ?? ''}${feed.startTime && feed.endTime ? ' – ' : ''}${feed.endTime ?? ''}`
                  : ''}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'Exit fullscreen recording' : 'Expand recording to fullscreen'}
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] text-ink transition-colors hover:bg-[#F3F7FC]"
            >
              {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close recording playback"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] text-ink transition-colors hover:bg-[#F3F7FC]"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div
          ref={playerRef}
          className={`relative w-full overflow-hidden bg-[#07121e] ${fullscreen ? 'min-h-0 flex-1 rounded-none' : 'mt-[14px] aspect-[16/10] rounded-[22px]'}`}
        >
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

          <div className="pointer-events-none absolute left-0 top-0 z-20 inline-flex items-center gap-[6px] rounded-br-[8px] bg-[#07121E]/95 px-[10px] py-[6px] text-[11px] font-semibold leading-4 text-white shadow-md">
            <span className="size-[7px] rounded-full bg-[#35D07F] shadow-[0_0_6px_#35D07F]" />
            Recording Video
          </div>
        </div>
      </div>
    </div>
  )
}
