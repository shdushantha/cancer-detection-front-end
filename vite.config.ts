import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'VITE_API_URL=https://shdushantha-cancer-detection-api.hf.space',
        changeOrigin: true,
      },
    },
  },
})
