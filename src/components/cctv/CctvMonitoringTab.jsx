import { useEffect, useMemo, useState } from 'react'
import CameraSummaryCard from './CameraSummaryCard'
import LiveCameraFeed from './LiveCameraFeed'
import { fetchCctvCameras, fetchCctvSites, getCamerasForStp, isCameraOnline, isCameraRecording } from '../../api/cctv'

export default function CctvMonitoringTab({ stpId }) {
  const [cameras, setCameras] = useState([])
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
    <div className="grid grid-cols-[0.5fr_1fr] items-start gap-[14px]">
      <CameraSummaryCard total={stats.total} breakdown={breakdown} />
      <LiveCameraFeed cameras={cameras} loading={loading} />
    </div>
  )
}
