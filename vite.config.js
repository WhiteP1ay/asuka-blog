import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/asuka/',
  server: {
    proxy: {
      '/api': {
        target: 'https://whitemeta.cn',
        changeOrigin: true,
      },
    },
  },
})
