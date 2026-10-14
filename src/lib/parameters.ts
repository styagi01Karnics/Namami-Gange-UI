/**
 * Formats water quality parameter names into standard scientific notation,
 * removing any redundant 'Outlet' or 'Inlet' qualifiers.
 *
 * Supported formats:
 * - BOD
 * - COD
 * - TSS
 * - pH
 * - Temperature
 * - NO₃-N
 * - NH₄-N
 */
export function formatParameterName(label: string): string {
  if (!label) return ''

  const cleaned = label
    .replace(/[_\s-]+(outlet|inlet)\b/gi, '')
    .replace(/\b(outlet|inlet)[_\s-]+/gi, '')
    .trim()

  const normalized = cleaned.toLowerCase().replace(/[^a-z0-9]/g, '')

  switch (normalized) {
    case 'bod':
      return 'BOD'
    case 'cod':
      return 'COD'
    case 'tss':
      return 'TSS'
    case 'ph':
      return 'pH'
    case 'temp':
    case 'temperature':
      return 'Temperature'
    case 'no3n':
    case 'no3':
      return 'NO₃-N'
    case 'nh4n':
    case 'nh4':
      return 'NH₄-N'
    default:
      if (/^no[₃3]-?n$/i.test(cleaned)) return 'NO₃-N'
      if (/^nh[₄4]-?n$/i.test(cleaned)) return 'NH₄-N'
      return cleaned
  }
}
