export type ParameterReading = {
  value: string
  limit: string
  isAlert: boolean
}

export type StreamReadings = {
  totalFlow: string
  timestamp: string
  ph: ParameterReading
  bod: ParameterReading
  cod: ParameterReading
  tss: ParameterReading
  nh4: ParameterReading
  temp: ParameterReading
  no3: ParameterReading
  flow: ParameterReading
  phosphorus: ParameterReading
  tn: ParameterReading
  totalizer: ParameterReading
}

export type StpDisplayData = {
  stpName: string
  address: string
  inletFlow: string
  outletFlow: string
  timestamp: string
  totalInletFlow: string
  totalOutletFlow: string
  influent: StreamReadings
  effluent: StreamReadings
}

const STP_SITE_INFO_API =
  import.meta.env.VITE_STP_SITE_INFO_API_URL ?? '/gangapulse-api/site-info/for_stp/'

const STP_ID =
  import.meta.env.VITE_STP_ID ?? 'cb3ac7f3-9be7-47dd-86b5-e5332ba68030'

const GANGAPULSE_TOKEN = import.meta.env.VITE_GANGAPULSE_API_TOKEN ?? ''

function defaultParameter(limit = '—'): ParameterReading {
  return { value: '—', limit, isAlert: false }
}

function defaultStream(timestamp: string, totalFlow: string): StreamReadings {
  return {
    totalFlow,
    timestamp,
    ph: defaultParameter('Ideal: 6.5 – 8.5'),
    bod: defaultParameter('Limit: 0 – 30'),
    cod: defaultParameter('Limit: 0 – 50'),
    tss: defaultParameter('Limit: 0 – 50'),
    nh4: defaultParameter('Limit: 0 – 10'),
    temp: defaultParameter('Limit: 0 – 10'),
    no3: defaultParameter('Limit: 0 – 10'),
    flow: defaultParameter('Limit: 0 – 10'),
    phosphorus: defaultParameter('Limit: 0 – 10'),
    tn: defaultParameter('Limit: 0 – 10'),
    totalizer: defaultParameter(''),
  }
}

export const defaultStpDisplayData: StpDisplayData = {
  stpName: '—',
  address: '—',
  inletFlow: '—',
  outletFlow: '—',
  timestamp: '—',
  totalInletFlow: '—',
  totalOutletFlow: '—',
  influent: defaultStream('—', '—'),
  effluent: defaultStream('—', '—'),
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function pickString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null && value !== '') {
      return String(value)
    }
  }
  return undefined
}

function pickNumber(source: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }
  return undefined
}

function pickObject(source: Record<string, unknown>, keys: string[]): Record<string, unknown> | undefined {
  for (const key of keys) {
    const value = source[key]
    if (isRecord(value)) {
      return value
    }
  }
  return undefined
}

function normalizeStreamName(name: string): 'inlet' | 'outlet' | null {
  const normalized = name.trim().toLowerCase()

  if (['inlet', 'influent', 'incoming', 'raw', 'raw water'].includes(normalized)) {
    return 'inlet'
  }

  if (['outlet', 'effluent', 'outgoing', 'treated', 'treated water'].includes(normalized)) {
    return 'outlet'
  }

  return null
}

function findNamedStreams(root: Record<string, unknown>): {
  inlet?: Record<string, unknown>
  outlet?: Record<string, unknown>
} {
  const result: {
    inlet?: Record<string, unknown>
    outlet?: Record<string, unknown>
  } = {}

  const registerItem = (item: Record<string, unknown>) => {
    const name = pickString(item, ['name', 'stream_name', 'streamName', 'type', 'site'])
    if (!name) {
      return
    }

    const kind = normalizeStreamName(name)
    if (kind === 'inlet' && !result.inlet) {
      result.inlet = item
    }
    if (kind === 'outlet' && !result.outlet) {
      result.outlet = item
    }
  }

  const collections = [
    root.streams,
    root.readings,
    root.parameters,
    root.params,
    root.site_parameters,
    root.siteParameters,
    root.results,
  ]

  for (const collection of collections) {
    if (!Array.isArray(collection)) {
      continue
    }

    for (const item of collection) {
      if (isRecord(item)) {
        registerItem(item)
      }
    }
  }

  const nestedData = root.data
  if (Array.isArray(nestedData)) {
    for (const item of nestedData) {
      if (isRecord(item)) {
        registerItem(item)
      }
    }
  } else if (isRecord(nestedData)) {
    for (const collection of [
      nestedData.streams,
      nestedData.readings,
      nestedData.parameters,
      nestedData.params,
    ]) {
      if (!Array.isArray(collection)) {
        continue
      }

      for (const item of collection) {
        if (isRecord(item)) {
          registerItem(item)
        }
      }
    }
  }

  return result
}

