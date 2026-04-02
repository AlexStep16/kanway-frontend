<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { HSStaticMethods } from 'preline'
import { Layers } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import { useUIStore } from '@/stores/ui'
import { useTask } from '@/composables/tasks/useTask'
import { useUpdateTask } from '@/composables/tasks/mutations/useUpdateTask'
import { useArchiveTask } from '@/composables/tasks/mutations/useArchiveTask'
import { useCloneTask } from '@/composables/tasks/mutations/useCloneTask'
import { useMoveTask } from '@/composables/tasks/mutations/useMoveTask'
import { useTaskMutationStatus } from '@/composables/tasks/mutations/useTaskMutationStatus'

// Компоненты
import ActionAndCloseButtons from '../../EditEntity/ActionAndCloseButtons.vue'
import MoveDropdown from '@components/Workspace/Main/MoveDropdown/MoveDropdown.vue'
import MoveDropdownButton from '@components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import DateTime from '@components/Workspace/Main/Task/Edit/DateTime.vue'
import Tags from '@components/Workspace/Main/Task/Edit/Tags.vue'
import Color from '@components/Workspace/Main/Task/Edit/Color.vue'
import { Nullable } from '@/types/utils'
import { EntityType } from '@/enums/EntityType'
import { useArchivedTask } from '@/composables/tasks/useArchivedTask'
import { TASK_COLORS_TITLES } from '@/constants/TASK_COLORS'

const uiStore = useUIStore()
const { editableTaskId, editableTaskBoardId, isEditableTaskDeleted } = storeToRefs(uiStore)

// --- Queries ---
const liveTask = useTask(
  editableTaskId,
  editableTaskBoardId,
  computed(() => !isEditableTaskDeleted.value),
)
const archivedTask = useArchivedTask(
  editableTaskId,
  computed(() => isEditableTaskDeleted.value),
)

const task = computed(() => {
  return isEditableTaskDeleted.value ? archivedTask.value : liveTask.value
})

const status = useTaskMutationStatus(editableTaskId)

// --- Local State (только для текста) ---
const localName = ref('')
const localDescription = ref('')
const textareaNameRef = ref<HTMLTextAreaElement | null>(null)
const textareaDescRef = ref<HTMLTextAreaElement | null>(null)
const dateRef = ref<any>(null)

// --- Mutations ---
const { mutate: updateTask } = useUpdateTask()
const { mutate: archiveTask } = useArchiveTask()
const { mutate: cloneTask } = useCloneTask()
const { mutate: moveTask } = useMoveTask()

// Универсальная функция для частичного обновления задачи
const patchTask = (fields: Record<string, any>) => {
  if (!task.value) return

  updateTask({
    payload: { id: task.value.id, ...fields },
    boardId: task.value.board.id,
  })
}

const textFieldsChanged = computed(() => {
  if (!task.value) return false

  return task.value.name !== localName.value || task.value.description !== localDescription.value
})

// --- Debounced Text Inputs ---
const debouncedUpdate = useDebounceFn(() => {
  if (!task.value || !textFieldsChanged.value) return

  patchTask({
    name: localName.value,
    description: localDescription.value,
  })
}, 500)

// --- Handlers ---
const toggleCompleted = () => {
  if (!task.value) return
  patchTask({ isCompleted: !task.value.isCompleted })
}

const handleSetColor = (
  color: Nullable<{
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  }>,
) => {
  patchTask({ color })
}

const handleAddTag = (tag: string) => {
  if (!task.value) return
  if (task.value.tags.includes(tag)) return toast.info('Тег уже существует')
  patchTask({ tags: [...task.value.tags, tag] })
}

const handleRemoveTag = (index: number) => {
  if (!task.value) return
  const newTags = [...task.value.tags]
  newTags.splice(index, 1)
  patchTask({ tags: newTags })
}

const handleChangeTime = (time: string) => {
  if (!time) return patchTask({ dueHours: null, dueMinutes: null })
  const [hours, minutes] = time.split(':').map(Number)
  patchTask({ dueHours: hours, dueMinutes: minutes })
}

const handleChangeDate = (date: string | null) => patchTask({ dueDate: date })

const handleMoveTask = (data: any) => {
  if (!task.value) return
  moveTask({
    payload: task.value,
    oldCategoryId: task.value.category.id,
    newCategoryId: data.newCategoryId,
    oldBoardId: task.value.board.id,
    newBoardId: data.newBoardId,
  })
}

