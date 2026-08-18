import { useEffect, useMemo, useState } from 'react'
import AppLayout from '@/layouts/AppLayout'
import { Card, DateRefreshBar } from '@/components/ui'
import iconCamera from '@/assets/dashboard/icon-camera.svg'
import iconOnline from '@/assets/cctv/icon-camera-online.svg'
import iconOffline from '@/assets/cctv/icon-camera-offline.svg'
import iconRecord from '@/assets/cctv/icon-record.svg'
import iconRecordStop from '@/assets/cctv/icon-record-stop.svg'
import {
  fetchCctvCameras,
  fetchCctvSites,
  getCameraSiteCode,
  getStreamUrl,
  isCameraOnline,
  isCameraRecording,
  startCameraStream,
  stopCameraStream,
  type CctvCamera,
} from '@/api/cctv'

const recentAlerts = [
  { location: 'Main Gate', message: 'Motion Detected', time: '10:30 AM' },
  { location: 'Main Gate', message: 'Motion Detected', time: '10:30 AM' },
  { location: 'Main Gate', message: 'Motion Detected', time: '10:30 AM' },
]

function formatLiveTimestamp(date: Date) {
  return date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function CameraStatBox({
  label,
  value,
  cardBg,
  iconBg,
  valueClass,
  icon,
}: {
  label: string
  value: string
  cardBg: string
  iconBg: string
  valueClass: string
  icon: string
}) {
  return (
    <div className={`flex h-[136px] w-[158px] flex-col items-center rounded-lg ${cardBg}`}>
      <div className={`mt-[18px] flex size-8 items-center justify-center rounded ${iconBg}`}>
        <img src={icon} alt="" className="size-5" />
      </div>
      <p className="mt-4 text-center text-[14px] font-medium leading-[22px] text-[#646464]">
        {label}
      </p>
      <p className={`text-[14px] font-semibold leading-[22px] ${valueClass}`}>{value}</p>
    </div>
  )
}

function LiveCameraFeed({ camera }: { camera: CctvCamera }) {
  const [streaming, setStreaming] = useState(true)
  const [starting, setStarting] = useState(false)
  const [message, setMessage] = useState('')
  const [timestamp, setTimestamp] = useState(() => formatLiveTimestamp(new Date()))

  const siteCode = getCameraSiteCode(camera)
  const streamUrl = getStreamUrl(siteCode, camera.channel)
  const online = isCameraOnline(camera)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(formatLiveTimestamp(new Date()))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  async function handleStart() {
    setStarting(true)
    setMessage('')

    try {
      await startCameraStream(camera.id)
      setStreaming(true)
      setMessage('Start command sent. Waiting for stream...')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start camera')
    } finally {
      setStarting(false)
    }
  }

  async function handleStop() {
    setMessage('')

    try {
      await stopCameraStream(camera.id)
      setStreaming(false)
      setMessage('Stop command sent.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to stop camera')
    }
  }

  return (
    <div className="relative h-[171px] overflow-hidden rounded-lg bg-[#07121e]">
      {streaming && online ? (
        <iframe
          title={camera.name}
          src={streamUrl}
          allow="autoplay; fullscreen"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a2430] px-4 text-center">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-[#9ca3af]">
              Camera stopped
            </p>
            <button
              type="button"
              disabled={starting}
              onClick={handleStart}
              className="mt-2 text-[12px] font-medium text-[#0768d2] underline disabled:opacity-60"
            >
              {starting ? 'Starting...' : 'Start camera'}
            </button>
          </div>
        </div>
      )}

      <div className="absolute left-2 top-2 flex h-4 max-w-[calc(100%-1rem)] items-center gap-1.5 rounded bg-black/50 px-2">
        <span
          className={`size-1.5 shrink-0 rounded-full ${online ? 'bg-[#168e3f]' : 'bg-[#dc2626]'}`}
        />
        <span className="truncate text-[10px] font-medium leading-none text-white">
          {camera.name}
        </span>
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        <span className="size-1.5 shrink-0 rounded-full bg-[#dc2626]" />
        <span className="text-[10px] font-medium leading-none text-white">{timestamp}</span>
      </div>

      {streaming && online && (
        <button
          type="button"
          onClick={handleStop}
          className="absolute right-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white"
        >
          Stop
        </button>
      )}

      {message && (
        <div className="absolute inset-x-2 bottom-8 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
          {message}
        </div>
      )}
    </div>
  )
}

