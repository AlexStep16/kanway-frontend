import compressPlugin from 'vite-plugin-compression'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@peterbud/nuxt-query', '@pinia/nuxt', '@vueuse/nuxt', 'shadcn-nuxt', 'nuxt-svgo'],
  imports: {
    dirs: ['~/composables/**', '~/utils/**', '~/helpers/**'],
  },
  spaLoadingTemplate: true,
  runtimeConfig: {
    public: {
      serverApiUrl: process.env.SERVER_API_URL || 'https://kanway.ru/api',
      serverBaseUrl: process.env.SERVER_BASE_URL || 'https://kanway.ru',
      yandexUserId: process.env.YANDEX_CLIENT_ID || '3b999a918afb4a9085e6238f30ae3df5',
      yandexRedirectUri:
        process.env.YANDEX_REDIRECT_URI || 'https://kanway.ru/yandex/suggest/token',
      vkUserId: process.env.VK_CLIENT_ID || '54569329',
      vkRedirectUri: process.env.VK_REDIRECT_URI || 'https://kanway.ru/vk/suggest/token',
    },
  },
  routeRules: {
    '/': { ssr: false, prerender: true },
    '/workspace/**': { ssr: false },
    '/auth/**': { ssr: false },
    '/privacy': { ssr: false },
    '/terms': { ssr: false },
    '/cookies': { ssr: false },
    '/payment/**': { ssr: false },
  },
  svgo: {
    dts: true,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },
  app: {
    head: {
      title: 'Kanway | AI-агент для управления проектами',
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
        },
        {
          name: 'description',
          content:
            'Персональный AI-агент для управления проектами. Создавайте задачи голосом или текстом, организуйте проекты и повышайте свою продуктивность. Попробуйте бесплатно!',
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'apple-mobile-web-app-title', content: 'Kanway' },
        { name: 'application-name', content: 'Kanway' },
        { name: 'msapplication-TileColor', content: '#2d89ef' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'canonical', href: 'https://kanway.ru' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicon/apple-touch-icon.png?v=20260624',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg?v=20260624' },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon/favicon-96x96.png?v=20260624',
          sizes: '96x96',
        },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico?v=20260624' },
        { rel: 'manifest', href: '/site.webmanifest?v=20260624' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg?v=20260624', color: '#3b82f6' },
      ],
      script: [
        {
          src: 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js',
          async: true,
          defer: true,
        },
        {
          src: 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js',
          async: true,
          defer: true,
        },
        { src: 'https://cdn.jsdelivr.net/npm/@floating-ui/core@1.7.3' },
        { src: 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.7.3' },
        // Твой локальный скрипт метрики из папки public
        { src: '/initYametrika.js' },
      ],
      noscript: [
        {
          innerHTML:
            '<div><img src="https://mc.yandex.ru/watch/108746868" style="position:absolute; left:-9999px;" alt="" /></div>',
        },
      ],
    },
  },
  css: [
    'vue-sonner/style.css',
    'aos/dist/aos.css',
    '@vuepic/vue-datepicker/dist/main.css',
    '~/assets/styles/style.css',
    '~/assets/styles/spinner.css',
    '~/assets/styles/transitions.css',
    '~/assets/styles/fonts.css',
  ],
  vite: {
    plugins: [
      compressPlugin({
        ext: '.gz',
        deleteOriginFile: false,
      }),
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        '@vee-validate/zod',
        'vee-validate',
        'zod',
        'lodash',
        'p-queue',
        'uuid',
        'vue-sonner',
        '@tanstack/vue-query',
        'axios',
        'dayjs', // CJS
        'dayjs/plugin/relativeTime', // CJS
        'dayjs/plugin/utc', // CJS
        'dayjs/plugin/timezone', // CJS
        'dayjs/plugin/updateLocale', // CJS
        'dayjs/plugin/calendar', // CJS
        'dayjs/plugin/isBetween', // CJS
        'dayjs/plugin/isoWeek', // CJS
        'dayjs/plugin/customParseFormat', // CJS
        'dayjs/locale/ru', // CJS
        '@lucide/vue',
        'reka-ui',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
        'aos', // CJS
        'plyr',
        'showdown', // CJS
        '@frsource/autoresize-textarea',
        'vue-input-autowidth',
        'vue-the-mask',
      ],
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        strict: true,
      },
    },
  },
})
