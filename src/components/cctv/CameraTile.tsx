import { useEffect, useState } from 'react'
import { Info, Play } from 'lucide-react'
import { ico } from '../ui/Ico'
import PlantScene from './PlantScene'
import MediaMtxWhepPlayer from './MediaMtxWhepPlayer'
import RecordingAutoPlayer from './RecordingAutoPlayer'
import { probeLiveStream, type RecordingTarget } from '../../api/cctv'

const ExpandIcon = ico('fluent:full-screen-maximize-24-filled')

const STATUS_DOT = {
  Live: 'bg-ok',
  Offline: 'bg-danger',
  'Under Maintenance': 'bg-warn',
}

/** The camera still itself — shared by the tile and the expanded overlay. */
export function CameraStill({
  camera,
  sceneId,
  recording,
  liveFailed = false,
}: {
  camera
  sceneId: string
  recording?: RecordingTarget | null
  liveFailed?: boolean
}) {
  const claimedLive = Boolean(camera.streamUrl) && camera.status === 'Live' && !liveFailed
  // WHEP players (14 MLD) report their own errors — do not block them on the CCTV health API.
  const needsProbe = claimedLive && camera.player !== 'whep'
  const [liveOk, setLiveOk] = useState(!needsProbe)
  const [whepFailed, setWhepFailed] = useState(false)

  useEffect(() => {
    setWhepFailed(false)
    if (!needsProbe) {
      setLiveOk(claimedLive)
      return undefined
    }

    // Probe iframe/MediaMTX pages so a dead stream does not show the "stream not found" HTML.
    setLiveOk(false)
    let cancelled = false
    probeLiveStream(camera.streamUrl).then((ok) => {
      if (!cancelled) setLiveOk(ok)
    })
    return () => {
      cancelled = true
    }
  }, [needsProbe, claimedLive, camera.streamUrl])

  if (claimedLive && liveOk && !whepFailed) {
    if (camera.player === 'whep') {
      return (
        <MediaMtxWhepPlayer
          src={camera.streamUrl}
          title={camera.location}
          onError={() => setWhepFailed(true)}
        />
      )
    }

    return (
      <iframe
        title={camera.location}
        src={camera.streamUrl}
        allow="autoplay; fullscreen"
        className="absolute inset-0 h-full w-full border-0"
      />
    )
  }

  if (recording) {
    return <RecordingAutoPlayer recording={recording} title={camera.location} />
  }

  const dimmed = camera.status !== 'Live'
  return (
    <>
      <div className={dimmed ? 'h-full w-full grayscale' : 'h-full w-full'}>
        {camera.image ? (
          <img src={camera.image} alt={`${camera.location} camera`} className="h-full w-full object-cover" />
        ) : (
          <PlantScene id={sceneId} />
        )}
      </div>
      {dimmed && <div className="absolute inset-0 bg-white/45" />}
    </>
  )
}

export default function CameraTile({ camera, onExpand, onPlayRecording, recording, hideTags = false }) {
  return (
    <div className="min-w-0 rounded-[12px] bg-[#EAF2FC] p-[12px]">
      <div className="flex items-center justify-between gap-3">
        <h4 className="truncate text-[13.5px] font-semibold leading-5 text-ink">{camera.location}</h4>
        {!hideTags && (
          <span className="inline-flex shrink-0 items-center gap-[6px] rounded-full bg-white px-[10px] py-[4px] text-[11.5px] font-semibold leading-4 text-ink">
            <span className={`h-[7px] w-[7px] rounded-full ${STATUS_DOT[camera.status] ?? 'bg-ink-muted'}`} />
            {camera.status === 'Live' ? 'Online' : camera.status}
          </span>
        )}
      </div>

      <div className="relative mt-[10px] aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-[#07121e]">
        <CameraStill camera={camera} sceneId={`tile-${camera.key}`} recording={recording} />

        {onPlayRecording && !hideTags && (
          <button
            type="button"
            onClick={() => onPlayRecording(camera)}
            aria-label={`Play ${camera.location} recording`}
            className="absolute left-[10px] top-[10px] z-[1] inline-flex h-[26px] items-center gap-[4px] rounded-[7px] bg-white/90 px-[8px] text-[11px] font-semibold text-ink-soft shadow-card transition-colors hover:text-brand"
          >
            <Play size={11} fill="currentColor" />
            Recording
          </button>
        )}

        <button
          type="button"
          onClick={() => onExpand?.(camera)}
          aria-label={`Expand ${camera.location} camera`}
          className="absolute right-[10px] top-[10px] z-[1] flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-white/90 text-ink-soft shadow-card transition-colors hover:text-brand"
        >
          <ExpandIcon size={13} />
        </button>

        <div className="group/info absolute bottom-[10px] left-[10px] z-[1]">
          <button
            type="button"
            aria-label={`${camera.location} camera details`}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-card"
          >
            <Info size={13} strokeWidth={2.2} />
          </button>

          <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-0 hidden w-max min-w-[280px] rounded-[9px] bg-white p-[11px] shadow-pop group-focus-within/info:block group-hover/info:block">
            {[
              ['Camera ID:', camera.id],
              ['Last Active:', camera.lastActive],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-[16px] whitespace-nowrap py-[3px]">
                <span className="text-[11.5px] leading-4 text-ink-soft">{label}</span>
                <span className="text-[11.5px] font-semibold leading-4 text-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {camera.timecode && !camera.streamUrl && (
          <span className="absolute bottom-[10px] right-[10px] inline-flex items-center gap-[5px] rounded-full bg-white/90 px-[8px] py-[3px] text-[11px] font-medium leading-4 text-ink">
            <span className="h-[5px] w-[5px] rounded-full bg-danger" />
            {camera.timecode}
          </span>
        )}
      </div>
    </div>
  )
}
