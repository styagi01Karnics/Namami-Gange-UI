/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CCTV_API_URL?: string
  readonly VITE_CCTV_API_BASE_URL?: string
  readonly VITE_STREAM_BASE?: string
  readonly VITE_STP_14MLD_CAMERA_1?: string
  readonly VITE_STP_14MLD_CAMERA_2?: string
  readonly VITE_DASHBOARD_API_URL?: string
  readonly VITE_DASHBOARD_API_BASE_URL?: string
  readonly VITE_PENALTY_API_URL?: string
  readonly VITE_PENALTY_API_BASE_URL?: string
  readonly VITE_STP_LIVE_POLL_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type MediaMtxReaderOptions = {
  url: string
  onError?: (err: unknown) => void
  onTrack?: (event: RTCTrackEvent) => void
}

type MediaMtxWebRTCReader = {
  close: () => void
}

type MediaMtxWebRTCReaderConstructor = new (options: MediaMtxReaderOptions) => MediaMtxWebRTCReader

interface Window {
  MediaMTXWebRTCReader?: MediaMtxWebRTCReaderConstructor
}
