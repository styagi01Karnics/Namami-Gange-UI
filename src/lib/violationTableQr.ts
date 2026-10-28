import type { StpMonthlyViolation } from '../data/mockData'

export const VIOLATION_REPORT_PATH = '/violation-report'

/** Keep the embedded URL within what a medium-level QR code can hold. */
export const MAX_QR_URL_LENGTH = 2300

/** Header details the on-screen PDF gets from the STP export context. */
export type ViolationReportMeta = {
  /** Date-range label shown in the PDF header (e.g. "1 Sep 2026 - 30 Sep 2026"). */
  rangeLabel: string
  address: string | null
  badge: string | null
  badgeTone: string
}

/** Query needed to re-load a large table on the report page instead of embedding it. */
export type ViolationReportLink = {
  plantCode: string
  from: string
  to: string
  query: string
  title: string
  meta: ViolationReportMeta
}

export type QrViolationRow = Pick<
  StpMonthlyViolation,
  'sn' | 'stpName' | 'capacity' | 'district' | 'omDepartment' | 'date' | 'nonComplianceTime' | 'parameters'
>

type ViolationTablePayload = {
  v: 1
  title: string
  meta?: ViolationReportMeta
  rows: QrViolationRow[]
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}

async function runStream(input: Uint8Array, transform: TransformStream<BufferSource, Uint8Array>): Promise<Uint8Array> {
  const output = new Blob([input as BlobPart]).stream().pipeThrough(transform)
  return new Uint8Array(await new Response(output).arrayBuffer())
}

/**
 * Builds the URL a scanned QR opens. The whole table is embedded (deflate-compressed),
 * so the scanned page shows the same data as the PDF. Returns null if it cannot fit in one QR.
 */
export async function buildViolationTableUrl(
  rows: StpMonthlyViolation[],
  title: string,
  meta: ViolationReportMeta,
  origin = window.location.origin,
): Promise<string | null> {
  const payload: ViolationTablePayload = {
    v: 1,
    title,
    meta,
    rows: rows.map(({ sn, stpName, capacity, district, omDepartment, date, nonComplianceTime, parameters }) => ({
      sn,
      stpName,
      capacity,
      district,
      omDepartment,
      date,
      nonComplianceTime,
      parameters,
    })),
  }
  const bytes = new TextEncoder().encode(JSON.stringify(payload))
  const compressed = await runStream(bytes, new CompressionStream('deflate-raw'))
  const url = `${origin}${VIOLATION_REPORT_PATH}?d=${bytesToBase64Url(compressed)}`
  return url.length <= MAX_QR_URL_LENGTH ? url : null
}

/** Link for tables too large to embed. The report page re-loads the same rows from the API. */
export function buildViolationReportLinkUrl(link: ViolationReportLink, origin = window.location.origin): string {
  const params = new URLSearchParams({
    plant: link.plantCode,
    from: link.from,
    to: link.to,
    title: link.title,
  })
  if (link.meta.rangeLabel) params.set('range', link.meta.rangeLabel)
  if (link.meta.address) params.set('address', link.meta.address)
  if (link.meta.badge) params.set('badge', link.meta.badge)
  params.set('tone', link.meta.badgeTone)
  if (link.query.trim()) params.set('q', link.query.trim())
  return `${origin}${VIOLATION_REPORT_PATH}?${params.toString()}`
}

/** Reads the `plant`/`from`/`to` query produced by {@link buildViolationReportLinkUrl}. */
export function parseViolationReportLink(params: URLSearchParams): ViolationReportLink | null {
  const plantCode = params.get('plant')
  const from = params.get('from')
  const to = params.get('to')
  if (!plantCode || !from || !to) return null
  return {
    plantCode,
    from,
    to,
    query: params.get('q') ?? '',
    title: params.get('title') ?? plantCode,
    meta: {
      rangeLabel: params.get('range') ?? '',
      address: params.get('address') || null,
      badge: params.get('badge') || null,
      badgeTone: params.get('tone') || 'brand',
    },
  }
}

/** Reads the `d` query value produced by {@link buildViolationTableUrl}. */
export async function parseViolationTablePayload(
  encoded: string | null,
): Promise<{ title: string; meta: ViolationReportMeta; rows: StpMonthlyViolation[] } | null> {
  if (!encoded) return null
  try {
    const bytes = await runStream(base64UrlToBytes(encoded), new DecompressionStream('deflate-raw'))
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as ViolationTablePayload
    if (parsed?.v !== 1 || !Array.isArray(parsed.rows)) return null
    return {
      title: parsed.title,
      meta: parsed.meta ?? { rangeLabel: '', address: null, badge: null, badgeTone: 'brand' },
      rows: parsed.rows.map((row, i) => ({
        ...row,
        id: `qr-${i + 1}`,
      })),
    }
  } catch {
    return null
  }
}
