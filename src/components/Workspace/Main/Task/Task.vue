<script setup lang="ts">
import { computed, ref } from 'vue'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { useUIStore } from '@/stores/ui'
import { useUpdateTask } from '@/composables/tasks/mutations/useUpdateTask'
import { useArchiveTask } from '@/composables/tasks/mutations/useArchiveTask'
import { useCloneTask } from '@/composables/tasks/mutations/useCloneTask'
import { useTaskMutationStatus } from '@/composables/tasks/mutations/useTaskMutationStatus'
import EntityCard, { EntityCardOptions } from '../EntityCard.vue'

const props = defineProps<{
  task: ITaskState
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

const uiStore = useUIStore()

// --- Local State ---
const dragStartTime = ref<number>(0)

// --- Mutations ---
const { mutate: updateTask } = useUpdateTask()
const { mutate: archiveTask } = useArchiveTask()
const { mutate: cloneTask } = useCloneTask()

const status = useTaskMutationStatus(computed(() => props.task.id))

// --- Logic ---

function startDragging() {
  dragStartTime.value = Date.now()
}

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
  if (props.options?.isStatic) return

  const clickDuration = Date.now() - dragStartTime.value
  if (clickDuration > 250) return

  uiStore.openTaskToEdit(props.task)
}

function handleCopy() {
  if (props.options?.isStatic) return

  cloneTask({ id: props.task.id })
}

function handleArchive() {
  if (props.options?.isStatic) return

  archiveTask({ task: props.task })
}
</script>

<template>
  <EntityCard
    :entity="task"
    :options="options"
    :classes="classes"
    :status="status"
    :selected-ids="selectedIds"
    @toggle-completion="toggleTaskCompletion"
    @edit="handleEdit"
    @copy="handleCopy"
    @archive="handleArchive"
    @mousedown="startDragging"
  >
    <slot />
  </EntityCard>
</template>
