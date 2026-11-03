import { base64UrlToBytes, bytesToBase64Url, MAX_QR_URL_LENGTH, runStream } from './violationTableQr'

export const TABLE_REPORT_PATH = '/table-report'

export type TableReportColumn = { key: string; label: string; align?: string }

/** Colour a cell is drawn with on screen and in the PDF; the scanned page uses the same colour. */
export type TableReportTone = 'red' | 'green' | 'amber'

/** One table row: cell text keyed by column key, and `tones` giving the colour for highlighted cells. */
export type TableReportRow = { id?: string; cells: Record<string, string>; tones: Record<string, TableReportTone> }

export type TableReportMeta = {
  stpName: string | null
  rangeLabel: string
  address: string | null
  badge: string | null
  badgeTone: string
}

/** Query needed to reload an STP parameter table on the public QR report page directly from the API. */
export type TableReportLink = {
  site: string
  from: string
  to: string
  stream?: 'Effluent' | 'Influent' | 'Both'
  title: string
  meta: TableReportMeta
}

type TableReportPayload = {
  v: 1
  title: string
  meta: TableReportMeta
  columns: TableReportColumn[]
  rows: TableReportRow[]
}

/**
 * Builds the URL a scanned QR opens. The rows are embedded as they appear in the PDF,
 * so the scanned page shows the same data. Returns null if it cannot fit in one QR.
 */
export async function buildTableReportUrl(
  input: Omit<TableReportPayload, 'v'>,
  origin = window.location.origin,
): Promise<string | null> {
  const payload: TableReportPayload = { v: 1, ...input }
  const bytes = new TextEncoder().encode(JSON.stringify(payload))
  const compressed = await runStream(bytes, new CompressionStream('deflate-raw'))
  const url = `${origin}${TABLE_REPORT_PATH}?d=${bytesToBase64Url(compressed)}`
  return url.length <= MAX_QR_URL_LENGTH ? url : null
}

/** Link for STP parameter tables so the QR report page loads the records directly from the API. */
export function buildTableReportLinkUrl(link: TableReportLink, origin = window.location.origin): string {
  const params = new URLSearchParams({
    site: link.site,
    from: link.from,
    to: link.to,
    title: link.title,
  })
  if (link.stream) params.set('stream', link.stream)
  if (link.meta.stpName) params.set('stp', link.meta.stpName)
  if (link.meta.rangeLabel) params.set('range', link.meta.rangeLabel)
  if (link.meta.address) params.set('address', link.meta.address)
  if (link.meta.badge) params.set('badge', link.meta.badge)
  if (link.meta.badgeTone) params.set('tone', link.meta.badgeTone)
  return `${origin}${TABLE_REPORT_PATH}?${params.toString()}`
}

/** Reads the `site`/`from`/`to` query produced by {@link buildTableReportLinkUrl}. */
export function parseTableReportLink(params: URLSearchParams): TableReportLink | null {
  const site = params.get('site')
  const from = params.get('from')
  const to = params.get('to')
  if (!site || !from || !to) return null
  const rawStream = params.get('stream')
  const stream =
    rawStream === 'Influent' || rawStream === 'Both' || rawStream === 'Effluent'
      ? rawStream
      : 'Effluent'
  return {
    site,
    from,
    to,
    stream,
    title: params.get('title') ?? 'STP Parameter Compliance Report',
    meta: {
      stpName: params.get('stp') || null,
      rangeLabel: params.get('range') ?? '',
      address: params.get('address') || null,
      badge: params.get('badge') || null,
      badgeTone: params.get('tone') || 'brand',
    },
  }
}

/** Reads the `d` query value produced by {@link buildTableReportUrl}. */
export async function parseTableReportPayload(encoded: string | null): Promise<Omit<TableReportPayload, 'v'> | null> {
  if (!encoded) return null
  try {
    const bytes = await runStream(base64UrlToBytes(encoded), new DecompressionStream('deflate-raw'))
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as TableReportPayload
    if (parsed?.v !== 1 || !Array.isArray(parsed.columns) || !Array.isArray(parsed.rows)) return null
    return {
      title: parsed.title,
      meta: parsed.meta,
      columns: parsed.columns,
      rows: parsed.rows.map((row, i) => ({ ...row, id: `qr-${i + 1}` })),
    }
  } catch {
    return null
  }
}
