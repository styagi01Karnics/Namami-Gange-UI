import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/** Vite 8's ProxyServer type does not expose EventEmitter `.on` under tsc. */
type DashboardProxy = {
  on: (
    event: 'proxyRes',
    listener: (
      proxyRes: { headers: Record<string, unknown> },
      req: unknown,
      res: { setHeader: (name: string, value: string) => void },
    ) => void,
  ) => void
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/cctv-api': {
          target: env.VITE_CCTV_API_BASE_URL || 'http://localhost:8905',
          changeOrigin: true,
          timeout: 0,
          proxyTimeout: 0,
          rewrite: (path) => path.replace(/^\/cctv-api/, '/api'),
        },
        '/dashboard-api': {
          target: env.VITE_DASHBOARD_API_BASE_URL || 'http://45.195.229.15:18087',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dashboard-api/, '/api'),
          // Keep MQTT SSE streams open (no proxy idle timeout / buffering).
          timeout: 0,
          proxyTimeout: 0,
          configure: (proxy) => {
            ;(proxy as unknown as DashboardProxy).on('proxyRes', (proxyRes, _req, res) => {
              const contentType = String(proxyRes.headers['content-type'] ?? '')
              if (contentType.includes('text/event-stream')) {
                res.setHeader('Cache-Control', 'no-cache, no-transform')
                res.setHeader('X-Accel-Buffering', 'no')
              }
            })
          },
        },
        '/penalty-api': {
          target: env.VITE_PENALTY_API_BASE_URL || 'http://45.195.229.15:18088',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/penalty-api/, '/api'),
        },
      },
    },
  }
})
