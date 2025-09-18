import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'vanilla-calendar-pro/styles/index.css'

import('preline/dist/index.js')

import $ from 'jquery'
import _ from 'lodash'
import noUiSlider from 'nouislider'
import 'datatables.net'
import 'dropzone/dist/dropzone-min.js'
import * as VanillaCalendarPro from 'vanilla-calendar-pro'

window._ = _
window.$ = $
window.jQuery = $
window.DataTable = $.fn.dataTable
window.noUiSlider = noUiSlider
window.VanillaCalendarPro = VanillaCalendarPro

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
