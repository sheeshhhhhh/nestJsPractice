import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'


const __dirname = path.resolve()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/api" : {
        target: 'http://localhost:3000/api',
      },
      // changeOrigin: true,
    }
  }
})
