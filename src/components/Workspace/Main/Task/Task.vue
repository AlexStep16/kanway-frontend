<script setup lang="ts">
import { computed, ref, toValue } from 'vue'
import { Clock, TextAlignStart, Archive, Copy, SquareKanban, Layers } from 'lucide-vue-next'

import { ITaskState } from '@stores/interfaces/ITaskState'
import { TimeStatus } from '@/enums/TimeStatus'
import { getTimeInReadableFormat } from '@utils/date'
import { getTimeStatus } from '@/helpers/getTimeStatus'

import Spinner from '@/components/Loader/Spinner.vue'
import { useUIStore } from '@/stores/ui'
import { useUpdateTask } from '@/composables/tasks/mutations/useUpdateTask'
import { useArchiveTask } from '@/composables/tasks/mutations/useArchiveTask'
import { useCloneTask } from '@/composables/tasks/mutations/useCloneTask'
import { useTaskMutationStatus } from '@/composables/tasks/mutations/useTaskMutationStatus'

const props = defineProps<{
  task: ITaskState
  isSelected?: boolean
  hasBorder?: boolean
  hasCopy?: boolean
  hasDelete?: boolean
  hasCheckbox?: boolean
  showInfo?: boolean
  taskClasses?: string
  isStatic?: boolean
}>()

const uiStore = useUIStore()

// --- Mutations ---
const { mutate: updateTask } = useUpdateTask()
const { mutate: archiveTask } = useArchiveTask()
const { mutate: cloneTask } = useCloneTask()
const status = useTaskMutationStatus(computed(() => props.task.id))

// --- Local State ---
const dragStartTime = ref<number>(0)

// --- Logic ---
function toggleTaskCompletion() {
  updateTask({
    payload: {
      id: props.task.id,
      isCompleted: !props.task.isCompleted,
    },
    boardId: props.task.board.id,
  })
}

function startDragging() {
  dragStartTime.value = Date.now()
}

function handleEdit() {
  if (props.isStatic) return

  const clickDuration = Date.now() - dragStartTime.value
  if (clickDuration > 250) return

  uiStore.openTaskToEdit(props.task)
}

function handleCopy() {
  cloneTask({ id: props.task.id })
}

function handleArchive() {
  archiveTask({ task: props.task })
}

// --- Computed Styles ---
const timeStatus = computed(() =>
  getTimeStatus(
    props.task.dueDate!,
    props.task.isCompleted,
    props.task.dueHours,
    props.task.dueMinutes,
  ),
)

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

const isCopyAvailable = computed(() => props.hasCopy && !props.task.isDeleted)
const isDeleteAvailable = computed(() => props.hasDelete && !props.task.isDeleted)

const readableDate = computed(() =>
  props.task.dueDate
    ? getTimeInReadableFormat(props.task.dueDate, props.task.dueHours, props.task.dueMinutes)
    : '',
)
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
    @click="handleEdit"
  >
    <div class="h-3 w-full" v-if="task.color" :style="{ backgroundColor: task.color }" />
    <div class="flex flex-col gap-y-2 p-3 group/task relative">
      <!-- Info -->
      <div class="flex items-center gap-x-2" v-if="showInfo">
        <div class="flex items-center gap-x-1 text-gray-500">
          <Layers class="size-3" /><span class="text-xs">{{
            task.category.name ?? 'Без категории'
          }}</span>
        </div>
        <div class="flex items-center gap-x-1 text-gray-500">
          <SquareKanban class="size-3" /><span class="text-xs">{{
            task.board.name ?? 'Без доски'
          }}</span>
        </div>
      </div>

      <div class="flex items-start justify-between gap-x-2">
        <div
          class="flex items-center pr-14 pointer-fine:pr-0 gap-x-1 shrink-1 overflow-hidden min-w-0 text-gray-800 transform pointer-fine:-translate-x-6 transition-all duration-100"
          :class="{
            'translate-x-0!': task.isCompleted,
            ' group-hover/task:translate-x-0': !isStatic,
          }"
        >
          <div
            class="inline-flex items-center pointer-fine:opacity-0 pointer-fine:pointer-events-none group-hover/task:opacity-100 group-hover/task:pointer-events-auto transition-all duration-100"
            :class="{ 'opacity-100! pointer-events-auto!': task.isCompleted && !isStatic }"
          >
            <div class="size-5 flex items-center justify-center">
              <label
                class="flex items-center cursor-pointer relative transition-all select-none"
                @click.stop
                v-if="!isStatic"
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
          @click.stop="$emit('toggleSelect', task)"
          v-if="hasCheckbox"
        >
          <input
            type="checkbox"
            class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-600"
            id="payment-method-card-2"
            :checked="isSelected"
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
              isCopyAvailable || isDeleteAvailable,
          }"
        >
          <button
            type="button"
            class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
            title="Копировать"
            @click.stop="handleCopy"
            v-if="isCopyAvailable"
          >
            <Spinner v-if="toValue(status.isCloning)" class="size-4" />
            <Copy v-else class="size-4" />
          </button>
          <button
            type="button"
            class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
            title="Архивировать"
            v-if="isDeleteAvailable"
            @click.stop="handleArchive"
          >
            <Spinner v-if="toValue(status.isArchiving)" class="size-4" />
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
        :class="dateBadgeClasses"
      >
        <Clock class="size-4" />
        <span v-if="task.dueDate">{{ readableDate }}</span>
      </div>

      <slot />
    </div>
  </div>
</template>
