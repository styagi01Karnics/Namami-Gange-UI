import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { Maximize2, Minimize2, X } from 'lucide-react'
import { ico } from '../ui/Ico'
import MediaMtxWhepPlayer from './MediaMtxWhepPlayer'
import PlantScene from './PlantScene'
import type { CameraPlayer } from '../../api/cctv'

const PinIcon = ico('fluent:location-20-filled')
const RECORDING_WINDOW_SECONDS = 60 * 60

function timeAtOffset(startTime: string, offsetMinutes: number) {
  const match = startTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return startTime

  const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0)
  const totalMinutes = (hour * 60 + Number(match[2]) + offsetMinutes) % (24 * 60)
  const normalizedMinutes = (totalMinutes + 24 * 60) % (24 * 60)
  const hour24 = Math.floor(normalizedMinutes / 60)
  const hour12 = hour24 % 12 || 12
  const minute = normalizedMinutes % 60
  const meridiem = hour24 < 12 ? 'AM' : 'PM'
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${meridiem}`
}

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
  const [seekSeconds, setSeekSeconds] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const showStream = Boolean(feed.streamUrl) && feed.status !== 'Offline'
  const startTime = feed.startTime ?? '09:00 AM'
  const selectedTime = timeAtOffset(startTime, Math.floor(seekSeconds / 60))
  const timelineLabels = [0, 15, 30, 45, 60].map((minute) => timeAtOffset(startTime, minute))
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
    setSeekSeconds(0)
  }, [feed.id, feed.recordingDate, feed.startTime])

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
      await playerRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => setFullscreen(true))
    } else {
      setFullscreen((value) => !value)
    }
  }

  const seekToPointer = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    setSeekSeconds(Math.round(fraction * RECORDING_WINDOW_SECONDS / 60) * 60)
  }

  const seekWithKeyboard = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 5 * 60 : 60
    if (event.key === 'Home') {
      event.preventDefault()
      setSeekSeconds(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setSeekSeconds(RECORDING_WINDOW_SECONDS)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      setSeekSeconds((value) => Math.max(0, value - step))
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      setSeekSeconds((value) => Math.min(RECORDING_WINDOW_SECONDS, value + step))
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

          <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#06111D]/95 via-[#06111D]/85 to-transparent px-[16px] pb-[13px] ${fullscreen ? 'pt-[30px]' : 'pt-[42px]'}`}>
            <div className="mb-[7px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] font-medium text-white">
              <span className="inline-flex items-center gap-[7px]">
                <span className="size-[8px] rounded-full bg-[#35D07F] shadow-[0_0_8px_#35D07F]" />
                Green bar indicates the selected NVR sync window
              </span>
              <span className="text-white/85">{fullscreen ? 'Recording video' : `Selected: ${selectedTime}`}</span>
            </div>
            <button
              type="button"
              role="slider"
              aria-label="Recording timeline"
              aria-valuemin={0}
              aria-valuemax={RECORDING_WINDOW_SECONDS}
              aria-valuenow={seekSeconds}
              aria-valuetext={selectedTime}
              onClick={seekToPointer}
              onKeyDown={seekWithKeyboard}
              className="pointer-events-auto group relative flex h-[34px] w-full cursor-pointer items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06111D]"
            >
              <span className="absolute inset-x-0 top-1/2 h-[14px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 shadow-inner">
                <span className="absolute inset-0 rounded-full bg-[#35D07F] shadow-[0_0_12px_#35D07F99]" />
                {timelineLabels.map((_, index) => (
                  <span
                    key={index}
                    className="absolute top-0 h-full w-[2px] bg-[#0B7543]/70"
                    style={{ left: `${index * 25}%` }}
                  />
                ))}
              </span>
              <span
                className="absolute top-1/2 z-[1] size-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#159957] shadow-[0_1px_8px_#0008] transition-[left] duration-100"
                style={{ left: `${(seekSeconds / RECORDING_WINDOW_SECONDS) * 100}%` }}
              />
            </button>
            {!fullscreen && (
              <>
                <div className="grid grid-cols-5 text-[9px] font-medium text-white/80">
                  {timelineLabels.map((time, index) => (
                    <span key={`${time}-${index}`} className={index === 0 ? 'text-left' : index === 4 ? 'text-right' : 'text-center'}>
                      {time}
                    </span>
                  ))}
                </div>
                <div className="mt-[5px] flex justify-between text-[10px] font-medium text-white/65">
                  <span>{recordingDateLabel}</span>
                  <span>1-hour NVR recording window · {startTime} – {feed.endTime ?? timeAtOffset(startTime, 60)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
