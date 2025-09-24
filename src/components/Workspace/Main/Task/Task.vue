<script setup lang="ts">
import { useRootStore } from '@/stores/root'
import { useTaskStore } from '@/stores/task'
import { useWorkspaceStore } from '@/stores/workspace'
import dayjs from 'dayjs'
import { Clock, TextAlignStart, Trash, Copy } from 'lucide-vue-next'

enum TimeStatus {
  EXPIRED = 0,
  EXPIRING = 1,
  PROGRESS = 2,
  COMPLETED = 3,
}

const props = defineProps<{
  task: {
    id: number
    name: string
    description?: string
    color?: string
    due_date?: string
    is_completed: boolean
    tags?: Array<any>
  }
  hasBorder?: boolean
  isInteractive?: boolean
  taskClasses?: string
}>()

const WORKSPACE_STORE = useWorkspaceStore()

function getTimeStatus(date: Date | string, is_completed: boolean): TimeStatus {
  if (is_completed) return TimeStatus.COMPLETED

  let validTime = new Date()

  if (typeof date === 'string') validTime = dayjs(date).toDate()
  else if (date instanceof Date) validTime = date

  if (validTime < new Date()) return TimeStatus.EXPIRED
  if (validTime >= new Date() && validTime <= dayjs(new Date()).add(2, 'days').toDate())
    return TimeStatus.EXPIRING
  else if (validTime >= new Date()) return TimeStatus.PROGRESS

  return TimeStatus.PROGRESS
}

function getTimeInReadableFormat(date: Date | string) {
  const STORE = useRootStore()

  let output = ''

  if (date && STORE.timezone) output = dayjs.utc(date).tz(STORE.timezone).calendar()

  return output
}

function edit(task: any) {
  if (!props.isInteractive) return

  const taskStore = useTaskStore()

  taskStore.taskToEdit = task

  WORKSPACE_STORE.openEditTaskModal()
}
</script>

<template>
  <div
    class="flex flex-col rounded-md min-w-60 max-w-90 shadow-gray-200 bg-white transition-all duration-200 overflow-hidden"
    :class="{
      'border border-gray-200': hasBorder,
      'shadow-sm': !hasBorder,
      'cursor-pointer hover:shadow-md hover:shadow-gray-300': isInteractive,
      [taskClasses || '']: !!taskClasses,
    }"
    @click="edit(task)"
  >
    <div
      class="h-3 w-full"
      v-if="task.color"
      :style="{ backgroundColor: task.color || '#A3D8F4' }"
    />
    <div class="flex flex-col gap-y-2 py-2 px-3 group/task">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-x-1 shrink-1 overflow-hidden min-w-0 text-gray-800">
          <span class="pt-0.5" title="Есть описание" v-if="task.description">
            <TextAlignStart class="size-4 text-gray-600" />
          </span>
          <span class="text-sm overflow-hidden break-words">{{ task.name }}</span>
        </div>
        <div class="flex pt-0.5 items-center gap-x-2">
          <span
            class="text-gray-400 hover:text-gray-500 opacity-0 transition-opacity duration-300"
            :class="{
              'group-hover/task:opacity-100': isInteractive,
            }"
            title="Копировать"
            @click.stop=""
          >
            <Copy class="size-4" />
          </span>
          <span
            class="text-gray-400 hover:text-gray-500 opacity-0 transition-opacity duration-300"
            :class="{
              'group-hover/task:opacity-100': isInteractive,
            }"
            title="Удалить"
            @click.stop=""
          >
            <Trash class="size-4" />
          </span>
        </div>
      </div>

      <!-- Теги -->
      <div class="flex flex-wrap text-xs text-gray-500 gap-1" v-if="task.tags && task.tags.length">
        {{ task.tags.map((t) => '#' + t).join(' ') }}
      </div>

      <!-- Дата выполнения -->
      <div
        v-if="task.due_date"
        class="inline-flex items-center self-start gap-x-2 text-xs rounded-sm py-1 px-2"
        :class="{
          'bg-red-100 text-red-400':
            getTimeStatus(task.due_date, task.is_completed) === TimeStatus.EXPIRED,
          'bg-yellow-100 text-yellow-500':
            getTimeStatus(task.due_date, task.is_completed) === TimeStatus.EXPIRING,
          'bg-gray-100 text-gray-500':
            getTimeStatus(task.due_date, task.is_completed) === TimeStatus.PROGRESS,
          'bg-green-100 text-green-500':
            getTimeStatus(task.due_date, task.is_completed) === TimeStatus.COMPLETED,
        }"
      >
        <Clock class="size-4" />
        <span v-if="task.due_date">{{ getTimeInReadableFormat(task.due_date) }}</span>
      </div>

      <slot />
    </div>
  </div>
</template>
