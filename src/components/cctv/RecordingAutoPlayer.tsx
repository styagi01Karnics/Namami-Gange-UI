import { useEffect, useState } from 'react'
import { loadPeriodRecording, type RecordingTarget } from '../../api/cctv'
import RecordingVideo from './RecordingVideo'

/** Period-matched CPV clip, used when the live stream is down or stopped. */
export default function RecordingAutoPlayer({
  recording,
  title,
}: {
  recording: RecordingTarget
  title: string
}) {
  const [src, setSrc] = useState('')
  const [label, setLabel] = useState('Loading recording…')

  useEffect(() => {
    let cancelled = false
    setSrc('')
    setLabel('Loading recording…')

    loadPeriodRecording(recording)
      .then((clip) => {
        if (cancelled) return
        if (!clip) {
          const effluent =
            recording.channel === 2 || /effluent|outlet/i.test(recording.location ?? '')
          setLabel(effluent ? 'Live stream error' : 'No recording available')
          return
        }
        setSrc(clip.streamUrl)
        setLabel('')
      })
      .catch((error) => {
        if (!cancelled) {
          setLabel(error instanceof Error ? error.message : 'Unable to play recording')
        }
      })

    return () => {
      cancelled = true
    }
  }, [recording.plantCode, recording.stpId, recording.channel, recording.location, recording.period])

  if (!src) {
    const streamError = label === 'Live stream error'
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#1a2430] px-4 text-center">
        <div>
          <p className={`text-[12px] font-medium ${streamError ? 'text-[#f3b4b4]' : 'text-[#e8edf4]'}`}>
            {label}
          </p>
          {streamError && (
            <p className="mt-1 text-[11px] font-medium text-[#9ca3af]">Live stream is not running</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <RecordingVideo
      key={src}
      title={title}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      controls
      preload="auto"
      onCanPlay={(event) => {
        event.currentTarget.play().catch(() => {})
      }}
      onError={() => setLabel('Unable to play this recording')}
    />
  )
}
