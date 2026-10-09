const CCTV_API = import.meta.env.VITE_CCTV_API_URL ?? '/cctv-api'
const STREAM_BASE = import.meta.env.VITE_STREAM_BASE ?? 'https://stream.karnics.com'

export type CameraPlayer = 'whep' | 'iframe' | 'mp4'

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

/** 68 MLD live streams — also used for 18 MLD Jagjeetpur until its own cameras are online. */
const STP_68MLD_CAMERAS: CctvCamera[] = [
  {
    id: 1,
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'PLANT001',
    streamUrl: LIVE_STREAM_OVERRIDES['PLANT001:1'],
  },
  {
    id: 2,
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'PLANT001',
    streamUrl: LIVE_STREAM_OVERRIDES['PLANT001:2'],
  },
]

const STP_14MLD_CAMERAS: CctvCamera[] = [
  {
    id: 'sarai-14-cam-1',
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP14MLD',
    streamUrl:
      import.meta.env.VITE_STP_14MLD_CAMERA_1 || 'https://stp14mldkpi5-1.tail72c450.ts.net/camera2/',
    player: 'whep',
  },
  {
    id: 'sarai-14-cam-2',
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP14MLD',
    streamUrl:
      import.meta.env.VITE_STP_14MLD_CAMERA_2 || 'https://stp14mldkpi5-1.tail72c450.ts.net/camera1/',
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
  // 18 MLD Jagjeetpur reuses the 68 MLD PLANT001 stream URLs.
  if (stpId === 'sarai-18' || stpId === '18mldjag') {
    return STP_68MLD_CAMERAS
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

export type RecordingClip = {
  id: string
  plantCode: string
  stpId: string
  channel: number
  fileName: string
  startTime: string
  endTime: string
  sizeBytes: number
  streamUrl: string
}

export type PlaybackClip = {
  id: string
  channel: number
  fileName: string
  startTime: string
  endTime: string
  sizeBytes: number
  player: CameraPlayer
  ready: boolean
  streamUrl: string
}

export type PlaybackStartResult = {
  ready: boolean
  player: CameraPlayer
  plantCode: string
  stpId: string
  channel: number
  startTime: string
  endTime: string
  clips: PlaybackClip[]
  message: string
}

export type PlaybackStartInput = {
  plantCode?: string
  stpId?: string
  channel: number
  location?: string
  date: string
  startTime: string
  endTime: string
}

export async function fetchRecordings(input: {
  plantCode?: string
  stpId?: string
  channel?: number
  date?: string
}) {
  const params = new URLSearchParams()
  if (input.plantCode) params.set('plantCode', input.plantCode)
  if (input.stpId) params.set('stpId', input.stpId)
  if (input.channel != null) params.set('channel', String(input.channel))
  if (input.date) params.set('date', input.date)

  const query = params.toString()
  const response = await fetch(`${CCTV_API}/recordings${query ? `?${query}` : ''}`)
  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.message ?? 'Unable to load recordings')
  }
  const clips = payload.data
  return Array.isArray(clips) ? (clips as RecordingClip[]) : []
}

const AUTO_PLAY_MAX_BYTES = 80 * 1024 * 1024

export type RecordingPeriod = 'day' | 'evening' | 'night'

export const RECORDING_PERIODS: Record<
  RecordingPeriod,
  { label: string; ranges: Array<{ start: string; end: string }> }
> = {
  day: { label: 'Day', ranges: [{ start: '06:00:00', end: '16:00:00' }] },
  evening: { label: 'Evening', ranges: [{ start: '16:00:00', end: '20:00:00' }] },
  night: {
    label: 'Night',
    ranges: [
      { start: '20:00:00', end: '23:59:59' },
      { start: '00:00:00', end: '06:00:00' },
    ],
  },
}

export function periodFromHour(hour: number): RecordingPeriod {
  if (hour >= 6 && hour < 16) return 'day'
  if (hour >= 16 && hour < 20) return 'evening'
  return 'night'
}

export function currentRecordingPeriod(now = new Date()): RecordingPeriod {
  return periodFromHour(now.getHours())
}

export function clipPeriod(clip: { startTime: string }): RecordingPeriod {
  const hour = Number(String(clip.startTime).slice(11, 13))
  return periodFromHour(Number.isFinite(hour) ? hour : 0)
}

function clipStartMs(clip: { startTime: string }) {
  const value = Date.parse(clip.startTime.replace(' ', 'T'))
  return Number.isFinite(value) ? value : 0
}

function sortClipsForPeriod(clips: RecordingClip[], period: RecordingPeriod) {
  const playableFirst = (left: RecordingClip, right: RecordingClip) => {
    const leftOk = left.sizeBytes <= AUTO_PLAY_MAX_BYTES ? 0 : 1
    const rightOk = right.sizeBytes <= AUTO_PLAY_MAX_BYTES ? 0 : 1
    if (leftOk !== rightOk) return leftOk - rightOk
    return clipStartMs(right) - clipStartMs(left)
  }
  return [
    ...clips.filter((clip) => clipPeriod(clip) === period).sort(playableFirst),
    ...clips.filter((clip) => clipPeriod(clip) !== period).sort(playableFirst),
  ]
}

export type RecordingTarget = {
  plantCode?: string
  stpId?: string
  channel: number
  location?: string
  period?: RecordingPeriod
}

export type ReadyRecording = PlaybackClip & { period: RecordingPeriod }

export async function startRecordingPlayback(input: PlaybackStartInput) {
  const response = await fetch(`${CCTV_API}/playback/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload?.success || !payload?.data?.clips?.length) {
    throw new Error(payload?.message ?? 'No recording for this time range')
  }
  return payload.data as PlaybackStartResult
}

export async function startPeriodPlayback(input: {
  plantCode?: string
  stpId?: string
  channel: number
  location?: string
  date: string
  period: RecordingPeriod
}) {
  const windows = RECORDING_PERIODS[input.period].ranges
  const clips: PlaybackClip[] = []
  let message = `No ${RECORDING_PERIODS[input.period].label.toLowerCase()} recording for this date`

  for (const range of windows) {
    try {
      const result = await startRecordingPlayback({
        plantCode: input.plantCode,
        stpId: input.stpId,
        channel: input.channel,
        location: input.location,
        date: input.date,
        startTime: range.start,
        endTime: range.end,
      })
      message = result.message
      clips.push(...result.clips.filter((clip) => clip.ready))
    } catch (error) {
      message = error instanceof Error ? error.message : message
    }
  }

  if (clips.length === 0) {
    throw new Error(message)
  }
  return clips
}

export async function loadPeriodRecording(input: RecordingTarget) {
  const period = input.period ?? currentRecordingPeriod()
  const listed = await fetchRecordings({
    plantCode: input.plantCode,
    stpId: input.stpId,
    channel: input.channel,
  })
  if (listed.length === 0) return null

  for (const clip of sortClipsForPeriod(listed, period)) {
    try {
      const result = await startRecordingPlayback({
        plantCode: input.plantCode,
        stpId: input.stpId,
        channel: input.channel,
        location: input.location,
        date: clip.startTime.slice(0, 10),
        startTime: clip.startTime.slice(11, 19),
        endTime: clip.endTime.slice(11, 19),
      })
      const ready = result.clips.find((item) => item.ready)
      if (ready) return { ...ready, period: clipPeriod(clip) } satisfies ReadyRecording
    } catch {
      // try the next clip in this period, then other times of day
    }
  }

  return null
}

export async function loadLatestReadyRecording(input: RecordingTarget) {
  return loadPeriodRecording(input)
}

export async function probeLiveStream(url?: string | null) {
  if (!url) return false

  try {
    const response = await fetch(`${CCTV_API}/stream/health?url=${encodeURIComponent(url)}`)
    const payload = await response.json().catch(() => ({}))
    return Boolean(payload.live)
  } catch {
    return false
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

const CPV_RECORDING_PLANTS = new Set([
  'jagjeetpur-68',
  '68mldjag',
  'sarai-14',
  '14mldsarai',
  'saliar-33',
  '33mldsali',
])

export function hasCpvRecordings(stpId?: string, plantCode?: string) {
  const keys = [stpId, plantCode].map((value) => String(value ?? '').trim().toLowerCase())
  return keys.some((key) => CPV_RECORDING_PLANTS.has(key))
}

export function toPlaybackCameras(cameras: LiveSiteCamera[]): CctvCamera[] {
  return cameras.map((camera) => {
    const location = camera.location || camera.id
    const effluent = String(location).toLowerCase().includes('effluent')
    return {
      id: camera.id,
      name: location,
      channel: camera.channel ?? (effluent ? 2 : 1),
      status: camera.status,
      player: camera.player,
      streamUrl: camera.streamUrl ?? undefined,
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
    const configured = getCamerasForStp(siteStpId) ?? getCamerasForStp(option.plantCode)
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
