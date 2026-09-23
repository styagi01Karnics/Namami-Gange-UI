import { stpRealtime } from '../data/mockData'

const DASHBOARD_API = import.meta.env.VITE_DASHBOARD_API_URL ?? '/dashboard-api'

type LiveReading = Record<string, unknown>

export type LiveParam = {
  key: string
  label: string
  icon: string
  value: string
  tone: 'ok' | 'breach' | 'ink'
  note?: string
}

export type LiveStreamData = {
  flow: { value: string; unit: string }
  params: LiveParam[]
  at: string
}

export type LiveRealtimeData = {
  at: string
  influent: LiveStreamData
  effluent: LiveStreamData
}

const PARAM_DEFS = [
  {
    key: 'bod',
    label: 'BOD',
    icon: 'bod',
    unit: 'mg/L',
    note: 'Ideal: 0 – 10',
    min: 0,
    max: 10,
    // MQTT 68mld uses bod__inlet; REST live uses bod_inlet / bod_outlet.
    inletKeys: ['bod_inlet', 'bod__inlet'],
    outletKeys: ['bod_outlet', 'bod__outlet'],
  },
  {
    key: 'ph',
    label: 'pH',
    icon: 'ph',
    unit: 'pH',
    note: 'Ideal: 5.5 - 9',
    min: 5.5,
    max: 9,
    inletKeys: ['ph_inlet', 'ph__inlet'],
    outletKeys: ['ph_outlet', 'ph__outlet'],
  },
  {
    key: 'totalizer',
    label: 'Totalizer',
    icon: 'totalizer',
    unit: 'm³',
    inletKeys: ['inlet_totalizer', 'cm_inlet', 'cm__inlet'],
    outletKeys: ['outlet_totalizer', 'cm_outlet', 'cm__outlet'],
  },
  {
    key: 'tss',
    label: 'TSS',
    icon: 'tss',
    unit: 'mg/L',
    note: 'Ideal: 0 – 20',
    min: 0,
    max: 20,
    inletKeys: ['tss_inlet', 'tss__inlet'],
    outletKeys: ['tss_outlet', 'tss__outlet'],
  },
  {
    key: 'cod',
    label: 'COD',
    icon: 'cod',
    unit: 'mg/L',
    note: 'Ideal: 0 – 50',
    min: 0,
    max: 50,
    inletKeys: ['cod_inlet', 'cod__inlet'],
    outletKeys: ['cod_outlet', 'cod__outlet'],
  },
  {
    key: 'no3n',
    label: 'NO₃-N',
    icon: 'no3n',
    unit: 'mg/L',
    note: 'Ideal: 0 – 10',
    min: 0,
    max: 10,
    inletKeys: ['tna_inlet', 'tna__inlet', 'no3n_inlet', 'no3_inlet'],
    outletKeys: ['tna_outlet', 'tna__outlet', 'no3n_outlet', 'no3_outlet'],
  },
] as const

function pickNumber(source: LiveReading | null | undefined, keys: readonly string[]) {
  if (!source) return null

  for (const key of keys) {
    const raw = source[key]
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw
    if (typeof raw === 'string' && raw.trim() !== '') {
      const parsed = Number(raw)
      if (Number.isFinite(parsed)) return parsed
    }
  }

  return null
}

function formatNumber(value: number | null, digits = 2) {
  if (value == null || !Number.isFinite(value)) return '—'
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : Math.min(digits, 2),
    maximumFractionDigits: digits,
  })
}

export function formatChangedAt(value: unknown) {
  if (!value) return '—'

  const raw = String(value)
  const parsed = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) return raw

  const date = parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const time = parsed.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return `${date}, ${time}`
}

function isBreach(value: number | null, min?: number, max?: number) {
  if (value == null || min === undefined || max === undefined) return false
  return value < min || value > max
}

function buildStream(
  side: 'inlet' | 'outlet',
  sources: Array<LiveReading | null | undefined>,
  timestamp: string,
): LiveStreamData {
  const merged: LiveReading = {}
  for (const source of sources) {
    if (source && typeof source === 'object') Object.assign(merged, source)
  }

  // 68/14 MLD use inlet_flow; 18/33 MLD use flow_inlet.
  const flowKeys =
    side === 'inlet' ? (['inlet_flow', 'flow_inlet'] as const) : (['outlet_flow', 'flow_outlet'] as const)
  const flow = pickNumber(merged, flowKeys)

  return {
    at: timestamp,
    flow: {
      value: formatNumber(flow),
      unit: 'm³/hr',
    },
    params: PARAM_DEFS.map((def) => {
      const keys = side === 'inlet' ? def.inletKeys : def.outletKeys
      const value = pickNumber(merged, keys)
      const tone: LiveParam['tone'] =
        value == null ? 'ink' : isBreach(value, 'min' in def ? def.min : undefined, 'max' in def ? def.max : undefined) ? 'breach' : 'ok'

      return {
        key: def.key,
        label: def.label,
        icon: def.icon,
        value: value == null ? '—' : `${formatNumber(value)} ${def.unit}`,
        tone,
        note: 'note' in def ? def.note : undefined,
      }
    }),
  }
}

