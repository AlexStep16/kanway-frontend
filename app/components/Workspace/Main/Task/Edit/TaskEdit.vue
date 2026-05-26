<script setup lang="ts">
import { Layers } from 'lucide-vue-next'

import MoveDropdown from '../../MoveDropdown/MoveDropdown.vue'
import ActionAndCloseButtons from '../../EditEntity/ActionAndCloseButtons.vue'
import { EntityType } from '~/enums/EntityType'
import { attach } from '@frsource/autoresize-textarea'
import TaskDateTime from '~/components/Workspace/Main/Task/Edit/TaskDateTime.vue'
import TaskTags from '~/components/Workspace/Main/Task/Edit/TaskTags.vue'
import TaskColor from '~/components/Workspace/Main/Task/Edit/TaskColor.vue'
import { toast } from 'vue-sonner'

const uiStore = useUIStore()
const editableTask = computed(() => uiStore.editableTask)

const editableTaskId = computed(() => editableTask.value?.id || null)
const editableTaskBoardId = computed(() => editableTask.value?.board.id || null)
const isEditableTaskDeleted = computed(() => editableTask.value?.isDeleted || false)

// --- Queries (Nuxt авто-импорт) ---
const liveTask = useTaskSelector(
  editableTaskId,
  editableTaskBoardId,
  computed(() => !isEditableTaskDeleted.value),
)
const archivedTask = useArchivedTask(
  editableTaskId,
  computed(() => isEditableTaskDeleted.value),
)

const task = computed(() => (isEditableTaskDeleted.value ? archivedTask.value : liveTask.value))
const status = useTaskMutationStatus(editableTaskId)

// --- Local State (текст) ---
const localName = ref('')
const localDescription = ref('')
const textareaNameRef = ref<HTMLTextAreaElement | null>(null)
const textareaDescRef = ref<HTMLTextAreaElement | null>(null)
const textareaNameFunc = ref<ReturnType<typeof attach> | null>(null)
const textareaDescFunc = ref<ReturnType<typeof attach> | null>(null)

// --- Mutations ---
const { mutate: updateTask } = useUpdateTask()
const { mutate: archiveTask } = useArchiveTask()
const { mutate: cloneTask } = useCloneTask()
const { mutate: moveTask } = useMoveTask()

const patchTask = (payload: any) => {
  if (!task.value) return
  updateTask({
    payload: { id: task.value.id, ...payload },
    boardId: task.value.board.id,
  })
}

// Debounce логика без изменений
const debouncedUpdateName = useDebounceFn(() => {
  if (!task.value || task.value.name === localName.value) return
  patchTask({ name: localName.value })
}, 500)

const debouncedUpdateDescription = useDebounceFn(() => {
  if (!task.value || task.value.description === localDescription.value) return
  patchTask({ description: localDescription.value })
}, 500)

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

const handleMoveTask = (data: any) => {
  if (!task.value) return

  moveTask({
    payload: task.value,
    oldCategoryId: task.value.category.id,
    newCategoryId: data.newCategoryId,
    oldBoardId: task.value.board.id,
    newBoardId: data.newBoardId,
    oldWorkspaceId: task.value.workspace.id,
    newWorkspaceId: data.newWorkspaceId,
  })
}

watch(
  task,
  (newVal, oldVal) => {
    if (!newVal) return
    if (newVal.id !== oldVal?.id || (!localName.value && !localDescription.value)) {
      localName.value = newVal.name
      localDescription.value = newVal.description || ''

      nextTick(() => {
        if (textareaNameRef.value) textareaNameFunc.value = attach(textareaNameRef.value) as any
        if (textareaDescRef.value) textareaDescFunc.value = attach(textareaDescRef.value) as any
      })
    }
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('resize', () => {
    if (textareaNameRef.value) textareaNameFunc.value?.update()
    if (textareaDescRef.value) textareaDescFunc.value?.update()
  })
})

