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
  /** URL to the latest recording clip served by /api/recordings/{id}/media */
  recordingStreamUrl?: string
  /** LIVE | RECORDING | AUTO | OFFLINE — from /api/cameras */
  mode?: string
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

/** 68 MLD live streams. */
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
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP20MLD1',
  },
  {
    id: 'mothorowala-20-cam-2',
    name: 'Effluent',
    channel: 2,
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

const STP_26MLD_CAMERAS: CctvCamera[] = [
  {
    id: 'lakkar-ghat-26-cam-1',
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP26MLD',
  },
  {
    id: 'lakkar-ghat-26-cam-2',
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP26MLD',
  },
]

const STP_10MLD_BAZPUR_CAMERAS: CctvCamera[] = [
  {
    id: 'bazpur-10-cam-1',
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP10MLDBAZ',
  },
  {
    id: 'bazpur-10-cam-2',
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP10MLDBAZ',
  },
]

const STP_68MLD_KARGI_CAMERAS: CctvCamera[] = [
  {
    id: 'kargi-68-cam-1',
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP68MLDKAR',
  },
  {
    id: 'kargi-68-cam-2',
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP68MLDKAR',
  },
]

const STP_18MLD_JAG_CAMERAS: CctvCamera[] = [
  {
    id: 'jagjeetpur-18-cam-1',
    name: 'Influent',
    channel: 1,
    status: 'LIVE',
    siteCode: 'STP18MLDJAG',
  },
  {
    id: 'jagjeetpur-18-cam-2',
    name: 'Effluent',
    channel: 2,
    status: 'LIVE',
    siteCode: 'STP18MLDJAG',
  },
]

function defaultPlantCameras(siteCode: string): CctvCamera[] {
  return [
    {
      id: `${siteCode}-cam-1`,
      name: 'Influent',
      channel: 1,
      status: 'OFFLINE',
      siteCode,
    },
    {
      id: `${siteCode}-cam-2`,
      name: 'Effluent',
      channel: 2,
      status: 'OFFLINE',
      siteCode,
    },
  ]
}

const DEFAULT_SITES: CctvSite[] = [
  { id: 1, siteCode: '14mldsarai', name: '14 MLD STP, Sarai, Haridwar' },
  { id: 2, siteCode: 'PLANT001', name: '68 MLD STP, Jagjeetpur, Haridwar' },
  { id: 3, siteCode: '27mldjag_upg', name: '27 MLD STP, Jagjeetpur' },
  { id: 4, siteCode: '18mldsarai_upg', name: '18 MLD STP, Sarai' },
  { id: 5, siteCode: 'STP18MLDJAG', name: '18 MLD STP, Jagjeetpur, Haridwar' },
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
  if (
    key === 'jagjeetpur-18' ||
    key === '18mldjag' ||
    key === '18mld_jagjeetpur' ||
    key === '18mld' ||
    key === '18mldjagjeetpur' ||
    key === 'stp18mldjag'
  ) {
    return STP_18MLD_JAG_CAMERAS
  }
  if (
    key === 'lakkar-ghat-26' ||
    key === '26mldlkgt2' ||
    key === '26mldlakkar' ||
    key === '26mld' ||
    key === 'rishikesh' ||
    key === '26mldrishikesh' ||
    key === '20mldrishikesh'
  ) {
    return STP_26MLD_CAMERAS
  }
  if (key === 'indira-nagar-28' || key === '28mldindira') {
    return defaultPlantCameras('28mldindira')
  }
  if (key === 'mothorowala-20' || key === '20mldmothorowala') {
    return STP_20MLD_UNIT1_CAMERAS
  }
  if (
    key === 'kargi-68' ||
    key === '68mldkargi' ||
    key === '68mld_kargi' ||
    key === '68mld-kargi' ||
    key === '68mld kargi' ||
    key === '68 mld kargi' ||
    key === 'kargi' ||
    key === 'kargi chowk' ||
    key === 'kargichowk' ||
    key === '68mld_kargi_chowk' ||
    key === '68mld kargi chowk' ||
    key === 'stp68mldkar'
  ) {
    return STP_68MLD_KARGI_CAMERAS
  }
  if (key === 'mothorowala-20-2' || key === '20mldmoth_2') {
    return STP_20MLD_UNIT2_CAMERAS
  }
  if (key === 'saliar-33' || key === '33mldsali') {
    return STP_33MLD_CAMERAS
  }
  if (
    key === 'bazpur-10' ||
    key === '10mldbazpur' ||
    key === 'bazpur' ||
    key === '10mld'
  ) {
    return STP_10MLD_BAZPUR_CAMERAS
  }
  if (key === 'kashipur-10' || key === '10mldkashipur') {
    return defaultPlantCameras('10mldkashipur')
  }
  return null
}

export function isCameraOnline(camera: CctvCamera) {
  if (camera.enabled === false) return false

  const status = String(camera.status ?? '').trim().toUpperCase()
  return (
    status === 'LIVE' ||
    status === 'ONLINE' ||
    status === 'STARTING' ||
    status === 'ACTIVE' ||
    status === 'RECORDING'
  )
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

export async function fetchCctvCameras(plantCode?: string, stpId?: string) {
  try {
    const params = new URLSearchParams()
    if (plantCode) params.set('plantCode', plantCode)
    if (stpId) params.set('stpId', stpId)
    const query = params.toString()
    const url = query ? `${CCTV_API}/cameras?${query}` : `${CCTV_API}/cameras`
    const response = await fetch(url)
    if (!response.ok) {
      if (plantCode || stpId) {
        return getCamerasForStp(stpId) ?? getCamerasForStp(plantCode) ?? []
      }
      return DEFAULT_CAMERAS
    }

    const raw = await parseJsonSafely<any[]>(response)
    const items = Array.isArray(raw) ? raw : []
    if (items.length === 0) {
      if (plantCode || stpId) {
        return getCamerasForStp(stpId) ?? getCamerasForStp(plantCode) ?? []
      }
      return DEFAULT_CAMERAS
    }
    // Map server response fields (camelCase) to CctvCamera, preserving
    // recordingStreamUrl and mode that are now returned by the API.
    const cameras: CctvCamera[] = items.map((item) => ({
      id: item.id ?? item.channel,
      name: item.name,
      channel: item.channel,
      status: item.status,
      siteCode: item.siteCode,
      streamUrl: item.liveUrl || item.streamUrl || undefined,
      recordingStreamUrl: item.recordingStreamUrl ?? item.recordingUrl ?? undefined,
      mode: item.mode ?? undefined,
      player: item.player,
      enabled: item.enabled,
    }))
    return cameras
  } catch {
    if (plantCode || stpId) {
      return getCamerasForStp(stpId) ?? getCamerasForStp(plantCode) ?? []
    }
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
  try {
    const response = await fetch(`${CCTV_API}/recordings${query ? `?${query}` : ''}`)
    if (!response.ok) {
      const payload = await parseJsonSafely<{ message?: string }>(response)
      throw new Error(payload?.message ?? 'Unable to connect to CCTV server')
    }
    const payload = await parseJsonSafely<{ data?: RecordingClip[] }>(response)
    const clips = payload?.data
    return Array.isArray(clips) ? (clips as RecordingClip[]) : []
  } catch (error) {
    if (error instanceof Error && !error.message.includes('connect')) {
      throw error
    }
    throw new Error('Unable to connect to CCTV server')
  }
}

const AUTO_PLAY_MAX_BYTES = 2 * 1024 * 1024 * 1024

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
  const isPlayable = (clip: RecordingClip) =>
    clip.sizeBytes <= AUTO_PLAY_MAX_BYTES && clip.sizeBytes >= 1024 * 1024

  const playableClips = clips.filter(isPlayable)
  const otherClips = clips.filter((c) => !isPlayable(c))

  const byRecency = (a: RecordingClip, b: RecordingClip) => clipStartMs(b) - clipStartMs(a)

  const playableInPeriod = playableClips.filter((c) => clipPeriod(c) === period).sort(byRecency)
  const playableOtherPeriod = playableClips.filter((c) => clipPeriod(c) !== period).sort(byRecency)

  const otherInPeriod = otherClips.filter((c) => clipPeriod(c) === period).sort(byRecency)
  const otherOtherPeriod = otherClips.filter((c) => clipPeriod(c) !== period).sort(byRecency)

  return [...playableInPeriod, ...playableOtherPeriod, ...otherInPeriod, ...otherOtherPeriod]
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
  const payload = (await parseJsonSafely<any>(response)) ?? {}
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

  // 1. Check if backend /api/feed endpoint returns an optimized ready clip for this camera/channel
  try {
    const params = new URLSearchParams()
    if (input.stpId) params.set('stpId', input.stpId)
    if (input.plantCode) params.set('plantCode', input.plantCode)
    params.set('channel', String(input.channel))

    const response = await fetch(`${CCTV_API}/feed?${params.toString()}`)
    const feed = await parseJsonSafely<any>(response)
    if (
      response.ok &&
      feed?.success &&
      feed?.streamUrl &&
      (!feed.sizeBytes || feed.sizeBytes <= AUTO_PLAY_MAX_BYTES)
    ) {
      return {
        id: String(feed.clipId ?? `${input.channel}`),
        channel: Number(feed.channel ?? input.channel),
        fileName: String(feed.fileName ?? ''),
        startTime: String(feed.startTime ?? ''),
        endTime: String(feed.endTime ?? ''),
        sizeBytes: Number(feed.sizeBytes ?? 0),
        player: 'mp4' as CameraPlayer,
        ready: true,
        streamUrl: String(feed.streamUrl),
        period,
      } satisfies ReadyRecording
    }
  } catch {
    // Fall back to querying /api/recordings
  }

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
    if (!response.ok) return false
    const payload = await parseJsonSafely<{ live?: boolean }>(response)
    return Boolean(payload?.live)
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
    const isRecordingMode = String(camera.mode ?? '').toUpperCase() === 'RECORDING'

    // When mode=RECORDING the camera has no live stream but has a recording
    // clip ready — surface the recordingStreamUrl as the streamUrl so the
    // CameraStill iframe / RecordingAutoPlayer picks it up automatically.
    const effectiveStreamUrl = isRecordingMode
      ? (camera.recordingStreamUrl ?? null)
      : getStreamUrl(siteCode, camera.channel, camera)

    return {
      key: `${stpId}-${camera.id}`,
      // Match Live Camera Feed tile label (Influent / Effluent).
      id: location,
      location,
      status: online ? 'Live' : 'Offline',
      lastActive: online ? 'Live now' : 'Unavailable',
      timecode: null,
      image: null,
      streamUrl: effectiveStreamUrl,
      player: isRecordingMode ? 'mp4' : camera.player,
      channel: camera.channel,
    }
  })
}

