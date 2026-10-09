import { useEffect, useMemo, useState } from 'react'
import LiveCameraFeed from './LiveCameraFeed'
import RecordingPlaybackCard from './RecordingPlaybackCard'
import {
  fetchCctvCameras,
  fetchCctvSites,
  getCamerasForStp,
  hasCpvRecordings,
  isCameraOnline,
  type CctvCamera,
} from '../../api/cctv'

function CameraStatCard({
  label,
  value,
  tone = 'brand',
}: {
  label: string
  value: number
  tone?: 'brand' | 'ok' | 'danger'
}) {
  const styles = {
    brand: {
      value: 'text-brand',
      border: '#0768D233',
      background:
        'linear-gradient(101.59deg, rgba(7, 104, 210, 0.05) -0.16%, rgba(7, 104, 210, 0) 100%), #FFFFFF',
    },
    ok: {
      value: 'text-ok',
      border: '#168E3F33',
      background:
        'linear-gradient(101.59deg, rgba(22, 142, 63, 0.05) -0.16%, rgba(22, 142, 63, 0) 100%), #FFFFFF',
    },
    danger: {
      value: 'text-danger',
      border: '#C50F1F33',
      background:
        'linear-gradient(101.59deg, rgba(220, 38, 38, 0.05) -0.16%, rgba(220, 38, 38, 0) 100%), #FFFFFF',
    },
  }[tone]

  return (
    <div
      className="flex h-[110px] flex-1 flex-col justify-center rounded-[12px] px-[22px] py-[18px]"
      style={{ background: styles.background, border: `1px solid ${styles.border}` }}
    >
      <p className="text-[13.5px] font-medium leading-5 text-ink-soft">{label}</p>
      <p className={`mt-[12px] text-[26px] font-bold leading-8 ${styles.value}`}>{value}</p>
    </div>
  )
}

/** Shared by the CCTV Monitoring page and the CCTV tab in STP Management. */
export default function CctvTab({ stpId, plantCode }: { stpId?: string; plantCode?: string }) {
  const [cameras, setCameras] = useState<CctvCamera[]>([])
  const [loading, setLoading] = useState(true)

  async function loadCameras() {
    setCameras([])
    setLoading(true)

    try {
      const configured = getCamerasForStp(stpId) ?? getCamerasForStp(plantCode)
      if (configured) {
        setCameras(configured)
        return
      }

      if (stpId && stpId !== 'jagjeetpur-68') {
        setCameras([])
        return
      }

      await fetchCctvSites()
      const nextCameras = await fetchCctvCameras()
      setCameras(nextCameras)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCameras()
  }, [stpId, plantCode])

  const stats = useMemo(() => {
    const total = cameras.length
    const online = cameras.filter(isCameraOnline).length
    const offline = total - online
    return { total, online, offline }
  }, [cameras])

  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-[0.42fr_1fr] items-stretch gap-[14px] [&>*]:min-w-0">
        <div className="flex flex-col gap-[12px]">
          <CameraStatCard label="Total Camera" value={stats.total} tone="brand" />
          <CameraStatCard label="Active Camera" value={stats.online} tone="ok" />
          <CameraStatCard label="Non-Active Camera" value={stats.offline} tone="danger" />
        </div>
        <LiveCameraFeed cameras={cameras} loading={loading} stpId={stpId} plantCode={plantCode} />
      </div>

      {hasCpvRecordings(stpId, plantCode) && (
        <RecordingPlaybackCard cameras={cameras} stpId={stpId} plantCode={plantCode} />
      )}
    </div>
  )
}
