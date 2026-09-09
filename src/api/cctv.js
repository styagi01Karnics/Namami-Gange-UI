const CCTV_API = import.meta.env.VITE_CCTV_API_URL ?? '/cctv-api'
const STREAM_BASE = import.meta.env.VITE_STREAM_BASE ?? 'https://stream.karnics.com'

const LIVE_STREAM_OVERRIDES = {
  'PLANT001:1': 'https://stream.karnics.com/site/PLANT001/camera/1/',
  'PLANT001:2': 'https://stream.karnics.com/site/PLANT001/camera/2/',
}

const STP_14MLD_CAMERAS = [
  {
    id: 'sarai-14-cam-1',
    name: '14 MLD Camera 1',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP14MLD',
    streamUrl:
      import.meta.env.VITE_STP_14MLD_CAMERA_1 || 'https://stp14mldkpi5-1.tail72c450.ts.net/camera1/',
    player: 'whep',
  },
  {
    id: 'sarai-14-cam-2',
    name: '14 MLD Camera 2',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP14MLD',
    streamUrl:
      import.meta.env.VITE_STP_14MLD_CAMERA_2 || 'https://stp14mldkpi5-1.tail72c450.ts.net/camera2/',
    player: 'whep',
  },
]

const DEFAULT_SITES = [{ id: 1, siteCode: 'PLANT001', name: '68 MLD STP, Jagjeetpur' }]

const DEFAULT_CAMERAS = [
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

export function getCameraSiteCode(camera) {
  return camera.siteCode ?? camera.nvr?.agent?.site?.siteCode ?? 'PLANT001'
}

export function getStreamUrl(siteCode, channel, camera) {
  if (camera?.streamUrl) return camera.streamUrl

  const override = LIVE_STREAM_OVERRIDES[`${siteCode}:${channel}`]
  if (override) return override

  return `${STREAM_BASE}/site/${encodeURIComponent(siteCode)}/camera/${channel}/`
}

export function getCamerasForStp(stpId) {
  if (stpId === 'sarai-14') {
    return STP_14MLD_CAMERAS
  }
  return null
}

export function isCameraOnline(camera) {
  if (camera.enabled === false) return false

  const status = camera.status.trim().toUpperCase()
  return status === 'LIVE' || status === 'ONLINE' || status === 'STARTING' || status === 'ACTIVE'
}

export function isCameraRecording(camera) {
  return camera.status.trim().toUpperCase() === 'LIVE'
}

export async function fetchCctvSites() {
  try {
    const response = await fetch(`${CCTV_API}/sites`)
    if (!response.ok) throw new Error('Failed to load sites')

    const data = await response.json()
    const sites = Array.isArray(data) ? data : []
    return sites.length > 0 ? sites : DEFAULT_SITES
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
    return cameras.length > 0 ? cameras : DEFAULT_CAMERAS
  } catch {
    return DEFAULT_CAMERAS
  }
}

export async function startCameraStream(cameraId) {
  const response = await fetch(`${CCTV_API}/stream/start/${cameraId}`, { method: 'POST' })
  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'Unable to start camera')
  }
}

export async function stopCameraStream(cameraId) {
  const response = await fetch(`${CCTV_API}/stream/stop/${cameraId}`, { method: 'POST' })
  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'Unable to stop camera')
  }
}