onUnmounted(() => {
  textareaNameFunc.value?.detach()
  textareaDescFunc.value?.detach()
})
</script>

<template>
  <Dialog v-model:open="uiStore.isEditTaskModalOpen">
    <DialogContent
      class="p-0 overflow-hidden border-none shadow-2xl rounded-lg"
      :showCloseButton="false"
    >
      <div
        v-if="task"
        class="flex flex-col bg-background overflow-hidden"
      >
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-border">
          <div class="flex items-center gap-2 min-w-0">
            <button
              type="button"
              @click="patchTask({ isCompleted: !task.isCompleted })"
              class="py-1.5 px-2 inline-flex items-center gap-x-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200"
              :class="
                task.isCompleted
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary-foreground/20'
              "
            >
              <div class="inline-flex items-center size-3 sm:size-4">
                <label
                  class="flex items-center relative transition-all"
                  @click.prevent
                >
                  <input
                    v-model="task.isCompleted"
                    type="checkbox"
                    class="peer size-3.5 sm:size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-green-600 checked:border-green-600"
                    id="check-custom-style"
                  />
                  <span
                    class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-2.5 sm:size-3"
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
              {{ task.isCompleted ? 'Выполнено' : 'Выполняется' }}
            </button>

            <MoveDropdown
              v-if="!task.isDeleted"
              :entity="task"
              :type="EntityType.Task"
              @move="handleMoveTask"
            >
              <Layers class="size-3.5 shrink-0" />
            </MoveDropdown>
          </div>

          <ActionAndCloseButtons
            :editableEntity="task"
            :isEntityCopying="status.isCloning?.value"
            :isEntityArchiving="status.isArchiving?.value"
            @copy="
              cloneTask({ id: task.id }, { onSuccess: () => (uiStore.isEditTaskModalOpen = false) })
            "
            @archive="
              archiveTask({ task }, { onSuccess: () => (uiStore.isEditTaskModalOpen = false) })
            "
          />
        </div>

        <div class="px-4 pt-4 flex flex-col gap-y-2">
          <textarea
            ref="textareaNameRef"
            v-model="localName"
            @input="debouncedUpdateName"
            class="p-0 w-full bg-transparent border-none focus:ring-0 text-xl font-bold resize-none placeholder:text-muted-foreground/50"
            placeholder="Имя задачи"
            rows="1"
          />

          <textarea
            ref="textareaDescRef"
            v-model="localDescription"
            @input="debouncedUpdateDescription"
            class="p-0 w-full bg-transparent border-none focus:ring-0 text-sm text-muted-foreground resize-none placeholder:text-muted-foreground/40"
            placeholder="Описание задачи..."
            rows="2"
          />
        </div>

        <div
          v-if="task.tags?.length"
          class="flex flex-wrap gap-1.5 px-4 pt-2 pb-4"
        >
          <span
            v-for="tag in task.tags"
            :key="tag"
            class="text-xs font-medium text-primary/70 bg-primary-muted px-1.5 py-0.5 rounded"
          >
            #{{ tag }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 px-4 py-4 border-t bg-muted/5">
          <TaskDateTime
            :task="task"
            @changeDate="(d) => patchTask({ dueDate: d })"
            @clearTaskDue="patchTask({ dueHours: null, dueMinutes: null, dueDate: null })"
            @changeTime="
              (t) =>
                patchTask({
                  dueHours: Number(t.split(':')[0]),
                  dueMinutes: Number(t.split(':')[1]),
                })
            "
            @clearTaskTime="patchTask({ dueHours: null, dueMinutes: null })"
          />
          <TaskTags
            :task="task"
            @addTag="handleAddTag"
            @removeTag="handleRemoveTag"
          />
          <TaskColor
            :task="task"
            @setColor="(c) => patchTask({ color: c })"
          />
        </div>
      </div>

      <DialogTitle class="sr-only">Редактирование задачи</DialogTitle>
    </DialogContent>
  </Dialog>
</template>