/** Prefer reading_time; 14 MLD uses device_time. */
export function pickReadingTime(...sources: Array<LiveReading | null | undefined>) {
  for (const key of ['reading_time', 'device_time', 'changed_at'] as const) {
    for (const source of sources) {
      const value = source?.[key]
      if (value != null && String(value).trim() !== '') return value
    }
  }
  return null
}

/** Map a single inlet/outlet API record into the Flow + 6-param reading used in the UI. */
export function mapRecordToReading(side: 'inlet' | 'outlet', record: LiveReading | null | undefined): LiveStreamData {
  const timestamp = formatChangedAt(pickReadingTime(record))
  return buildStream(side, [record], timestamp)
}

/** Parse gateway `raw_payload` (string JSON or object) into extra reading fields. */
function parseRawPayload(record: LiveReading | null | undefined): {
  flat?: LiveReading
  inlet?: LiveReading
  outlet?: LiveReading
} {
  const raw = record?.raw_payload
  if (raw == null) return {}

  let parsed: unknown = raw
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw)
    } catch {
      return {}
    }
  }
  if (!parsed || typeof parsed !== 'object') return {}

  const obj = parsed as LiveReading & { inlet?: LiveReading; outlet?: LiveReading; data?: LiveReading }
  if (obj.inlet || obj.outlet) {
    return { inlet: obj.inlet, outlet: obj.outlet, flat: obj }
  }
  if (obj.data && typeof obj.data === 'object') {
    const nested = obj.data as LiveReading & { inlet?: LiveReading; outlet?: LiveReading }
    if (nested.inlet || nested.outlet) {
      return { inlet: nested.inlet, outlet: nested.outlet, flat: nested }
    }
    return { flat: nested }
  }
  return { flat: obj }
}

export function mapLivePayloadToRealtime(payload: unknown): LiveRealtimeData | null {
  const data = (payload as { data?: LiveReading })?.data ?? payload
  if (!data || typeof data !== 'object') return null

  const record = data as {
    main?: LiveReading
    inlet?: LiveReading
    outlet?: LiveReading
  }

  // MQTT events may send a flat reading (same shape as `main`) instead of nested sides.
  const flat =
    !record.main && !record.inlet && !record.outlet ? (data as LiveReading) : null
  const main = record.main ?? flat
  const inlet = record.inlet
  const outlet = record.outlet
  const fromMainRaw = parseRawPayload(main)
  const fromInletRaw = parseRawPayload(inlet)
  const fromOutletRaw = parseRawPayload(outlet)

  const influentAt = formatChangedAt(
    pickReadingTime(inlet, main, fromInletRaw.inlet, fromMainRaw.inlet, fromMainRaw.flat),
  )
  const effluentAt = formatChangedAt(
    pickReadingTime(outlet, main, fromOutletRaw.outlet, fromMainRaw.outlet, fromMainRaw.flat),
  )

  return {
    at: influentAt !== '—' ? influentAt : effluentAt,
    influent: buildStream(
      'inlet',
      [inlet, fromInletRaw.inlet, fromInletRaw.flat, main, fromMainRaw.inlet, fromMainRaw.flat],
      influentAt,
    ),
    effluent: buildStream(
      'outlet',
      [outlet, fromOutletRaw.outlet, fromOutletRaw.flat, main, fromMainRaw.outlet, fromMainRaw.flat],
      effluentAt,
    ),
  }
}

/**
 * Keep previous non-empty readings when a later MQTT/REST frame only fills one side
 * (68 MLD publishes separate slave packets for inlet vs outlet).
 */
export function mergeRealtimeReadings(
  previous: LiveRealtimeData,
  next: LiveRealtimeData,
): LiveRealtimeData {
  const pickValue = (incoming: string, existing: string) =>
    incoming && incoming !== '—' ? incoming : existing

  const mergeStream = (existing: LiveStreamData, incoming: LiveStreamData): LiveStreamData => ({
    at: pickValue(incoming.at, existing.at),
    flow: {
      value: pickValue(incoming.flow.value, existing.flow.value),
      unit: incoming.flow.unit || existing.flow.unit,
    },
    params: incoming.params.map((param, index) => {
      const prior = existing.params[index]
      if (!prior) return param
      return {
        ...param,
        value: pickValue(param.value, prior.value),
        tone: param.value && param.value !== '—' ? param.tone : prior.tone,
        note: param.note ?? prior.note,
      }
    }),
  })

  return {
    at: pickValue(next.at, previous.at),
    influent: mergeStream(previous.influent, next.influent),
    effluent: mergeStream(previous.effluent, next.effluent),
  }
}

