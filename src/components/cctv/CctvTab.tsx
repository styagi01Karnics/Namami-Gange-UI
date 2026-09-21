import { useEffect, useMemo, useState } from 'react'
import CameraSummaryCard from './CameraSummaryCard'
import LiveCameraFeed from './LiveCameraFeed'
import CctvLogsCard from './CctvLogsCard'
import {
  fetchCctvCameras,
  fetchCctvSites,
  getCamerasForStp,
  isCameraOnline,
  isCameraRecording,
  type CctvCamera,
} from '../../api/cctv'

/** Shared by the CCTV Monitoring page and the CCTV tab in STP Management. */
export default function CctvTab({ stpId }: { stpId?: string }) {
  const [cameras, setCameras] = useState<CctvCamera[]>([])
  const [loading, setLoading] = useState(true)

  async function loadCameras() {
    setCameras([])
    setLoading(true)

    try {
      const configured = getCamerasForStp(stpId)
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
  }, [stpId])

  const stats = useMemo(() => {
    const total = cameras.length
    const online = cameras.filter(isCameraOnline).length
    const offline = total - online
    const recording = cameras.filter(isCameraRecording).length
    const notRecording = total - recording

    return { total, online, offline, recording, notRecording }
  }, [cameras])

  const breakdown = [
    { key: 'online', label: 'Online Camera', value: stats.online, tone: 'ok' },
    { key: 'offline', label: 'Offline Camera', value: stats.offline, tone: 'danger' },
    { key: 'recording', label: 'Recording', value: stats.recording, tone: 'record' },
    { key: 'notRecording', label: 'Not Recording', value: stats.notRecording, tone: 'warn' },
  ]

  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-[0.5fr_1fr] items-start gap-[14px] [&>*]:min-w-0">
        <CameraSummaryCard total={stats.total} breakdown={breakdown} />
        <LiveCameraFeed cameras={cameras} loading={loading} />
      </div>

      <CctvLogsCard />
    </div>
  )
}
