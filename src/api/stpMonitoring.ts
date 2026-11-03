import { authFetch } from '../auth/session'
import { API_BASE_URL, ENDPOINTS } from '../config/api'
import type { LiveParam, LiveRealtimeData, LiveStreamData } from './stpLive'

/**
 * STP Site Enum matching backend StpSite enum.
 * Path segments for REST URLs (e.g. /api/stp/BAZPUR/latest).
 */
export enum StpSite {
  BAZPUR = 'BAZPUR',
  KASHIPUR = 'KASHIPUR',
  SARAI = 'SARAI',
  JAG_18 = 'JAG_18',
  SARAI_18 = 'SARAI_18',
  MOTHOROWALA_1 = 'MOTHOROWALA_1',
  MOTHOROWALA_2 = 'MOTHOROWALA_2',
  LAKKAR_GHAT = 'LAKKAR_GHAT',
  JAG_27 = 'JAG_27',
  INDRA_NAGAR = 'INDRA_NAGAR',
  SALIYAR = 'SALIYAR',
  KARGI_CHOWK = 'KARGI_CHOWK',
  JAG_68 = 'JAG_68',
}

export interface StpSiteMeta {
  site: StpSite
  displayName: string
  capacityMld: number
}

export const STP_SITE_METADATA: Record<StpSite, StpSiteMeta> = {
  [StpSite.BAZPUR]: { site: StpSite.BAZPUR, displayName: '10 MLD STP Bazpur', capacityMld: 10 },
  [StpSite.KASHIPUR]: { site: StpSite.KASHIPUR, displayName: '10 MLD STP Kashipur', capacityMld: 10 },
  [StpSite.SARAI]: { site: StpSite.SARAI, displayName: '14 MLD STP Sarai', capacityMld: 14 },
  [StpSite.JAG_18]: { site: StpSite.JAG_18, displayName: '18 MLD STP Jagjeetpur', capacityMld: 18 },
  [StpSite.SARAI_18]: { site: StpSite.SARAI_18, displayName: '18 MLD STP Sarai', capacityMld: 18 },
  [StpSite.MOTHOROWALA_1]: { site: StpSite.MOTHOROWALA_1, displayName: '20 MLD STP Mothorowala', capacityMld: 20 },
  [StpSite.MOTHOROWALA_2]: { site: StpSite.MOTHOROWALA_2, displayName: '20 MLD STP Mothorowala', capacityMld: 20 },
  [StpSite.LAKKAR_GHAT]: { site: StpSite.LAKKAR_GHAT, displayName: '26 MLD STP Lakkar Ghat', capacityMld: 26 },
  [StpSite.JAG_27]: { site: StpSite.JAG_27, displayName: '27 MLD STP Jagjeetpur', capacityMld: 27 },
  [StpSite.INDRA_NAGAR]: { site: StpSite.INDRA_NAGAR, displayName: '28 MLD STP Indra Nagar', capacityMld: 28 },
  [StpSite.SALIYAR]: { site: StpSite.SALIYAR, displayName: '33 MLD STP Saliyar', capacityMld: 33 },
  [StpSite.KARGI_CHOWK]: { site: StpSite.KARGI_CHOWK, displayName: '68 MLD STP Kargi Chowk', capacityMld: 68 },
  [StpSite.JAG_68]: { site: StpSite.JAG_68, displayName: '68 MLD STP Jagjeetpur', capacityMld: 68 },
}

/**
 * Uniform JSON response from http://45.195.229.15:8909/api/stp/${site}/latest
 */
