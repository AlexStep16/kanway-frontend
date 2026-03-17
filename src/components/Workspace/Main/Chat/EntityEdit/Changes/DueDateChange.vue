<script setup lang="ts">
import { TimeStatus } from '@/enums/TimeStatus'
import { getTimeStatus } from '@/helpers/getTimeStatus'
import { OptionalNullable } from '@/types/utils'
import { getTimeInReadableFormat } from '@/utils/date'
import { Clock } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  before: {
    dueDate?: OptionalNullable<string>
    dueHours?: OptionalNullable<number>
    dueMinutes?: OptionalNullable<number>
    isCompleted?: boolean
  }
  after: {
    dueDate?: OptionalNullable<string>
    dueHours?: OptionalNullable<number>
    dueMinutes?: OptionalNullable<number>
    isCompleted?: boolean
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const readableDateBefore = computed(() =>
  props.before.dueDate
    ? getTimeInReadableFormat(props.before.dueDate, props.before.dueHours, props.before.dueMinutes)
    : 'Нет даты',
)

const readableDateAfter = computed(() =>
  props.after.dueDate
    ? getTimeInReadableFormat(props.after.dueDate, props.after.dueHours, props.after.dueMinutes)
    : 'Нет даты',
)

const hasDueDateChange = computed(() => {
  if (typeof props.after.dueDate === 'undefined') return false

  return (
    props.before.dueDate != props.after.dueDate ||
    props.before.dueHours != props.after.dueHours ||
    props.before.dueMinutes != props.after.dueMinutes
  )
})

const timeStatus = computed(() => {
  if (!props.after.dueDate) return null
  if (typeof props.after.isCompleted === 'undefined') return null

  return getTimeStatus(
    props.after.dueDate,
    props.after.isCompleted,
    props.after.dueHours,
    props.after.dueMinutes,
  )
})

const dateBadgeClasses = computed(() => {
  switch (timeStatus.value) {
    case TimeStatus.EXPIRED:
      return 'bg-red-100 text-red-500'
    case TimeStatus.EXPIRING:
      return 'bg-yellow-100 text-yellow-600'
    case TimeStatus.COMPLETED:
      return 'bg-green-100 text-green-600'
    default:
      return 'bg-gray-100 text-gray-500'
  }
})
</script>

<template>
  <div class="flex flex-wrap gap-1" v-if="hasDueDateChange">
    <div
      class="inline-flex items-center self-start gap-x-2 text-xs rounded-sm py-1 px-2"
      :class="baseBlockBeforeClasses"
    >
      <Clock class="size-4" />
      <span>{{ readableDateBefore }}</span>
    </div>

    <div
      class="inline-flex items-center self-start gap-x-2 text-xs rounded-sm py-1 px-2"
      :class="baseBlockAfterClasses"
    >
      <Clock class="size-4" />
      <span>{{ readableDateAfter }}</span>
    </div>
  </div>

  <div
    v-else-if="before.dueDate"
    class="inline-flex items-center self-start gap-x-2 text-xs rounded-sm py-1 px-2"
    :class="dateBadgeClasses"
  >
    <Clock class="size-4" />
    <span>{{ readableDateBefore }}</span>
  </div>
</template>
