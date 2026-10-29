import { base64UrlToBytes, bytesToBase64Url, MAX_QR_URL_LENGTH, runStream } from './violationTableQr'

export const TABLE_REPORT_PATH = '/table-report'

export type TableReportColumn = { key: string; label: string; align?: string }

/** Colour a cell is drawn with on screen and in the PDF; the scanned page uses the same colour. */
export type TableReportTone = 'red' | 'green' | 'amber'

/** One table row: cell text keyed by column key, and `tones` giving the colour for highlighted cells. */
export type TableReportRow = { id?: string; cells: Record<string, string>; tones: Record<string, TableReportTone> }

export type TableReportMeta = {
  rangeLabel: string
  address: string | null
  badge: string | null
  badgeTone: string
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