export interface StpReadingResponse {
  id: number
  stpUuid?: string | null
  stpName?: string | null
  district?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  capacityMld?: number | null
  status?: string | null
  latitude?: number | null
  longitude?: number | null
  // Inlet (Influent)
  inletFlowM3Hr?: number | null
  inletBod?: number | null
  inletCod?: number | null
  inletTss?: number | null
  inletPh?: number | null
  inletTn?: number | null
  inletTp?: number | null
  inletNh4?: number | null
  /** DB column inlet_nh4n_mg_l, under the names the API may serialise it as. */
  inletNh4n?: number | null
  inletNh4nMgL?: number | null
  inlet_nh4n_mg_l?: number | null
  inletTemperatureC?: number | null
  inletTimestamp?: string | null
  // Outlet (Effluent)
  outletFlowM3Hr?: number | null
  outletBod?: number | null
  outletCod?: number | null
  outletTss?: number | null
  outletPh?: number | null
  outletTn?: number | null
  outletTp?: number | null
  outletNh4?: number | null
  /** DB column outlet_nh4n_mg_l, under the names the API may serialise it as. */
  outletNh4n?: number | null
  outletNh4nMgL?: number | null
  outlet_nh4n_mg_l?: number | null
  outletTemperatureC?: number | null
  outletTimestamp?: string | null
  fetchedAt?: string | null
}

/**
 * Exact (lower-cased) UI identifiers -> backend StpSite.
 * Each UI plant is listed by plantCode, stpId, map/hierarchy id and display name.
 */
const STP_SITE_LOOKUP: Record<string, StpSite> = {
  // 10 MLD Bazpur
  '10mldbazpur': StpSite.BAZPUR,
  'bazpur-10': StpSite.BAZPUR,
  'map-bazpur-10': StpSite.BAZPUR,
  '10 mld stp, bazpur': StpSite.BAZPUR,
  // 10 MLD Kashipur
  '10mldkashipur': StpSite.KASHIPUR,
  'kashipur-10': StpSite.KASHIPUR,
  'map-kashipur-10': StpSite.KASHIPUR,
  '10 mld stp, kashipur': StpSite.KASHIPUR,
  // 14 MLD Sarai
  '14mldsarai': StpSite.SARAI,
  'sarai-14': StpSite.SARAI,
  'map-sarai-14': StpSite.SARAI,
  '14 mld stp, sarai, haridwar': StpSite.SARAI,
  // 18 MLD Jagjeetpur
  '18mldjag': StpSite.JAG_18,
  'jagjeetpur-18': StpSite.JAG_18,
  'map-jagjeetpur-18': StpSite.JAG_18,
  '18 mld stp, jagjeetpur, haridwar': StpSite.JAG_18,
  // 18 MLD Sarai
  '18mldsarai_upg': StpSite.SARAI_18,
  'sarai-18-upg': StpSite.SARAI_18,
  'sarai-18': StpSite.SARAI_18,
  'map-sarai-upgrade-18': StpSite.SARAI_18,
  '18 mld stp, sarai': StpSite.SARAI_18,
  // 20 MLD Mothorowala (1)
  '20mldmothorowala': StpSite.MOTHOROWALA_1,
  'mothorowala-20': StpSite.MOTHOROWALA_1,
  'map-mothorowala-1-20': StpSite.MOTHOROWALA_1,
  '20 mld stp, mothorowala-1, dehradun': StpSite.MOTHOROWALA_1,
  // 20 MLD Mothorowala (2)
  '20mldmoth_2': StpSite.MOTHOROWALA_2,
  'mothorowala-20-2': StpSite.MOTHOROWALA_2,
  'map-mothorowala-2-20': StpSite.MOTHOROWALA_2,
  '20 mld stp, mothorowala-2, dehradun': StpSite.MOTHOROWALA_2,
  // 26 MLD Lakkar Ghat
  '26mldlkgt2': StpSite.LAKKAR_GHAT,
  'lakkar-ghat-26': StpSite.LAKKAR_GHAT,
  'lakkarghat-26': StpSite.LAKKAR_GHAT,
  'map-lakkarghat-26': StpSite.LAKKAR_GHAT,
  '26 mld stp, lakkarghat, rishikesh': StpSite.LAKKAR_GHAT,
  // 27 MLD Jagjeetpur
  '27mldjag_upg': StpSite.JAG_27,
  'jagjeetpur-27-upg': StpSite.JAG_27,
  'jagjeetpur-27': StpSite.JAG_27,
  'map-jagjeetpur-upgrade-27': StpSite.JAG_27,
  '27 mld stp, jagjeetpur': StpSite.JAG_27,
  // 28 MLD Indra Nagar
  '28mldindira': StpSite.INDRA_NAGAR,
  'indira-nagar-28': StpSite.INDRA_NAGAR,
  'map-haldwani-28': StpSite.INDRA_NAGAR,
  '28 mld stp, indira nagar, haldwani': StpSite.INDRA_NAGAR,
  // 33 MLD Saliyar
  '33mldsali': StpSite.SALIYAR,
  'saliar-33': StpSite.SALIYAR,
  'saliyar-33': StpSite.SALIYAR,
  'map-saliyar-33': StpSite.SALIYAR,
  '33 mld stp, saliyar, roorkee': StpSite.SALIYAR,
  // 68 MLD Kargi Chowk
  '68mldkargi': StpSite.KARGI_CHOWK,
  'kargi-68': StpSite.KARGI_CHOWK,
  'map-kargi-68': StpSite.KARGI_CHOWK,
  '68 mld stp, kargi chowk, dehradun': StpSite.KARGI_CHOWK,
  // 68 MLD Jagjeetpur
  '68mldjag': StpSite.JAG_68,
  'jagjeetpur-68': StpSite.JAG_68,
  'map-jagjeetpur-68': StpSite.JAG_68,
  '68 mld stp, jagjeetpur, haridwar': StpSite.JAG_68,
}

