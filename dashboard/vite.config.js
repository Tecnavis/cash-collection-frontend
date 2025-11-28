import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,                         // allow external access
    allowedHosts: ['neo.tecnavis.in'],  // ✅ your custom domain
    // (optionally you can also add your Render URL here)
    // allowedHosts: ['neo.tecnavis.in', 'your-service.onrender.com'],
  },
})
