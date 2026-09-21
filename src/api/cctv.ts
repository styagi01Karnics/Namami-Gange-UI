const CCTV_API = import.meta.env.VITE_CCTV_API_URL ?? '/cctv-api'
const STREAM_BASE = import.meta.env.VITE_STREAM_BASE ?? 'https://stream.karnics.com'

export type CameraPlayer = 'whep' | 'iframe'

export type CctvCamera = {
  id: string | number
  name: string
  channel: number
  status: string
  siteCode?: string
  streamUrl?: string
  player?: CameraPlayer
  enabled?: boolean
  nvr?: { agent?: { site?: { siteCode?: string } } }
}

export type CctvSite = {
  id: number
  siteCode: string
  name: string
}

const LIVE_STREAM_OVERRIDES: Record<string, string> = {
  'PLANT001:1': 'https://stream.karnics.com/site/PLANT001/camera/1/',
  'PLANT001:2': 'https://stream.karnics.com/site/PLANT001/camera/2/',
}

const STP_14MLD_CAMERAS: CctvCamera[] = [
  {
    id: 'sarai-14-cam-1',
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP14MLD',
    streamUrl:
      import.meta.env.VITE_STP_14MLD_CAMERA_1 || 'https://stp14mldkpi5-1.tail72c450.ts.net/camera1/',
    player: 'whep',
  },
  {
    id: 'sarai-14-cam-2',
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP14MLD',
    streamUrl:
      import.meta.env.VITE_STP_14MLD_CAMERA_2 || 'https://stp14mldkpi5-1.tail72c450.ts.net/camera2/',
    player: 'whep',
  },
]

const DEFAULT_SITES: CctvSite[] = [{ id: 1, siteCode: 'PLANT001', name: '68 MLD STP, Jagjeetpur' }]

const DEFAULT_CAMERAS: CctvCamera[] = [
  {
    id: 1,
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'PLANT001',
  },
  {
    id: 2,
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'PLANT001',
  },
]

export function getCameraSiteCode(camera: CctvCamera) {
  return camera.siteCode ?? camera.nvr?.agent?.site?.siteCode ?? 'PLANT001'
}

export function getStreamUrl(siteCode: string, channel: number, camera?: CctvCamera) {
  if (camera?.streamUrl) return camera.streamUrl

  const override = LIVE_STREAM_OVERRIDES[`${siteCode}:${channel}`]
  if (override) return override

  return `${STREAM_BASE}/site/${encodeURIComponent(siteCode)}/camera/${channel}/`
}

export function getCamerasForStp(stpId?: string): CctvCamera[] | null {
  if (stpId === 'sarai-14') {
    return STP_14MLD_CAMERAS
  }
  return null
}

export function isCameraOnline(camera: CctvCamera) {
  if (camera.enabled === false) return false

  const status = String(camera.status ?? '').trim().toUpperCase()
  return status === 'LIVE' || status === 'ONLINE' || status === 'STARTING' || status === 'ACTIVE'
}

export function isCameraRecording(camera: CctvCamera) {
  return String(camera.status ?? '').trim().toUpperCase() === 'LIVE'
}

export async function fetchCctvSites() {
  try {
    const response = await fetch(`${CCTV_API}/sites`)
    if (!response.ok) throw new Error('Failed to load sites')

    const data = await response.json()
    const sites = Array.isArray(data) ? data : []
    return sites.length > 0 ? (sites as CctvSite[]) : DEFAULT_SITES
  } catch {
    return DEFAULT_SITES
  }
}

export async function fetchCctvCameras() {
  try {
    const response = await fetch(`${CCTV_API}/cameras`)
    if (!response.ok) throw new Error('Failed to load cameras')

    const data = await response.json()
    const cameras = Array.isArray(data) ? data : []
    return cameras.length > 0 ? (cameras as CctvCamera[]) : DEFAULT_CAMERAS
  } catch {
    return DEFAULT_CAMERAS
  }
}

export async function startCameraStream(cameraId: number) {
  const response = await fetch(`${CCTV_API}/stream/start/${cameraId}`, { method: 'POST' })
  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'Unable to start camera')
  }
}

export async function stopCameraStream(cameraId: number) {
  const response = await fetch(`${CCTV_API}/stream/stop/${cameraId}`, { method: 'POST' })
  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'Unable to stop camera')
  }
}

