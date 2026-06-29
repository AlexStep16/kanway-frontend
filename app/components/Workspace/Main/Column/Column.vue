<script setup lang="ts">
import Options from '~/components/Options/Options.vue'
import Task from '../Task/Task.vue'
import { ListFilter, Plus, SquarePen } from 'lucide-vue-next'
import type { ComponentPublicInstance } from 'vue'
import type { IColumnState } from '~/stores/interfaces/IColumnState'
import type { ITaskState } from '~/stores/interfaces/ITaskState'
import _ from 'lodash'
import CreateTaskForm from '~/components/Forms/CreateTaskForm.vue'
import { EntityType } from '~/enums/EntityType'
import TransferForm from '~/components/Options/TransferForm.vue'
import EntityCardSkeleton from '../EntityCardSkeleton.vue'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

type TaskDropPosition = 'before' | 'after'

interface TaskDragData {
  type: 'task'
  taskId: string
  boardId: string
  columnId: string
  task: ITaskState
}

const TASK_ITEM_KIND = 'column-task-item'
const TASK_CONTAINER_KIND = 'column-task-container'

const props = defineProps<{
  column: IColumnState
}>()

const taskFilterStore = useTaskFilterStore()

const columnId = computed(() => props.column.id)
const columnBoardId = computed(() => props.column.board.id)
const columnRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
const tasksContainerRef = ref<HTMLElement | null>(null)
const draggingTaskId = ref<string | null>(null)
const taskElements = new Map<string, HTMLElement>()
const taskDragPreview = useState<{
  draggingTaskId: string | null
  sourceColumnId: string | null
  targetColumnId: string | null
  targetTaskId: string | null
  position: TaskDropPosition | null
  task: ITaskState | null
}>('workspace-main-task-drag-preview', () => ({
  draggingTaskId: null,
  sourceColumnId: null,
  targetColumnId: null,
  targetTaskId: null,
  position: null,
  task: null,
}))

const { isPending: areTasksLoading } = useTasks(columnBoardId)

const { tasks } = useVisibleTasks(columnBoardId, columnId)
const { data: boardsData } = useBoards(computed(() => props.column.workspace.id))

const { mutate: moveTaskCard } = useMoveTaskCard()
const { mutate: updateColumn } = useUpdateColumn()
const { mutate: moveColumn } = useMoveColumn()
const { mutate: cloneColumn } = useCloneColumn()
const { mutate: archiveColumn } = useArchiveColumn()

const boards = computed(() => boardsData.value || [])

const status = reactive(useColumnMutationStatus(columnId))

const isInputVisible = ref(false)
const inputEditRef = ref<HTMLInputElement | null>(null)

const localTaskList = ref<ITaskState[]>([])
const isTaskAddFormShown = ref(false)

const displayTaskList = computed(() => {
  const preview = taskDragPreview.value

  if (!preview.draggingTaskId || !preview.task) {
    return localTaskList.value
  }

  const isSourceColumn = preview.sourceColumnId === props.column.id
  const isTargetColumn = preview.targetColumnId === props.column.id

  if (!isSourceColumn && !isTargetColumn) {
    return localTaskList.value
  }

  const nextTasks = localTaskList.value.filter((task) => task.id !== preview.draggingTaskId)

  if (!isTargetColumn) {
    return nextTasks
  }

  let insertIndex = nextTasks.length

  if (preview.targetTaskId) {
    const targetIndex = nextTasks.findIndex((task) => task.id === preview.targetTaskId)

    if (targetIndex !== -1) {
      insertIndex = preview.position === 'after' ? targetIndex + 1 : targetIndex
    }
  }

  nextTasks.splice(insertIndex, 0, {
    ...preview.task,
    column: {
      ...preview.task.column,
      id: props.column.id,
      name: props.column.name,
    },
  })

  return nextTasks
})

watch(
  tasks,
  (newList) => {
    localTaskList.value = _.cloneDeep(newList).sort((a, b) => a.rank.localeCompare(b.rank))
  },
  { deep: true, immediate: true },
)

