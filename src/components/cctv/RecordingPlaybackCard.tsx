import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Play } from 'lucide-react'
import { ico } from '../ui/Ico'
import type { IconComponent } from '../../types'
import PillTabs from '../ui/PillTabs'
import RecordingPlaybackModal, { type PlaybackFeed } from './RecordingPlaybackModal'
import { waterLabel } from './CameraFeedTile'
import {
  RECORDING_PERIODS,
  cameraLocationLabel as apiCameraLocationLabel,
  currentRecordingPeriod,
  fetchRecordings,
  startPeriodPlayback,
  type CctvCamera,
  type RecordingPeriod,
} from '../../api/cctv'

const CalendarIcon = ico('fluent:calendar-ltr-20-filled')
const PinIcon = ico('fluent:location-20-filled')
const ClockIcon = ico('fluent:clock-20-filled')

const PERIOD_TABS = (Object.keys(RECORDING_PERIODS) as RecordingPeriod[]).map(
  (id) => RECORDING_PERIODS[id].label,
)
const PERIOD_BY_LABEL = Object.fromEntries(
  (Object.keys(RECORDING_PERIODS) as RecordingPeriod[]).map((id) => [RECORDING_PERIODS[id].label, id]),
) as Record<string, RecordingPeriod>

const LOCATIONS = [
  { id: 'Influent', label: 'Sewer Water' },
  { id: 'Effluent', label: 'Treated Water' },
]
const RETENTION_DAYS = 15

function toDateInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function cameraLocationLabel(camera: CctvCamera) {
  return apiCameraLocationLabel(camera)
}

function channelFromLocation(location: string, cameras: CctvCamera[]) {
  const match = cameras.find((camera) => cameraLocationLabel(camera) === location)
  if (match?.channel) return match.channel
  return /effluent|outlet/i.test(location) ? 2 : 1
}

function FilterBlock({
  icon: Icon,
  label,
  children,
  className = '',
}: {
  icon: IconComponent
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-[10px] border border-[#B9D4F7] bg-[#E8F1FD] px-[12px] py-[10px] ${className}`}
    >
      <p className="mb-[8px] flex items-center gap-[6px] text-[12.5px] font-semibold leading-4 text-brand">
        <Icon size={15} className="text-brand" />
        {label}
      </p>
      {children}
    </div>
  )
}

/** Recording playback controls for the CCTV tab redesign. */
export default function RecordingPlaybackCard({
  cameras = [],
  stpId,
  plantCode,
}: {
  cameras?: CctvCamera[]
  stpId?: string
  plantCode?: string
}) {
  const [period, setPeriod] = useState<RecordingPeriod>(() => currentRecordingPeriod())
  const [date, setDate] = useState(() => toDateInput(new Date()))
  const [location, setLocation] = useState('Influent')
  const [playback, setPlayback] = useState<PlaybackFeed | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchRecordings({ plantCode, stpId })
      .then((clips) => {
        if (cancelled || clips.length === 0) return
        setDate(clips[clips.length - 1].startTime.slice(0, 10))
      })
      .catch(() => {
        if (!cancelled) setDate((current) => current || toDateInput(new Date()))
      })
    return () => {
      cancelled = true
    }
  }, [plantCode, stpId])

  const today = useMemo(() => new Date(), [])
  const maxDate = toDateInput(today)
  const minDate = toDateInput(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - (RETENTION_DAYS - 1)),
  )

  const locationOptions = useMemo(() => {
    if (cameras.length === 0) return LOCATIONS
    const labels = Array.from(new Set(cameras.map(cameraLocationLabel).filter(Boolean)))
    return labels.map((label) => ({ id: label, label: waterLabel(label) }))
  }, [cameras])

  const openPlayback = async () => {
    if (!date) {
      setError('No recording date available')
      return
    }

    const match =
      cameras.find((camera) => cameraLocationLabel(camera) === location) ?? cameras[0]
    const channel = channelFromLocation(location, cameras)

    setError('')
    setLoading(true)

    try {
      const clips = await startPeriodPlayback({
        plantCode,
        stpId,
        channel,
        location,
        date,
        period,
      })
      const range = RECORDING_PERIODS[period].ranges[0]
      setPlayback({
        cameraId: match?.id ?? channel,
        id: match?.name || String(channel),
        location: waterLabel(location),
        recordingDate: date,
        startTime: range?.start,
        endTime: range?.end,
        player: 'mp4',
        status: 'Recording',
        clips,
        streamUrl: clips[0].streamUrl,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to play recording')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px] shadow-card">
      <h3 className="text-[15px] font-semibold leading-5 text-ink">Recording Playback</h3>

      <div className="mt-[14px] grid grid-cols-[1.4fr_1fr_0.9fr] items-stretch gap-[12px]">
        <FilterBlock icon={ClockIcon} label="Time of day">
          <PillTabs
            tabs={PERIOD_TABS}
            active={RECORDING_PERIODS[period].label}
            onChange={(tab) => setPeriod(PERIOD_BY_LABEL[tab] ?? period)}
            variant="segmented"
            className="w-full"
          />
        </FilterBlock>

        <FilterBlock icon={CalendarIcon} label="Recording Date">
          <label className="relative block">
            <input
              type="date"
              value={date}
              min={minDate}
              max={maxDate}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="h-[34px] w-full rounded-[9px] border border-line bg-white px-[12px] text-[12.5px] font-medium text-ink outline-none focus:border-brand"
            />
          </label>
          <p className="mt-[6px] text-[11px] text-ink-soft">Last {RETENTION_DAYS} days</p>
        </FilterBlock>

        <FilterBlock icon={PinIcon} label="Location">
          <div className="grid grid-cols-2 gap-[8px]">
            {locationOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLocation(option.id)}
                aria-pressed={location === option.id}
                className={`h-[34px] rounded-[9px] border text-[12.5px] font-semibold transition-colors ${
                  location === option.id
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-white text-ink hover:border-brand'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterBlock>
      </div>

      {error && <p className="mt-[12px] text-[12.5px] font-medium text-danger">{error}</p>}

      <div className="mt-[14px] flex justify-end">
        <button
          type="button"
          onClick={openPlayback}
          disabled={loading || !date}
          className="inline-flex h-[40px] items-center gap-[8px] rounded-[10px] bg-brand px-[18px] text-[13.5px] font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? 'Preparing…' : `Play ${RECORDING_PERIODS[period].label} Recording`}
          <Play size={14} fill="currentColor" />
        </button>
      </div>

      {playback && <RecordingPlaybackModal feed={playback} onClose={() => setPlayback(null)} />}
    </section>
  )
}
