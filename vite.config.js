import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': {
        target: 'https://caju-form-a90be5eacb3a.herokuapp.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
