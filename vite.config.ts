import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import compressPlugin from 'vite-plugin-compression'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import svgLoader from 'vite-svg-loader'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@views': path.resolve(__dirname, './src/views'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@api': path.resolve(__dirname, './src/api'),
      '@services': path.resolve(__dirname, './src/services'),
      '@enums': path.resolve(__dirname, './src/enums'),
      '@models': path.resolve(__dirname, './src/models'),
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'chrome61',
  },
  plugins: [
    vue(),
    svgLoader(),
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
    legacy({
      targets: ['defaults', 'not IE 11', 'iOS >= 10', 'Safari >= 10'],
      renderLegacyChunks: true,
    }),
  ],
})
