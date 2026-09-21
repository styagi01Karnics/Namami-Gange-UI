const PENALTY_API = import.meta.env.VITE_PENALTY_API_URL ?? '/penalty-api'

export type PenaltySummary = {
  stpCode: string
  from: string
  to: string
  technicalQualityOccurrences: number
  availabilityEvents: number
  qualityAssessments: number
  qualityPenaltyAmount: number
  downtimePenaltyAmount: number
  totalAssessedAmount: number
}

export type PenaltyOccurrence = {
  id: number | string
  violation_id?: string | number | null
  stp_code?: string
  parameter_name?: string
  observed_value?: number | null
  min_allowed?: number | null
  max_allowed?: number | null
  violation_type?: string
  observed_at?: string
  start_time?: string
  end_time?: string
  duration_minutes?: number | null
  peak_value?: number | null
  peak_recorded_at?: string
  penalty_days?: number | null
  status?: string
  penalty_applicable?: boolean
  penalty_amount?: number | null
  remarks?: string | null
  rule_code?: string | null
  rule_type?: string | null
  rate_per_day?: number | null
  created_at?: string
  [key: string]: unknown
}

export type ViolationListItem = {
  id: string
  /** Plant code from occurrence `stp_code` (e.g. 18mldjag). */
  stpCode: string
  /** Display name from `/dashboard/plants` `plantName`, resolved via stp_code. */
  stp: string
  type: string
  typeGroup: 'Parameter Breach' | 'Equipment Failure'
  parameter: string
  exceedance: string
  location: string
  downtime: string
  detectedOn: string
  status: string
  summary: Array<{ label: string; value: string; tone: string; trend?: string }>
  tracking: { rows: Array<{ label: string; value: string }>; remarks: string }
  recovery: Array<{ label: string; time: string; tone: string }>
  penalty: {
    total: string
    amounts: Array<{ label: string; value: string }>
    calculation: Array<{ label: string; value: string; tone?: string }>
    recoveryDetails: Array<{ label: string; value: string }>
    document: string
  }
  trend: {
    unit: string
    series: Array<{ t: string; value: number }>
    domain: [number, number]
    ticks: number[]
    lowerLimit: number
    upperLimit: number
    violationFrom: string
    violationTo: string
    xTicks?: string[]
    peak: { t: string; value: string; stamp: string }
  }
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

/** Local datetime without timezone, matching the penalty API query shape. */
export function toPenaltyApiDateTime(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/**
 * Calendar day bounds for penalty APIs:
 * from → YYYY-MM-DDT00:00:00, to → YYYY-MM-DDT23:59:59
 */
export function toPenaltyApiDayRange(fromDate: Date, toDate: Date) {
  const start = fromDate.getTime() <= toDate.getTime() ? fromDate : toDate
  const end = fromDate.getTime() <= toDate.getTime() ? toDate : fromDate

  const from = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0)
  const to = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 0)

  return {
    from: toPenaltyApiDateTime(from),
    to: toPenaltyApiDateTime(to),
  }
}

/** Default window matching sample penalty URLs: (today − 2 days) 00:00:00 → today 14:59:59. */
export function defaultPenaltyRange(now = new Date()) {
  const from = new Date(now)
  from.setDate(from.getDate() - 2)
  from.setHours(0, 0, 0, 0)

  const to = new Date(now)
  to.setHours(14, 59, 59, 0)

  return {
    from: toPenaltyApiDateTime(from),
    to: toPenaltyApiDateTime(to),
  }
}

/** Occurrences sample window ends at 13:59:59. */
export function defaultOccurrencesRange(now = new Date()) {
  const from = new Date(now)
  from.setDate(from.getDate() - 2)
  from.setHours(0, 0, 0, 0)

  const to = new Date(now)
  to.setHours(13, 59, 59, 0)

  return {
    from: toPenaltyApiDateTime(from),
    to: toPenaltyApiDateTime(to),
  }
}

