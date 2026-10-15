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

const STP_33MLD_CAMERAS: CctvCamera[] = [
  {
    id: 'saliar-33-cam-1',
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP33MLD',
  },
  {
    id: 'saliar-33-cam-2',
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP33MLD',
  },
]

const STP_20MLD_UNIT1_CAMERAS: CctvCamera[] = [
  {
    id: 'mothorowala-20-cam-1',
    name: 'Influent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP20MLD1',
  },
  {
    id: 'mothorowala-20-cam-2',
    name: 'Effluent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP20MLD1',
  },
]

const STP_20MLD_UNIT2_CAMERAS: CctvCamera[] = [
  {
    id: 'mothorowala-20-2-cam-1',
    name: 'Influent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP20MLD2',
  },
  {
    id: 'mothorowala-20-2-cam-2',
    name: 'Effluent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP20MLD2',
  },
]

function defaultPlantCameras(siteCode: string): CctvCamera[] {
  return [
    {
      id: `${siteCode}-cam-1`,
      name: 'Influent',
      channel: 1,
      status: 'LIVE',
      siteCode,
    },
    {
      id: `${siteCode}-cam-2`,
      name: 'Effluent',
      channel: 2,
      status: 'LIVE',
      siteCode,
    },
  ]
}

const DEFAULT_SITES: CctvSite[] = [
  { id: 1, siteCode: '14mldsarai', name: '14 MLD STP, Sarai, Haridwar' },
  { id: 2, siteCode: 'PLANT001', name: '68 MLD STP, Jagjeetpur, Haridwar' },
  { id: 3, siteCode: '27mldjag_upg', name: '27 MLD STP, Jagjeetpur' },
  { id: 4, siteCode: '18mldsarai_upg', name: '18 MLD STP, Sarai' },
  { id: 5, siteCode: '18mldjag', name: '18 MLD STP, Jagjeetpur, Haridwar' },
  { id: 6, siteCode: '26mldlkgt2', name: '26 MLD STP, Lakkarghat, Rishikesh' },
  { id: 7, siteCode: '28mldindira', name: '28 MLD STP, Indira Nagar, Haldwani' },
  { id: 8, siteCode: 'STP20MLD1', name: '20 MLD STP, Mothorowala-1, Dehradun' },
  { id: 9, siteCode: '68mldkargi', name: '68 MLD STP, Kargi Chowk, Dehradun' },
  { id: 10, siteCode: 'STP20MLD2', name: '20 MLD STP, Mothorowala-2, Dehradun' },
  { id: 11, siteCode: 'STP33MLD', name: '33 MLD STP, Saliyar, Roorkee' },
  { id: 12, siteCode: '10mldbazpur', name: '10 MLD STP, Bazpur' },
  { id: 13, siteCode: '10mldkashipur', name: '10 MLD STP, Kashipur' },
]

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
  const key = String(stpId ?? '').toLowerCase().trim()
  if (!key) return null

  if (key === 'sarai-14' || key === '14mldsarai') {
    return STP_14MLD_CAMERAS
  }
  if (key === 'jagjeetpur-68' || key === '68mldjag') {
    return STP_68MLD_CAMERAS
  }
  if (key === 'jagjeetpur-27-upg' || key === '27mldjag_upg' || key === 'jagjeetpur-27') {
    return defaultPlantCameras('27mldjag_upg')
  }
  if (key === 'sarai-18-upg' || key === '18mldsarai_upg' || key === 'sarai-18') {
    return defaultPlantCameras('18mldsarai_upg')
  }
  if (key === 'jagjeetpur-18' || key === '18mldjag') {
    return STP_68MLD_CAMERAS
  }
  if (key === 'lakkar-ghat-26' || key === '26mldlkgt2' || key === '26mldlakkar') {
    return defaultPlantCameras('26mldlkgt2')
  }
  if (key === 'indira-nagar-28' || key === '28mldindira') {
    return defaultPlantCameras('28mldindira')
  }
  if (key === 'mothorowala-20' || key === '20mldmothorowala') {
    return STP_20MLD_UNIT1_CAMERAS
  }
  if (key === 'kargi-68' || key === '68mldkargi') {
    return defaultPlantCameras('68mldkargi')
  }
  if (key === 'mothorowala-20-2' || key === '20mldmoth_2') {
    return STP_20MLD_UNIT2_CAMERAS
  }
  if (key === 'saliar-33' || key === '33mldsali') {
    return STP_33MLD_CAMERAS
  }
  if (key === 'bazpur-10' || key === '10mldbazpur') {
    return defaultPlantCameras('10mldbazpur')
  }
  if (key === 'kashipur-10' || key === '10mldkashipur') {
    return defaultPlantCameras('10mldkashipur')
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

async function parseJsonSafely<T = any>(response: Response): Promise<T | null> {
  try {
    const text = await response.text()
    if (!text || !text.trim()) return null
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

export async function fetchCctvSites() {
  try {
    const response = await fetch(`${CCTV_API}/sites`)
    if (!response.ok) return DEFAULT_SITES

    const data = await parseJsonSafely<CctvSite[]>(response)
    const sites = Array.isArray(data) ? data : []
    return sites.length > 0 ? (sites as CctvSite[]) : DEFAULT_SITES
  } catch {
    return DEFAULT_SITES
  }
}

export async function fetchCctvCameras() {
  try {
    const response = await fetch(`${CCTV_API}/cameras`)
    if (!response.ok) return DEFAULT_CAMERAS

    const data = await parseJsonSafely<CctvCamera[]>(response)
    const cameras = Array.isArray(data) ? data : []
    return cameras.length > 0 ? (cameras as CctvCamera[]) : DEFAULT_CAMERAS
  } catch {
    return DEFAULT_CAMERAS
  }
}

export async function startCameraStream(cameraId: number) {
  try {
    const response = await fetch(`${CCTV_API}/stream/start/${cameraId}`, { method: 'POST' })
    const data = await parseJsonSafely<{ success?: boolean; message?: string }>(response)

    if (!response.ok || !data?.success) {
      throw new Error(data?.message ?? 'Unable to start camera')
    }
  } catch (err) {
    throw err instanceof Error ? err : new Error('Unable to start camera')
  }
}

export async function stopCameraStream(cameraId: number) {
  try {
    const response = await fetch(`${CCTV_API}/stream/stop/${cameraId}`, { method: 'POST' })
    const data = await parseJsonSafely<{ success?: boolean; message?: string }>(response)

    if (!response.ok || !data?.success) {
      throw new Error(data?.message ?? 'Unable to stop camera')
    }
  } catch (err) {
    throw err instanceof Error ? err : new Error('Unable to stop camera')
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

  // Fallback to the best listed clip's direct stream URL if conversion / period playback didn't return ready
  const sorted = sortClipsForPeriod(listed, period)
  if (sorted.length > 0) {
    const best = sorted[0]
    return {
      id: best.id,
      channel: best.channel,
      fileName: best.fileName,
      startTime: best.startTime,
      endTime: best.endTime,
      sizeBytes: best.sizeBytes,
      player: 'mp4' as CameraPlayer,
      ready: true,
      streamUrl: best.streamUrl,
      period: clipPeriod(best),
    } satisfies ReadyRecording
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
  if (name.includes('influent')) return 'Influent'
  if (name.includes('effluent')) return 'Effluent'
  if (camera.channel === 1 || /camera1|cam-?1\b/.test(name)) return 'Influent'
  if (camera.channel === 2 || /camera2|cam-?2\b/.test(name)) return 'Effluent'
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
  '68mld',
  'sarai-14',
  '14mldsarai',
  '14mld',
  'saliar-33',
  '33mldsali',
  '33mld_sal',
  '38mldsaliar',
  'mothorowala-20',
  '20mldmothorowala',
  '20mld',
  'mothorowala-20-2',
  '20mldmoth_2',
  '20mld2',
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
