<script setup lang="ts">
import { Clock, X } from 'lucide-vue-next'
import { datepickerOptions } from '@helpers/datepickerOptions'
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { HSDatepicker, HSDropdown, HSStaticMethods } from 'preline'
import { TaskModel } from '@models/TaskModel'
import { getTimeInReadableFormat } from '@utils/date'
import dayjs from 'dayjs'
import { Nullable } from '@/types/utils'

const props = defineProps<{
  task: TaskModel
}>()

const emit = defineEmits<{
  (e: 'clearTaskTime'): void
  (e: 'changeTime', time: string): void
  (e: 'changeDate', date: string): void
  (e: 'clearTaskDue'): void
}>()

// Dropdowns
const dateDropdownRef = ref<Nullable<HTMLElement>>(null)
const dateDropdownInstance = ref<Nullable<HSDropdown>>(null)
const hsDatepickerRef = ref<Nullable<HTMLElement>>(null)
const timeListRef = ref<Nullable<HTMLElement>>(null)

const datePickerInstance = ref<Nullable<typeof HSDatepicker>>(null)

const timeDropdownRef = ref<Nullable<HTMLElement>>(null)
const timeDropdownInstance = ref<Nullable<HSDropdown>>(null)

const handleDateOutsideClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (
    dateDropdownRef.value &&
    !dateDropdownRef.value.contains(target) &&
    !target.closest('.date-picker-options')
  ) {
    if (dateDropdownInstance.value) {
      dateDropdownInstance.value.close()
    }
  }
}

const handleTimeOutsideClick = (event: any) => {
  if (timeDropdownRef.value && !timeDropdownRef.value.contains(event.target)) {
    if (timeDropdownInstance.value) {
      timeDropdownInstance.value.close()
    }
  }
}

function getTimesOptions() {
  const times = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')
      times.push(`${formattedHour}:${formattedMinute}`)
    }
  }
  return times
}

