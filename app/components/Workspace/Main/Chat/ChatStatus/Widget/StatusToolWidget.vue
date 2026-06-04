<script setup lang="ts">
import type { StatusTools } from '~/types/StatusTools'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import SearchTasks from './ToolCall/Tasks/SearchTasks.vue'
import SearchCategories from './ToolCall/Categories/SearchCategories.vue'
import UpdateTasks from './ToolCall/Tasks/UpdateTasks.vue'
import UpdateCategories from './ToolCall/Categories/UpdateCategories.vue'
import DeleteArchiveTasks from './ToolCall/Tasks/DeleteArchiveTasks.vue'
import DeleteArchiveCategories from './ToolCall/Categories/DeleteArchiveCategories.vue'
import CloneTasks from './ToolCall/Tasks/CloneTasks.vue'
import CloneCategories from './ToolCall/Categories/CloneCategories.vue'
import RecoverTasks from './ToolCall/Tasks/RecoverTasks.vue'
import RecoverCategories from './ToolCall/Categories/RecoverCategories.vue'
import MoveTasks from './ToolCall/Tasks/MoveTasks.vue'
import MoveCategories from './ToolCall/Categories/MoveCategories.vue'

import SearchBoards from './ToolCall/Boards/SearchBoards.vue'
import UpdateBoards from './ToolCall/Boards/UpdateBoards.vue'
import DeleteArchiveBoards from './ToolCall/Boards/DeleteArchiveBoards.vue'
import CloneBoards from './ToolCall/Boards/CloneBoards.vue'
import RecoverBoards from './ToolCall/Boards/RecoverBoards.vue'
import MoveBoards from './ToolCall/Boards/MoveBoards.vue'
import SearchWorkspaces from './ToolCall/Workspaces/SearchWorkspaces.vue'
import UpdateWorkspaces from './ToolCall/Workspaces/UpdateWorkspaces.vue'
import DeleteArchiveWorkspaces from './ToolCall/Workspaces/DeleteArchiveWorkspaces.vue'
import CloneWorkspaces from './ToolCall/Workspaces/CloneWorkspaces.vue'
import RecoverWorkspaces from './ToolCall/Workspaces/RecoverWorkspaces.vue'
import UndoOperations from './ToolCall/UndoOperations.vue'

const props = defineProps<{
  tool: StatusTools
  chatId: string
  threadId: string
  statusLogId: string
  state: StatusStatesEnum
}>()

const stateClasses = computed(() => {
  return {
    'text-muted-foreground':
      props.state === StatusStatesEnum.COMPLETED || props.state === StatusStatesEnum.CANCELLED,
    'text-red-500': props.state === StatusStatesEnum.FAILED,
    'shimmer-text text-primary': props.state === StatusStatesEnum.IN_PROGRESS,
    'text-yellow-500': props.state === StatusStatesEnum.AWAITING_CONFIRMATION,
  }
})

const toolComponents = {
  search_tasks: SearchTasks,
  search_categories: SearchCategories,
  search_boards: SearchBoards,
  search_workspaces: SearchWorkspaces,

  update_tasks: UpdateTasks,
  update_categories: UpdateCategories,
  update_boards: UpdateBoards,
  update_workspaces: UpdateWorkspaces,

  delete_archive_tasks: DeleteArchiveTasks,
  delete_archive_categories: DeleteArchiveCategories,
  delete_archive_boards: DeleteArchiveBoards,
  delete_archive_workspaces: DeleteArchiveWorkspaces,

  clone_tasks: CloneTasks,
  clone_categories: CloneCategories,
  clone_boards: CloneBoards,
  clone_workspaces: CloneWorkspaces,

  recover_tasks: RecoverTasks,
  recover_categories: RecoverCategories,
  recover_boards: RecoverBoards,
  recover_workspaces: RecoverWorkspaces,

  move_tasks: MoveTasks,
  move_categories: MoveCategories,
  move_boards: MoveBoards,

  undo_operations: UndoOperations,
} as const

const activeToolComponent = computed(() => {
  return toolComponents[props.tool.name as keyof typeof toolComponents] || null
})

const mutationTools = new Set([
  'update_tasks',
  'update_categories',
  'update_boards',
  'update_workspaces',
  'delete_archive_tasks',
  'delete_archive_categories',
  'delete_archive_boards',
  'delete_archive_workspaces',
  'clone_tasks',
  'clone_categories',
  'clone_boards',
  'clone_workspaces',
  'recover_tasks',
  'recover_categories',
  'recover_boards',
  'recover_workspaces',
  'move_tasks',
  'move_categories',
  'move_boards',

  'undo_operations',
])

const toolCallProps = computed(() => {
  const baseProps = {
    state: props.state,
    content: props.tool.content,
    stateClasses: stateClasses.value,
  }

  if (!mutationTools.has(props.tool.name)) {
    return baseProps
  }

  return {
    ...baseProps,
    toolId: props.tool.id,
    chatId: props.chatId,
    threadId: props.threadId,
    statusLogId: props.statusLogId,
  }
})
</script>

<template>
  <component
    :is="activeToolComponent"
    v-if="activeToolComponent"
    v-bind="toolCallProps"
  />
</template>
