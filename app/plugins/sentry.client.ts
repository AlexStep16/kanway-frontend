import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: 'https://4adcf5554c18bb49117bf9f9c0bdab29@o4510595293249536.ingest.de.sentry.io/4512140397903952',
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,

    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
  })
})
