const CCTV_API = import.meta.env.VITE_CCTV_API_URL ?? '/cctv-api'
const STREAM_BASE = import.meta.env.VITE_STREAM_BASE ?? 'https://stream.karnics.com'

const LIVE_STREAM_OVERRIDES: Record<string, string> = {
  'PLANT001:1': 'https://stream.karnics.com/site/PLANT001/camera/1/',
  'PLANT001:2': 'https://stream.karnics.com/site/PLANT001/camera/2/',
}

export type CctvSite = {
  id: number
  siteCode: string
  name: string
}

export type CctvCamera = {
  id: number
  name: string
  channel: number
  status: string
  enabled?: boolean
  siteCode?: string
  nvr?: {
    agent?: {
      site?: {
        siteCode?: string
      }
    }
  }
}

type StreamCommandResponse = {
  success?: boolean
  message?: string
}

const DEFAULT_SITES: CctvSite[] = [{ id: 1, siteCode: 'PLANT001', name: 'Plant 001' }]

const DEFAULT_CAMERAS: CctvCamera[] = [
  {
    id: 1,
    name: 'PLANT001 Camera 1',
    channel: 1,
    status: 'LIVE',
    siteCode: 'PLANT001',
  },
  {
    id: 2,
    name: 'PLANT001 Camera 2',
    channel: 2,
    status: 'LIVE',
    siteCode: 'PLANT001',
  },
]

export function getCameraSiteCode(camera: CctvCamera): string {
  return camera.siteCode ?? camera.nvr?.agent?.site?.siteCode ?? 'PLANT001'
}

export function getStreamUrl(siteCode: string, channel: number): string {
  const override = LIVE_STREAM_OVERRIDES[`${siteCode}:${channel}`]
  if (override) return override

  return `${STREAM_BASE}/site/${encodeURIComponent(siteCode)}/camera/${channel}/`
}

export function isCameraOnline(camera: CctvCamera): boolean {
  if (camera.enabled === false) return false

  const status = camera.status.trim().toUpperCase()
  return status === 'LIVE' || status === 'ONLINE' || status === 'STARTING' || status === 'ACTIVE'
}

export function isCameraRecording(camera: CctvCamera): boolean {
  return camera.status.trim().toUpperCase() === 'LIVE'
}

export async function fetchCctvSites(): Promise<CctvSite[]> {
  try {
    const response = await fetch(`${CCTV_API}/sites`)
    if (!response.ok) throw new Error('Failed to load sites')

    const data: unknown = await response.json()
    const sites = Array.isArray(data) ? (data as CctvSite[]) : []
    return sites.length > 0 ? sites : DEFAULT_SITES
  } catch {
    return DEFAULT_SITES
  }
}

export async function fetchCctvCameras(): Promise<CctvCamera[]> {
  try {
    const response = await fetch(`${CCTV_API}/cameras`)
    if (!response.ok) throw new Error('Failed to load cameras')

    const data: unknown = await response.json()
    const cameras = Array.isArray(data) ? (data as CctvCamera[]) : []
    return cameras.length > 0 ? cameras : DEFAULT_CAMERAS
  } catch {
    return DEFAULT_CAMERAS
  }
}

export async function startCameraStream(cameraId: number): Promise<void> {
  const response = await fetch(`${CCTV_API}/stream/start/${cameraId}`, { method: 'POST' })
  const data = (await response.json()) as StreamCommandResponse

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'Unable to start camera')
  }
}

export async function stopCameraStream(cameraId: number): Promise<void> {
  const response = await fetch(`${CCTV_API}/stream/stop/${cameraId}`, { method: 'POST' })
  const data = (await response.json()) as StreamCommandResponse

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'Unable to stop camera')
  }
}