function validateTime(event: Event) {
  const input = event.target as HTMLInputElement

  if (input.value) {
    let { hours, minutes } = getSplittedTime(input.value)

    if (hours > 23) {
      hours = 23
    }
    if (minutes > 59) {
      minutes = 59
    }

    input.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
}

function initializeDate() {
  if (dateDropdownRef.value) {
    dateDropdownInstance.value = HSDropdown.getInstance(dateDropdownRef.value) as HSDropdown

    document.addEventListener('mousedown', handleDateOutsideClick)
  }

  if (timeDropdownRef.value) {
    timeDropdownInstance.value = HSDropdown.getInstance(timeDropdownRef.value) as HSDropdown
    timeDropdownInstance.value.on('open', () => {
      scrollTimeListToTaskTime()
    })

    document.addEventListener('mousedown', handleTimeOutsideClick)
  }
}

function scrollTimeListToTaskTime() {
  if (timeListRef.value && getTaskTime.value) {
    const timeItems = timeListRef.value.querySelectorAll('a')
    const taskHour = getTaskTime.value.split(':')[0]

    timeItems.forEach((item) => {
      const itemHour = (item.textContent || '').split(':')[0]

      if (itemHour === taskHour) {
        const itemOffsetTop = (item as HTMLElement).offsetTop
        timeListRef.value!.scrollTop =
          itemOffsetTop -
          timeListRef.value!.clientHeight / 2 +
          (item as HTMLElement).clientHeight / 2
      }
    })
  }
}

function getSplittedTime(time: string) {
  const splittedTime = time.split(':')

  if (splittedTime.length === 1) {
    return { hours: parseInt(splittedTime[0], 10), minutes: 0 }
  }

  const hours = parseInt(splittedTime[0], 10)
  const minutes = parseInt(splittedTime[1], 10)

  return { hours, minutes }
}

function timeChange(event: Event) {
  if (!props.task) return

  const input = event.target as HTMLInputElement

  if (input.value) {
    const { hours, minutes } = getSplittedTime(input.value)

    if (hours === props.task.dueHours && minutes === props.task.dueMinutes) return
  }

  validateTime(event)

  closeTimeDropdown()

  emit('changeTime', (event.target as HTMLInputElement).value)
}

function clearTime() {
  if (!props.task) return

  emit('clearTaskTime')

  closeTimeDropdown()
}

function closeTimeDropdown() {
  if (timeDropdownInstance.value) {
    timeDropdownInstance.value.close()
  }
}

function clearDue() {
  if (!props.task) return

  emit('clearTaskDue')

  if (dateDropdownInstance.value) {
    dateDropdownInstance.value.close()
  }
}

function setTimeFromOption(time: string) {
  emit('changeTime', time)

  closeTimeDropdown()
}

function openTimeDropdown() {
  if (timeDropdownInstance.value) {
    timeDropdownInstance.value.open()
  }
}

const getTaskTime = computed(() => {
  if (props.task.dueHours != null && props.task.dueMinutes != null) {
    const formattedHours = props.task.dueHours.toString().padStart(2, '0')
    const formattedMinutes = props.task.dueMinutes.toString().padStart(2, '0')
    return `${formattedHours}:${formattedMinutes}`
  } else {
    return ''
  }
})

const getDateTitle = computed(() => {
  if (props.task.dueDate) {
    return getTimeInReadableFormat(props.task.dueDate, props.task.dueHours, props.task.dueMinutes)
  } else {
    return 'Дата'
  }
})

const getDatepickerValue = computed(() => {
  if (props.task.dueDate) {
    return dayjs(props.task.dueDate).format('DD.MM.YYYY')
  } else {
    return ''
  }
})

defineExpose({
  initializeDate,
})

onMounted(() => {
  HSStaticMethods.autoInit()

  datePickerInstance.value = HSDatepicker.getInstance(hsDatepickerRef.value, true)

  if (datePickerInstance.value) {
    const element = datePickerInstance.value.element

    element.vanillaCalendar.onClickDate = (data: any) => {
      emit('changeDate', data.context.selectedDates[0])
    }

    if (props.task.dueDate) element.vanillaCalendar.set({ selectedDates: [props.task.dueDate] })
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDateOutsideClick)
  document.removeEventListener('mousedown', handleTimeOutsideClick)
})
</script>

<template>
  <div class="hs-dropdown [--auto-close:false] relative inline-flex" ref="dateDropdownRef">
    <button
      id="hs-dropdown-date"
      type="button"
      class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border rounded-lg shadow-2xs transition-colors duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
      :class="{
        'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 focus:bg-gray-200 ':
          !props.task.dueDate,
        'bg-blue-100 border-blue-200 text-blue-500 hover:bg-blue-200 focus:bg-blue-200':
          props.task.dueDate,
      }"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Dropdown"
    >
      <div class="flex items-center gap-x-2">
        <Clock class="size-4" />
        <span>{{ getDateTitle }}</span>
      </div>
      <svg
        class="hs-dropdown-open:rotate-180 size-4"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden w-65 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="hs-dropdown-date"
    >
      <div class="p-2 flex flex-col">
        <div class="flex items-center gap-x-1">
          <div class="flex flex-col gap-y-0.5 grow">
            <span class="text-xs text-gray-400">Дата</span>
            <div
              class="relative rounded-lg border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <input
                id="hs-dropdown-date-input"
                type="text"
                class="bg-transparent w-full pointer-events-none pr-7 border-none py-1 px-2 inline-flex self-start items-center gap-x-2 text-sm placeholder:text-gray-300 focus:ring-0 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                aria-haspopup="menu"
                placeholder="Выберите дату"
                :value="getDatepickerValue"
                aria-expanded="false"
                autocomplete="off"
              />
            </div>
          </div>

          <div class="flex flex-col gap-y-0.5">
            <span class="text-xs text-gray-400">Время</span>
            <div
              class="hs-dropdown [--auto-close:false] relative inline-flex self-start"
              ref="timeDropdownRef"
            >
              <span class="hidden"></span>
              <!-- Prevent dropdown button trigger -->
              <div
                class="relative rounded-lg border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <input
                  id="hs-dropdown-time-input"
                  type="tel"
                  class="bg-transparent pr-7 border-none py-1 px-2 inline-flex self-start w-20 items-center gap-x-2 text-sm placeholder:text-gray-300 focus:ring-0 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                  aria-haspopup="menu"
                  v-mask="'##:##'"
                  @click="openTimeDropdown"
                  @change="timeChange($event)"
                  @keydown.enter="timeChange($event)"
                  :value="getTaskTime"
                  aria-expanded="false"
                  aria-label="Dropdown"
                  autocomplete="off"
                  placeholder="00:00"
                />
                <button
                  type="button"
                  @click.stop="clearTime"
                  class="absolute end-2 top-1/2 -translate-y-1/2"
                >
                  <X class="size-4 text-gray-400 hover:text-gray-500" />
                </button>
              </div>

              <div
                class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 w-56 hidden z-10 mt-2 min-w-60 bg-white shadow-md rounded-lg p-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-dropdown-time"
              >
                <div class="max-h-60 overflow-y-auto" ref="timeListRef">
                  <a
                    v-for="time in getTimesOptions()"
                    :key="time"
                    class="block py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
                    href="#"
                    @click.prevent="setTimeFromOption(time)"
                  >
                    {{ time }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="hs-datepicker"
          ref="hsDatepickerRef"
          :data-hs-datepicker="JSON.stringify(datepickerOptions)"
        ></div>
        <div class="text-right pt-2 mb-1 mt-2 text-custom-sm border-t border-gray-200">
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-100 focus:outline-hidden"
            @click="clearDue"
          >
            Удалить всё
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
