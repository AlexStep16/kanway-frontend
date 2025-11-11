<script setup lang="ts">
import { ITaskState } from '@stores/interfaces/ITaskState'
import { useTaskDataStore } from '@stores/taskData'
import { useUIStore } from '@stores/ui'
import dayjs from 'dayjs'
import { Clock, TextAlignStart, Archive, Copy, SquareKanban, Layers } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import { getTimeInReadableFormat } from '@utils/date'
import Spinner from '@/components/Loader/Spinner.vue'

const emit = defineEmits<{
  (e: 'updateTask', payload: { id: string; isCompleted: boolean }): void
  (e: 'connectInputEditRef', el: HTMLInputElement): void
}>()

enum TimeStatus {
  EXPIRED = 0,
  EXPIRING = 1,
  PROGRESS = 2,
  COMPLETED = 3,
}

const props = defineProps<{
  task: ITaskState
  hasBorder?: boolean
  hasCopy?: boolean
  hasDelete?: boolean
  hasCheckbox?: boolean
  showInfo?: boolean
  taskClasses?: string
}>()

const isChecked = ref(true)
const dragStartTime = ref<number>(0)
const dragEndTime = ref<number>(0)
const inputAddRef = ref<HTMLInputElement | null>(null)

const UI_STORE = useUIStore()
const TASK_STORE = useTaskDataStore()

watch(inputAddRef, (newVal) => {
  if (newVal) emit('connectInputEditRef', newVal)
})

function toggleTaskCompletion() {
  TASK_STORE.updateTask(
    { id: props.task.id, isCompleted: !props.task.isCompleted },
    props.task.boardId,
    true,
  )
}

function getTimeStatus(
  dueDate: string,
  isCompleted: boolean,
  dueHours?: number,
  dueMinutes?: number,
): TimeStatus {
  if (isCompleted) return TimeStatus.COMPLETED

  let validTime = new Date()

  const date =
    dueHours !== undefined && dueMinutes !== undefined
      ? dayjs(dueDate).hour(dueHours).minute(dueMinutes).toDate()
      : dayjs(dueDate).startOf('day').toDate()

  if (typeof date === 'string') validTime = dayjs(date).toDate()
  else if (date instanceof Date) validTime = date

  if (validTime < new Date()) return TimeStatus.EXPIRED
  if (validTime >= new Date() && validTime <= dayjs(new Date()).add(2, 'days').toDate())
    return TimeStatus.EXPIRING
  else if (validTime >= new Date()) return TimeStatus.PROGRESS

  return TimeStatus.PROGRESS
}

function edit(task: ITaskState) {
  if (task.isNew) return

  dragEndTime.value = Date.now()

  if (dragEndTime.value - dragStartTime.value > 700) {
    return
  }

  TASK_STORE.taskToEdit = task

  UI_STORE.openEditTaskModal()
}

function copyTask(task: ITaskState) {
  TASK_STORE.cloneTask(task)
}

function archiveTask(task: ITaskState) {
  TASK_STORE.archiveTask(task)
}

async function createOrSplice(task: ITaskState, target: HTMLInputElement, isEnterKey = false) {
  if (isTaskAdding.value) return

  TASK_STORE.createOrSplice(task, target)

  if (isEnterKey) {
    nextTick(() => {
      TASK_STORE.addTaskToStore(task.categoryId) // nexttick to wait current new task is reinit itself ref
    })
  }
}

function startDragging() {
  dragStartTime.value = Date.now()
}

const isTaskAdding = computed(() => {
  return TASK_STORE.isTaskAdding(props.task.id)
})

const isTaskCopying = computed(() => {
  return TASK_STORE.isTaskCloning(props.task.id)
})

const isTaskArchiving = computed(() => {
  return TASK_STORE.isTaskArchiving(props.task.id)
})
</script>

<template>
  <div
    class="flex flex-col shrink-0 rounded-md min-w-60 cursor-pointer hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
    :class="{
      'border border-gray-200': hasBorder,
      'shadow-sm': !hasBorder,
      [taskClasses || '']: !!taskClasses,
    }"
    @mousedown="startDragging"
    @click="edit(task)"
  >
    <div class="h-3 w-full" v-if="task.color" :style="{ backgroundColor: task.color }" />
    <div class="flex gap-x-2 py-3 px-3 relative" v-if="task.isNew">
      <div class="flex items-center" v-if="isTaskAdding">
        <Spinner class="size-3.5 text-gray-600" />
      </div>
      <input
        type="text"
        class="text-gray-800 w-full text-sm border-none ring-0 p-0"
        @blur="createOrSplice(task, $event.target as HTMLInputElement)"
        @keydown.enter="createOrSplice(task, $event.target as HTMLInputElement, true)"
        :disabled="isTaskAdding"
        ref="inputAddRef"
        placeholder="Название задачи"
      />
    </div>
    <div class="flex flex-col gap-y-2 py-3 px-3 group/task relative" v-else>
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
          :class="{ 'translate-x-0!': task.isCompleted }"
        >
          <div
            class="inline-flex items-center opacity-0 pointer-events-none group-hover/task:opacity-100 group-hover/task:pointer-events-auto transition-all duration-100"
            :class="{ 'opacity-100! pointer-events-auto!': task.isCompleted }"
          >
            <div class="size-5 flex items-center justify-center">
              <label
                class="flex items-center cursor-pointer relative transition-all select-none"
                @click.stop
              >
                <input
                  type="checkbox"
                  class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-green-600 checked:border-green-600"
                  :checked="task.isCompleted"
                  id="check-custom-style"
                  @change="toggleTaskCompletion"
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
            :class="{
              'text-gray-300 decoration-1 line-through': task.isCompleted,
            }"
          >
            {{ task.name }}
          </span>
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
          class="flex items-center absolute right-2 pointer-fine:opacity-0 transition-all pointer-events-none duration-100 top-2"
          :class="{
            'group-hover/task:opacity-100 group-hover/task:bg-white pointer-events-auto!':
              hasCopy || hasDelete,
          }"
        >
          <button
            type="button"
            class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
            title="Копировать"
            @click.stop="copyTask(task)"
            v-if="hasCopy"
          >
            <Spinner v-if="isTaskCopying" class="size-4" />
            <Copy v-else class="size-4" />
          </button>
          <button
            type="button"
            class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
            title="Архивировать"
            v-if="hasDelete"
            @click.stop="archiveTask(task)"
          >
            <Spinner v-if="isTaskArchiving" class="size-4" />
            <Archive v-else class="size-4" />
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
        v-if="task.dueDate"
        class="inline-flex items-center self-start gap-x-2 text-xs rounded-sm py-1 px-2"
        :class="{
          'bg-red-100 text-red-400':
            getTimeStatus(task.dueDate, task.isCompleted) === TimeStatus.EXPIRED,
          'bg-yellow-100 text-yellow-500':
            getTimeStatus(task.dueDate, task.isCompleted) === TimeStatus.EXPIRING,
          'bg-gray-100 text-gray-500':
            getTimeStatus(task.dueDate, task.isCompleted) === TimeStatus.PROGRESS,
          'bg-green-100 text-green-500':
            getTimeStatus(task.dueDate, task.isCompleted) === TimeStatus.COMPLETED,
        }"
      >
        <Clock class="size-4" />
        <span v-if="task.dueDate">{{
          getTimeInReadableFormat(task.dueDate, task.dueHours, task.dueMinutes)
        }}</span>
      </div>

      <slot />
    </div>
  </div>
</template>
