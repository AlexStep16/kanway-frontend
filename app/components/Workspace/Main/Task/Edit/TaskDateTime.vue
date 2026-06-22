<script setup lang="ts">
import { ChevronDown, X } from 'lucide-vue-next'
import { TaskModel } from '~/models/TaskModel'
import dayjs from 'dayjs'

import type { DateValue } from '@internationalized/date'
import { parseDate } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { Card, CardContent, CardHeader, CardFooter } from '~/components/ui/card'
import Input from '~/components/ui/input/Input.vue'
import { getTimeInReadableFormat } from '~/utils/date'

const date = ref<DateValue>()
const time = ref('')
const open = ref(false)
const inputDate = ref('')

const props = defineProps<{
  task: TaskModel
}>()

const emit = defineEmits<{
  (e: 'clearTaskTime'): void
  (e: 'changeTime', time: string): void
  (e: 'changeDate', date: string): void
  (e: 'clearTaskDue'): void
}>()

function clearTime() {
  time.value = ''

  emit('clearTaskTime')
}

function clearDate() {
  date.value = undefined
  inputDate.value = ''
  time.value = ''

  emit('clearTaskDue')
}

const dateTitle = computed(() => {
  if (props.task.dueDate) {
    return getTimeInReadableFormat(props.task.dueDate, props.task.dueHours, props.task.dueMinutes)
  } else {
    return 'Дата'
  }
})

const validateTimeFormat = (timeStr: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  return timeRegex.test(timeStr)
}

const isTimeFull = computed(() => {
  return time.value.length === 5
})

const isDateFull = computed(() => {
  return inputDate.value.length === 10
})

const formatDateInput = (value?: string | null) => {
  if (!value) {
    return ''
  }

  return dayjs(value).format('DD.MM.YYYY')
}

const formatTimeValue = (hours?: number | null, minutes?: number | null) => {
  if (hours == null && minutes == null) {
    return ''
  }

  return `${String(hours ?? 0).padStart(2, '0')}:${String(minutes ?? 0).padStart(2, '0')}`
}

const parseInputDate = (value: string) => {
  const parsedDate = dayjs(value, 'DD.MM.YYYY', true)

  if (!parsedDate.isValid()) {
    return null
  }

  return parseDate(parsedDate.format('YYYY-MM-DD'))
}

const syncDateFromTask = () => {
  date.value = props.task.dueDate ? parseDate(props.task.dueDate) : undefined
  inputDate.value = formatDateInput(props.task.dueDate)
}

const syncTimeFromTask = () => {
  time.value = formatTimeValue(props.task.dueHours, props.task.dueMinutes)
}

const syncFromTask = () => {
  syncDateFromTask()
  syncTimeFromTask()
}

const applyDate = (newDate: DateValue) => {
  const nextDate = newDate.toString()

  date.value = newDate
  inputDate.value = formatDateInput(nextDate)

  if (nextDate !== props.task.dueDate) {
    emit('changeDate', nextDate)
  }
}

const handleTimeInput = () => {
  const value = time.value.trim()

  if (!value) {
    clearTime()
    return
  }

  if (!isTimeFull.value) return

  if (validateTimeFormat(value)) {
    time.value = value

    if (value !== formatTimeValue(props.task.dueHours, props.task.dueMinutes)) {
      emit('changeTime', value)
    }
  } else {
    syncTimeFromTask()
  }
}

const handleCalendarDateChange = (newDate: DateValue | undefined) => {
  if (!newDate) {
    clearDate()
    return
  }

  applyDate(newDate)
}

const handleDateInput = () => {
  const value = inputDate.value.trim()

  if (!value) {
    clearDate()
    return
  }

  if (!isDateFull.value) {
    return
  }

  const parsedDate = parseInputDate(value)

  if (parsedDate) {
    applyDate(parsedDate)
  } else {
    syncDateFromTask()
  }
}

const clearAll = () => {
  clearDate()
  open.value = false
}

watch(
  () => [props.task.dueDate, props.task.dueHours, props.task.dueMinutes],
  () => {
    syncFromTask()
  },
  { immediate: true },
)
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-auto min-w-35 flex gap-x-2 justify-between text-left text-muted-foreground text-xs sm:text-custom-sm',
            !date && 'text-muted-foreground',
          )
        "
        size="sm"
      >
        <CalendarIcon class="size-3.5 sm:size-4" />
        {{ date ? dateTitle : 'Выбрать дату' }}
        <ChevronDown
          class="size-4 transition-transform duration-200"
          :class="{
            'rotate-180': open,
          }"
        />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      class="w-auto overflow-hidden p-0 z-90"
      @openAutoFocus.prevent
    >
      <Card class="max-w-xs rounded-0 border-0 shadow-none p-0">
        <CardHeader class="flex flex-col gap-2 border-b px-3 sm:px-4 py-2">
          <div class="flex justify-between items-center gap-x-2 w-full">
            <span class="text-xs sm:text-custom-sm text-muted-foreground font-medium">Дата</span>
            <div class="flex items-center relative">
              <Input
                type="text"
                v-model="inputDate"
                :class="
                  cn(
                    'px-2 w-35 h-8 placeholder:text-muted-foreground/80 text-muted-foreground text-xs sm:text-custom-sm font-medium',
                  )
                "
                placeholder="Дата окончания"
                v-mask="'##.##.####'"
                @blur="handleDateInput"
              />

              <Button
                variant="ghost"
                size="icon"
                class="absolute right-1 size-6 text-muted-foreground hover:text-accent-foreground"
                @click="clearDate"
                v-if="inputDate"
              >
                <X class="size-4" />
              </Button>
            </div>
          </div>
          <div class="flex justify-between items-center gap-x-2 w-full">
            <span class="text-xs sm:text-custom-sm text-muted-foreground font-medium">Время</span>
            <div class="flex items-center relative">
              <Input
                type="text"
                :class="
                  cn(
                    'px-2 w-35 h-8 placeholder:text-muted-foreground/80 text-muted-foreground text-xs sm:text-custom-sm font-medium',
                    time && 'pr-7',
                  )
                "
                placeholder="Время окончания"
                v-mask="'##:##'"
                v-model="time"
                @blur="handleTimeInput"
              />

              <Button
                variant="ghost"
                size="icon"
                class="absolute right-1 size-6 text-muted-foreground hover:text-accent-foreground"
                @click="clearTime"
                v-if="isTimeFull && validateTimeFormat(time)"
              >
                <X class="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <Calendar
            :model-value="date"
            locale="ru-RU"
            :class="cn('**:data-[slot=calendar-cell-trigger]:size-12! p-2 sm:p-3')"
            @update:model-value="handleCalendarDateChange"
          />
        </CardContent>
        <CardFooter class="flex justify-end gap-x-2 border-t p-3">
          <span
            class="font-medium w-auto text-xs text-muted-foreground cursor-pointer hover:text-red-500 transition-colors duration-200"
            @click="clearAll"
          >
            Очистить всё
          </span>
        </CardFooter>
      </Card>
    </PopoverContent>
  </Popover>
</template>
