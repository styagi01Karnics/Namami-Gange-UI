import { stpRealtime } from '../data/mockData'
import { dashboardResourceUrl } from './plants'

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
    key: 'temp',
    label: 'Temperature',
    icon: 'temp',
    unit: '°C',
    note: 'Ideal: 15 – 35',
    min: 15,
    max: 35,
    inletKeys: ['temperature_inlet', 'temp_inlet', 'temperature__inlet', 'temp__inlet', 'temperature', 'temp'],
    outletKeys: ['temperature_outlet', 'temp_outlet', 'temperature__outlet', 'temp__outlet', 'temperature', 'temp'],
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

  // 68/14 MLD use inlet_flow; Kargi / Mothorowala / 18/33 MLD use flow_inlet.
  const flowKeys =
    side === 'inlet' ? (['inlet_flow', 'flow_inlet'] as const) : (['outlet_flow', 'flow_outlet'] as const)
  const flow = pickNumber(merged, flowKeys)

  // Nitrogen subcard priority: NH4-N comes first if present in the API; otherwise fallback to NO3-N.
  const nh4Keys =
    side === 'inlet'
      ? (['nh4n_inlet', 'nh4_inlet', 'nh4__inlet', 'nh4n__inlet'] as const)
      : (['nh4n_outlet', 'nh4_outlet', 'nh4__outlet', 'nh4n__outlet'] as const)
  const no3Keys =
    side === 'inlet'
      ? (['tna_inlet', 'tna__inlet', 'no3n_inlet', 'no3_inlet', 'no3n__inlet'] as const)
      : (['tna_outlet', 'tna__outlet', 'no3n_outlet', 'no3_outlet', 'no3n__outlet'] as const)

  const nh4Val = pickNumber(merged, nh4Keys)
  const no3Val = pickNumber(merged, no3Keys)

  const nitrogenParam: LiveParam =
    nh4Val != null
      ? {
          key: 'nh4n',
          label: 'NH₄-N',
          icon: 'nh4n',
          value: `${formatNumber(nh4Val)} mg/L`,
          tone: isBreach(nh4Val, 0, 10) ? 'breach' : 'ok',
          note: 'Ideal: 0 – 10',
        }
      : {
          key: 'no3n',
          label: 'NO₃-N',
          icon: 'no3n',
          value: no3Val == null ? '—' : `${formatNumber(no3Val)} mg/L`,
          tone: no3Val == null ? 'ink' : isBreach(no3Val, 0, 10) ? 'breach' : 'ok',
          note: 'Ideal: 0 – 10',
        }

  return {
    at: timestamp,
    flow: {
      value: formatNumber(flow),
      unit: 'm³/hr',
    },
    params: [
      ...PARAM_DEFS.map((def) => {
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
      nitrogenParam,
    ],
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

  const obj = parsed as LiveReading
  const rawParams = (obj as Record<string, unknown>).PARAMETERS ?? (obj as Record<string, unknown>).parameters
  if (rawParams && typeof rawParams === 'object') {
    Object.assign(obj, rawParams)
  }

  const typedObj = obj as LiveReading & { inlet?: LiveReading; outlet?: LiveReading; data?: LiveReading }
  if (typedObj.inlet || typedObj.outlet) {
    return { inlet: typedObj.inlet, outlet: typedObj.outlet, flat: typedObj }
  }
  if (typedObj.data && typeof typedObj.data === 'object') {
    const nested = typedObj.data as LiveReading & { inlet?: LiveReading; outlet?: LiveReading }
    if (nested.inlet || nested.outlet) {
      return { inlet: nested.inlet, outlet: nested.outlet, flat: nested }
    }
    return { flat: nested }
  }
  return { flat: typedObj }
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

export async function fetchStpLive(plantCode: string): Promise<LiveRealtimeData | null> {
  if (!plantCode) return null

  try {
    const response = await fetch(dashboardResourceUrl(plantCode, 'live'))
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