function unwrapPayload(payload: unknown): Record<string, unknown> {
  if (Array.isArray(payload)) {
    return { streams: payload }
  }

  if (!isRecord(payload)) {
    return {}
  }

  const nested =
    pickObject(payload, ['data', 'result', 'site_info', 'siteInfo', 'stp']) ?? payload

  if (Array.isArray(nested)) {
    return { streams: nested }
  }

  return nested
}

function pickFromSources(
  sources: Array<Record<string, unknown> | undefined>,
  keys: string[],
): string | undefined {
  for (const source of sources) {
    if (!source) {
      continue
    }

    const value = pickString(source, keys)
    if (value) {
      return value
    }
  }

  return undefined
}

function pickSiteName(root: Record<string, unknown>): string {
  const explicitName = pickString(root, [
    'stp_name',
    'stpName',
    'site_name',
    'siteName',
    'title',
    'label',
  ])

  if (explicitName) {
    return explicitName
  }

  const genericName = pickString(root, ['name'])
  if (genericName && !normalizeStreamName(genericName)) {
    return genericName
  }

  return '—'
}

function formatNumber(value: unknown, fractionDigits = 2): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: fractionDigits,
    })
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: fractionDigits,
      })
    }
    return value
  }

  return '—'
}

function formatTimestamp(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    return '—'
  }

  const parsed = new Date(value.includes('T') ? value : value.replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatFlow(value: unknown, suffix = 'm³/hr'): string {
  const formatted = formatNumber(value)
  return formatted === '—' ? formatted : `${formatted} ${suffix}`
}

function formatLimit(
  param: Record<string, unknown>,
  fallback: string,
  prefix: 'Ideal' | 'Limit' = 'Limit',
): string {
  const direct = pickString(param, ['limit', 'limit_text', 'limitText', 'range'])
  if (direct) {
    return direct
  }

  const min = pickNumber(param, ['min', 'min_limit', 'minLimit', 'ideal_min', 'idealMin', 'lower_limit'])
  const max = pickNumber(param, ['max', 'max_limit', 'maxLimit', 'ideal_max', 'idealMax', 'upper_limit'])

  if (min !== undefined && max !== undefined) {
    return `${prefix}: ${min} – ${max}`
  }

  return fallback
}

function paramValue(param: Record<string, unknown>): unknown {
  return (
    param.value ??
    param.reading ??
    param.current_value ??
    param.currentValue ??
    param.param_value ??
    param.paramValue ??
    param.latest_value ??
    param.latestValue
  )
}

function paramUnit(param: Record<string, unknown>, fallback = ''): string {
  return pickString(param, ['unit', 'uom', 'measurement_unit']) ?? fallback
}

function isAlert(param: Record<string, unknown>, numericValue?: number): boolean {
  const flag = param.is_exceeded ?? param.exceeded ?? param.is_alert ?? param.alert
  if (flag === true || flag === 1 || flag === 'true' || flag === 'exceeded') {
    return true
  }

  if (numericValue === undefined) {
    return false
  }

  const min = pickNumber(param, ['min', 'min_limit', 'minLimit', 'ideal_min', 'idealMin', 'lower_limit'])
  const max = pickNumber(param, ['max', 'max_limit', 'maxLimit', 'ideal_max', 'idealMax', 'upper_limit'])

  if (min !== undefined && max !== undefined) {
    return numericValue < min || numericValue > max
  }

  if (max !== undefined) {
    return numericValue > max
  }

  return false
}

function normalizeParamKey(key: string): string {
  return key.toLowerCase().replace(/[-_\s]/g, '')
}

function matchesParamAlias(key: string, aliases: string[]): boolean {
  const normalizedKey = normalizeParamKey(key)

  return aliases.some((alias) => {
    const normalizedAlias = normalizeParamKey(alias)
    return normalizedKey === normalizedAlias || normalizedKey.endsWith(normalizedAlias)
  })
}

function toParamRecord(
  key: string,
  value: unknown,
  source: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (isRecord(value)) {
    return value
  }

  return {
    value,
    unit: source[`${key}_unit`] ?? source[`${key}Unit`],
    min: source[`${key}_min`] ?? source[`${key}Min`],
    max: source[`${key}_max`] ?? source[`${key}Max`],
    limit: source[`${key}_limit`] ?? source[`${key}Limit`],
  }
}

function getRawObject(stream: Record<string, unknown>): Record<string, unknown> | undefined {
  return pickObject(stream, ['raw', 'Raw', 'RAW'])
}

function formatReading(
  param: Record<string, unknown> | undefined,
  fallbackLimit: string,
  options?: { unit?: string; prefix?: 'Ideal' | 'Limit'; fractionDigits?: number; suffix?: string },
): ParameterReading {
  if (!param) {
    return defaultParameter(fallbackLimit)
  }

  const rawValue = paramValue(param)
  const numericValue =
    typeof rawValue === 'number'
      ? rawValue
      : typeof rawValue === 'string'
        ? Number(rawValue)
        : undefined

  const unit = paramUnit(param, options?.unit ?? '')
  const formattedValue =
    rawValue === undefined || rawValue === null || rawValue === ''
      ? '—'
      : typeof rawValue === 'string' && Number.isNaN(Number(rawValue))
        ? rawValue
        : `${formatNumber(rawValue, options?.fractionDigits ?? 2)}${unit ? ` ${unit}` : options?.suffix ?? ''}`

  return {
    value: formattedValue,
    limit: formatLimit(param, fallbackLimit, options?.prefix ?? 'Limit'),
    isAlert: isAlert(param, Number.isFinite(numericValue) ? numericValue : undefined),
  }
}

function findParamObject(
  stream: Record<string, unknown>,
  aliases: string[],
): Record<string, unknown> | undefined {
  const raw = getRawObject(stream)
  const sources = raw ? [raw, stream] : [stream]

  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (key === 'raw' || key === 'Raw' || key === 'RAW') {
        continue
      }

      if (!matchesParamAlias(key, aliases)) {
        continue
      }

      if (raw && source === stream && matchesParamAlias(key, ['flow'])) {
        continue
      }

      const param = toParamRecord(key, value, source)
      if (param) {
        return param
      }
    }

    const direct = pickObject(source, aliases)
    if (direct) {
      return direct
    }

    const collections = [
      source.parameters,
      source.params,
      source.readings,
      source.data,
      source.values,
    ]

    for (const collection of collections) {
      if (!Array.isArray(collection)) {
        continue
      }

      for (const item of collection) {
        if (!isRecord(item)) {
          continue
        }

        const name = pickString(item, ['name', 'parameter', 'param', 'key', 'code'])?.toLowerCase()
        if (!name || normalizeStreamName(name)) {
          continue
        }

        if (aliases.some((alias) => name.includes(alias.toLowerCase()))) {
          return item
        }
      }
    }
  }

  return undefined
}

