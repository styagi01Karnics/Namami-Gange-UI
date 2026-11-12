/**
 * Single source of truth for backend base URLs and endpoint paths.
 * Base URLs come from `.env` (VITE_*); the fallbacks below are used when a variable is unset.
 */

export const API_BASE_URL = {
  cctv: import.meta.env.VITE_CCTV_API_URL ?? '/cctv-api',
  // Same-origin proxy paths (see nginx.conf / vite.config.ts). Direct http:// IP calls are blocked on the https site.
  dashboard: import.meta.env.VITE_DASHBOARD_API_URL ?? '/dashboard-api',
  penalty: import.meta.env.VITE_PENALTY_API_URL ?? '/penalty-api',
  role: import.meta.env.VITE_ROLE_API_URL ?? '/role-api',
  user: import.meta.env.VITE_USER_API_URL ?? '/user-api',
  // Same-origin proxy (nginx / vite). A direct http:// call is blocked as mixed content on the https site.
  auth: import.meta.env.VITE_AUTH_API_URL ?? '/auth-api',
  // Served through the dev/nginx proxy because the upstream does not send CORS headers.
  stpDetails: import.meta.env.VITE_STP_DETAILS_API_URL ?? '/stp-details-api',
  // STP count source (catalog/stp-data-query). Proxied to avoid mixed-content blocks.
  stpDataQuery: import.meta.env.VITE_STP_DATA_QUERY_API_URL ?? '/stp-data-query-api',
  // STP monitoring data service (8909) exposing snapshots per site enum
  stpMonitoring: import.meta.env.VITE_STP_MONITORING_API_URL ?? '/stp-monitoring-api',
} as const

export const STREAM_BASE_URL = import.meta.env.VITE_STREAM_BASE ?? 'https://stream.karnics.com'

export const ENDPOINTS = {
  stpMonitoring: {
    latest: (site: string) => `/stp/${encodeURIComponent(site)}/latest`,
    readings: (site: string) => `/stp/${encodeURIComponent(site)}/readings`,
  },
  stpDetails: {
    list: '/stp-details',
  },
  stpDataQuery: {
    list: '/stp-details',
  },
  manpower: {
    byStp: (stpId: string | number) => `/manpower/stp/${encodeURIComponent(stpId)}`,
  },
  cctv: {
    cameras: '/cameras',
    streamStart: (cameraId: string | number) => `/stream/start/${cameraId}`,
    streamStop: (cameraId: string | number) => `/stream/stop/${cameraId}`,
    streamHealth: '/stream/health',
    recordings: '/recordings',
    playbackStart: '/playback/start',
    feed: '/feed',
  },
  dashboard: {
    plants: '/dashboard/plants',
    activeStatus: '/dashboard/active-status',
    latestViolations: '/dashboard/latest-violations',
    plantResource: (plantCode: string, resource: 'live' | 'inlet' | 'outlet') =>
      `/dashboard/${encodeURIComponent(plantCode)}/${resource}`,
  },
  penalty: {
    summary: '/penalty/summary',
    vendors: '/penalty/vendors',
    occurrences: '/penalty/occurrences',
  },
  roles: {
    list: '/roles',
    catalog: '/roles/catalog',
    byId: (id: string | number) => `/roles/${encodeURIComponent(id)}`,
    users: (id: string | number) => `/roles/${encodeURIComponent(id)}/users`,
  },
  users: {
    list: '/users',
    count: '/users/count',
    byId: (id: string | number) => `/users/${encodeURIComponent(id)}`,
    auditLogs: '/audit-logs',
  },
} as const
