import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import compressPlugin from 'vite-plugin-compression'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
    },
  },
  plugins: [
    vue(),
    vike({
      prerender: {
        partial: true,
      },
    }),
    compressPlugin({
      ext: '.gz',
      deleteOriginFile: false,
    }),
    tailwindcss(),
    vueDevTools(),
  ],
})