export function formatPenaltyAmount(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return '—'
  return `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function parseApiDate(value: unknown) {
  if (!value) return null
  const raw = String(value)
  const parsed = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatOccurrenceStamp(value: unknown) {
  const parsed = parseApiDate(value)
  if (!parsed) return value ? String(value) : '—'

  const date = parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const time = parsed.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  return `${date} ,${time}`
}

export function formatDurationMinutes(value: unknown) {
  const mins = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(mins) || mins < 0) return '—'
  const total = Math.round(mins)
  if (total < 60) return `${total}min`
  const hours = Math.floor(total / 60)
  const rem = total % 60
  return rem ? `${hours}h ${rem}min` : `${hours}h`
}

export function locationFromParameter(parameterName: unknown) {
  const name = String(parameterName ?? '').toLowerCase()
  if (name.includes('outlet')) return 'Effluent'
  if (name.includes('inlet')) return 'Influent'
  return '—'
}

function formatNumber(value: number | null | undefined, digits = 2) {
  if (value == null || !Number.isFinite(value)) return '—'
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : Math.min(digits, 2),
    maximumFractionDigits: digits,
  })
}

/** % difference: (observed_value − max_allowed) / max_allowed × 100 */
function calcExceedance(occurrence: PenaltyOccurrence) {
  const observed = Number(occurrence.observed_value)
  const max = Number(occurrence.max_allowed)

  if (!Number.isFinite(observed) || !Number.isFinite(max) || max === 0) return '—'

  const percent = ((observed - max) / Math.abs(max)) * 100
  return `${percent.toFixed(1)}%`
}

function typeGroupFromOccurrence(occurrence: PenaltyOccurrence): ViolationListItem['typeGroup'] {
  const ruleType = String(occurrence.rule_type ?? '').toUpperCase()
  if (ruleType.includes('AVAIL') || ruleType.includes('DOWN') || ruleType.includes('EQUIP')) {
    return 'Equipment Failure'
  }
  return 'Parameter Breach'
}

function formatClock(value: unknown) {
  const parsed = parseApiDate(value)
  if (!parsed) return '—'
  return formatClockFromDate(parsed)
}

function formatClockFromDate(date: Date) {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const suffix = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  if (hours === 0) hours = 12
  // Hourly ticks: "9am"; off-hour samples: "9:15am".
  if (minutes === 0) return `${hours}${suffix}`
  return `${hours}:${String(minutes).padStart(2, '0')}${suffix}`
}

function shiftHours(value: unknown, hours: number): Date | null {
  const parsed = parseApiDate(value)
  if (!parsed) return null
  return new Date(parsed.getTime() + hours * 60 * 60 * 1000)
}

function floorToHour(date: Date) {
  const d = new Date(date)
  d.setMinutes(0, 0, 0)
  return d
}

function ceilToHour(date: Date) {
  const d = new Date(date)
  if (d.getMinutes() === 0 && d.getSeconds() === 0 && d.getMilliseconds() === 0) {
    return d
  }
  d.setMinutes(0, 0, 0)
  d.setHours(d.getHours() + 1)
  return d
}

/** Mid-high value inside the ideal band (matches design ~8.0 for 6–9). */
function idealBaseline(min: number, max: number, fallback: number) {
  if (Number.isFinite(min) && Number.isFinite(max) && max > min) {
    return Math.round((min + (max - min) * 0.65) * 100) / 100
  }
  if (Number.isFinite(max)) return Math.round(max * 0.85 * 100) / 100
  if (Number.isFinite(min)) return Math.round((min + Math.abs(min) * 0.2) * 100) / 100
  return Number.isFinite(fallback) ? Math.round(fallback * 0.7 * 100) / 100 : 0
}

function buildHourlyTicks(from: Date, to: Date): string[] {
  const ticks: string[] = []
  const cursor = new Date(from)
  while (cursor.getTime() <= to.getTime() + 1000) {
    ticks.push(formatClockFromDate(cursor))
    cursor.setHours(cursor.getHours() + 1)
  }
  return ticks
}

export function mapOccurrenceToViolation(
  occurrence: PenaltyOccurrence,
  plantNameByCode?: Record<string, string>,
  fallbackPlantName?: string,
): ViolationListItem {
  const parameter = String(occurrence.parameter_name ?? '—')
  const exceedance = calcExceedance(occurrence)
  const min = Number(occurrence.min_allowed)
  const max = Number(occurrence.max_allowed)
  const peak = Number(occurrence.peak_value ?? occurrence.observed_value)
  const observed = Number(occurrence.observed_value)
  const ideal =
    Number.isFinite(min) && Number.isFinite(max)
      ? `${formatNumber(min)}-${formatNumber(max)}`
      : Number.isFinite(max)
        ? `≤ ${formatNumber(max)}`
        : Number.isFinite(min)
          ? `≥ ${formatNumber(min)}`
          : '—'

  const penaltyAmount = occurrence.penalty_amount == null ? null : Number(occurrence.penalty_amount)
  // Y-axis: 0 → headroom above exceed/peak so the curve matches the design chart.
  const exceedValue = Number.isFinite(observed)
    ? observed
    : Number.isFinite(peak)
      ? peak
      : Number.isFinite(max)
        ? max
        : 1
  const domainMax = Math.max(
    exceedValue,
    Number.isFinite(peak) ? peak : 0,
    Number.isFinite(max) ? max : 0,
    1,
  )
  // Prefer a clean top tick (e.g. 10.2 → 12) when headroom helps readability.
  const niceTop = Math.ceil(domainMax / 3) * 3
  const yMax = niceTop > domainMax ? niceTop : domainMax
  const yTicks = [0, yMax / 3, (yMax * 2) / 3, yMax].map((n) => Math.round(n * 100) / 100)
  const stpCode = String(occurrence.stp_code ?? '').trim()
  const stp =
    (stpCode && plantNameByCode?.[stpCode]) ||
    fallbackPlantName ||
    (stpCode || '—')

  const paddedStart = shiftHours(occurrence.start_time, -2)
  const paddedEnd = shiftHours(occurrence.end_time, 2)
  const axisFrom = paddedStart ? floorToHour(paddedStart) : null
  const axisTo = paddedEnd ? ceilToHour(paddedEnd) : null

  return {
    id: String(occurrence.violation_id ?? occurrence.id ?? '—'),
    stpCode,
    stp,
    type: String(occurrence.violation_type ?? '—'),
    typeGroup: typeGroupFromOccurrence(occurrence),
    parameter,
    exceedance,
    location: locationFromParameter(parameter),
    downtime: formatDurationMinutes(occurrence.duration_minutes),
    detectedOn: formatOccurrenceStamp(occurrence.peak_recorded_at),
    status: String(occurrence.status ?? '—'),
    summary: [
      { label: 'Parameter', value: parameter, tone: 'ink' },
      { label: 'Exceed Value', value: formatNumber(observed), tone: 'danger' },
      { label: 'Ideal Range', value: ideal, tone: 'ok' },
      { label: 'Exceedance', value: exceedance, tone: 'danger', trend: 'up' },
    ],
    tracking: {
      rows: [
        { label: 'Violation Type', value: String(occurrence.violation_type ?? '—') },
        { label: 'Detected', value: formatOccurrenceStamp(occurrence.start_time) },
        { label: 'Recovered on', value: formatOccurrenceStamp(occurrence.end_time) },
        { label: 'Total Duration', value: formatDurationMinutes(occurrence.duration_minutes) },
      ],
      remarks: occurrence.remarks != null && String(occurrence.remarks).trim() !== '' ? String(occurrence.remarks) : '—',
    },
    recovery: [
      { label: 'Violation Started', time: formatOccurrenceStamp(occurrence.start_time), tone: 'danger' },
      { label: 'Peak Value Recorded', time: formatOccurrenceStamp(occurrence.peak_recorded_at), tone: 'danger' },
      { label: 'Recovery Started', time: '—', tone: 'warn' },
      { label: 'Recovered', time: formatOccurrenceStamp(occurrence.end_time), tone: 'muted' },
    ],
    penalty: {
      total: formatPenaltyAmount(penaltyAmount),
      amounts: [
        { label: 'Recovered Amount', value: formatPenaltyAmount(0) },
        { label: 'Pending Amount', value: formatPenaltyAmount(penaltyAmount) },
      ],
      calculation: [
        { label: 'Penalty Rule', value: String(occurrence.rule_code ?? '—'), tone: 'warn' },
        { label: 'Penalty Basis', value: String(occurrence.rule_type ?? '—') },
        {
          label: 'Calculation',
          value: `${occurrence.penalty_days ?? 0} day(s) × ${formatPenaltyAmount(Number(occurrence.rate_per_day) || 0)}`,
        },
      ],
      recoveryDetails: [
        { label: 'Status', value: String(occurrence.status ?? '—') },
        { label: 'Penalty Applicable', value: occurrence.penalty_applicable ? 'Yes' : 'No' },
      ],
      document: '—',
    },
    trend: {
      unit: parameter,
      series: buildTrendSeries(occurrence, observed, peak, min, max, axisFrom, axisTo),
      domain: [0, yMax],
      ticks: yTicks,
      lowerLimit: Number.isFinite(min) ? min : 0,
      upperLimit: Number.isFinite(max) ? max : yMax,
      // Violation band stays on actual Started → Recovered.
      violationFrom: formatClock(occurrence.start_time),
      violationTo: formatClock(occurrence.end_time),
      // X-axis: hourly ticks across (Started − 2h) → (Recovered + 2h).
      xTicks: axisFrom && axisTo ? buildHourlyTicks(axisFrom, axisTo) : [],
      peak: {
        t: formatClock(occurrence.peak_recorded_at),
        value: formatNumber(peak),
        stamp: formatOccurrenceStamp(occurrence.peak_recorded_at),
      },
    },
  }
}

/**
 * Blue line stays inside the ideal range before Violation Started and after Recovered,
 * rises through the limit to the peak during the violation window (matches design chart).
 */
function buildTrendSeries(
  occurrence: PenaltyOccurrence,
  observed: number,
  peak: number,
  min: number,
  max: number,
  axisFrom: Date | null,
  axisTo: Date | null,
): Array<{ t: string; value: number }> {
  const start = parseApiDate(occurrence.start_time)
  const end = parseApiDate(occurrence.end_time)
  const peakAt = parseApiDate(occurrence.peak_recorded_at) ?? start
  const peakValue = Number.isFinite(peak) ? peak : Number.isFinite(observed) ? observed : 0
  const baseline = idealBaseline(min, max, peakValue)

  if (!start || !end || !axisFrom || !axisTo) {
    return [{ t: '—', value: peakValue || baseline }]
  }

  const upperBreach =
    Number.isFinite(max) && peakValue > max
      ? true
      : Number.isFinite(min) && peakValue < min
        ? false
        : Number.isFinite(max)
  const edgeLimit = upperBreach
    ? Number.isFinite(max)
      ? max
      : baseline
    : Number.isFinite(min)
      ? min
      : baseline

  const clampIdeal = (v: number) => {
    let next = v
    if (Number.isFinite(min) && Number.isFinite(max)) {
      // Keep a small gap inside the band so the line reads as "in range".
      const lo = min + (max - min) * 0.05
      const hi = max - (max - min) * 0.05
      next = Math.min(hi, Math.max(lo, next))
    } else if (Number.isFinite(max)) {
      next = Math.min(max * 0.95, next)
    } else if (Number.isFinite(min)) {
      next = Math.max(min * 1.05, next)
    }
    return Math.round(next * 100) / 100
  }

  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t))
  const easeIn = (t: number) => t * t
  const easeOut = (t: number) => 1 - (1 - t) * (1 - t)

  const startMs = start.getTime()
  const endMs = end.getTime()
  const peakMs = Math.min(Math.max(peakAt.getTime(), startMs), endMs)
  const fromMs = axisFrom.getTime()
  const toMs = axisTo.getTime()
  const stepMs = 15 * 60 * 1000

  const points = new Map<number, number>()

  for (let t = fromMs; t <= toMs; t += stepMs) {
    let value: number
    if (t < startMs) {
      // Inside ideal range; drift gently toward the limit near the breach.
      const progress = (t - fromMs) / Math.max(1, startMs - fromMs)
      const approach = progress > 0.65 ? easeIn((progress - 0.65) / 0.35) : 0
      value = clampIdeal(lerp(baseline, edgeLimit, approach * 0.55))
    } else if (t <= peakMs) {
      const progress = (t - startMs) / Math.max(1, peakMs - startMs)
      value = Math.round(lerp(edgeLimit, peakValue, easeIn(progress)) * 100) / 100
    } else if (t <= endMs) {
      const progress = (t - peakMs) / Math.max(1, endMs - peakMs)
      value = Math.round(lerp(peakValue, edgeLimit, easeOut(progress)) * 100) / 100
    } else {
      // Back inside ideal range after recovery.
      const progress = (t - endMs) / Math.max(1, toMs - endMs)
      value = clampIdeal(lerp(edgeLimit, baseline, easeOut(Math.min(1, progress * 1.2))))
    }
    points.set(t, value)
  }

  // Pin exact event timestamps.
  points.set(startMs, Math.round(edgeLimit * 100) / 100)
  points.set(peakMs, Math.round(peakValue * 100) / 100)
  points.set(endMs, Math.round(edgeLimit * 100) / 100)
  points.set(fromMs, clampIdeal(baseline))
  points.set(toMs, clampIdeal(baseline))

  return [...points.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([ms, value]) => ({ t: formatClockFromDate(new Date(ms)), value }))
}

export async function fetchPenaltySummary(
  stpCode: string,
  range = defaultPenaltyRange(),
): Promise<PenaltySummary | null> {
  if (!stpCode) return null

  try {
    const params = new URLSearchParams({
      stpCode,
      from: range.from,
      to: range.to,
    })
    const response = await fetch(`${PENALTY_API}/penalty/summary?${params}`)
    if (!response.ok) throw new Error('Failed to load penalty summary')

    const payload = await response.json()
    const data = payload?.data ?? payload
    if (!data || typeof data !== 'object') return null

    const amount = Number(data.totalAssessedAmount)
    return {
      stpCode: String(data.stpCode ?? stpCode),
      from: String(data.from ?? range.from),
      to: String(data.to ?? range.to),
      technicalQualityOccurrences: Number(data.technicalQualityOccurrences) || 0,
      availabilityEvents: Number(data.availabilityEvents) || 0,
      qualityAssessments: Number(data.qualityAssessments) || 0,
      qualityPenaltyAmount: Number(data.qualityPenaltyAmount) || 0,
      downtimePenaltyAmount: Number(data.downtimePenaltyAmount) || 0,
      totalAssessedAmount: Number.isFinite(amount) ? amount : 0,
    }
  } catch {
    return null
  }
}

export type PenaltyVendor = {
  id: number | string
  stp_code: string
  vendor_code: string
  vendor_name: string
  contract_number?: string | null
  active?: boolean
}

/** Active vendors for an STP — used by Vendor Details in the STP header. */
export async function fetchPenaltyVendors(stpCode: string): Promise<PenaltyVendor[]> {
  if (!stpCode) return []

  try {
    const params = new URLSearchParams({ stpCode })
    const response = await fetch(`${PENALTY_API}/penalty/vendors?${params}`)
    if (!response.ok) throw new Error('Failed to load vendors')

    const payload = await response.json()
    const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []

    return rows
      .filter((row): row is Record<string, unknown> => Boolean(row && typeof row === 'object'))
      .map((row) => ({
        id: (row.id as number | string) ?? '—',
        stp_code: String(row.stp_code ?? stpCode),
        vendor_code: String(row.vendor_code ?? ''),
        vendor_name: String(row.vendor_name ?? ''),
        contract_number: row.contract_number == null ? null : String(row.contract_number),
        active: Boolean(row.active),
      }))
      .filter((row) => row.vendor_name)
  } catch {
    return []
  }
}

export async function fetchPenaltyOccurrences(
  stpCode: string,
  range = defaultOccurrencesRange(),
  options?: {
    plantNameByCode?: Record<string, string>
    plantName?: string
  },
): Promise<ViolationListItem[]> {
  if (!stpCode) return []

  try {
    // Works for all STP codes: 68mldjag, 18mldjag, 33mldsali, 14mldsarai
    const params = new URLSearchParams({
      stpCode,
      from: range.from,
      to: range.to,
    })
    const response = await fetch(`${PENALTY_API}/penalty/occurrences?${params}`)
    if (!response.ok) throw new Error('Failed to load penalty occurrences')

    const payload = await response.json()
    const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
    const plantNameByCode = options?.plantNameByCode
    const fallbackName = options?.plantName ?? plantNameByCode?.[stpCode]

    return uniqueByCreatedAtDesc(
      rows
        .filter((row): row is PenaltyOccurrence => Boolean(row && typeof row === 'object'))
        .filter((row) => row.penalty_applicable === true)
        .map((row) => ({
          ...row,
          // Ensure mapping always has a code when the API omits it on the row.
          stp_code: row.stp_code ?? stpCode,
        })),
    ).map((row) => mapOccurrenceToViolation(row, plantNameByCode, fallbackName))
  } catch {
    return []
  }
}

function createdAtKey(value: unknown) {
  return String(value ?? '').trim()
}

function createdAtMs(value: unknown) {
  const parsed = parseApiDate(value)
  return parsed ? parsed.getTime() : 0
}

/** Keep one row per exact created_at, newest first. */
function uniqueByCreatedAtDesc(rows: PenaltyOccurrence[]) {
  const sorted = [...rows].sort((a, b) => {
    const delta = createdAtMs(b.created_at) - createdAtMs(a.created_at)
    if (delta !== 0) return delta
    return Number(b.id) - Number(a.id)
  })

  const seen = new Set<string>()
  const unique: PenaltyOccurrence[] = []

  for (const row of sorted) {
    const key = createdAtKey(row.created_at)
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(row)
  }

  return unique
}
