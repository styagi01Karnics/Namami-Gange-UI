import { useEffect, useMemo, useState } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import StatCardsRow from '../../components/ui/StatCardsRow'
import StatusPill, { statusTone } from '../../components/ui/StatusPill'
import { StpLink } from '../../components/reports/cells'
import { cctvReportColumns, cctvReportStats, cctvSites } from '../../data/mockData'
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

const STATUS_DOT: Record<string, string> = {
  Live: 'bg-ok',
  Offline: 'bg-danger',
  'Under Maintenance': 'bg-warn',
}

function CameraStatusCell({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-[6px]">
      <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${STATUS_DOT[status] ?? 'bg-ink-muted'}`} />
      <StatusPill tone={statusTone(status)}>{status}</StatusPill>
    </span>
  )
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
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
      return undefined
    }

    let cancelled = false
    setLoading(true)

    async function load() {
      const next = await loadLiveCamerasByStp(
        plantOptions,
        cctvSites as Array<{ stpId: string; cameras: LiveSiteCamera[] }>,
      )
      if (cancelled) return
      setLiveByStp(next)
      setLoading(false)
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
          // Same label as Live Camera Feed tiles (Influent / Effluent).
          cameraId: camera.location || camera.id,
          status: camera.status,
          ...metrics,
        }
      })
    })
  }, [visiblePlants, liveByStp])

  const stats = useMemo(() => {
    const total = rows.length
    const live = rows.filter((row) => row.status === 'Live').length
    const offline = rows.filter((row) => row.status === 'Offline').length
    const maintenance = rows.filter((row) => row.status === 'Under Maintenance').length
    const operationalPct = total === 0 ? 0 : Math.round((live / total) * 1000) / 10
    const affectedStps = new Set(
      rows.filter((row) => row.status !== 'Live').map((row) => row.stp),
    ).size
    const totalStps = visiblePlants.length

    return cctvReportStats.map((item) => {
      if (item.key === 'total') {
        return { ...item, value: String(total), note: totalStps ? `Across ${totalStps} STP(s)` : item.note }
      }
      if (item.key === 'operational') {
        return {
          ...item,
          value: `${live} / ${total || 0}`,
          note: `${operationalPct}%`,
        }
      }
      if (item.key === 'offline') {
        return {
          ...item,
          value: String(offline),
          note: `Affected STP: ${affectedStps} / ${totalStps || 0}`,
        }
      }
      if (item.key === 'maintenance') {
        return {
          ...item,
          value: String(maintenance),
          note: maintenance ? "Across affected STP's" : 'None',
        }
      }
      return item
    })
  }, [rows, visiblePlants.length])

  const renderCell = (row: CctvReportRow, col: { key: string }) => {
    if (col.key === 'stp') return <StpLink>{row.stp}</StpLink>
    if (col.key === 'status') return <CameraStatusCell status={row.status} />
    return row[col.key as keyof CctvReportRow]
  }

  return (
    <>
      <StatCardsRow items={stats} />
      <ReportTable
        columns={cctvReportColumns}
        rows={loading ? [] : rows}
        searchKeys={['stp', 'cameraId', 'status']}
        renderCell={renderCell}
        minWidth={1020}
        emptyMessage={loading ? 'Loading cameras…' : 'No cameras match your search.'}
        exportTitle="CCTV Report"
        exportFileName="cctv-report"
        exportValue={(row: CctvReportRow, col: { key: string }) =>
          col.key === 'status' ? row.status : undefined
        }
      />
    </>
  )
}

export default function CctvReport() {
  return (
    <ReportShell>
      <CctvReportBody />
    </ReportShell>
  )
}
