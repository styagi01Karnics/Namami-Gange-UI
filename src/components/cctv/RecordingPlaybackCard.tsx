import { useMemo, useState, type ReactNode } from 'react'
import { Play } from 'lucide-react'
import { ico } from '../ui/Ico'
import type { IconComponent } from '../../types'
import Select from '../ui/Select'
import RecordingPlaybackModal, { type PlaybackFeed } from './RecordingPlaybackModal'
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
const MINUTES = ['00', '15', '30', '45'].map((m) => ({ id: m, label: m }))
const MERIDIEM = [
  { id: 'AM', label: 'AM' },
  { id: 'PM', label: 'PM' },
]
const LOCATIONS = [
  { id: 'Influent', label: 'Influent' },
  { id: 'Effluent', label: 'Effluent' },
]

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

function TimeFields({
  hour,
  minute,
  meridiem,
  onHour,
  onMinute,
  onMeridiem,
}: {
  hour: string
  minute: string
  meridiem: string
  onHour: (v: string) => void
  onMinute: (v: string) => void
  onMeridiem: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <Select
        options={HOURS}
        value={hour}
        onChange={onHour}
        className="min-w-0 flex-1"
        buttonClassName="h-[34px] px-[10px] text-[12.5px]"
      />
      <span className="text-[13px] font-semibold text-ink">:</span>
      <Select
        options={MINUTES}
        value={minute}
        onChange={onMinute}
        className="min-w-0 flex-1"
        buttonClassName="h-[34px] px-[10px] text-[12.5px]"
      />
      <Select
        options={MERIDIEM}
        value={meridiem}
        onChange={onMeridiem}
        className="min-w-0 flex-1"
        buttonClassName="h-[34px] px-[10px] text-[12.5px]"
      />
    </div>
  )
}

/** Recording playback controls for the CCTV tab redesign. */
export default function RecordingPlaybackCard({ cameras = [] }: { cameras?: CctvCamera[] }) {
  const [startH, setStartH] = useState('09')
  const [startM, setStartM] = useState('00')
  const [startAp, setStartAp] = useState('AM')
  const [endH, setEndH] = useState('10')
  const [endM, setEndM] = useState('00')
  const [endAp, setEndAp] = useState('AM')
  const [date, setDate] = useState('2026-05-06')
  const [location, setLocation] = useState('Influent')
  const [playback, setPlayback] = useState<PlaybackFeed | null>(null)

  const locationOptions = useMemo(() => {
    if (cameras.length === 0) return LOCATIONS
    const labels = Array.from(new Set(cameras.map(cameraLocationLabel).filter(Boolean)))
    return labels.map((label) => ({ id: label, label }))
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
        location: cameraLocationLabel(match),
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
      location,
      status: 'Offline',
    })
  }

  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px] shadow-card">
      <h3 className="text-[15px] font-semibold leading-5 text-ink">Recording Playback</h3>

      <div className="mt-[14px] grid grid-cols-[1.15fr_1.15fr_1fr_0.9fr] items-stretch gap-[12px]">
        <FilterBlock icon={HistoryIcon} label="Start Time">
          <TimeFields
            hour={startH}
            minute={startM}
            meridiem={startAp}
            onHour={setStartH}
            onMinute={setStartM}
            onMeridiem={setStartAp}
          />
        </FilterBlock>

        <FilterBlock icon={HistoryIcon} label="End Time">
          <TimeFields
            hour={endH}
            minute={endM}
            meridiem={endAp}
            onHour={setEndH}
            onMinute={setEndM}
            onMeridiem={setEndAp}
          />
        </FilterBlock>

        <FilterBlock icon={CalendarIcon} label="Recording Date">
          <label className="relative block">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-[34px] w-full rounded-[9px] border border-line bg-white px-[12px] pr-[34px] text-[12.5px] font-medium text-ink outline-none focus:border-brand"
            />
            <CalendarIcon
              size={15}
              className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-ink-muted"
            />
          </label>
        </FilterBlock>

        <FilterBlock icon={PinIcon} label="Location">
          <Select
            options={locationOptions}
            value={location}
            onChange={setLocation}
            className="w-full"
            buttonClassName="h-[34px] text-[12.5px]"
          />
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
