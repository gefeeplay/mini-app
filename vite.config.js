import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fitness-app-auth-api.fly.dev', // адрес бэкенда
        changeOrigin: true, // подменяет Origin на целевой
        rewrite: (path) => path.replace(/^\/api/, '/api'), 
      },
    },
  },
})
