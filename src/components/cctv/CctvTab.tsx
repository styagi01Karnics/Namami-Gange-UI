import { useEffect, useMemo, useState } from 'react'
import LiveCameraFeed from './LiveCameraFeed'
import {
  fetchCctvCameras,
  fetchCctvSites,
  getCamerasForStp,
  hasCpvRecordings,
  isCameraOnline,
  toSiteCameras,
  type LiveSiteCamera,
} from '../../api/cctv'
import { cctvSites, stpDetails } from '../../data/mockData'

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

function normalizeLocation(loc?: string) {
  const l = String(loc ?? '')
  if (l.toLowerCase().includes('influent') || l.toLowerCase().includes('cam-in')) return 'Sewage Water'
  if (l.toLowerCase().includes('effluent') || l.toLowerCase().includes('cam-ef')) return 'Treated Water'
  return l || 'Sewage Water'
}

/** CCTV tab in STP Management. */
export default function CctvTab({ stpId, plantCode }: { stpId?: string; plantCode?: string }) {
  const [cameras, setCameras] = useState<LiveSiteCamera[]>([])
  const [loading, setLoading] = useState(true)

  async function loadCameras() {
    setCameras([])
    setLoading(true)

    try {
      const siteStpId = stpId || plantCode || ''
      // 1. Sarai 14 MLD has custom Tailnet WHEP live player configured
      if (siteStpId === 'sarai-14' || siteStpId === '14mldsarai') {
        const configured = getCamerasForStp(siteStpId)
        if (configured) {
          setCameras(
            toSiteCameras(siteStpId, configured).map((c) => ({
              ...c,
              location: normalizeLocation(c.location),
            })),
          )
          return
        }
      }

      // 2. Fetch from CCTV API (returns liveUrl or recordingStreamUrl + mode for all plants)
      try {
        const apiCameras = await fetchCctvCameras(plantCode || undefined, siteStpId || undefined)
        if (apiCameras && apiCameras.length > 0) {
          setCameras(
            toSiteCameras(siteStpId, apiCameras).map((c) => ({
              ...c,
              location: normalizeLocation(c.location),
            })),
          )
          return
        }
      } catch {
        // Fall through to configured / mock data if API is unreachable
      }

      // 3. Fallback to hardcoded configured cameras if API is down
      const configured = getCamerasForStp(siteStpId) ?? getCamerasForStp(plantCode)
      if (configured) {
        setCameras(
          toSiteCameras(siteStpId, configured).map((c) => ({
            ...c,
            location: normalizeLocation(c.location),
          })),
        )
        return
      }

      const mockSite = cctvSites.find(
        (site) =>
          site.stpId === siteStpId ||
          site.stpId.toLowerCase() === siteStpId.toLowerCase() ||
          (plantCode && site.stpId.toLowerCase().includes(plantCode.toLowerCase())),
      )
      if (mockSite) {
        setCameras(
          mockSite.cameras.map((c) => ({
            ...c,
            location: normalizeLocation(c.location),
          })),
        )
        return
      }

      await fetchCctvSites()
      const nextCameras = await fetchCctvCameras(plantCode || stpId)
      setCameras(
        toSiteCameras(siteStpId, nextCameras).map((c) => ({
          ...c,
          location: normalizeLocation(c.location),
        })),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCameras()
  }, [stpId, plantCode])

  const stats = useMemo(() => {
    const total = cameras.length
    const canRecord = hasCpvRecordings(stpId, plantCode)
    const online = cameras.filter((c) => c.status === 'Live' || isCameraOnline(c as any) || canRecord).length
    const offline = total - online
    return { total, online, offline }
  }, [cameras, stpId, plantCode])

  const siteName = (stpId && stpDetails[stpId]?.name) || stpId || 'STP Plant'

  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-[0.42fr_1fr] items-stretch gap-[14px] [&>*]:min-w-0">
        <div className="flex flex-col gap-[12px]">
          <CameraStatCard label="Total Camera" value={stats.total} tone="brand" />
          <CameraStatCard label="Active Camera" value={stats.online} tone="ok" />
          <CameraStatCard label="Non-Active Camera" value={stats.offline} tone="danger" />
        </div>
        <LiveCameraFeed
          cameras={cameras}
          loading={loading}
          stpId={stpId}
          plantCode={plantCode}
          siteName={siteName}
        />
      </div>
    </div>
  )
}