/** Display labels used by Live Camera Feed tiles. */
export function cameraLocationLabel(camera: CctvCamera) {
  const name = String(camera.name ?? '').toLowerCase().replace(/\s+/g, '')
  if (camera.channel === 1 || /camera1|cam-?1\b/.test(name) || name.includes('influent')) return 'Influent'
  if (camera.channel === 2 || /camera2|cam-?2\b/.test(name) || name.includes('effluent')) return 'Effluent'
  return camera.name
}

export type LiveSiteCamera = {
  key: string
  id: string
  location: string
  status: string
  lastActive: string
  timecode?: string | null
  image?: string | null
  streamUrl?: string | null
  player?: CameraPlayer
  channel?: number
}

export function toSiteCameras(stpId: string, cameras: CctvCamera[]): LiveSiteCamera[] {
  return cameras.map((camera) => {
    const siteCode = getCameraSiteCode(camera)
    const online = isCameraOnline(camera)
    const location = cameraLocationLabel(camera)

    return {
      key: `${stpId}-${camera.id}`,
      // Match Live Camera Feed tile label (Influent / Effluent).
      id: location,
      location,
      status: online ? 'Live' : 'Offline',
      lastActive: online ? 'Live now' : 'Unavailable',
      timecode: null,
      image: null,
      streamUrl: getStreamUrl(siteCode, camera.channel, camera),
      player: camera.player,
      channel: camera.channel,
    }
  })
}

export function emptyCameras(stpId: string): LiveSiteCamera[] {
  return [
    {
      key: `${stpId}-influent`,
      id: 'Influent',
      location: 'Influent',
      status: 'Offline',
      lastActive: 'Unavailable',
      timecode: null,
      image: null,
      streamUrl: null,
      player: undefined,
      channel: undefined,
    },
    {
      key: `${stpId}-effluent`,
      id: 'Effluent',
      location: 'Effluent',
      status: 'Offline',
      lastActive: 'Unavailable',
      timecode: null,
      image: null,
      streamUrl: null,
      player: undefined,
      channel: undefined,
    },
  ]
}

type PlantCameraOption = { id: string; label: string; plantCode?: string; stpId?: string }

/**
 * Same camera resolution as Live Camera Feed:
 * configured STP cameras → 68 MLD live API → mock site cameras → empty placeholders.
 */
export async function loadLiveCamerasByStp(
  plantOptions: PlantCameraOption[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockSites: Array<{ stpId: string; cameras: readonly any[] }>,
): Promise<Record<string, LiveSiteCamera[]>> {
  const next: Record<string, LiveSiteCamera[]> = {}

  for (const option of plantOptions) {
    const siteStpId = option.stpId || option.id
    const configured = getCamerasForStp(siteStpId)
    if (configured) {
      next[siteStpId] = toSiteCameras(siteStpId, configured)
      continue
    }

    // 68 MLD pulls live streams from the CCTV API (do not use mock stills).
    if (siteStpId === 'jagjeetpur-68') {
      const cameras = await fetchCctvCameras()
      next[siteStpId] = toSiteCameras(siteStpId, cameras)
      continue
    }

    const mockSite = mockSites.find((site) => site.stpId === siteStpId)
    if (mockSite) {
      next[siteStpId] = mockSite.cameras.map((camera) => {
        const location = String((camera as LiveSiteCamera).location ?? '')
        return {
          key: String((camera as LiveSiteCamera).key ?? ''),
          // Prefer location so report/Live Feed labels stay Influent / Effluent.
          id: location || String((camera as LiveSiteCamera).id ?? ''),
          location,
          status: String((camera as LiveSiteCamera).status ?? 'Offline'),
          lastActive: String((camera as LiveSiteCamera).lastActive ?? 'Unavailable'),
          timecode: (camera as LiveSiteCamera).timecode ?? null,
          image: (camera as LiveSiteCamera).image ?? null,
          streamUrl: (camera as LiveSiteCamera).streamUrl ?? null,
          player: (camera as LiveSiteCamera).player,
          channel: (camera as LiveSiteCamera).channel,
        }
      })
      continue
    }

    next[siteStpId] = emptyCameras(siteStpId)
  }

  return next
}
