const REALTIME_URLS = {
  'jagjeetpur-68':
    import.meta.env.VITE_STP_REALTIME_URL || 'http://localhost:8080/api/v1/stp/68mldjag/realtime',
  'sarai-14':
    import.meta.env.VITE_STP_14MLD_REALTIME_URL || 'http://localhost:8080/api/v1/stp/14mldsarai/realtime',
}

const PARAMS = [
  { key: 'bod', label: 'BOD', unit: 'mg/L', min: 0, max: 10, icon: 'bod' },
  { key: 'ph', label: 'pH', unit: 'pH', min: 5.5, max: 9, icon: 'ph' },
  { key: 'totalizer', label: 'Totalizer', unit: 'm³', icon: 'totalizer' },
  { key: 'tss', label: 'TSS', unit: 'mg/L', min: 0, max: 20, icon: 'tss' },
  { key: 'cod', label: 'COD', unit: 'mg/L', min: 0, max: 50, icon: 'cod' },
  { key: 'no3', label: 'NO₃-N', unit: 'mg/L', min: 0, max: 10, icon: 'no3', aliases: ['no3', 'no3n', 'no3_n'] },
]

function formatNumber(value, digits = 2) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : Math.min(digits, 2),
    maximumFractionDigits: digits,
  })
}

function formatTimestamp(value) {
  if (!value) return '—'
  const parsed = new Date(String(value).includes('T') ? value : String(value).replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) return String(value)

  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function pickNumber(stream, keys) {
  for (const key of keys) {
    const raw = stream?.[key]
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw
    if (typeof raw === 'string' && raw.trim() !== '') {
      const parsed = Number(raw)
      if (Number.isFinite(parsed)) return parsed
    }
  }
  return null
}

function isAlert(value, min, max) {
  if (value == null || min === undefined || max === undefined) return false
  return value < min || value > max
}

function mergeStream(staticStream, apiStream, timestamp) {
  const data = apiStream && typeof apiStream === 'object' ? apiStream : {}
  const flow = pickNumber(data, ['flow'])

  return {
    ...staticStream,
    timestamp: timestamp && timestamp !== '—' ? timestamp : staticStream.timestamp,
    flow: flow != null ? formatNumber(flow) : staticStream.flow,
    params: staticStream.params.map((param) => {
      const def = PARAMS.find((item) => item.key === param.key)
      const value = pickNumber(data, def?.aliases ?? [param.key])
      if (value == null) return param

      return {
        ...param,
        value: formatNumber(value),
        alert: def ? isAlert(value, def.min, def.max) : param.alert,
      }
    }),
  }
}

export function getStpDeviceId(stpId) {
  return REALTIME_URLS[stpId] ? stpId : null
}

export function mergeRealtimeWithStatic(payload, baseline) {
  const data = payload && typeof payload === 'object' ? payload : {}
  const timestamp = formatTimestamp(data.receivedAt)

  return {
    ...baseline,
    influent: mergeStream(baseline.influent, data.influent, timestamp),
    effluent: mergeStream(baseline.effluent, data.effluent, timestamp),
  }
}

export function mergeTrendWithStatic(payload, baseline) {
  const data = payload && typeof payload === 'object' ? payload : {}
  const timestamp = formatTimestamp(data.receivedAt)

  return {
    ...baseline,
    influent: mergeTrendStream(baseline.influent, data.influent, timestamp),
    effluent: mergeTrendStream(baseline.effluent, data.effluent, timestamp),
  }
}

function mergeTrendStream(staticStream, apiStream, timestamp) {
  const data = apiStream && typeof apiStream === 'object' ? apiStream : {}

  return {
    ...staticStream,
    rows: staticStream.rows.map((row) => {
      const def = PARAMS.find((item) => item.key === row.key)
      const keys = def?.aliases ?? [row.key]
      const value = pickNumber(data, keys)
      if (value == null) {
        return timestamp && timestamp !== '—' ? { ...row, timestamp } : row
      }

      const spark = row.spark
        ? Object.fromEntries(
            Object.entries(row.spark).map(([range, series]) => [
              range,
              Array.isArray(series) && series.length
                ? series.map((point, index) => (index === series.length - 1 ? { ...point, v: value } : point))
                : series,
            ]),
          )
        : row.spark

      return {
        ...row,
        value: formatNumber(value),
        timestamp: timestamp && timestamp !== '—' ? timestamp : row.timestamp,
        alert: row.tone === 'plain' ? false : isAlert(value, def?.min, def?.max),
        spark,
      }
    }),
  }
}

function resolveRealtimeUrl(stpId = 'jagjeetpur-68') {
  const realtimeUrl = REALTIME_URLS[stpId]
  if (!realtimeUrl) {
    throw new Error(`Missing realtime URL in .env for ${stpId}`)
  }

  try {
    const parsed = new URL(realtimeUrl, window.location.origin)
    if (parsed.origin !== window.location.origin) {
      return `/stp-api${parsed.pathname.replace(/^\/api/, '')}${parsed.search}`
    }
  } catch {
    /* relative URL — use as-is */
  }

  return realtimeUrl
}

export async function fetchStpRealtime(baseline, stpId) {
  const response = await fetch(resolveRealtimeUrl(stpId))

  if (!response.ok) {
    throw new Error(`Failed to load realtime parameters (${response.status})`)
  }

  return mergeRealtimeWithStatic(await response.json(), baseline)
}

export async function fetchStpTrend(baseline, stpId) {
  const response = await fetch(resolveRealtimeUrl(stpId))

  if (!response.ok) {
    throw new Error(`Failed to load parameter trends (${response.status})`)
  }

  return mergeTrendWithStatic(await response.json(), baseline)
}
