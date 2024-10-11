import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'


const __dirname = path.resolve()
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, process.cwd())

  const backendUrl = env.VITE_backendAPI_URL

  if(!backendUrl) throw new Error('Backend API URL is required')

  return { 
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    server: {
      proxy: {
        "/api" : {
          changeOrigin: true,
          target: backendUrl,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        "/socket.io": {
          changeOrigin: true,
          target: "ws://localhost:3000",
          ws: true,
        }
      }
    }
  }
})