function pickParamNumber(stream: Record<string, unknown>, aliases: string[]): number | undefined {
  const param = findParamObject(stream, aliases)
  if (!param) {
    return undefined
  }

  const value = paramValue(param)
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
}

function mapStream(
  stream: Record<string, unknown> | undefined,
  fallbackTimestamp: string,
): StreamReadings {
  const streamData = stream ?? {}
  const rawData = getRawObject(streamData)
  const totalFlowValue =
    pickParamNumber(streamData, ['totalizer', 'totaliser', 'totalizer_value']) ??
    pickNumber(rawData ?? {}, ['totalizer', 'totaliser', 'totalizer_value']) ??
    pickNumber(streamData, ['flow']) ??
    pickNumber(streamData, ['total_flow', 'totalFlow', 'current_flow', 'currentFlow']) ??
    pickNumber(streamData, ['value'])

  const timestamp =
    pickString(streamData, ['timestamp', 'last_updated', 'lastUpdated', 'updated_at', 'updatedAt']) ??
    pickString(rawData ?? {}, ['timestamp', 'last_updated', 'lastUpdated', 'updated_at', 'updatedAt']) ??
    fallbackTimestamp

  return {
    totalFlow: totalFlowValue !== undefined ? formatFlow(totalFlowValue) : '—',
    timestamp: formatTimestamp(timestamp),
    ph: formatReading(findParamObject(streamData, ['ph', 'pH']), 'Ideal: 6.5 – 8.5', {
      prefix: 'Ideal',
      fractionDigits: 2,
    }),
    bod: formatReading(findParamObject(streamData, ['bod', 'BOD']), 'Limit: 0 – 30', {
      unit: 'mg/L',
    }),
    cod: formatReading(findParamObject(streamData, ['cod', 'COD']), 'Limit: 0 – 50', {
      unit: 'mg/L',
    }),
    tss: formatReading(findParamObject(streamData, ['tss', 'TSS']), 'Limit: 0 – 50', {
      unit: 'mg/L',
    }),
    nh4: formatReading(
      findParamObject(streamData, ['nh4', 'nh4n', 'nh4-n', 'nh4_n', 'nh4n']),
      'Limit: 0 – 10',
      { unit: 'mg/L' },
    ),
    temp: formatReading(
      findParamObject(streamData, ['temp', 'temperature', 'Temperature']),
      'Limit: 0 – 10',
      {
        suffix: '°C',
        fractionDigits: 0,
      },
    ),
    no3: formatReading(
      findParamObject(streamData, ['no3', 'no3n', 'no3-n', 'no3_n']),
      'Limit: 0 – 10',
      { unit: 'mg/L' },
    ),
    flow: formatReading(findParamObject(streamData, ['flow', 'Flow']), 'Limit: 0 – 10', {
      unit: 'mg/L',
    }),
    phosphorus: formatReading(
      findParamObject(streamData, ['phosphorus', 'tp', 'phosphate', 'totalphosphorus']),
      'Limit: 0 – 10',
      { unit: 'mg/L' },
    ),
    tn: formatReading(
      findParamObject(streamData, ['tn', 'totalnitrogen', 'total_nitrogen']),
      'Limit: 0 – 10',
      { unit: 'mg/L' },
    ),
    totalizer: formatReading(
      findParamObject(streamData, ['totalizer', 'totaliser', 'totalizer_value']),
      '',
      {
        suffix: ' m³',
      },
    ),
  }
}

