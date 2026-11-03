import BuildingIcon from './components/ui/BuildingIcon'
import CctvIcon from './components/ui/CctvIcon'
import DashboardIcon from './components/ui/DashboardIcon'
import ReportsIcon from './components/ui/ReportsIcon'
import SettingsIcon from './components/ui/SettingsIcon'
import SupportIcon from './components/ui/SupportIcon'
import TeamIcon from './components/ui/TeamIcon'
import { stpSectionTabs } from './data/mockData'
import type { IconComponent, PageTitle } from './types'

/**
 * What a route or menu entry needs. `'any'` means at least one grant in any
 * module. `can` matches AuthContext: `can(module)` or `can(module, key)`.
 */
export type Access = { module: string; key?: string } | 'any'
export type CanFn = (moduleId: string, key?: string) => boolean

export type MenuItem = {
  id: string
  label: string
  icon: IconComponent
  path: string
  match?: string
  access?: Access
}

export type ReportTab = {
  label: string
  path: string
}

const slugify = (label: string) => label.toLowerCase().replace(/\s+/g, '-')

/** Deep link to a section tab inside STP Management, e.g. '/stp-management/manpower'. */
export const stpTabPath = (label) => `/stp-management/${slugify(label)}`
export const stpTabFromSlug = (slug: string) => stpSectionTabs.find((label) => slugify(label) === slug)
export const STP_TAB_PATHS = stpSectionTabs.map(stpTabPath)

/** Dashboard → STP Management › Compliance, with plant pre-selected in the dropdown. */
export const stpCompliancePath = (plantCode: string) =>
  `${stpTabPath('Violation')}?plant=${encodeURIComponent(plantCode)}`

/** Dashboard Live Data → STP Management › Realtime Parameter Values, plant synced. */
export const stpRealtimePath = (plantCode: string) =>
  `/stp-management?plant=${encodeURIComponent(plantCode)}&focus=realtime`

/** Module-level access used by the sidebar and route guard. Keys match the role permission catalog. */
export const ACCESS: Record<string, Access> = {
  dashboard: { module: 'dashboard' },
  stp: { module: 'stp' },
  cctv: { module: 'cctv' },
  support: { module: 'support' },
  supportAdmin: { module: 'support', key: 'Manage Tickets' },
  reports: { module: 'reports' },
  team: { module: 'team' },
  settings: { module: 'settings' },
}

const PERMISSION_MODULES = ['dashboard', 'stp', 'cctv', 'support', 'reports', 'team', 'settings']
const STP_KEYS = ['Manpower', 'Inventory', 'CCTV', 'Remote Calibration', 'Transaction Logs', 'Contracts', 'Compliance', 'Billing']

/** Sidebar structure + route paths. Add a section here and it appears in the nav. */
export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/dashboard', access: ACCESS.dashboard },
  // No sidebar dropdown: the sections are tabs inside the STP Management page.
  { id: 'stp', label: 'STP Management', icon: BuildingIcon, path: '/stp-management', access: ACCESS.stp },
  { id: 'cctv', label: 'Live Camera Feed', icon: CctvIcon, path: '/cctv-monitoring', access: ACCESS.cctv },
  { id: 'support', label: 'Support Tickets', icon: SupportIcon, path: '/support-tickets', access: ACCESS.support },
  { id: 'support-admin', label: 'Support Tickets Admin', icon: SupportIcon, path: '/support-tickets-admin', access: ACCESS.supportAdmin },
  // Contracts, Compliance, Manpower and Inventory are hidden — the same content
  // is reachable as tabs inside STP Management. Uncomment to bring them back;
  // the routes and pages still exist.
  // { id: 'contracts', label: 'Contracts', icon: FileText, path: '/contracts' },
  // { id: 'compliance', label: 'Compliance', icon: AlertTriangle, path: '/compliance' },
  // { id: 'manpower', label: 'Manpower', icon: Users, path: '/manpower' },
  // { id: 'inventory', label: 'Inventory', icon: Boxes, path: '/inventory' },
]

/**
 * Tab strip across the Data Reports pages. The labels are section names, so
 * they pick up the same accent colour and icon as the STP Management tabs.
 */
export const REPORT_TABS: ReportTab[] = [
  { label: 'STP Parameter', path: '/reports/parameters' },
  { label: 'CCTV', path: '/reports/cctv-monitoring' },
  { label: 'Manpower', path: '/reports/manpower' },
  { label: 'Inventory', path: '/reports/inventory' },
  { label: 'Violation', path: '/reports/compliance' },
]

export const REPORT_ITEMS: MenuItem[] = [
  // Live Status / Live Delay Offline are hidden until those sections are ready.
  // Uncomment to bring them back — the routes and pages still exist.
  // { id: 'live', label: 'Live Status', icon: Activity, path: '/live-status' },
  // { id: 'live-delay', label: 'Live Delay Offline', icon: LiveDelayIcon, path: '/live-delay-offline' },
  // No sidebar dropdown: the reports are tabs inside the Data Reports page, so
  // the entry lands on the first tab and stays lit for every /reports path.
  {
    id: 'data-reports',
    label: 'Data Reports',
    icon: ReportsIcon,
    path: REPORT_TABS[0].path,
    match: '/reports',
    access: ACCESS.reports,
  },
  { id: 'team', label: 'Team Management', icon: TeamIcon, path: '/team-management', access: ACCESS.team },
  // Remote Calibration and Transaction Logs are hidden — the same content is
  // reachable as tabs inside STP Management. Uncomment to bring them back;
  // the routes and pages still exist.
  // { id: 'calibration', label: 'Remote Calibration', icon: UserCog, path: '/remote-calibration' },
  // { id: 'logs', label: 'Transaction Logs', icon: History, path: '/transaction-logs' },
]

