// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 4173, // Optional: Vite default preview port
    host: true, // Needed to allow external access
    allowedHosts: ['neo2.tecnavis.com'], // ✅ Add your domain here
  },
})
