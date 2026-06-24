<script setup lang="ts">
import type { StatusTools } from '~/types/StatusTools'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'

import SearchTasks from './ToolCall/Tasks/SearchTasks.vue'
import SearchColumns from './ToolCall/Columns/SearchColumns.vue'
import SearchBoards from './ToolCall/Boards/SearchBoards.vue'
import SearchWorkspaces from './ToolCall/Workspaces/SearchWorkspaces.vue'

import SearchTasksSemantic from './ToolCall/Tasks/SearchSemanticTasks.vue'

import CreateTasks from './ToolCall/Tasks/CreateTasks.vue'
import CreateColumns from './ToolCall/Columns/CreateColumns.vue'
import CreateBoards from './ToolCall/Boards/CreateBoards.vue'
import CreateWorkspaces from './ToolCall/Workspaces/CreateWorkspaces.vue'

import UpdateTasks from './ToolCall/Tasks/UpdateTasks.vue'
import UpdateColumns from './ToolCall/Columns/UpdateColumns.vue'
import UpdateBoards from './ToolCall/Boards/UpdateBoards.vue'
import UpdateWorkspaces from './ToolCall/Workspaces/UpdateWorkspaces.vue'

import DeleteArchiveTasks from './ToolCall/Tasks/DeleteArchiveTasks.vue'
import DeleteArchiveColumns from './ToolCall/Columns/DeleteArchiveColumns.vue'
import DeleteArchiveBoards from './ToolCall/Boards/DeleteArchiveBoards.vue'
import DeleteArchiveWorkspaces from './ToolCall/Workspaces/DeleteArchiveWorkspaces.vue'

import CloneTasks from './ToolCall/Tasks/CloneTasks.vue'
import CloneColumns from './ToolCall/Columns/CloneColumns.vue'
import CloneBoards from './ToolCall/Boards/CloneBoards.vue'
import CloneWorkspaces from './ToolCall/Workspaces/CloneWorkspaces.vue'

import RecoverTasks from './ToolCall/Tasks/RecoverTasks.vue'
import RecoverColumns from './ToolCall/Columns/RecoverColumns.vue'
import RecoverBoards from './ToolCall/Boards/RecoverBoards.vue'
import RecoverWorkspaces from './ToolCall/Workspaces/RecoverWorkspaces.vue'

import MoveTasks from './ToolCall/Tasks/MoveTasks.vue'
import MoveColumns from './ToolCall/Columns/MoveColumns.vue'
import MoveBoards from './ToolCall/Boards/MoveBoards.vue'
import MoveWorkspaces from './ToolCall/Workspaces/MoveWorkspaces.vue'

import ReorderTasks from './ToolCall/Tasks/ReorderTasks.vue'
import ReorderColumns from './ToolCall/Columns/ReorderColumns.vue'
import ReorderBoards from './ToolCall/Boards/ReorderBoards.vue'
import ReorderWorkspaces from './ToolCall/Workspaces/ReorderWorkspaces.vue'

import UndoOperations from './ToolCall/UndoOperations.vue'

const props = defineProps<{
  tool: StatusTools
  chatId: string
  threadId: string
  statusLogId: string
  state: StatusStatesEnum
  isDemo?: boolean
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
  search_tasks_semantic: SearchTasksSemantic,
  search_columns: SearchColumns,
  search_boards: SearchBoards,
  search_workspaces: SearchWorkspaces,

  create_tasks: CreateTasks,
  create_columns: CreateColumns,
  create_boards: CreateBoards,
  create_workspaces: CreateWorkspaces,

  update_tasks: UpdateTasks,
  update_columns: UpdateColumns,
  update_boards: UpdateBoards,
  update_workspaces: UpdateWorkspaces,

  delete_archive_tasks: DeleteArchiveTasks,
  delete_archive_columns: DeleteArchiveColumns,
  delete_archive_boards: DeleteArchiveBoards,
  delete_archive_workspaces: DeleteArchiveWorkspaces,

  clone_tasks: CloneTasks,
  clone_columns: CloneColumns,
  clone_boards: CloneBoards,
  clone_workspaces: CloneWorkspaces,

  recover_tasks: RecoverTasks,
  recover_columns: RecoverColumns,
  recover_boards: RecoverBoards,
  recover_workspaces: RecoverWorkspaces,

  move_tasks: MoveTasks,
  move_columns: MoveColumns,
  move_boards: MoveBoards,
  move_workspaces: MoveWorkspaces,

  reorder_tasks: ReorderTasks,
  reorder_columns: ReorderColumns,
  reorder_boards: ReorderBoards,
  reorder_workspaces: ReorderWorkspaces,

  undo_operations: UndoOperations,
} as const

const activeToolComponent = computed(() => {
  return toolComponents[props.tool.name as keyof typeof toolComponents] || null
}) as ComputedRef<any>

const mutationTools = new Set([
  'create_tasks',
  'create_columns',
  'create_boards',
  'create_workspaces',

  'update_tasks',
  'update_columns',
  'update_boards',
  'update_workspaces',

  'delete_archive_tasks',
  'delete_archive_columns',
  'delete_archive_boards',
  'delete_archive_workspaces',

  'clone_tasks',
  'clone_columns',
  'clone_boards',
  'clone_workspaces',

  'recover_tasks',
  'recover_columns',
  'recover_boards',
  'recover_workspaces',

  'move_tasks',
  'move_columns',
  'move_boards',
  'move_workspaces',

  'reorder_tasks',
  'reorder_columns',
  'reorder_boards',
  'reorder_workspaces',

  'undo_operations',
])

const toolCallProps = computed(() => {
  const baseProps = {
    state: props.state,
    content: props.tool.content,
    stateClasses: stateClasses.value,
    isDemo: props.isDemo,
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
