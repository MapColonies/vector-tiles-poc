import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mapbox: resolve(__dirname, 'mapbox.html'),
        arcgis: resolve(__dirname, 'arcgis.html'),
        giro: resolve(__dirname, 'giro.html'),
      },
    },
  },
})