function isTaskDragData(data: unknown): data is TaskDragData {
  if (!data || typeof data !== 'object') return false

  return (
    'type' in data &&
    data.type === 'task' &&
    'taskId' in data &&
    typeof data.taskId === 'string' &&
    'boardId' in data &&
    typeof data.boardId === 'string' &&
    'columnId' in data &&
    typeof data.columnId === 'string'
  )
}

function setTaskElement(taskId: string) {
  return (element: Element | ComponentPublicInstance | null) => {
    if (element instanceof HTMLElement) {
      taskElements.set(taskId, element)
      return
    }

    taskElements.delete(taskId)
  }
}

function getVerticalDropPosition(input: { clientY: number }, element: Element): TaskDropPosition {
  const rect = element.getBoundingClientRect()

  return input.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
}

function handleTaskDrop(
  sourceData: TaskDragData,
  location: { current: { dropTargets: Array<{ data: Record<string | symbol, unknown> }> } },
) {
  const containerTarget = location.current.dropTargets.find(
    (target) =>
      target.data.kind === TASK_CONTAINER_KIND && target.data.columnId === props.column.id,
  )

  if (!containerTarget) return

  const itemTarget = location.current.dropTargets.find(
    (target) => target.data.kind === TASK_ITEM_KIND && target.data.columnId === props.column.id,
  )

  const nextTasks = localTaskList.value.filter((task) => task.id !== sourceData.taskId)

  let insertIndex = nextTasks.length

  if (itemTarget && typeof itemTarget.data.taskId === 'string') {
    const targetIndex = nextTasks.findIndex((task) => task.id === itemTarget.data.taskId)

    if (targetIndex !== -1) {
      insertIndex = itemTarget.data.position === 'after' ? targetIndex + 1 : targetIndex
    }
  }

  const beforeId = nextTasks[insertIndex]?.id ?? null
  const afterId = nextTasks[insertIndex - 1]?.id ?? null

  const currentIndex = localTaskList.value.findIndex((task) => task.id === sourceData.taskId)
  const currentBeforeId = localTaskList.value[currentIndex + 1]?.id ?? null
  const currentAfterId = localTaskList.value[currentIndex - 1]?.id ?? null

  if (
    sourceData.columnId === props.column.id &&
    beforeId === currentBeforeId &&
    afterId === currentAfterId
  ) {
    return
  }

  moveTaskCard({
    id: sourceData.taskId,
    beforeId,
    afterId,
    newColumnId: props.column.id,
    boardId: props.column.board.id,
  })
}

function resetTaskPreview() {
  taskDragPreview.value = {
    draggingTaskId: null,
    sourceColumnId: null,
    targetColumnId: null,
    targetTaskId: null,
    position: null,
    task: null,
  }
}

function syncTaskPreview(location: {
  current: { dropTargets: Array<{ data: Record<string | symbol, unknown> }> }
}) {
  const containerTarget = location.current.dropTargets.find(
    (target) =>
      target.data.kind === TASK_CONTAINER_KIND && target.data.columnId === props.column.id,
  )

  if (!containerTarget) {
    if (taskDragPreview.value.targetColumnId === props.column.id) {
      taskDragPreview.value = {
        ...taskDragPreview.value,
        targetColumnId: null,
        targetTaskId: null,
        position: null,
      }
    }
    return
  }

  const itemTarget = location.current.dropTargets.find(
    (target) => target.data.kind === TASK_ITEM_KIND && target.data.columnId === props.column.id,
  )

  if (itemTarget && typeof itemTarget.data.taskId === 'string') {
    taskDragPreview.value = {
      ...taskDragPreview.value,
      targetColumnId: props.column.id,
      targetTaskId: itemTarget.data.taskId,
      position: itemTarget.data.position === 'after' ? 'after' : 'before',
    }
    return
  }

  taskDragPreview.value = {
    ...taskDragPreview.value,
    targetColumnId: props.column.id,
    targetTaskId: null,
    position: null,
  }
}

function showInput() {
  if (status.isBusy) return

  isInputVisible.value = true

  nextTick(() => {
    if (inputEditRef.value) {
      inputEditRef.value.focus()
    }
  })
}