export function mapStpSiteInfoResponse(payload: unknown): StpDisplayData {
  const root = unwrapPayload(payload)
  const namedStreams = findNamedStreams(root)
  const influentSource =
    namedStreams.inlet ??
    pickObject(root, ['influent', 'inlet', 'in', 'raw', 'incoming'])
  const effluentSource =
    namedStreams.outlet ??
    pickObject(root, ['effluent', 'outlet', 'out', 'treated', 'outgoing'])

  const metaSources = [influentSource, effluentSource, root]

  const stpName =
    pickFromSources(metaSources, ['stp_name', 'stpName']) ?? pickSiteName(root)

  const address =
    pickFromSources(metaSources, [
      'stp_address',
      'stpAddress',
      'address',
      'site_address',
      'siteAddress',
      'location',
      'full_address',
    ]) ?? '—'

  const timestamp = formatTimestamp(
    pickFromSources(metaSources, [
      'timestamp',
      'last_updated',
      'lastUpdated',
      'updated_at',
      'updatedAt',
      'reading_time',
      'readingTime',
    ]),
  )

  const inletFlow = influentSource ? pickNumber(influentSource, ['flow']) : undefined
  const outletFlow = effluentSource ? pickNumber(effluentSource, ['flow']) : undefined

  const influent = mapStream(influentSource, timestamp)
  const effluent = mapStream(effluentSource, timestamp)

  return {
    stpName,
    address,
    inletFlow: inletFlow !== undefined ? formatNumber(inletFlow) : '—',
    outletFlow: outletFlow !== undefined ? formatNumber(outletFlow) : '—',
    timestamp,
    totalInletFlow: inletFlow !== undefined ? formatFlow(inletFlow) : influent.totalFlow,
    totalOutletFlow: outletFlow !== undefined ? formatFlow(outletFlow) : effluent.totalFlow,
    influent,
    effluent,
  }
}

export async function fetchStpSiteInfo(): Promise<StpDisplayData> {
  if (!GANGAPULSE_TOKEN) {
    throw new Error('Missing VITE_GANGAPULSE_API_TOKEN in environment')
  }

  const url = `${STP_SITE_INFO_API}?stp=${encodeURIComponent(STP_ID)}&state=`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GANGAPULSE_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch STP site info (${response.status})`)
  }

  const json: unknown = await response.json()
  return mapStpSiteInfoResponse(json)
}
