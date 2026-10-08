import { useMemo, useState, type ReactNode } from 'react'
import { Play } from 'lucide-react'
import { ico } from '../ui/Ico'
import type { IconComponent } from '../../types'
import Select from '../ui/Select'
import RecordingPlaybackModal, { type PlaybackFeed } from './RecordingPlaybackModal'
import { waterLabel } from './CameraFeedTile'
import {
  getCameraSiteCode,
  getStreamUrl,
  isCameraOnline,
  type CctvCamera,
} from '../../api/cctv'

const HistoryIcon = ico('fluent:history-20-filled')
const CalendarIcon = ico('fluent:calendar-ltr-20-filled')
const PinIcon = ico('fluent:location-20-filled')

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1
  return { id: String(n).padStart(2, '0'), label: String(n) }
})
const MERIDIEM = [
  { id: 'AM', label: 'AM' },
  { id: 'PM', label: 'PM' },
]
const LOCATIONS = [
  { id: 'Influent', label: 'Sewer Water' },
  { id: 'Effluent', label: 'Treated Water' },
]
const RETENTION_DAYS = 15

function toDateInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Recordings are one hour long: the end time always follows the start time. */
function endOfHour(hour: string, meridiem: string) {
  const h24 = (Number(hour) % 12) + (meridiem === 'PM' ? 12 : 0)
  const next = (h24 + 1) % 24
  return `${String(next % 12 || 12).padStart(2, '0')}:00 ${next >= 12 ? 'PM' : 'AM'}`
}

function cameraLocationLabel(camera: CctvCamera) {
  const name = String(camera.name ?? '').toLowerCase().replace(/\s+/g, '')
  if (camera.channel === 1 || /camera1|cam-?1\b/.test(name) || name.includes('influent')) return 'Influent'
  if (camera.channel === 2 || /camera2|cam-?2\b/.test(name) || name.includes('effluent')) return 'Effluent'
  return camera.name
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
export default function RecordingPlaybackCard({ cameras = [] }: { cameras?: CctvCamera[] }) {
  const [startH, setStartH] = useState('09')
  const [startAp, setStartAp] = useState('AM')
  const [date, setDate] = useState(() => toDateInput(new Date()))
  const [location, setLocation] = useState('Influent')
  const [playback, setPlayback] = useState<PlaybackFeed | null>(null)

  const today = useMemo(() => new Date(), [])
  const maxDate = toDateInput(today)
  const minDate = toDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - (RETENTION_DAYS - 1)))

  const locationOptions = useMemo(() => {
    if (cameras.length === 0) return LOCATIONS
    const labels = Array.from(new Set(cameras.map(cameraLocationLabel).filter(Boolean)))
    return labels.map((label) => ({ id: label, label: waterLabel(label) }))
  }, [cameras])

  const openPlayback = () => {
    const match =
      cameras.find((camera) => cameraLocationLabel(camera) === location) ?? cameras[0]

    if (match) {
      const siteCode = getCameraSiteCode(match)
      const online = isCameraOnline(match)
      setPlayback({
        cameraId: match.id,
        id: match.name || String(match.id),
        location: waterLabel(cameraLocationLabel(match)),
        streamUrl: getStreamUrl(siteCode, match.channel, match),
        player: match.player,
        status: online ? 'Live' : 'Offline',
      })
      return
    }

    // Fallback preview when no camera is loaded for the plant.
    setPlayback({
      cameraId: '123456',
      id: 'CAM-IN',
      location: waterLabel(location),
      status: 'Offline',
    })
  }

  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px] shadow-card">
      <h3 className="text-[15px] font-semibold leading-5 text-ink">Recording Playback</h3>

      <div className="mt-[14px] grid grid-cols-[1fr_1.15fr_1fr_1.3fr] items-stretch gap-[12px]">
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

        <FilterBlock icon={HistoryIcon} label="Start Time">
          <div className="flex items-center gap-[6px]">
            <Select
              options={HOURS}
              value={startH}
              onChange={setStartH}
              className="min-w-0 flex-1"
              buttonClassName="h-[34px] px-[10px] text-[12.5px]"
            />
            <span className="text-[13px] font-semibold text-ink">:00</span>
            <Select
              options={MERIDIEM}
              value={startAp}
              onChange={setStartAp}
              className="min-w-0 flex-1"
              buttonClassName="h-[34px] px-[10px] text-[12.5px]"
            />
          </div>
        </FilterBlock>

        <FilterBlock icon={HistoryIcon} label="End Time">
          <div className="flex h-[34px] items-center rounded-[9px] border border-line bg-[#F4F8FD] px-[12px] text-[12.5px] font-medium text-ink">
            {endOfHour(startH, startAp)}
          </div>
          <p className="mt-[6px] text-[11px] text-ink-soft">1 hour range</p>
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

      <div className="mt-[14px] flex justify-end">
        <button
          type="button"
          onClick={openPlayback}
          className="inline-flex h-[40px] items-center gap-[8px] rounded-[10px] bg-brand px-[18px] text-[13.5px] font-semibold text-white transition-colors hover:bg-brand/90"
        >
          Play Recording
          <Play size={14} fill="currentColor" />
        </button>
      </div>

      {playback && <RecordingPlaybackModal feed={playback} onClose={() => setPlayback(null)} />}
    </section>
  )
}
