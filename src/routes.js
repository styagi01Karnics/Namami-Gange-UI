import {
  LayoutGrid,
  Building2,
  FileText,
  AlertTriangle,
  Users,
  Camera,
  Boxes,
  FileBarChart2,
  UserCog,
  History,
} from 'lucide-react'

/** Sidebar structure + route paths. Add a section here and it appears in the nav. */
export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
  { id: 'stp', label: 'STP Management', icon: Building2, path: '/stp-management' },
  { id: 'contracts', label: 'Contracts', icon: FileText, path: '/contracts' },
  { id: 'compliance', label: 'Compliance', icon: AlertTriangle, path: '/compliance' },
  { id: 'manpower', label: 'Manpower', icon: Users, path: '/manpower' },
  { id: 'cctv', label: 'CCTV Monitoring', icon: Camera, path: '/cctv-monitoring' },
  { id: 'inventory', label: 'Inventory', icon: Boxes, path: '/inventory' },
]

export const REPORT_ITEMS = [
  // Live Status is hidden until that section is ready.
  // Uncomment to bring it back — the route and page still exist.
  // { id: 'live', label: 'Live Status', icon: Radio, path: '/live-status' },
  {
    id: 'data-reports',
    label: 'Data Reports',
    icon: FileBarChart2,
    children: [
      { id: 'rep-contracts', label: 'Contracts', path: '/reports/contracts' },
      { id: 'rep-compliance', label: 'Compliance', path: '/reports/compliance' },
      { id: 'rep-manpower', label: 'Manpower', path: '/reports/manpower' },
      { id: 'rep-cctv', label: 'CCTV Monitoring', path: '/reports/cctv-monitoring' },
      { id: 'rep-inventory', label: 'Inventory', path: '/reports/inventory' },
    ],
  },
  { id: 'calibration', label: 'Remote Calibration', icon: UserCog, path: '/remote-calibration' },
  { id: 'logs', label: 'Transaction Logs', icon: History, path: '/transaction-logs' },
]

/**
 * Path → page heading. An array renders as a breadcrumb, with every entry but
 * the last shown muted.
 */
export const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/stp-management': 'STP Management',
  '/contracts': 'Contracts',
  '/compliance': 'Compliance',
  '/manpower': 'Manpower',
  '/cctv-monitoring': 'CCTV Monitoring',
  '/inventory': 'Inventory',
  '/live-status': 'Live Status',
  '/reports/contracts': ['Data Reports', 'Contracts'],
  '/reports/compliance': ['Data Reports', 'Compliance'],
  '/reports/manpower': ['Data Reports', 'Manpower'],
  '/reports/cctv-monitoring': ['Data Reports', 'CCTV Monitoring'],
  '/reports/inventory': ['Data Reports', 'Inventory'],
  '/remote-calibration': 'Remote Calibration',
  '/transaction-logs': 'Transaction Logs',
  '/settings': 'Settings',
}