export default function CctvMonitoring() {
  const [cameras, setCameras] = useState<CctvCamera[]>([])
  const [loading, setLoading] = useState(true)

  async function loadCameras() {
    setLoading(true)

    try {
      await fetchCctvSites()
      const nextCameras = await fetchCctvCameras()
      setCameras(nextCameras)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCameras()
  }, [])

  const stats = useMemo(() => {
    const total = cameras.length
    const online = cameras.filter(isCameraOnline).length
    const offline = total - online
    const recording = cameras.filter(isCameraRecording).length
    const notRecording = total - recording

    return { total, online, offline, recording, notRecording }
  }, [cameras])

  const cameraStats = [
    {
      label: 'Online Camera',
      value: String(stats.online),
      cardBg: 'bg-[#f4fff2]',
      iconBg: 'bg-[#eaf3ec]',
      valueClass: 'text-[#168e3f]',
      icon: iconOnline,
    },
    {
      label: 'Offline Camera',
      value: String(stats.offline),
      cardBg: 'bg-[#fde8e8]',
      iconBg: 'bg-[#f5e7e7]',
      valueClass: 'text-[#dc2626]',
      icon: iconOffline,
    },
    {
      label: 'Recording',
      value: String(stats.recording),
      cardBg: 'bg-[#ebf4fe]',
      iconBg: 'bg-[#d8edff]',
      valueClass: 'text-[#0768d2]',
      icon: iconRecord,
    },
    {
      label: 'Not Recording',
      value: String(stats.notRecording),
      cardBg: 'bg-[#fbf6e8]',
      iconBg: 'bg-[#fff4d6]',
      valueClass: 'text-[#fdb93a]',
      icon: iconRecordStop,
    },
  ]

  return (
    <AppLayout
      breadcrumbs={[{ label: 'CCTV Monitoring', current: true }]}
      toolbar={<DateRefreshBar />}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Card className="relative h-[308px] w-[697px] shrink-0 overflow-hidden rounded-[10px]">
            <div className="absolute left-4 top-4">
              <div className="flex size-8 items-center justify-center rounded bg-[#ebf4fe] opacity-80">
                <img src={iconCamera} alt="" className="size-4" />
              </div>
              <p className="mt-2 text-[14px] font-medium leading-[22px] text-[#646464]">
                Total Camera
              </p>
              <p className="text-[16px] font-semibold leading-[22px] text-[#07121e]">
                {stats.total}
              </p>
              <span className="mt-1 inline-flex h-5 items-center rounded-full bg-[#f4faff] px-1 text-[12px] font-medium text-[#0768d2] opacity-80">
                Across all area
              </span>
            </div>

            <div className="absolute bottom-4 left-4 flex gap-[11px]">
              {cameraStats.map((stat) => (
                <CameraStatBox key={stat.label} {...stat} />
              ))}
            </div>
          </Card>

          <Card className="relative h-[308px] min-w-[422px] flex-1 overflow-hidden rounded-[10px]">
            <div className="flex items-start justify-between px-4 pt-4">
              <p className="text-[14px] font-medium leading-[22px] text-[#646464]">
                Recent Alerts
              </p>
              <button
                type="button"
                className="text-[14px] font-medium leading-[22px] text-[#0768d2] underline"
              >
                View all
              </button>
            </div>

            <div className="mt-6 px-4">
              {recentAlerts.map((alert, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between py-4">
                    <div className="flex gap-[15px]">
                      <span className="mt-0.5 size-3.5 shrink-0 rounded-full bg-[#dc2626]" />
                      <div>
                        <p className="text-[14px] font-medium leading-[17px] text-[#07121e]">
                          {alert.location}
                        </p>
                        <p className="mt-1.5 text-[12px] font-medium leading-[14px] text-[#646464]">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-[12px] font-medium leading-[14px] text-[#646464]">
                      {alert.time}
                    </span>
                  </div>
                  {index < recentAlerts.length - 1 && (
                    <div className="h-px bg-[rgba(70,78,95,0.08)]" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="min-h-[428px] overflow-hidden rounded-[10px] p-4">
          <p className="text-[14px] font-medium leading-[22px] text-[#646464]">
            Live Camera Feed
          </p>

          {loading ? (
            <p className="mt-6 text-[14px] text-[#646464]">Loading cameras...</p>
          ) : cameras.length === 0 ? (
            <p className="mt-6 text-[14px] text-[#646464]">No cameras registered yet.</p>
          ) : (
            <div className="mt-[24px] grid grid-cols-3 gap-x-3 gap-y-2">
              {cameras.map((camera) => (
                <LiveCameraFeed key={camera.id} camera={camera} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
