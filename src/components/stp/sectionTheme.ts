import {
  BillingGlyph,
  CameraGlyph,
  DocumentGlyph,
  HistoryGlyph,
  InventoryGlyph,
  ManpowerGlyph,
  OperatorGlyph,
  WarningGlyph,
} from '../ui/sectionIcons'

/**
 * Per-section identity for STP Management: one accent colour drives the tab
 * pill, the heading tile and the heading text, so a section is recognisable
 * before you read it.
 *
 *   tint  accent at 10% — the resting tab pill
 *   wash  accent at 12% — the heading icon tile
 */
export const SECTION_THEME = {
  Manpower: {
    color: '#1668E3',
    icon: ManpowerGlyph,
    blurb: 'Monitor staff strength, attendance, and availability across the STP.',
  },
  Inventory: {
    color: '#1668E3',
    icon: InventoryGlyph,
    blurb: 'Monitor and manage STP inventory, stock levels, and equipment availability',
  },
  CCTV: {
    color: '#1668E3',
    icon: CameraGlyph,
    blurb: 'Monitor CCTV cameras across STPs and track their current operational status.',
  },
  'Remote Calibration': {
    color: '#1668E3',
    icon: OperatorGlyph,
    blurb: 'Monitor and manage remote calibration activities to ensure accurate STP measurements.',
  },
  'Transaction Logs': {
    color: '#1668E3',
    icon: HistoryGlyph,
    blurb: 'Track and review system activities, data updates, and transaction records across STPs',
  },
  Contracts: {
    color: '#1668E3',
    icon: DocumentGlyph,
    blurb: 'Monitor and manage STP contracts, timelines, and contractual obligations.',
  },
  Compliance: {
    color: '#1668E3',
    icon: WarningGlyph,
    blurb: 'Monitor STP compliance, regulatory requirements, and operational adherence',
  },
  Billing: {
    color: '#1668E3',
    icon: BillingGlyph,
    blurb: 'Track STP billing, payment requests, penalties, and settlement status',
  },
}

export const sectionTheme = (tab: string) => SECTION_THEME[tab] ?? SECTION_THEME.Manpower

/** Accent at a given opacity, as an 8-digit hex suffix. */
export const tint = (color: string, alpha: number) =>
  `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase()}`
