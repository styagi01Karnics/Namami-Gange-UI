/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ATTENDANCE_API_URL: string
  readonly VITE_STP_SITE_INFO_API_URL: string
  readonly VITE_STP_ID: string
  readonly VITE_GANGAPULSE_API_TOKEN: string
  readonly VITE_CCTV_API_URL: string
  readonly VITE_CCTV_API_BASE_URL: string
  readonly VITE_STREAM_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