const CPV_RECORDING_PLANTS = new Set([
  // 14 MLD Sarai, Haridwar
  'sarai-14',
  '14mldsarai',
  '14_mld_sarai',
  '14mld_sarai',
  '14mld',
  'sarai',
  // 68 MLD Jagjeetpur, Haridwar
  'jagjeetpur-68',
  '68mldjag',
  '68mld_jag',
  '68mld',
  '68mldjagjeetpur',
  'jagjeetpur',
  // 18 MLD Jagjeetpur, Haridwar
  'jagjeetpur-18',
  '18mldjag',
  '18mld_jagjeetpur',
  '18mldjagjeetpur',
  '18mld',
  'stp18mldjag',
  // 26 MLD Rishikesh / Lakkarghat
  'lakkar-ghat-26',
  '26mldlkgt2',
  '26_mld_rishikesh',
  '26mldlakkar',
  '26mld',
  '26mldrishikesh',
  'rishikesh',
  '20mldrishikesh',
  'lakkarghat',
  // 28 MLD Indira Nagar, Haldwani
  'indira-nagar-28',
  '28mldindira',
  '28_mld_haldwani',
  '28mld_haldwani',
  '28mldhaldwani',
  '28mld',
  'haldwani',
  'indiranagar',
  // 20 MLD Mothorowala Unit 1
  'mothorowala-20',
  '20mldmothorowala',
  '20_mld_mothorwala_unit1',
  '20mld_mothorwala_unit1',
  '20mld',
  'mothorowala',
  'unit1',
  // 68 MLD Kargi Chowk, Dehradun
  'kargi-68',
  '68mldkargi',
  '68mld_kargi',
  '68mld-kargi',
  '68mld kargi',
  '68 mld kargi',
  'kargi',
  'kargi chowk',
  'kargichowk',
  '68mld_kargi_chowk',
  '68mld kargi chowk',
  'stp68mldkar',
  // 20 MLD Mothorowala Unit 2
  'mothorowala-20-2',
  '20mldmoth_2',
  '20mld_mothorwala_unit2',
  '20_mld_mothorwala_unit2',
  '20mld2',
  'unit2',
  // 33 MLD Saliyar, Roorkee
  'saliar-33',
  '33mldsali',
  '33mld_sal',
  '38mldsaliar',
  'saliar',
  'saliyar',
  // 10 MLD Bazpur
  'bazpur-10',
  '10mldbazpur',
  '10_mld_bazpur',
  '10mld_bazpur',
  'bazpur',
  '10mld',
  // 10 MLD Kashipur
  'kashipur-10',
  '10mldkashipur',
  '10_mld_kashipur',
  '10mld_kashipur',
  'kashipur',
])

