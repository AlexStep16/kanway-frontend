<script setup lang="ts">
import { useRootStore } from '@/stores/root'
import { useTaskStore } from '@/stores/task'
import { useWorkspaceStore } from '@/stores/workspace'
import dayjs from 'dayjs'
import { Clock, TextAlignStart, Trash, Copy, SquareKanban, Layers } from 'lucide-vue-next'
import { computed, ref } from 'vue'

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
  isEditable?: boolean
  hasCopy?: boolean
  hasDelete?: boolean
  hasCheckbox?: boolean
  showInfo?: boolean
  taskClasses?: string
}>()

const isChecked = ref(true)

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

const getTaskIsCompleted = computed(() => {
  return props.task.is_completed
})

function edit(task: any) {
  if (!props.isEditable) return

  const taskStore = useTaskStore()

  taskStore.taskToEdit = task

  WORKSPACE_STORE.openEditTaskModal()
}
</script>

<template>
  <div
    class="flex flex-col rounded-md min-w-60 max-w-75 w-full shadow-gray-200 bg-white transition-all duration-100 overflow-hidden"
    :class="{
      'border border-gray-200': hasBorder,
      'shadow-sm': !hasBorder,
      'cursor-pointer hover:shadow-md hover:shadow-gray-300': isEditable,
      [taskClasses || '']: !!taskClasses,
    }"
    @click="edit(task)"
  >
    <div class="h-3 w-full" v-if="task.color" :style="{ backgroundColor: task.color }" />
    <div class="flex flex-col gap-y-2 py-2 px-3 group/task relative">
      <!-- Info -->
      <div class="flex items-center gap-x-2" v-if="showInfo">
        <div class="flex items-center gap-x-1 text-gray-500">
          <Layers class="size-3" /><span class="text-xs">Отчёты</span>
        </div>
        <div class="flex items-center gap-x-1 text-gray-500">
          <SquareKanban class="size-3" /><span class="text-xs">Личная</span>
        </div>
      </div>

      <div class="flex items-start justify-between gap-x-2">
        <div
          class="flex items-center gap-x-1 shrink-1 overflow-hidden min-w-0 text-gray-800 transform -translate-x-6 group-hover/task:translate-x-0 transition-all duration-100"
          :class="{ 'translate-x-0!': getTaskIsCompleted }"
        >
          <div
            class="inline-flex items-center opacity-0 pointer-events-none group-hover/task:opacity-100 group-hover/task:pointer-events-auto transition-all duration-100"
            :class="{ 'opacity-100! pointer-events-auto!': getTaskIsCompleted }"
            v-if="props.isEditable"
          >
            <div class="size-5 flex items-center justify-center">
              <label
                class="flex items-center cursor-pointer relative transition-all select-none"
                @click.stop
              >
                <input
                  type="checkbox"
                  class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-green-600 checked:border-green-600"
                  :checked="getTaskIsCompleted"
                  id="check-custom-style"
                  @change="$emit('updateTask', { is_completed: !getTaskIsCompleted })"
                />
                <span
                  class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </label>
            </div>
          </div>
          <span
            class="text-sm overflow-hidden break-words"
            :class="{ 'text-gray-300 decoration-1 line-through': task.is_completed }"
            >{{ task.name }}</span
          >
        </div>

        <div
          class="flex items-center cursor-pointer relative transition-all"
          @click.stop="isChecked = !isChecked"
          v-if="hasCheckbox"
        >
          <input
            type="checkbox"
            class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-600"
            id="payment-method-card-2"
            v-model="isChecked"
          />
          <span
            class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-3"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="1"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
        </div>

        <div
          class="flex items-center absolute right-2 pointer-fine:opacity-0 transition-all pointer-events-none duration-100 top-1"
          :class="{
            'group-hover/task:opacity-100 group-hover/task:bg-white pointer-events-auto!':
              hasCopy || hasDelete,
          }"
        >
          <button
            type="button"
            class="text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
            title="Копировать"
            @click.stop=""
            v-if="hasCopy"
          >
            <Copy class="size-4" />
          </button>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
            title="Удалить"
            v-if="hasDelete"
            @click.stop=""
          >
            <Trash class="size-4" />
          </button>
        </div>
      </div>

      <!-- Описание -->
      <div class="flex items-center text-xs text-gray-500 gap-1" v-if="task.description">
        <TextAlignStart class="size-3" />
        <span class="decoration-1 hover:underline">Есть описание</span>
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
