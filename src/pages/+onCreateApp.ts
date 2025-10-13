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
import 'vanilla-calendar-pro/styles/index.css'

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
      sameDay: '[Сегодня] HH:mm',
      nextDay: '[Завтра] HH:mm',
      nextWeek: 'dddd HH:mm',
      lastDay: '[Вчера] HH:mm',
      lastWeek: 'DD MMMM HH:mm',
      sameElse: 'DD MMMM HH:mm',
    },
  })

  if (app) {
    app.use(VueTheMask as any)
  }
}
