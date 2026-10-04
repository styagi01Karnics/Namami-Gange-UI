import { useEffect, useMemo, useState } from 'react'
import ReportShell, { useReportFilters } from '../../components/reports/ReportShell'
import ReportTable from '../../components/reports/ReportTable'
import SoftStatCardsRow from '../../components/ui/SoftStatCard'
import TabSectionHeader from '../../components/stp/TabSectionHeader'
import DateRangeField from '../../components/ui/DateRangeField'
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
  const { stpId, stpOptions, range, setRange } = useReportFilters()
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
    const nonActive = rows.filter((row) => row.status !== 'Live').length
    const operationalPct = total === 0 ? 0 : Math.round((live / total) * 1000) / 10
    const affectedStps = new Set(
      rows.filter((row) => row.status !== 'Live').map((row) => row.stp),
    ).size
    const totalStps = visiblePlants.length
    const affectedNote = `Affected STP: ${affectedStps} / ${totalStps || 0}`

    return cctvReportStats.map((item) => {
      if (item.key === 'total') {
        return { ...item, value: String(total), note: affectedNote }
      }
      if (item.key === 'operational') {
        return {
          ...item,
          value: `${live} / day`,
          note: `${operationalPct}%`,
        }
      }
      if (item.key === 'offline') {
        return {
          ...item,
          value: String(nonActive),
          note: affectedNote,
        }
      }
      return item
    })
  }, [rows, visiblePlants.length])

  const renderCell = (row: CctvReportRow, col: { key: string }) => {
    if (col.key === 'stp') return <StpLink>{row.stp}</StpLink>
    return row[col.key as keyof CctvReportRow]
  }

  return (
    <>
      <TabSectionHeader
        tab="CCTV"
        right={<DateRangeField value={range} onChange={setRange} className="w-[280px]" />}
      />

      <SoftStatCardsRow items={stats} columns={3} gap={16} />

      <ReportTable
        columns={cctvReportColumns}
        rows={loading ? [] : rows}
        searchKeys={['stp', 'cameraId']}
        renderCell={renderCell}
        minWidth={1100}
        emptyMessage={loading ? 'Loading cameras…' : 'No cameras match your search.'}
        exportTitle="CCTV Report"
        exportFileName="cctv-report"
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
