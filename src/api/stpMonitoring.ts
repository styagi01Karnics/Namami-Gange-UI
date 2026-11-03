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
  JAGJEETPUR = 'JAGJEETPUR',
  SARAI_18 = 'SARAI_18',
  MOTHOROWALA_1 = 'MOTHOROWALA_1',
  MOTHOROWALA_2 = 'MOTHOROWALA_2',
  RISHIKESH = 'RISHIKESH',
  LAKKAR_GHAT = 'LAKKAR_GHAT',
  JAG_27 = 'JAG_27',
  INDRA_NAGAR = 'INDRA_NAGAR',
  SALIYAR = 'SALIYAR',
  KARGI_CHOWK = 'KARGI_CHOWK',
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
  [StpSite.JAGJEETPUR]: { site: StpSite.JAGJEETPUR, displayName: '18 MLD STP Jagjeetpur', capacityMld: 18 },
  [StpSite.SARAI_18]: { site: StpSite.SARAI_18, displayName: '18 MLD STP Sarai', capacityMld: 18 },
  [StpSite.MOTHOROWALA_1]: { site: StpSite.MOTHOROWALA_1, displayName: '20 MLD STP Mothorowala', capacityMld: 20 },
  [StpSite.MOTHOROWALA_2]: { site: StpSite.MOTHOROWALA_2, displayName: '20 MLD STP Mothorowala', capacityMld: 20 },
  [StpSite.RISHIKESH]: { site: StpSite.RISHIKESH, displayName: '26 MLD STP Lakkar Ghat', capacityMld: 26 },
  [StpSite.LAKKAR_GHAT]: { site: StpSite.LAKKAR_GHAT, displayName: '26 MLD STP Lakkar Ghat', capacityMld: 26 },
  [StpSite.JAG_27]: { site: StpSite.JAG_27, displayName: '27 MLD STP Jagjeetpur', capacityMld: 27 },
  [StpSite.INDRA_NAGAR]: { site: StpSite.INDRA_NAGAR, displayName: '28 MLD STP Indra Nagar', capacityMld: 28 },
  [StpSite.SALIYAR]: { site: StpSite.SALIYAR, displayName: '33 MLD STP Saliyar', capacityMld: 33 },
  [StpSite.KARGI_CHOWK]: { site: StpSite.KARGI_CHOWK, displayName: '68 MLD STP Kargi Chowk', capacityMld: 68 },
}

/**
 * Uniform JSON response from http://localhost:8909/api/stp/${site}/latest
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
  outletTemperatureC?: number | null
  outletTimestamp?: string | null
  fetchedAt?: string | null
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

  const clean = raw.toLowerCase()

  // 10 MLD Bazpur
  if (clean.includes('bazpur')) return StpSite.BAZPUR

  // 10 MLD Kashipur
  if (clean.includes('kashipur')) return StpSite.KASHIPUR

  // 18 MLD Sarai
  if (
    clean.includes('sarai_18') ||
    clean.includes('sarai-18') ||
    clean.includes('18mldsarai') ||
    clean.includes('jwalapur') ||
    (clean.includes('sarai') && clean.includes('18'))
  ) {
    return StpSite.SARAI_18
  }

  // 14 MLD Sarai
  if (clean.includes('sarai') || clean.includes('14mld')) return StpSite.SARAI

  // 27 MLD Jagjeetpur
  if (clean.includes('27') && (clean.includes('jag') || clean.includes('jagjeetpur'))) {
    return StpSite.JAG_27
  }

  // 18 MLD Jagjeetpur
  if (clean.includes('18') && (clean.includes('jag') || clean.includes('jagjeetpur'))) {
    return StpSite.JAGJEETPUR
  }

  // 20 MLD Mothorowala-2
  if (
    clean.includes('moth_2') ||
    clean.includes('mothorowala-2') ||
    clean.includes('mothorowala_2') ||
    clean.includes('mothorowala-ii') ||
    clean.includes('mothorowala ii')
  ) {
    return StpSite.MOTHOROWALA_2
  }

  // 20 MLD Mothorowala-1
  if (clean.includes('mothorowala') || clean.includes('moth')) {
    return StpSite.MOTHOROWALA_1
  }

  // 26 MLD Lakkar Ghat / Rishikesh
  if (clean.includes('lakkar') || clean.includes('lkgt')) {
    return StpSite.LAKKAR_GHAT
  }
  if (clean.includes('rishikesh')) {
    return StpSite.RISHIKESH
  }

  // 28 MLD Indra Nagar
  if (clean.includes('indira') || clean.includes('indra')) {
    return StpSite.INDRA_NAGAR
  }

  // 33 MLD Saliyar
  if (clean.includes('sali') || clean.includes('saliyar')) {
    return StpSite.SALIYAR
  }

  // 68 MLD Kargi Chowk (and fallback for 68 MLD Jagjeetpur)
  if (clean.includes('kargi')) {
    return StpSite.KARGI_CHOWK
  }
  if (clean.includes('68mld') || clean.includes('68 mld')) {
    return StpSite.KARGI_CHOWK
  }

  return null
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

  try {
    const response = await authFetch(endpoint)
    if (!response.ok) {
      // If same-origin proxy fails in local dev, try direct port 8909
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        try {
          const directRes = await fetch(`http://localhost:8909/api/stp/${encodeURIComponent(resolved)}/latest`)
          if (directRes.ok) return (await directRes.json()) as StpReadingResponse
        } catch {
          // ignore direct fallback error
        }
      }
      return null
    }
    return (await response.json()) as StpReadingResponse
  } catch {
    // Direct fallback for local dev when proxy is unavailable
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      try {
        const directRes = await fetch(`http://localhost:8909/api/stp/${encodeURIComponent(resolved)}/latest`)
        if (directRes.ok) return (await directRes.json()) as StpReadingResponse
      } catch {
        // ignore
      }
    }
    return null
  }
}

/**
 * Maps DB reading response into the LiveRealtimeData structure used by RealtimeParametersPanel.
 * Influent: maps all inlet params (inletFlowM3Hr, inletBod, inletCod, inletTss, inletPh, inletTemperatureC, inletNh4, inletTn, inletTp)
 * Effluent: maps all outlet params (outletFlowM3Hr, outletBod, outletCod, outletTss, outletPh, outletTemperatureC, outletNh4, outletTn, outletTp)
 */
export function mapStpReadingToLiveRealtime(
  reading: StpReadingResponse,
  _site?: StpSite | null,
): LiveRealtimeData {
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