function updateColumnName(event: Event) {
  const target = event.target as HTMLInputElement
  const newName = target.value.trim()

  if (newName) {
    updateColumn({
      payload: {
        id: props.column.id,
        name: newName,
      },
      boardId: props.column.board.id,
    })
  }

  isInputVisible.value = false
}

function handleMove(newBoardId: string) {
  const board = boards.value.find((b) => b.id === newBoardId)

  if (board) {
    moveColumn({
      payload: props.column,
      oldBoardId: props.column.board.id,
      newBoardId: board.id,
    })
  }
}

function handleCopy() {
  if (!props.column) return

  cloneColumn({
    id: props.column.id,
  })
}

function handleArchive() {
  if (!props.column) return

  archiveColumn({
    column: props.column,
  })
}

function getRandomTasksNumber() {
  const randomNumber = Math.floor(Math.random() * 4) + 1

  return randomNumber
}

const otherBoards = computed(() => {
  return boards.value.filter((board) => board.id !== props.column.board.id)
})

watchPostEffect((onCleanup) => {
  if (!columnRef.value) return

  const dragHandle = columnRef.value.querySelector('.column-drag-handle') ?? undefined

  onCleanup(
    draggable({
      element: columnRef.value,
      dragHandle,
      canDrag: ({ dragHandle }) => !!dragHandle && !status.isBusy,
      getInitialData: () => ({
        type: 'column',
        columnId: props.column.id,
        boardId: props.column.board.id,
        column: props.column,
      }),
      onDragStart: () => {
        dragging.value = true
      },
      onDrop: () => {
        dragging.value = false
      },
    }),
  )
})

