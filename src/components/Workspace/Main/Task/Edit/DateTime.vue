<script setup lang="ts">
import { ChevronDown, X } from 'lucide-vue-next'
import { computed, Ref, ref, watch } from 'vue'
import { TaskModel } from '@models/TaskModel'
import dayjs from 'dayjs'

import type { DateValue } from '@internationalized/date'
import { parseDate } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/input/Input.vue'
import { getTimeInReadableFormat } from '@/utils/date'

const date = ref() as Ref<DateValue | undefined>
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
  if (!props.task) return

  emit('clearTaskTime')
}

function clearDate() {
  if (!props.task) return

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

const handleTimeInput = () => {
  if (!validateTimeFormat(time.value)) {
    if (isTimeFull.value) {
      if (props.task?.dueHours != null && props.task?.dueMinutes != null) {
        time.value =
          props.task.dueHours.toString().padStart(2, '0') +
          ':' +
          props.task.dueMinutes.toString().padStart(2, '0')
      } else {
        time.value = ''
      }
    }

    return
  }
  emit('changeTime', time.value)
}

const handleDateInput = () => {
  const parsedDate = dayjs(inputDate.value, 'DD.MM.YYYY', true)
  if (parsedDate.isValid()) {
    date.value = parseDate(parsedDate.format('YYYY-MM-DD'))
  } else if (isDateFull.value) {
    inputDate.value = ''
  }
}

const clearAll = () => {
  clearDate()
  clearTime()
  open.value = false
}

watch(
  () => props.task.dueDate,
  (newDueDate) => {
    if (newDueDate) {
      date.value = parseDate(newDueDate)
    } else {
      date.value = undefined
    }
  },
  { immediate: true },
)

watch(
  () => props.task.dueHours,
  (newDueHours) => {
    if (newDueHours) {
      time.value =
        newDueHours.toString().padStart(2, '0') +
        ':' +
        (props.task?.dueMinutes ?? '00').toString().padStart(2, '0')
    } else {
      time.value = ''
    }
  },
  { immediate: true },
)

watch(
  () => props.task.dueMinutes,
  (newDueMinutes) => {
    if (newDueMinutes) {
      time.value =
        (props.task?.dueHours ?? '00').toString().padStart(2, '0') +
        ':' +
        newDueMinutes.toString().padStart(2, '0')
    } else {
      time.value = ''
    }
  },
  { immediate: true },
)

watch(
  date,
  (newDate) => {
    if (newDate) {
      if (props.task && newDate.toString() !== props.task.dueDate) {
        emit('changeDate', newDate.toString())
      }

      inputDate.value = dayjs(newDate.toString()).format('DD.MM.YYYY')
    } else if (!newDate) {
      inputDate.value = ''
    }
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
            'w-auto min-w-35 flex gap-x-2 justify-between text-left text-muted-foreground text-custom-sm',
            !date && 'text-muted-foreground',
          )
        "
        size="sm"
      >
        <CalendarIcon />
        {{ date ? dateTitle : 'Выбрать дату' }}
        <ChevronDown
          class="size-4 transition-transform duration-200"
          :class="{
            'rotate-180': open,
          }"
        />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-auto overflow-hidden p-0 z-90" @openAutoFocus.prevent>
      <Card class="max-w-xs rounded-0 border-0 shadow-none p-0">
        <CardHeader class="flex flex-col gap-2 border-b px-4 py-2">
          <div class="flex justify-between items-center gap-x-2 w-full">
            <span class="text-custom-sm text-muted-foreground font-medium">Дата</span>
            <div class="flex items-center relative">
              <Input
                type="text"
                v-model="inputDate"
                :class="
                  cn(
                    'px-2 w-35 h-8 placeholder:text-muted-foreground/80 text-muted-foreground text-custom-sm! font-medium',
                  )
                "
                placeholder="Дата окончания"
                v-mask="'##.##.####'"
                @input="handleDateInput"
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
            <span class="text-custom-sm text-muted-foreground font-medium">Время</span>
            <div class="flex items-center relative">
              <Input
                type="text"
                :class="
                  cn(
                    'px-2 w-35 h-8 placeholder:text-muted-foreground/80 text-muted-foreground text-custom-sm! font-medium',
                    time && 'pr-7',
                  )
                "
                placeholder="Время окончания"
                v-mask="'##:##'"
                v-model="time"
                @input="handleTimeInput"
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
            v-model="date"
            locale="ru-RU"
            :class="cn('**:data-[slot=calendar-cell-trigger]:size-12!')"
            @update:model-value="() => (open = false)"
          />
        </CardContent>
        <CardFooter class="flex justify-end gap-x-2 border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            class="w-auto text-xs text-muted-foreground"
            @click="clearAll"
          >
            Очистить всё
          </Button>
        </CardFooter>
      </Card>
    </PopoverContent>
  </Popover>
</template>
