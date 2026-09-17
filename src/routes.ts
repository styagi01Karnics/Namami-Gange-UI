import BuildingIcon from './components/ui/BuildingIcon'
import CctvIcon from './components/ui/CctvIcon'
import DashboardIcon from './components/ui/DashboardIcon'
import LiveDelayIcon from './components/ui/LiveDelayIcon'
import ReportsIcon from './components/ui/ReportsIcon'
import SupportIcon from './components/ui/SupportIcon'
import TeamIcon from './components/ui/TeamIcon'
import { stpSectionTabs } from './data/mockData'
import type { IconComponent, PageTitle } from './types'

export type MenuItem = {
  id: string
  label: string
  icon: IconComponent
  path: string
  match?: string
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

/** Sidebar structure + route paths. Add a section here and it appears in the nav. */
export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
  // No sidebar dropdown: the sections are tabs inside the STP Management page.
  { id: 'stp', label: 'STP Management', icon: BuildingIcon, path: '/stp-management' },
  { id: 'cctv', label: 'Live Camera Feed', icon: CctvIcon, path: '/cctv-monitoring' },
  { id: 'support', label: 'Support Tickets', icon: SupportIcon, path: '/support-tickets' },
  { id: 'support-admin', label: 'Support Tickets Admin', icon: SupportIcon, path: '/support-tickets-admin' },
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
  { label: 'Manpower', path: '/reports/manpower' },
  { label: 'Inventory', path: '/reports/inventory' },
  { label: 'CCTV', path: '/reports/cctv-monitoring' },
  { label: 'Contracts', path: '/reports/contracts' },
  { label: 'Compliance', path: '/reports/compliance' },
]

export const REPORT_ITEMS: MenuItem[] = [
  // Live Status is hidden until that section is ready.
  // Uncomment to bring it back — the route and page still exist.
  // { id: 'live', label: 'Live Status', icon: Activity, path: '/live-status' },
  { id: 'live-delay', label: 'Live Delay Offline', icon: LiveDelayIcon, path: '/live-delay-offline' },
  // No sidebar dropdown: the reports are tabs inside the Data Reports page, so
  // the entry lands on the first tab and stays lit for every /reports path.
  {
    id: 'data-reports',
    label: 'Data Reports',
    icon: ReportsIcon,
    path: REPORT_TABS[0].path,
    match: '/reports',
  },
  { id: 'team', label: 'Team Management', icon: TeamIcon, path: '/team-management' },
  // Remote Calibration and Transaction Logs are hidden — the same content is
  // reachable as tabs inside STP Management. Uncomment to bring them back;
  // the routes and pages still exist.
  // { id: 'calibration', label: 'Remote Calibration', icon: UserCog, path: '/remote-calibration' },
  // { id: 'logs', label: 'Transaction Logs', icon: History, path: '/transaction-logs' },
]

/**
 * Path → page heading. An array renders as a breadcrumb, with every entry but
 * the last shown muted.
 */
export const PAGE_TITLES: Record<string, PageTitle> = {
  '/dashboard': 'Dashboard',
  '/stp-management': 'STP Management',
  ...Object.fromEntries(stpSectionTabs.map((label) => [stpTabPath(label), ['STP Management', label]])),
  '/contracts': 'Contracts',
  '/compliance': 'Compliance',
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
