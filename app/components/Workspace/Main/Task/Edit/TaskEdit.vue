<script setup lang="ts">
import { Check, Layers, Plus, X } from '@lucide/vue'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'

import MoveDropdown from '../../MoveDropdown/MoveDropdown.vue'
import ActionAndCloseButtons from '../../EditEntity/ActionAndCloseButtons.vue'
import { attach } from '@frsource/autoresize-textarea'
import TaskDateTime from '~/components/Workspace/Main/Task/Edit/TaskDateTime.vue'
import TaskPriority from '~/components/Workspace/Main/Task/Edit/TaskPriority.vue'
import TaskColor from '~/components/Workspace/Main/Task/Edit/TaskColor.vue'
import { toast } from 'vue-sonner'
import _ from 'lodash'
import type { ITaskEditApiPayload } from '~/interfaces/ITaskEditApiPayload'
import type { ITaskState } from '~/stores/interfaces/ITaskState.js'

const uiStore = useUIStore()
const { editableTask } = storeToRefs(uiStore)

const editableTaskId = computed(() => editableTask.value?.id || null)

// --- Queries (Nuxt авто-импорт) ---
const { data: liveTask } = useTask(editableTask.value!.id, editableTask.value!.board.id)

const task = ref<ITaskState | null>(null)
const status = useTaskMutationStatus(editableTaskId)
const tagRef = ref<HTMLInputElement | null>(null)

// --- Local State (текст) ---
const localName = ref('')
const localDescription = ref('')
const localTag = ref('')
const isTagInputVisible = ref(false)
const textareaNameRef = ref<HTMLTextAreaElement | null>(null)
const textareaDescRef = ref<HTMLTextAreaElement | null>(null)
const textareaNameFunc = ref<ReturnType<typeof attach> | null>(null)
const textareaDescFunc = ref<ReturnType<typeof attach> | null>(null)

// --- Mutations ---
const { mutate: updateTask } = useUpdateTask()
const { mutate: archiveTask } = useArchiveTask()
const { mutate: cloneTask } = useCloneTask()
const { mutate: moveTask } = useMoveTask()

const patchTask = (payload: Omit<ITaskEditApiPayload, 'id'>) => {
  if (!task.value) return

  const taskId = task.value.id
  const boardId = task.value.board.id

  Object.assign(task.value, payload)

  updateTask({
    payload: { id: taskId, ...payload },
    boardId,
  })
}

const toggleTaskCompletion = () => {
  if (!task.value) return
  patchTask({ isCompleted: !task.value.isCompleted })
}

// Debounce логика без изменений
const debouncedUpdateName = useDebounceFn(() => {
  if (!task.value || task.value.name === localName.value || !localName.value) return

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

    newColumnId: data.newColumnId,
    oldBoardId: task.value.board.id,
    newBoardId: data.newBoardId,
  })
}

const handleTagInputOpen = () => {
  isTagInputVisible.value = true
  nextTick(() => {
    tagRef.value?.focus()
  })
}

const handleTagInputClose = () => {
  isTagInputVisible.value = false
  localTag.value = ''
}

const handleTagInputBlur = () => {
  const normalizedTag = localTag.value.trim()
  if (!normalizedTag) handleTagInputClose()
  else handleInlineAddTag(true)
}

const handleInlineAddTag = (shouldClose = false) => {
  const normalizedTag = localTag.value.trim()
  if (!normalizedTag) return

  handleAddTag(normalizedTag)
  if (shouldClose) handleTagInputClose()
  else {
    localTag.value = ''
    handleTagInputOpen()
  }
}

watch(
  () => liveTask.value?.id,
  (newId, oldId) => {
    const current = liveTask.value

    if (!current) {
      task.value = null
      localName.value = ''
      localDescription.value = ''
      return
    }

    if (newId !== oldId) {
      task.value = _.cloneDeep(current)
      localName.value = current.name || ''
      localDescription.value = current.description || ''

      nextTick(() => {
        if (textareaNameRef.value) textareaNameFunc.value = attach(textareaNameRef.value) as any
        if (textareaDescRef.value) textareaDescFunc.value = attach(textareaDescRef.value) as any
      })
    }
  },
  { immediate: true },
)