watchPostEffect((onCleanup) => {
  if (!tasksContainerRef.value || areTasksLoading.value) return

  const cleanups = [
    dropTargetForElements({
      element: tasksContainerRef.value,
      canDrop: ({ source }) =>
        isTaskDragData(source.data) && source.data.boardId === props.column.board.id,
      getData: () => ({
        kind: TASK_CONTAINER_KIND,
        columnId: props.column.id,
      }),
      onDragLeave: () => {
        if (taskDragPreview.value.targetColumnId === props.column.id) {
          taskDragPreview.value = {
            ...taskDragPreview.value,
            targetColumnId: null,
            targetTaskId: null,
            position: null,
          }
        }
      },
    }),
    monitorForElements({
      canMonitor: ({ source }) =>
        isTaskDragData(source.data) && source.data.boardId === props.column.board.id,
      onDragStart: ({ source }) => {
        if (!isTaskDragData(source.data)) return

        draggingTaskId.value = source.data.taskId
        taskDragPreview.value = {
          draggingTaskId: source.data.taskId,
          sourceColumnId: source.data.columnId,
          targetColumnId: source.data.columnId,
          targetTaskId: null,
          position: null,
          task: source.data.task,
        }
      },
      onDrag: ({ location }) => {
        syncTaskPreview(location)
      },
      onDrop: ({ source, location }) => {
        draggingTaskId.value = null

        resetTaskPreview()

        if (!isTaskDragData(source.data)) return

        handleTaskDrop(source.data, location)
      },
    }),
  ]

  for (const task of localTaskList.value) {
    const element = taskElements.get(task.id)

    if (!element) continue

    cleanups.push(
      draggable({
        element,
        canDrag: () => !status.isBusy,
        getInitialData: () => ({
          type: 'task',
          taskId: task.id,
          boardId: props.column.board.id,
          columnId: props.column.id,
          task,
        }),
        onDragStart: () => {
          draggingTaskId.value = task.id
        },
        onDrop: () => {
          if (draggingTaskId.value === task.id) {
            draggingTaskId.value = null
          }
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          isTaskDragData(source.data) && source.data.boardId === props.column.board.id,
        getData: ({ input, element: currentElement }) => ({
          kind: TASK_ITEM_KIND,
          columnId: props.column.id,
          taskId: task.id,
          position: getVerticalDropPosition(input, currentElement),
        }),
      }),
    )
  }

  onCleanup(combine(...cleanups))
})
</script>

<template>
  <div
    class="bg-gray-100 flex flex-col shrink-0 gap-y-3 py-3 rounded-md h-full w-70 sm:w-75 group/column select-none"
    :class="{
      'opacity-55 scale-[1.01] rotate-[0.8deg] shadow-2xl shadow-gray-300/70': dragging,
    }"
    ref="columnRef"
  >
    <!-- Header -->
    <div class="column-drag-handle flex w-full px-4 justify-between items-center">
      <div
        class="flex gap-x-2 items-center h-8 min-w-0 text-sm text-gray-800 cursor-pointer transition-colors duration-100 group"
        @click="showInput"
        v-show="!isInputVisible"
      >
        <div
          class="flex items-center justify-center"
          v-if="taskFilterStore.isFilterActive"
          title="Применён фильтр"
        >
          <ListFilter class="size-4 text-blue-500" />
        </div>
        <span class="font-semibold group-hover:text-gray-600 truncate">{{ column.name }}</span>
        <SquarePen
          class="size-3.5 shrink-0 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>

      <div
        class="h-8 grow relative undraggable"
        v-if="isInputVisible"
      >
        <input
          type="text"
          class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
          :value="column.name"
          @change="updateColumnName"
          @blur="isInputVisible = false"
          placeholder="Название колонки"
          ref="inputEditRef"
        />
        <div class="shrink-0 absolute -bottom-0.5 w-full left-0">
          <div class="h-0.5 bg-blue-500 w-full animation-grow"></div>
        </div>
      </div>

      <Options
        :options="{
          copy: true,
          move: true,
          archive: true,
        }"
        :status="status"
        :item="column"
        :isAlwaysVisible="true"
        :entityType="EntityType.Column"
        groupName="column"
        class="text-gray-600 undraggable"
        @archive="handleArchive"
        @copy="handleCopy"
      >
        <template #transfer-content="{ close }">
          <TransferForm
            :items="otherBoards"
            :isProcessing="status.isBusy"
            :isItemMoving="status.isMoving"
            :noItemsText="'Нет других досок'"
            @close="close"
            @moveItem="handleMove"
          />
        </template>
      </Options>
    </div>

    <!-- Tasks -->
    <div class="flex grow flex-col min-h-0 px-3 gap-y-2 mb-3">
      <div class="px-1 undraggable">
        <Button
          variant="primaryMuted"
          class="w-full undraggable font-semibold text-xs cursor-pointer"
          @click="isTaskAddFormShown = true"
          :disabled="status.isBusy"
        >
          <Plus class="size-4" />
          Добавить задачу
        </Button>
      </div>
      <div
        class="overflow-y-auto overflow-x-hidden px-1 custom-scrollbar flex flex-col grow gap-y-2 pb-1"
        ref="tasksContainerRef"
      >
        <TransitionGroup
          name="task-reorder"
          tag="div"
          class="flex flex-col gap-y-2"
          v-if="!areTasksLoading && displayTaskList.length > 0"
        >
          <div
            v-for="element in displayTaskList"
            :key="element.id"
            :ref="setTaskElement(element.id)"
            class="relative transition-transform duration-150"
            :class="{
              'opacity-45 scale-[1.02] rotate-[0.7deg] z-20': draggingTaskId === element.id,
            }"
          >
            <Task
              :task="element"
              :options="{ hasCopy: true, hasDelete: true, isCompletable: true }"
            />
          </div>
        </TransitionGroup>

        <template v-else-if="areTasksLoading">
          <EntityCardSkeleton
            v-for="number in getRandomTasksNumber()"
            :key="number + '_skeleton_task'"
          />
        </template>

        <CreateTaskForm
          v-if="isTaskAddFormShown && column.id && column.board.id"
          :columnId="column.id"
          :boardId="column.board.id"
          @close="isTaskAddFormShown = false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ghost-class {
  opacity: 0;
}

.drag-class {
  transform: scale(1.04);
  opacity: 0.95 !important;
  cursor: grabbing;
  z-index: 9999;
}

.task-reorder-move {
  transition:
    transform 180ms ease,
    opacity 180ms ease;
}
</style>
