import { mapRecordToReading, pickReadingTime, type LiveStreamData } from './stpLive'
import { streamTransactions } from '../data/mockData'

const DASHBOARD_API = import.meta.env.VITE_DASHBOARD_API_URL ?? '/dashboard-api'
const DEFAULT_LIMIT = 20
/** Pull extra rows so we can still fill 20 after deduping by reading_time. */
const FETCH_LIMIT = 100

export type TransactionRow = {
  id: string
  status: string
  timestamp: string
  readingTime: string
  syncKey: string
  reading: LiveStreamData
}

export type TransactionStreamData = {
  uniqueId: string
  rows: TransactionRow[]
}

function formatCreatedAt(value: unknown) {
  if (!value) return '—'

  const raw = String(value)
  const parsed = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) return raw

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

function truncateId(value: string | number) {
  const text = String(value)
  return text.length > 18 ? `${text.slice(0, 18)}...` : text
}

function readingTimeKey(value: unknown) {
  return String(value ?? '').trim()
}

function readingTimeMs(value: unknown) {
  if (!value) return 0
  const raw = String(value)
  const parsed = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'))
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

function mapRecordToRow(side: 'inlet' | 'outlet', record: Record<string, unknown>): TransactionRow {
  // 14 MLD uses device_time; others use reading_time.
  const rawTime = pickReadingTime(record)
  const readingTime = readingTimeKey(rawTime)

  return {
    id: truncateId(String(record.id ?? record.site_id ?? record.device_id ?? '—')),
    status: typeof record.status === 'string' && record.status ? record.status : 'Pending',
    timestamp: formatCreatedAt(rawTime),
    readingTime,
    syncKey: readingTime,
    reading: mapRecordToReading(side, record),
  }
}


/** Keep one row per exact reading_time, newest first, capped at `limit`. */
function uniqueByReadingTimeDesc(rows: TransactionRow[], limit = DEFAULT_LIMIT) {
  const sorted = [...rows].sort((a, b) => readingTimeMs(b.readingTime) - readingTimeMs(a.readingTime))
  const seen = new Set<string>()
  const unique: TransactionRow[] = []

  for (const row of sorted) {
    const key = readingTimeKey(row.readingTime)
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(row)
    if (unique.length >= limit) break
  }

  return unique
}

async function fetchStreamRows(plantCode: string, side: 'inlet' | 'outlet', limit = DEFAULT_LIMIT) {
  const response = await fetch(
    `${DASHBOARD_API}/dashboard/${encodeURIComponent(plantCode)}/${side}?limit=${FETCH_LIMIT}`,
  )
  if (!response.ok) throw new Error(`Failed to load ${side} transactions`)

  const payload = await response.json()
  const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []

  return uniqueByReadingTimeDesc(
    rows
      .filter((row): row is Record<string, unknown> => row && typeof row === 'object')
      .map((row) => mapRecordToRow(side, row)),
    limit,
  )
}

export async function fetchTransactionLogs(
  plantCode: string,
  limit = DEFAULT_LIMIT,
): Promise<{ influent: TransactionStreamData; effluent: TransactionStreamData } | null> {
  if (!plantCode) return null

  try {
    const [inletRows, outletRows] = await Promise.all([
      fetchStreamRows(plantCode, 'inlet', limit),
      fetchStreamRows(plantCode, 'outlet', limit),
    ])

    return {
      influent: {
        uniqueId: `${plantCode}in`,
        rows: inletRows,
      },
      effluent: {
        uniqueId: `${plantCode}out`,
        rows: outletRows,
      },
    }
  } catch {
    return null
  }
}

export function getFallbackTransactionLogs() {
  return {
    influent: {
      ...streamTransactions.influent,
      rows: streamTransactions.influent.rows.map((row) => ({
        ...row,
        readingTime: row.timestamp,
        syncKey: row.timestamp,
      })),
    } as TransactionStreamData,
    effluent: {
      ...streamTransactions.effluent,
      rows: streamTransactions.effluent.rows.map((row) => ({
        ...row,
        readingTime: row.timestamp,
        syncKey: row.timestamp,
      })),
    } as TransactionStreamData,
  }
}
