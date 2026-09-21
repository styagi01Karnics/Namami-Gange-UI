import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/cctv-api': {
          target: env.VITE_CCTV_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cctv-api/, '/api'),
        },
        '/dashboard-api': {
          target: env.VITE_DASHBOARD_API_BASE_URL || 'http://45.195.229.15:18087',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dashboard-api/, '/api'),
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
