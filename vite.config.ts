
import { defineConfig } from 'vite'
import path from "path"

export default defineConfig({
  base: './', //  esto es lo que falta para producción
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