// Синхронизация при открытии новой задачи
watch(editableTaskId, (newId) => {
  if (!newId) {
    localName.value = ''
    localDescription.value = ''
  }
})

function initializeTextarea(textarea: Nullable<HTMLTextAreaElement>) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

watch(
  task,
  (newVal, oldVal) => {
    if (!newVal) return

    if (newVal.id !== oldVal?.id || (!localName.value && !localDescription.value)) {
      localName.value = newVal.name
      localDescription.value = newVal.description || ''

      nextTick(() => {
        HSStaticMethods.autoInit()

        initializeTextarea(textareaNameRef.value)
        initializeTextarea(textareaDescRef.value)

        dateRef.value?.initializeDate()
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    id="hs-task-edit"
    :ref="
      (el) => {
        if (el) uiStore.editTaskModalRef = el as HTMLElement
      }
    "
    class="hs-overlay [--overlay-backdrop:static] hidden fixed z-90 size-full top-0 start-0 overflow-y-auto pointer-events-none"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <!-- Работаем напрямую с task из Query -->
      <div
        v-if="task"
        class="flex flex-col w-full max-w-xl bg-white rounded-md pointer-events-auto shadow-xl"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-gray-200">
          <div class="flex items-center gap-x-1">
            <!-- Кнопка статуса -->
            <button
              type="button"
              @click="toggleCompleted"
              class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition-colors"
              :class="
                task.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
              "
            >
              <div class="size-4.5 relative">
                <input
                  type="checkbox"
                  :checked="task.isCompleted"
                  class="peer size-4.5 rounded-full border-gray-300 checked:bg-green-600 focus:ring-0 cursor-pointer"
                  @click.stop
                />
              </div>
              {{ task.isCompleted ? 'Выполнено' : 'Выполняется' }}
            </button>

            <!-- Перемещение -->
            <MoveDropdown
              v-if="!task.isDeleted"
              :entity="task"
              :key="task.id"
              :type="EntityType.Task"
              @moveTask="handleMoveTask"
            >
              <Layers class="size-4 shrink-0" />
            </MoveDropdown>

            <MoveDropdownButton :title="task.category.name" :disabled="true" v-else>
              <Layers class="size-4 shrink-0" />
            </MoveDropdownButton>
          </div>

          <ActionAndCloseButtons
            :editableEntity="task"
            :isEntityCopying="status.isCloning?.value"
            :isEntityArchiving="status.isArchiving?.value"
            @copy="cloneTask({ id: task.id }, { onSuccess: () => uiStore.closeEditTaskModal() })"
            @archive="archiveTask({ task }, { onSuccess: () => uiStore.closeEditTaskModal() })"
            @close="uiStore.closeEditTaskModal()"
          />
        </div>

        <!-- Inputs -->
        <div class="px-4 pt-2">
          <textarea
            ref="textareaNameRef"
            v-model="localName"
            @input="debouncedUpdate"
            class="p-0 block w-full text-black border-none focus:ring-0 text-lg resize-none"
            placeholder="Имя задачи"
            rows="1"
          ></textarea>

          <textarea
            ref="textareaDescRef"
            v-model="localDescription"
            @input="debouncedUpdate"
            class="p-0 mt-1 block w-full border-none resize-none text-sm focus:ring-0 text-gray-600"
            placeholder="Описание задачи"
            rows="2"
          ></textarea>
        </div>

        <!-- Tags Display -->
        <div v-if="task.tags?.length" class="flex flex-wrap text-xs text-gray-500 gap-1 px-4 mt-2">
          <span v-for="tag in task.tags" :key="tag">#{{ tag }}</span>
        </div>

        <!-- Actions Footer -->
        <div class="flex flex-wrap gap-2 px-4 pt-3 pb-4">
          <DateTime
            :task="task"
            @changeDate="handleChangeDate"
            @clearTaskDue="patchTask({ dueHours: null, dueMinutes: null, dueDate: null })"
            @changeTime="handleChangeTime"
            @clearTaskTime="patchTask({ dueHours: null, dueMinutes: null })"
          />
          <Tags :task="task" @addTag="handleAddTag" @removeTag="handleRemoveTag" />
          <Color :task="task" @setColor="handleSetColor" />
        </div>
      </div>
    </div>
  </div>
</template>