/**
 * Resolves a given plant identifier (plantCode, stpId, plant name, or enum constant)
 * to the matching StpSite enum.
 */
export function resolveStpSite(key?: string | null): StpSite | null {
  if (!key) return null
  const raw = String(key).trim()
  const upper = raw.toUpperCase().replace(/[\s-]+/g, '_')

  // Direct enum match
  if (Object.values(StpSite).includes(upper as StpSite)) {
    return upper as StpSite
  }

  return STP_SITE_LOOKUP[raw.toLowerCase()] ?? null
}

export function parseNumeric(val: unknown): number | null {
  if (typeof val === 'number') {
    return Number.isFinite(val) ? val : null
  }
  if (typeof val === 'string' && val.trim() !== '' && val.trim() !== '—') {
    const cleaned = val.replace(/,/g, '').replace(/[^\d.-]/g, '')
    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function formatNumber(value: unknown, digits = 2): string {
  const num = parseNumeric(value)
  if (num == null) return '—'
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(num) ? 0 : Math.min(digits, 2),
    maximumFractionDigits: digits,
  })
}

function formatTimestamp(value: unknown): string {
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

function isBreach(value: unknown, min?: number, max?: number): boolean {
  const num = parseNumeric(value)
  if (num == null) return false
  if (min !== undefined && num < min) return true
  if (max !== undefined && num > max) return true
  return false
}

/**
 * Fetch latest snapshot for a specific STP site from the 8909 API endpoint.
 * URL: ${API_BASE_URL.stpMonitoring}/stp/${site}/latest
 */
export async function fetchLatestStpReading(
  site: StpSite | string,
): Promise<StpReadingResponse | null> {
  const resolved = resolveStpSite(site) ?? site
  const endpoint = `${API_BASE_URL.stpMonitoring}${ENDPOINTS.stpMonitoring.latest(resolved)}`
  const directBaseUrl =
    import.meta.env.VITE_STP_MONITORING_API_BASE_URL || 'http://45.195.229.15:8909'
  const directUrl = `${directBaseUrl}/api/stp/${encodeURIComponent(resolved)}/latest`

  try {
    const response = await authFetch(endpoint)
    if (!response.ok) {
      try {
        const directRes = await fetch(directUrl)
        if (directRes.ok) return (await directRes.json()) as StpReadingResponse
      } catch {
        // ignore direct fallback error
      }
      return null
    }
    return (await response.json()) as StpReadingResponse
  } catch {
    try {
      const directRes = await fetch(directUrl)
      if (directRes.ok) return (await directRes.json()) as StpReadingResponse
    } catch {
      // ignore
    }
    return null
  }
}

/** Fills inletNh4/outletNh4 from the inlet_nh4n_mg_l / outlet_nh4n_mg_l DB column, however the API names it. */
function withNh4n(reading: StpReadingResponse): StpReadingResponse {
  const pick = (...values: Array<number | null | undefined>) => values.find((value) => value != null) ?? null
  return {
    ...reading,
    inletNh4: pick(reading.inletNh4, reading.inletNh4n, reading.inletNh4nMgL, reading.inlet_nh4n_mg_l),
    outletNh4: pick(reading.outletNh4, reading.outletNh4n, reading.outletNh4nMgL, reading.outlet_nh4n_mg_l),
  }
}

/**
 * Maps DB reading response into the LiveRealtimeData structure used by RealtimeParametersPanel.
 * Influent: maps all inlet params (inletFlowM3Hr, inletBod, inletCod, inletTss, inletPh, inletTemperatureC, inletNh4, inletTn, inletTp)
 * Effluent: maps all outlet params (outletFlowM3Hr, outletBod, outletCod, outletTss, outletPh, outletTemperatureC, outletNh4, outletTn, outletTp)
 */
export function mapStpReadingToLiveRealtime(
  rawReading: StpReadingResponse,
  _site?: StpSite | null,
): LiveRealtimeData {
  const reading = withNh4n(rawReading)
  const inletAt = formatTimestamp(reading.inletTimestamp ?? reading.fetchedAt)
  const outletAt = formatTimestamp(reading.outletTimestamp ?? reading.fetchedAt)
  const generalAt = inletAt !== '—' ? inletAt : outletAt !== '—' ? outletAt : formatTimestamp(reading.fetchedAt)

  // Influent flow
  const inletFlowVal = reading.inletFlowM3Hr
  const inletFlowStr =
    inletFlowVal != null && Number.isFinite(inletFlowVal) ? formatNumber(inletFlowVal) : '0'

  // Effluent flow
  const outletFlowVal = reading.outletFlowM3Hr
  const outletFlowStr =
    outletFlowVal != null && Number.isFinite(outletFlowVal) ? formatNumber(outletFlowVal) : '0'

  // Build Influent parameter tiles - all Influent parameters must show in green font (no red)
  const influentParams: LiveParam[] = [
    {
      key: 'bod',
      label: 'BOD',
      icon: 'bod',
      value: `${formatNumber(reading.inletBod)} mg/L`,
      tone: 'ok',
      note: 'Ideal: 0 – 10',
    },
    {
      key: 'ph',
      label: 'pH',
      icon: 'ph',
      value: `${formatNumber(reading.inletPh)} pH`,
      tone: 'ok',
      note: 'Ideal: 5.5 - 9',
    },
    {
      key: 'temp',
      label: 'Temperature',
      icon: 'temp',
      value: reading.inletTemperatureC != null ? `${formatNumber(reading.inletTemperatureC)} °C` : '— °C',
      tone: 'ok',
      note: 'Ideal: 15 – 35',
    },
    {
      key: 'tss',
      label: 'TSS',
      icon: 'tss',
      value: `${formatNumber(reading.inletTss)} mg/L`,
      tone: 'ok',
      note: 'Ideal: 0 – 20',
    },
    {
      key: 'cod',
      label: 'COD',
      icon: 'cod',
      value: `${formatNumber(reading.inletCod)} mg/L`,
      tone: 'ok',
      note: 'Ideal: 0 – 50',
    },
  ]

  // Nitrogen priority: NH4-N if present, else TN, else sample/note
  if (reading.inletNh4 != null) {
    influentParams.push({
      key: 'nh4n',
      label: 'NH₄-N',
      icon: 'nh4n',
      value: `${formatNumber(reading.inletNh4)} mg/L`,
      tone: 'ok',
      note: 'Ideal: 0 – 10',
    })
  } else if (reading.inletTn != null) {
    influentParams.push({
      key: 'tn',
      label: 'Total Nitrogen',
      icon: 'no3n',
      value: `${formatNumber(reading.inletTn)} mg/L`,
      tone: 'ok',
      note: 'Ideal: 0 – 10',
    })
  } else {
    influentParams.push({
      key: 'nh4n',
      label: 'NH₄-N',
      icon: 'nh4n',
      value: '— mg/L',
      tone: 'ok',
      note: 'Ideal: 0 – 10',
    })
  }

  // If TP (Total Phosphorus) is present, add it as well
  if (reading.inletTp != null) {
    influentParams.push({
      key: 'tp',
      label: 'Total Phosphorus',
      icon: 'tp',
      value: `${formatNumber(reading.inletTp)} mg/L`,
      tone: 'ok',
      note: 'Ideal: 0 – 5',
    })
  }

  // Build Effluent parameter tiles
  const effluentParams: LiveParam[] = [
    {
      key: 'bod',
      label: 'BOD',
      icon: 'bod',
      value: `${formatNumber(reading.outletBod)} mg/L`,
      tone: isBreach(reading.outletBod, 0, 10) ? 'breach' : 'ok',
      note: 'Ideal: 0 – 10',
    },
    {
      key: 'ph',
      label: 'pH',
      icon: 'ph',
      value: `${formatNumber(reading.outletPh)} pH`,
      tone: isBreach(reading.outletPh, 5.5, 9) ? 'breach' : 'ok',
      note: 'Ideal: 5.5 - 9',
    },
    {
      key: 'temp',
      label: 'Temperature',
      icon: 'temp',
      value: reading.outletTemperatureC != null ? `${formatNumber(reading.outletTemperatureC)} °C` : '— °C',
      tone: isBreach(reading.outletTemperatureC, 15, 35) ? 'breach' : 'ok',
      note: 'Ideal: 15 – 35',
    },
    {
      key: 'tss',
      label: 'TSS',
      icon: 'tss',
      value: `${formatNumber(reading.outletTss)} mg/L`,
      tone: isBreach(reading.outletTss, 0, 20) ? 'breach' : 'ok',
      note: 'Ideal: 0 – 20',
    },
    {
      key: 'cod',
      label: 'COD',
      icon: 'cod',
      value: `${formatNumber(reading.outletCod)} mg/L`,
      tone: isBreach(reading.outletCod, 0, 50) ? 'breach' : 'ok',
      note: 'Ideal: 0 – 50',
    },
  ]

  // Nitrogen priority: NH4-N if present, else TN
  if (reading.outletNh4 != null) {
    effluentParams.push({
      key: 'nh4n',
      label: 'NH₄-N',
      icon: 'nh4n',
      value: `${formatNumber(reading.outletNh4)} mg/L`,
      tone: isBreach(reading.outletNh4, 0, 10) ? 'breach' : 'ok',
      note: 'Ideal: 0 – 10',
    })
  } else if (reading.outletTn != null) {
    effluentParams.push({
      key: 'tn',
      label: 'Total Nitrogen',
      icon: 'no3n',
      value: `${formatNumber(reading.outletTn)} mg/L`,
      tone: isBreach(reading.outletTn, 0, 10) ? 'breach' : 'ok',
      note: 'Ideal: 0 – 10',
    })
  } else {
    effluentParams.push({
      key: 'nh4n',
      label: 'NH₄-N',
      icon: 'nh4n',
      value: '— mg/L',
      tone: 'ink',
      note: 'Ideal: 0 – 10',
    })
  }

  // If TP (Total Phosphorus) is present, add it
  if (reading.outletTp != null) {
    effluentParams.push({
      key: 'tp',
      label: 'Total Phosphorus',
      icon: 'tp',
      value: `${formatNumber(reading.outletTp)} mg/L`,
      tone: isBreach(reading.outletTp, 0, 5) ? 'breach' : 'ok',
      note: 'Ideal: 0 – 5',
    })
  }

  const influentStream: LiveStreamData = {
    flow: {
      value: inletFlowStr,
      unit: 'm³/hr',
    },
    params: influentParams,
    at: inletAt,
  }

  const effluentStream: LiveStreamData = {
    flow: {
      value: outletFlowStr,
      unit: 'm³/hr',
    },
    params: effluentParams,
    at: outletAt,
  }

  return {
    at: generalAt,
    influent: influentStream,
    effluent: effluentStream,
  }
}

/**
 * High-level function that resolves the site, calls /api/stp/${site}/latest on port 8909,
 * and maps the record to LiveRealtimeData. Returns null if unreachable.
 */
export async function fetchStpMonitoringRealtime(
  plantKey?: string | null,
): Promise<LiveRealtimeData | null> {
  const site = resolveStpSite(plantKey)
  if (!site) return null

  const reading = await fetchLatestStpReading(site)
  if (!reading) return null

  return mapStpReadingToLiveRealtime(reading, site)
}

export interface StpReadingsPageInfo {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export interface StpReadingsPagedResponse {
  content: StpReadingResponse[]
  page: StpReadingsPageInfo
}

export interface FetchStpReadingsParams {
  site: StpSite | string
  from: string
  to: string
  page?: number
  size?: number
}

export interface StpParameterReportRow {
  id: string
  stream: 'Influent' | 'Effluent'
  date: string
  time: string
  flow: string
  bod: string
  cod: string
  tss: string
  ph: string
  temp: string
  nh4n: string
  tn: string
  tp: string
  status: 'Compliant' | 'Non-Complying'
  breaches: Record<string, boolean>
}

function formatReportDateAndTime(rawTimestamp?: string | null): { date: string; time: string } {
  if (!rawTimestamp) return { date: '—', time: '—' }
  const raw = String(rawTimestamp).trim()
  const parsed = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) {
    return { date: raw, time: '—' }
  }

  const day = String(parsed.getDate()).padStart(2, '0')
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const year = parsed.getFullYear()
  const date = `${day}/${month}/${year}`

  const time = parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return { date, time }
}

/**
 * Maps a single StpReadingResponse to a parameter report row for either Effluent or Influent.
 */
export function mapStpReadingToParameterReportRow(
  rawReading: StpReadingResponse,
  side: 'inlet' | 'outlet' = 'outlet',
  index = 0,
): StpParameterReportRow {
  const reading = withNh4n(rawReading)
  const isInlet = side === 'inlet'
  const rawTs = isInlet
    ? reading.inletTimestamp ?? reading.outletTimestamp ?? reading.fetchedAt
    : reading.outletTimestamp ?? reading.inletTimestamp ?? reading.fetchedAt
  const { date, time } = formatReportDateAndTime(rawTs)

  const flowVal = isInlet ? reading.inletFlowM3Hr : reading.outletFlowM3Hr
  const bodVal = isInlet ? reading.inletBod : reading.outletBod
  const codVal = isInlet ? reading.inletCod : reading.outletCod
  const tssVal = isInlet ? reading.inletTss : reading.outletTss
  const phVal = isInlet ? reading.inletPh : reading.outletPh
  const tempVal = isInlet ? reading.inletTemperatureC : reading.outletTemperatureC
  const nh4Val = isInlet ? reading.inletNh4 : reading.outletNh4
  const tnVal = isInlet ? reading.inletTn : reading.outletTn
  const tpVal = isInlet ? reading.inletTp : reading.outletTp

  const breaches: Record<string, boolean> = isInlet
    ? {}
    : {
        bod: isBreach(bodVal, 0, 10),
        cod: isBreach(codVal, 0, 50),
        tss: isBreach(tssVal, 0, 20),
        ph: isBreach(phVal, 5.5, 9),
        temp: isBreach(tempVal, 15, 35),
        nh4n: isBreach(nh4Val, 0, 10),
        tn: isBreach(tnVal, 0, 10),
        tp: isBreach(tpVal, 0, 5),
      }

  const hasAnyBreach = Object.values(breaches).some(Boolean)

  return {
    id: `${reading.id ?? index}-${side}`,
    stream: isInlet ? 'Influent' : 'Effluent',
    date,
    time,
    flow: formatNumber(flowVal),
    bod: formatNumber(bodVal),
    cod: formatNumber(codVal),
    tss: formatNumber(tssVal),
    ph: formatNumber(phVal),
    temp: formatNumber(tempVal),
    nh4n: formatNumber(nh4Val),
    tn: formatNumber(tnVal),
    tp: formatNumber(tpVal),
    status: hasAnyBreach ? 'Non-Complying' : 'Compliant',
    breaches,
  }
}

function normalizePagedReadingsResponse(
  raw: unknown,
  fallbackPage: number,
  fallbackSize: number,
): StpReadingsPagedResponse {
  if (Array.isArray(raw)) {
    return {
      content: raw as StpReadingResponse[],
      page: {
        size: fallbackSize,
        number: fallbackPage,
        totalElements: raw.length,
        totalPages: raw.length > 0 ? 1 : 0,
      },
    }
  }

  const obj = (raw ?? {}) as Record<string, any>
  const content = Array.isArray(obj.content)
    ? (obj.content as StpReadingResponse[])
    : Array.isArray(obj.data)
      ? (obj.data as StpReadingResponse[])
      : []

  const pageObj = obj.page && typeof obj.page === 'object' ? obj.page : obj
  const size = typeof pageObj.size === 'number' ? pageObj.size : fallbackSize
  const number = typeof pageObj.number === 'number' ? pageObj.number : fallbackPage
  const totalElements =
    typeof pageObj.totalElements === 'number' ? pageObj.totalElements : content.length
  const totalPages =
    typeof pageObj.totalPages === 'number'
      ? pageObj.totalPages
      : size > 0
        ? Math.ceil(totalElements / size)
        : 1

  return {
    content,
    page: {
      size,
      number,
      totalElements,
      totalPages,
    },
  }
}

/**
 * Fetch paginated readings for a specific STP site from the 8909 API endpoint.
 * Example: /api/stp/BAZPUR/readings?from=2026-11-01T00:00:00&to=2026-11-03T23:59:59&page=0&size=50
 */
export async function fetchStpReadings({
  site,
  from,
  to,
  page = 0,
  size = 50,
}: FetchStpReadingsParams): Promise<StpReadingsPagedResponse | null> {
  const resolved = resolveStpSite(site) ?? site
  if (!resolved) return null

  const query = new URLSearchParams({
    from,
    to,
    page: String(page),
    size: String(size),
  }).toString()

  const endpoint = `${API_BASE_URL.stpMonitoring}${ENDPOINTS.stpMonitoring.readings(resolved)}?${query}`
  const directBaseUrl =
    import.meta.env.VITE_STP_MONITORING_API_BASE_URL || 'http://45.195.229.15:8909'
  const directUrl = `${directBaseUrl}/api/stp/${encodeURIComponent(resolved)}/readings?${query}`

  try {
    const response = await authFetch(endpoint)
    if (response.ok) {
      const json = await response.json()
      return normalizePagedReadingsResponse(json, page, size)
    }
  } catch {
    // fallback below
  }

  try {
    const directRes = await fetch(directUrl)
    if (directRes.ok) {
      const json = await directRes.json()
      return normalizePagedReadingsResponse(json, page, size)
    }
  } catch {
    // ignore fallback error
  }

  return null
}