function handleConnectInputRef(refObj: any) {
  const exposed = refObj as { inputRef: HTMLInputElement | null } | null
  if (!exposed) return

  tagRef.value = exposed.inputRef
  if (exposed.inputRef) {
    exposed.inputRef.focus()
  }
}

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
  <div
    v-if="task"
    class="flex flex-col bg-background overflow-hidden"
  >
    <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-border">
      <div class="flex items-center gap-2 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="toggleTaskCompletion"
          class="py-1.5 px-2 inline-flex items-center gap-x-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200"
          :class="
            task.isCompleted
              ? 'bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary-foreground/20'
          "
        >
          <div class="inline-flex items-center size-3.5 sm:size-4.5 shrink-0">
            <Checkbox
              :model-value="task.isCompleted"
              aria-hidden="true"
              tabindex="-1"
              class="pointer-events-none size-3.5 sm:size-4.5 rounded-full border-slate-300 bg-slate-100 text-white shadow data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
            >
              <Check
                class="size-3"
                stroke-width="4"
              />
            </Checkbox>
          </div>
          {{ task.isCompleted ? 'Выполнено' : 'Выполняется' }}
        </Button>

        <MoveDropdown
          v-if="!task.isDeleted"
          :task="task"
          @move="handleMoveTask"
        >
          <Layers class="size-3.5 shrink-0" />
        </MoveDropdown>
      </div>

      <ActionAndCloseButtons
        :editableEntity="task"
        :isEntityCopying="status.isCloning?.value"
        :isEntityArchiving="status.isArchiving?.value"
        :isEntityUpdating="status.isUpdating?.value"
        @copy="
          cloneTask({ id: task.id }, { onSuccess: () => (uiStore.isEditTaskModalOpen = false) })
        "
        @archive="archiveTask({ task }, { onSuccess: () => (uiStore.isEditTaskModalOpen = false) })"
      />
    </div>

    <div class="p-4 flex flex-col gap-y-2">
      <textarea
        ref="textareaNameRef"
        v-model="localName"
        @input="debouncedUpdateName"
        class="p-0 w-full bg-transparent border-none focus:ring-0 text-lg font-medium resize-none placeholder:text-muted-foreground/50"
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

      <div class="flex flex-wrap gap-1.5 mt-1">
        <Badge
          v-for="(tag, index) in task.tags"
          :key="`${tag}-${index}`"
          variant="secondaryMuted"
          @click="handleRemoveTag(index)"
          class="text-xs h-6 gap-x-2 rounded-sm cursor-pointer transition-colors hover:bg-red-100 hover:text-red-600 max-w-full truncate"
        >
          <span class="truncate">#{{ tag }}</span>
          <X class="size-3 shrink-0" />
        </Badge>

        <template v-if="isTagInputVisible">
          <form
            @submit.prevent="handleInlineAddTag(false)"
            class="inline-block"
          >
            <Input
              id="task-tag-input"
              :ref="handleConnectInputRef"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              enterkeyhint="done"
              v-model="localTag"
              class="h-6 w-14 px-2 text-xs min-w-20 rounded-sm focus-visible:ring-0 outline-0 focus:ring-0 focus:ring-offset-0 focus:outline-0 font-medium border-transparent bg-muted text-foreground/50 hover:bg-secondary/80"
              @blur="handleTagInputBlur"
              v-autowidth
            />
          </form>
        </template>

        <Badge
          v-else
          variant="secondaryMuted"
          class="text-xs h-6 rounded-sm text-foreground/40 cursor-pointer border border-dashed border-muted-foreground/30 transition-colors hover:bg-secondary hover:text-foreground/80"
          @click="handleTagInputOpen"
        >
          <Plus class="size-3" />
          Добавить тег
        </Badge>
      </div>
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
      <TaskPriority
        :task="task"
        @setPriority="(priority) => patchTask({ priority })"
      />
      <TaskColor
        :task="task"
        @setColor="(c) => patchTask({ color: c })"
      />
    </div>
  </div>

  <DialogTitle class="sr-only">Редактирование задачи</DialogTitle>
</template>