export const SETTINGS_ITEM: MenuItem = {
  id: 'settings',
  label: 'Settings',
  icon: SettingsIcon,
  path: '/settings',
  access: ACCESS.settings,
}

const TOP_LEVEL_ACCESS: Record<string, Access> = {
  '/dashboard': ACCESS.dashboard,
  '/stp-management': ACCESS.stp,
  '/cctv-monitoring': ACCESS.cctv,
  '/support-tickets': ACCESS.support,
  '/support-tickets-admin': ACCESS.supportAdmin,
  '/team-management': ACCESS.team,
  '/settings': ACCESS.settings,
  '/contracts': { module: 'stp', key: 'Contracts' },
  '/compliance': { module: 'stp', key: 'Compliance' },
  '/manpower': { module: 'stp', key: 'Manpower' },
  '/inventory': { module: 'stp', key: 'Inventory' },
  '/remote-calibration': { module: 'stp', key: 'Remote Calibration' },
  '/transaction-logs': { module: 'stp', key: 'Transaction Logs' },
}

const REPORT_PATH_ACCESS: Record<string, Access> = {
  '/reports/parameters': ACCESS.reports,
  '/reports/cctv-monitoring': { module: 'reports', key: 'CCTV' },
  '/reports/manpower': { module: 'reports', key: 'Manpower' },
  '/reports/inventory': { module: 'reports', key: 'Inventory' },
  '/reports/compliance': { module: 'reports', key: 'Compliance' },
}

/** Landing order used after login when the default page is not allowed. */
const LANDING_PATHS = [
  '/dashboard',
  '/stp-management',
  '/cctv-monitoring',
  '/support-tickets',
  '/reports/parameters',
  '/team-management',
  '/settings',
]

/** Access needed to open a pathname. Unknown paths need any grant. */
export const requiredAccessFor = (pathname: string): Access => {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path.startsWith('/stp-management/')) {
    const label = stpTabFromSlug(path.slice('/stp-management/'.length))
    return label && STP_KEYS.includes(label) ? { module: 'stp', key: label } : ACCESS.stp
  }
  if (path === '/support-tickets-admin' || path.startsWith('/support-tickets-admin/')) return ACCESS.supportAdmin
  if (path.startsWith('/support-tickets/')) return ACCESS.support
  if (path.startsWith('/reports')) return REPORT_PATH_ACCESS[path] ?? ACCESS.reports

  return TOP_LEVEL_ACCESS[path] ?? 'any'
}

export const canAccess = (access: Access | undefined, can: CanFn): boolean => {
  if (!access) return true
  if (access === 'any') return PERMISSION_MODULES.some((moduleId) => can(moduleId))
  return can(access.module, access.key)
}

/** First page the user may open, used when the current page is not allowed. */
export const firstAllowedPath = (can: CanFn): string | undefined =>
  LANDING_PATHS.find((path) => canAccess(requiredAccessFor(path), can))


/**
 * Path → page heading. An array renders as a breadcrumb, with every entry but
 * the last shown muted.
 */
export const PAGE_TITLES: Record<string, PageTitle> = {
  '/dashboard': 'Dashboard',
  '/stp-management': 'STP Management',
  ...Object.fromEntries(stpSectionTabs.map((label) => [stpTabPath(label), ['STP Management', label]])),
  '/contracts': 'Contracts',
  '/compliance': 'Violation',
  '/manpower': 'Manpower',
  '/cctv-monitoring': 'Live Camera Feed',
  '/support-tickets': 'Support Tickets',
  '/support-tickets-admin': 'Support Tickets',
  '/live-delay-offline': 'Live Delay Offline',
  '/inventory': 'Inventory',
  '/live-status': 'Live Status',
  // Every report shares one heading — the tab strip says which one is open.
  ...Object.fromEntries(REPORT_TABS.map((t) => [t.path, 'Data Reports'])),
  '/team-management': 'Team Management',
  '/remote-calibration': 'Remote Calibration',
  '/transaction-logs': 'Transaction Logs',
  '/settings': 'Settings',
}

/** Ticket detail pages carry an id in the path, so they need a pattern. */
const TICKET_DETAIL_PATHS = [/^\/support-tickets\/[^/]+$/, /^\/support-tickets-admin\/[^/]+$/]

/**
 * Heading for a pathname. Crumbs are plain strings, except where an earlier
 * crumb links back to its list page.
 */
export const pageTitle = (pathname: string): PageTitle => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]

  if (TICKET_DETAIL_PATHS.some((re) => re.test(pathname))) {
    const list = pathname.slice(0, pathname.lastIndexOf('/'))
    return [{ label: 'Support Tickets', to: list }, 'Ticket Details']
  }

  return 'Dashboard'
}
