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
    inletKeys: ['bod_inlet'],
    outletKeys: ['bod_outlet'],
  },
  {
    key: 'ph',
    label: 'pH',
    icon: 'ph',
    unit: 'pH',
    note: 'Ideal: 5.5 - 9',
    min: 5.5,
    max: 9,
    inletKeys: ['ph_inlet'],
    outletKeys: ['ph_outlet'],
  },
  {
    key: 'totalizer',
    label: 'Totalizer',
    icon: 'totalizer',
    unit: 'm³',
    inletKeys: ['inlet_totalizer', 'cm_inlet'],
    outletKeys: ['outlet_totalizer', 'cm_outlet'],
  },
  {
    key: 'tss',
    label: 'TSS',
    icon: 'tss',
    unit: 'mg/L',
    note: 'Ideal: 0 – 20',
    min: 0,
    max: 20,
    inletKeys: ['tss_inlet'],
    outletKeys: ['tss_outlet'],
  },
  {
    key: 'cod',
    label: 'COD',
    icon: 'cod',
    unit: 'mg/L',
    note: 'Ideal: 0 – 50',
    min: 0,
    max: 50,
    inletKeys: ['cod_inlet'],
    outletKeys: ['cod_outlet'],
  },
  {
    key: 'no3n',
    label: 'NO₃-N',
    icon: 'no3n',
    unit: 'mg/L',
    note: 'Ideal: 0 – 10',
    min: 0,
    max: 10,
    inletKeys: ['tna_inlet', 'no3n_inlet', 'no3_inlet'],
    outletKeys: ['tna_outlet', 'no3n_outlet', 'no3_outlet'],
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

export function mapLivePayloadToRealtime(payload: unknown): LiveRealtimeData | null {
  const data = (payload as { data?: LiveReading })?.data ?? payload
  if (!data || typeof data !== 'object') return null

  const record = data as {
    main?: LiveReading
    inlet?: LiveReading
    outlet?: LiveReading
  }

  const influentAt = formatChangedAt(pickReadingTime(record.inlet, record.main))
  const effluentAt = formatChangedAt(pickReadingTime(record.outlet, record.main))

  return {
    at: influentAt !== '—' ? influentAt : effluentAt,
    influent: buildStream('inlet', [record.inlet, record.main], influentAt),
    effluent: buildStream('outlet', [record.outlet, record.main], effluentAt),
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
