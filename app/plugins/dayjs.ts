import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/ru'

export default defineNuxtPlugin(() => {
  dayjs.locale('ru')
  dayjs.extend(customParseFormat)
  dayjs.extend(utc)
  dayjs.extend(isoWeek)
  dayjs.extend(isBetween)
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

  return {
    provide: {
      dayjs
    }
  }
})