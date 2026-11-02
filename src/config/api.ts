/**
 * Single source of truth for backend base URLs and endpoint paths.
 * Base URLs come from `.env` (VITE_*); the fallbacks below are used when a variable is unset.
 */

const API_HOST = import.meta.env.VITE_API_HOST ?? 'http://45.195.229.15'

export const API_BASE_URL = {
  cctv: import.meta.env.VITE_CCTV_API_URL ?? '/cctv-api',
  dashboard: import.meta.env.VITE_DASHBOARD_API_URL ?? `${API_HOST}:18087/api`,
  penalty: import.meta.env.VITE_PENALTY_API_URL ?? `${API_HOST}:18088/api`,
  role: import.meta.env.VITE_ROLE_API_URL ?? `${API_HOST}:8903/api`,
  user: import.meta.env.VITE_USER_API_URL ?? `${API_HOST}:8904/api`,
  // Served through the dev/nginx proxy because the upstream does not send CORS headers.
  stpDetails: import.meta.env.VITE_STP_DETAILS_API_URL ?? '/stp-details-api',
} as const

export const STREAM_BASE_URL = import.meta.env.VITE_STREAM_BASE ?? 'https://stream.karnics.com'

export const ENDPOINTS = {
  stpDetails: {
    list: '/stp-details',
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
