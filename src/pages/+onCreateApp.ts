export { onCreateApp }

import type { PageContext } from 'vike/types'
import VueTheMask from 'vue-the-mask'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
import { plugin as VueInputAutowidth } from 'vue-input-autowidth'

// Import global styles
import 'vanilla-calendar-pro/styles/index.css'
import 'vue-sonner/style.css'
import 'aos/dist/aos.css'
import '@vuepic/vue-datepicker/dist/main.css'
import '../styles/style.css'
import '../styles/spinner.css'
import '../styles/transitions.css'
import '../styles/fonts.css'

function onCreateApp(pageContext: PageContext) {
  if (pageContext.isRenderingHead) {
    // Don't add the plugin when rendering <head> (see Lifecycle)
    return
  }
  const app = pageContext.app

  dayjs.locale('ru')
  dayjs.extend(customParseFormat)
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(relativeTime)
  dayjs.extend(calendar)
  dayjs.extend(updateLocale)

  dayjs.updateLocale('ru', {
    calendar: {
      sameDay: '[Сегодня]',
      nextDay: '[Завтра]',
      nextWeek: 'dddd',
      lastDay: '[Вчера]',
      lastWeek: 'D MMMM',
      sameElse: 'D MMMM',
    },
  })

  if (app) {
    if (pageContext.pinia) app.use(pageContext.pinia)
    app.use(VueInputAutowidth)
    app.use(VueTheMask as any)
  }
}