/**
 * MQTT SSE live stream is enabled ONLY for 68 MLD Jagjeetpur.
 * URL: http://45.195.229.15:18087/api/mqtt/68mldjag/live
 * Other STPs continue to use REST /dashboard/{plantCode}/live.
 */
export const MQTT_LIVE_PLANT_CODE = '68mldjag'

export function usesMqttLiveStream(plantCode?: string) {
  return plantCode === MQTT_LIVE_PLANT_CODE
}

/** Absolute MQTT SSE URL → http://45.195.229.15:18087/api/mqtt/68mldjag/live */
export function mqttLiveUrl() {
  const base = String(import.meta.env.VITE_DASHBOARD_API_BASE_URL ?? '').replace(/\/$/, '')
  if (/^https?:\/\//i.test(base)) {
    return `${base}/api/mqtt/${MQTT_LIVE_PLANT_CODE}/live`
  }
  // Deployed builds without absolute base use the nginx /dashboard-api proxy.
  return `${DASHBOARD_API}/mqtt/${MQTT_LIVE_PLANT_CODE}/live`
}

/**
 * MQTT SSE event shape:
 * { topic, receivedAt, data: { inlet: {...}, outlet: {...}, signal, ... } }
 */
function mapMqttLiveEvent(live: unknown): LiveRealtimeData | null {
  if (!live || typeof live !== 'object') return null

  const envelope = live as {
    topic?: unknown
    data?: {
      inlet?: LiveReading
      outlet?: LiveReading
      main?: LiveReading
    } & LiveReading
    receivedAt?: unknown
  }

  // Prefer nested inlet/outlet from MQTT payload; fall back to generic mapper.
  const mapped =
    envelope.data && (envelope.data.inlet || envelope.data.outlet)
      ? mapLivePayloadToRealtime({ data: envelope.data })
      : mapLivePayloadToRealtime(envelope.data != null ? { data: envelope.data } : live)

  if (!mapped) return null

  // MQTT readings omit reading_time — stamp both columns with receivedAt.
  const receivedAt = formatChangedAt(envelope.receivedAt)
  if (receivedAt === '—') return mapped

  return {
    at: receivedAt,
    influent: { ...mapped.influent, at: receivedAt },
    effluent: { ...mapped.effluent, at: receivedAt },
  }
}

/**
 * Subscribe to 68 MLD MQTT SSE only.
 * No-ops (and returns a no-op cleanup) for any other plant code.
 */
export function subscribeMqttLive(
  plantCode: string,
  onMessage: (realtime: LiveRealtimeData) => void,
  onError?: (event: Event) => void,
): () => void {
  if (plantCode !== MQTT_LIVE_PLANT_CODE) {
    return () => undefined
  }

  const source = new EventSource(mqttLiveUrl())

  const handleFrame = (event: MessageEvent) => {
    const raw = String(event.data ?? '').trim()
    if (!raw || raw.startsWith(':')) return

    try {
      const live = JSON.parse(raw) as unknown
      const mapped = mapMqttLiveEvent(live)
      if (mapped) onMessage(mapped)
    } catch {
      // Ignore keepalives / non-JSON frames.
    }
  }

  // Default + common named SSE event types used by MQTT gateways.
  source.onmessage = handleFrame
  source.addEventListener('message', handleFrame)
  source.addEventListener('live', handleFrame)
  source.addEventListener('update', handleFrame)
  source.addEventListener('reading', handleFrame)
  source.addEventListener('mqtt', handleFrame)

  source.onerror = (event) => {
    onError?.(event)
  }

  return () => {
    source.onmessage = null
    source.removeEventListener('message', handleFrame)
    source.removeEventListener('live', handleFrame)
    source.removeEventListener('update', handleFrame)
    source.removeEventListener('reading', handleFrame)
    source.removeEventListener('mqtt', handleFrame)
    source.close()
  }
}

export async function fetchStpLive(plantCode: string): Promise<LiveRealtimeData | null> {
  if (!plantCode) return null

  try {
    const response = await fetch(`${DASHBOARD_API}/dashboard/${encodeURIComponent(plantCode)}/live`)
    if (!response.ok) throw new Error('Failed to load live parameters')

    return mapLivePayloadToRealtime(await response.json())
  } catch {
    return null
  }
}

export function getFallbackRealtime(): LiveRealtimeData {
  return {
    at: stpRealtime.at,
    influent: {
      ...stpRealtime.influent,
      at: stpRealtime.at,
      params: stpRealtime.influent.params.map((param) => ({
        ...param,
        tone: param.tone as LiveParam['tone'],
      })),
    },
    effluent: {
      ...stpRealtime.effluent,
      at: stpRealtime.at,
      params: stpRealtime.effluent.params.map((param) => ({
        ...param,
        tone: param.tone as LiveParam['tone'],
      })),
    },
  }
}
