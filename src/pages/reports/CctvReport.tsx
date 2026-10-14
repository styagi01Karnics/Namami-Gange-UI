import { useEffect, useMemo, useState } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportDownloadScreen from '../../components/reports/ReportDownloadScreen'
import { cctvReportColumns, cctvSites } from '../../data/mockData'
import { emptyCameras, loadLiveCamerasByStp, type LiveSiteCamera } from '../../api/cctv'
import { ALL_STP_FILTER_OPTION } from '../../api/plants'

type CctvReportRow = {
  id: string
  stp: string
  cameraId: string
  availability: string
  interruptions: number
  downtime: string
  timestamp: string
  storage: string
  status: string
}

function metricsFromCamera(camera: LiveSiteCamera) {
  const status = String(camera.status ?? '')
  if (status === 'Live') {
    return {
      availability: '100%',
      interruptions: 0,
      downtime: '0',
      timestamp: camera.lastActive === 'Live now' ? 'Live now' : camera.lastActive || '—',
      storage: '—',
    }
  }
  if (status === 'Under Maintenance') {
    return {
      availability: '—',
      interruptions: 1,
      downtime: '—',
      timestamp: camera.lastActive || '—',
      storage: '—',
    }
  }
  return {
    availability: '0%',
    interruptions: 1,
    downtime: '—',
    timestamp: camera.lastActive || '—',
    storage: '—',
  }
}

function CctvReportBody() {
  const { stpId, stpOptions } = useReportFilters()
  const [liveByStp, setLiveByStp] = useState<Record<string, LiveSiteCamera[]>>({})

  const plantOptions = useMemo(
    () =>
      stpOptions.filter(
        (option) => option.id !== ALL_STP_FILTER_OPTION.id && Boolean(option.stpId || option.id),
      ),
    [stpOptions],
  )

  useEffect(() => {
    if (plantOptions.length === 0) {
      setLiveByStp({})
      return undefined
    }

    let cancelled = false

    async function load() {
      const next = await loadLiveCamerasByStp(
        plantOptions,
        cctvSites as Array<{ stpId: string; cameras: LiveSiteCamera[] }>,
      )
      if (cancelled) return
      setLiveByStp(next)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [plantOptions])

  const visiblePlants = useMemo(() => {
    if (stpId === ALL_STP_FILTER_OPTION.id) return plantOptions
    return plantOptions.filter((option) => option.id === stpId)
  }, [plantOptions, stpId])

  const rows = useMemo<CctvReportRow[]>(() => {
    return visiblePlants.flatMap((plant) => {
      const siteStpId = plant.stpId || plant.id
      const cameras = liveByStp[siteStpId] ?? emptyCameras(siteStpId)

      return cameras.map((camera) => {
        const metrics = metricsFromCamera(camera)
        return {
          id: camera.key,
          stp: plant.label,
          cameraId: camera.location || camera.id,
          status: camera.status,
          ...metrics,
        }
      })
    })
  }, [visiblePlants, liveByStp])

  return (
    <ReportDownloadScreen
      moduleKey="cctv"
      title="CCTV Operational Report"
      description="Camera stream availability, operational status, downtime tracking, and maintenance records."
      columns={cctvReportColumns}
      rows={rows}
      renderCell={(r, col) => {
        if (col.key === 'status') {
          const isLive = r.status === 'Live'
          return (
            <span
              className={`inline-flex rounded-full px-[10px] py-[3px] text-[12px] font-bold ${
                isLive ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'
              }`}
            >
              {r.status}
            </span>
          )
        }
        return r[col.key]
      }}
      exportTitle="CCTV Monitoring Operational Report"
      exportFileName="cctv-report"
    />
  )
}

export default function CctvReport() {
  return (
    <ReportShell>
      <CctvReportBody />
    </ReportShell>
  )
}
