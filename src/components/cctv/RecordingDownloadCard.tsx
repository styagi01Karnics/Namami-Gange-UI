import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Download } from 'lucide-react'
import Select from '../ui/Select'
import { useReportFilters } from '../reports/ReportShell'
import {
  cameraLocationLabel,
  fetchCctvCameras,
  startRecordingPlayback,
  type CctvCamera,
  type PlaybackClip,
} from '../../api/cctv'

const RETENTION_DAYS = 25

const LOCATIONS = [
  { id: 'Influent', label: 'Influent (Sewage Water)' },
  { id: 'Effluent', label: 'Effluent (Treated Water)' },
]

const inputClass =
  'h-[38px] w-full rounded-[9px] border border-line bg-white px-[12px] text-[13px] font-medium text-ink outline-none focus:border-brand'

const GRID_CLASS = 'grid grid-cols-[1.6fr_1fr_1fr_0.7fr_auto] items-center gap-[12px]'

function toDateInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function toApiTime(value: string) {
  return `${value}:00`
}

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <span className="text-[12.5px] font-semibold text-ink">{label}</span>
      {children}
    </div>
  )
}

/** Downloads CCTV recordings for the STP selected in the report filter, limited to the retention window. */
export default function RecordingDownloadCard() {
  const { stpId, setStpId, stpOptions } = useReportFilters()
  const plant = stpOptions.find((option) => option.id === stpId)
  const plantCode = plant?.plantCode
  const siteStpId = plant?.stpId

  const [cameras, setCameras] = useState<CctvCamera[]>([])
  const [date, setDate] = useState(() => toDateInput(new Date()))
  const [fromTime, setFromTime] = useState('06:00')
  const [toTime, setToTime] = useState('07:00')
  const [location, setLocation] = useState('Influent')
  const [clips, setClips] = useState<PlaybackClip[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = useMemo(() => new Date(), [])
  const maxDate = toDateInput(today)
  const minDate = toDateInput(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - (RETENTION_DAYS - 1)),
  )

  useEffect(() => {
    let cancelled = false
    setClips(null)
    setError('')
    fetchCctvCameras(plantCode, siteStpId)
      .then((list) => {
        if (!cancelled) setCameras(list)
      })
      .catch(() => {
        if (!cancelled) setCameras([])
      })
    return () => {
      cancelled = true
    }
  }, [plantCode, siteStpId])

  const searchRecordings = async () => {
    setError('')
    setClips(null)

    if (!plantCode) {
      setError('Select an STP to search recordings')
      return
    }
    if (!date || date < minDate || date > maxDate) {
      setError(`Select a date within the last ${RETENTION_DAYS} days`)
      return
    }
    if (!fromTime || !toTime || toTime <= fromTime) {
      setError('End time must be after start time')
      return
    }

    const channel =
      cameras.find((camera) => cameraLocationLabel(camera) === location)?.channel ??
      (location === 'Effluent' ? 2 : 1)

    setLoading(true)
    try {
      const result = await startRecordingPlayback({
        plantCode,
        stpId: siteStpId,
        channel,
        location,
        date,
        startTime: toApiTime(fromTime),
        endTime: toApiTime(toTime),
      })
      setClips(result.clips.filter((clip) => clip.ready))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch recordings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px] shadow-card">
      <h3 className="text-[15px] font-semibold leading-5 text-ink">Recording Download</h3>
      <p className="mt-[4px] text-[12.5px] text-ink-soft">
        Download recordings by date and time. Available for the last {RETENTION_DAYS} days.
      </p>

      <div className="mt-[14px] grid grid-cols-1 gap-[12px] md:grid-cols-5">
        <Field label="Target STP">
          <Select options={stpOptions} value={stpId} onChange={setStpId} />
        </Field>
        <Field label="Date">
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="From">
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="To">
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Location">
          <Select options={LOCATIONS} value={location} onChange={setLocation} />
        </Field>
      </div>

      {error && <p className="mt-[12px] text-[12.5px] font-medium text-danger">{error}</p>}

      <div className="mt-[14px] flex justify-end">
        <button
          type="button"
          onClick={searchRecordings}
          disabled={loading}
          className="inline-flex h-[40px] items-center gap-[8px] rounded-[10px] bg-brand px-[18px] text-[13.5px] font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Search Recordings'}
        </button>
      </div>

      {clips && clips.length === 0 && (
        <p className="mt-[14px] text-[12.5px] text-ink-soft">No recordings found for this time range.</p>
      )}

      {clips && clips.length > 0 && (
        <div className="mt-[14px] overflow-hidden rounded-[10px] border border-line">
          <div className={`${GRID_CLASS} bg-[#EFF7FF] px-[14px] py-[10px] text-[12.5px] font-semibold text-ink`}>
            <span>File</span>
            <span>Start</span>
            <span>End</span>
            <span>Size</span>
            <span className="text-right">Action</span>
          </div>
          {clips.map((clip) => (
            <div
              key={clip.id}
              className={`${GRID_CLASS} border-t border-line px-[14px] py-[10px] text-[12.5px] text-ink`}
            >
              <span className="truncate">{clip.fileName}</span>
              <span>{clip.startTime}</span>
              <span>{clip.endTime}</span>
              <span>{formatSize(clip.sizeBytes)}</span>
              <a
                href={clip.streamUrl}
                download={clip.fileName}
                className="inline-flex h-[30px] items-center gap-[6px] rounded-[8px] bg-brand px-[10px] font-semibold text-white hover:bg-brand/90"
              >
                <Download size={13} />
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
