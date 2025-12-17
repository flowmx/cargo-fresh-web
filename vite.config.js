import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/cargo-fresh/", // <--- AGREGA ESTA LÍNEA (nombre de tu repo entre barras)
})