export function hasCpvRecordings(stpId?: string, plantCode?: string) {
  const candidates = [stpId, plantCode].filter(Boolean)
  return candidates.some((cand) => {
    const raw = String(cand).trim().toLowerCase()
    const clean = raw.replace(/[-_\s]+/g, '')
    return CPV_RECORDING_PLANTS.has(raw) || CPV_RECORDING_PLANTS.has(clean)
  })
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

/** Influent clips served by nginx from /opt/stp-cctv (see nginx.conf). */
const LOCAL_INFLUENT_VIDEOS: Record<string, string> = {
  'saliar-33': '/stp-cctv/33mld_sal/Inlet.mp4',
  '33mldsali': '/stp-cctv/33mld_sal/Inlet.mp4',
  '33mld_sal': '/stp-cctv/33mld_sal/Inlet.mp4',
  stp33mld: '/stp-cctv/33mld_sal/Inlet.mp4',
}

type PlantCameraOption = { id: string; label: string; plantCode?: string; stpId?: string }

/**
 * Same camera resolution as Live Camera Feed:
 * 1. 14 MLD Sarai WHEP live stream (custom Tailnet client stream)
 * 2. CCTV API (all 13 STPs, returns recordingStreamUrl + mode for recorded feeds)
 * 3. Configured STP cameras
 * 4. Mock site cameras -> empty placeholders.
 */
export async function loadLiveCamerasByStp(
  plantOptions: PlantCameraOption[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockSites: Array<{ stpId: string; cameras: readonly any[] }>,
): Promise<Record<string, LiveSiteCamera[]>> {
  const next: Record<string, LiveSiteCamera[]> = {}

  for (const option of plantOptions) {
    const siteStpId = option.stpId || option.id

    // 1. Sarai 14 MLD has custom Tailnet WHEP live player configured
    if (siteStpId === 'sarai-14' || siteStpId === '14mldsarai') {
      const configured = getCamerasForStp(siteStpId)
      if (configured) {
        next[siteStpId] = toSiteCameras(siteStpId, configured)
        continue
      }
    }

    // 2. All STPs: fetch from CCTV API which returns recordingStreamUrl + mode
    // so the Live Camera Feed tab can play recordings when live is down.
    try {
      const cameras = await fetchCctvCameras(option.plantCode, siteStpId)
      if (cameras && cameras.length > 0) {
        next[siteStpId] = toSiteCameras(siteStpId, cameras)
        continue
      }
    } catch {
      // Fall through to configured / mock site data if API is unreachable
    }

    const configured = getCamerasForStp(siteStpId) ?? getCamerasForStp(option.plantCode)
    if (configured) {
      next[siteStpId] = toSiteCameras(siteStpId, configured)
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

  for (const [stpId, cams] of Object.entries(next)) {
    const url = LOCAL_INFLUENT_VIDEOS[stpId.toLowerCase()]
    if (!url) continue
    next[stpId] = cams.map((cam) =>
      String(cam.location || cam.id).toLowerCase().includes('influent')
        ? { ...cam, status: 'Live', streamUrl: url, player: 'mp4' as CameraPlayer }
        : cam,
    )
  }

  return next
}
