<script setup lang="ts">
import { computed, ref } from 'vue'
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
  hasBorder?: boolean
  hasCopy?: boolean
  hasDelete?: boolean
  hasCheckbox?: boolean
  showInfo?: boolean
  taskClasses?: string
}>()

const uiStore = useUIStore()

// --- Mutations ---
const { mutate: updateTask } = useUpdateTask()
const { mutate: archiveTask } = useArchiveTask()
const { mutate: cloneTask } = useCloneTask()
const status = useTaskMutationStatus(computed(() => props.task.id))

// --- Local State ---
const isSelected = ref(false)
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

function handleEdit() {
  const clickDuration = Date.now() - dragStartTime.value
  if (clickDuration > 250) return

  uiStore.openTaskToEdit(props.task.id)
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
    class="flex flex-col shrink-0 rounded-md min-w-60 cursor-pointer hover:shadow-md max-w-75 w-full bg-white transition-all duration-200 overflow-hidden select-none"
    :class="[hasBorder ? 'border border-gray-200' : 'shadow-sm', taskClasses]"
    @mousedown="dragStartTime = Date.now()"
    @click="handleEdit"
  >
    <!-- Task Color Line -->
    <div v-if="task.color" class="h-1.5 w-full" :style="{ backgroundColor: task.color }" />

    <div class="flex flex-col gap-y-2 p-3 group/task relative">
      <!-- Board/Category Info -->
      <div v-if="showInfo" class="flex items-center gap-x-3 mb-1">
        <div class="flex items-center gap-x-1 text-gray-400">
          <Layers class="size-3" />
          <span class="text-[10px] font-medium uppercase tracking-wider">{{
            task.category.name
          }}</span>
        </div>
        <div class="flex items-center gap-x-1 text-gray-400">
          <SquareKanban class="size-3" />
          <span class="text-[10px] font-medium uppercase tracking-wider">{{
            task.board.name
          }}</span>
        </div>
      </div>

      <!-- Main Row: Checkbox + Name -->
      <div class="flex items-start justify-between gap-x-2">
        <div
          class="flex items-center gap-x-2 shrink-1 overflow-hidden min-w-0 transition-all duration-200"
          :class="[
            task.isCompleted
              ? 'translate-x-0'
              : 'pointer-fine:-translate-x-7 group-hover/task:translate-x-0',
          ]"
        >
          <!-- Completion Checkbox -->
          <div
            class="size-5 flex shrink-0 items-center justify-center transition-opacity"
            :class="[task.isCompleted ? 'opacity-100' : 'opacity-0 group-hover/task:opacity-100']"
          >
            <label class="relative flex items-center cursor-pointer" @click.stop>
              <input
                type="checkbox"
                :checked="task.isCompleted"
                @change="toggleTaskCompletion"
                class="peer size-4.5 rounded-full border-gray-300 checked:bg-green-600 focus:ring-0 cursor-pointer transition-all"
              />
              <span
                class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <svg class="size-3" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </label>
          </div>

          <span
            class="text-sm leading-tight break-words"
            :class="{
              'text-gray-400 line-through': task.isCompleted,
              'text-gray-800': !task.isCompleted,
            }"
          >
            {{ task.name }}
          </span>
        </div>

        <div
          class="flex items-center cursor-pointer relative transition-all"
          @click.stop="isSelected = !isSelected"
          v-if="hasCheckbox"
        >
          <input
            type="checkbox"
            class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-600"
            id="payment-method-card-2"
            v-model="isSelected"
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

        <!-- Right Side Actions (Copy/Archive) -->
        <div
          class="flex items-center absolute right-1 top-2 opacity-0 group-hover/task:opacity-100 transition-opacity bg-white/80 backdrop-blur-xs rounded-full shadow-sm"
          @click.stop
        >
          <button
            v-if="isCopyAvailable"
            @click="handleCopy"
            class="p-1.5 text-gray-400 hover:text-blue-500 rounded-full transition-colors"
            :disabled="status.isCloning?.value"
          >
            <Spinner v-if="status.isCloning?.value" class="size-3.5" />
            <Copy v-else class="size-3.5" />
          </button>

          <button
            v-if="isDeleteAvailable"
            @click="handleArchive"
            class="p-1.5 text-gray-400 hover:text-red-500 rounded-full transition-colors"
            :disabled="status.isArchiving?.value"
          >
            <Spinner v-if="status.isArchiving?.value" class="size-3.5" />
            <Archive v-else class="size-3.5" />
          </button>
        </div>
      </div>

      <!-- Description Indicator -->
      <div v-if="task.description" class="flex items-center text-[11px] text-gray-400 gap-1 mt-0.5">
        <TextAlignStart class="size-3" />
        <span>С описанием</span>
      </div>

      <!-- Tags -->
      <div v-if="task.tags?.length" class="flex flex-wrap gap-1 mt-1">
        <span
          v-for="tag in task.tags"
          :key="tag"
          class="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-100"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Due Date Badge -->
      <div
        v-if="task.dueDate"
        class="inline-flex items-center self-start gap-x-1.5 text-[11px] font-medium rounded-md py-1 px-2 mt-1 transition-colors"
        :class="dateBadgeClasses"
      >
        <Clock class="size-3.5" />
        <span>{{ readableDate }}</span>
      </div>

      <!-- Extra content slot -->
      <slot />
    </div>
  </div>
</template>
