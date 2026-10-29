import type { ExportMeta } from '../components/export/exportMeta'

export const MANPOWER_REPORT_PATH = '/manpower-report'

export type ManpowerReportMeta = Pick<ExportMeta, 'address' | 'badge' | 'badgeTone'>

export type ManpowerReportLink = {
  /** Seed passed to buildTodayManpower, so the scanned page rebuilds the same roster. */
  seed: string
  stpName: string
  dateLabel: string
  meta: ManpowerReportMeta
}

/** Link the manpower QR opens: enough to rebuild the same staff rows and PDF header. */
export function buildManpowerReportUrl(link: ManpowerReportLink, origin = window.location.origin): string {
  const params = new URLSearchParams({
    seed: link.seed,
    name: link.stpName,
    date: link.dateLabel,
    tone: link.meta.badgeTone,
  })
  if (link.meta.address) params.set('address', link.meta.address)
  if (link.meta.badge) params.set('badge', link.meta.badge)
  return `${origin}${MANPOWER_REPORT_PATH}?${params.toString()}`
}

export function parseManpowerReportLink(params: URLSearchParams): ManpowerReportLink | null {
  const seed = params.get('seed')
  const stpName = params.get('name')
  const dateLabel = params.get('date')
  if (!seed || !stpName || !dateLabel) return null
  return {
    seed,
    stpName,
    dateLabel,
    meta: {
      address: params.get('address'),
      badge: params.get('badge'),
      badgeTone: params.get('tone') ?? 'brand',
    },
  }
}
