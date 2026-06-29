<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { ComponentPublicInstance } from 'vue'

import type { IColumnState } from '~/stores/interfaces/IColumnState'

import Column from '~/components/Workspace/Main/Column/Column.vue'
import ColumnSkeleton from '~/components/Workspace/Main/Column/ColumnSkeleton.vue'
import CreateColumnForm from '~/components/Forms/CreateColumnForm.vue'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { Separator } from '~/components/ui/separator'
import TitleBoard from '../../Header/TitleBoard.vue'
import SidebarInset from '~/components/ui/sidebar/SidebarInset.vue'
import HeaderSearch from '../../Header/HeaderSearch.vue'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

type ColumnDropPosition = 'before' | 'after'

interface ColumnDragData {
  type: 'column'
  columnId: string
  boardId: string
}

const COLUMN_ITEM_KIND = 'board-column-item'
const COLUMN_CONTAINER_KIND = 'board-column-container'

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const activeBoardId = computed(() => boardStore.activeBoardId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

const { data: board } = useBoard(activeBoardId, activeWorkspaceId)
const { data: workspace } = useWorkspace(activeWorkspaceId)
const { data: columns, isPending: areColumnsLoading } = useColumns(activeBoardId)
const { isPending: isBoardsLoading } = useBoards(activeWorkspaceId)

const { mutate: moveColumn } = useMoveColumnCard()

const localColumnList = ref<IColumnState[]>([])
const columnsRef = ref<HTMLElement | null>(null)
const isColumnFormShown = ref(false)
const columnElements = new Map<string, HTMLElement>()
const draggingColumnId = ref<string | null>(null)
const columnDragOriginList = ref<IColumnState[] | null>(null)

useHead({
  title: () =>
    board.value
      ? `Kanway | ${board.value.name}`
      : workspace.value
        ? `Kanway | ${workspace.value.name}`
        : 'Kanway',
})

watch(
  () => columns.value,
  (newList) => {
    if (!newList) return

    localColumnList.value = [...newList].sort((a, b) => a.rank.localeCompare(b.rank))
  },
  { immediate: true },
)

function isColumnDragData(data: unknown): data is ColumnDragData {
  if (!data || typeof data !== 'object') return false

  return (
    'type' in data &&
    data.type === 'column' &&
    'columnId' in data &&
    typeof data.columnId === 'string' &&
    'boardId' in data &&
    typeof data.boardId === 'string'
  )
}

function setColumnElement(columnId: string) {
  return (element: Element | ComponentPublicInstance | null) => {
    if (element instanceof HTMLElement) {
      columnElements.set(columnId, element)
      return
    }

    columnElements.delete(columnId)
  }
}

function getHorizontalDropPosition(
  input: { clientX: number },
  element: Element,
): ColumnDropPosition {
  const rect = element.getBoundingClientRect()

  return input.clientX < rect.left + rect.width / 2 ? 'before' : 'after'
}

function handleColumnDrop(
  sourceData: ColumnDragData,
  location: { current: { dropTargets: Array<{ data: Record<string | symbol, unknown> }> } },
) {
  const result = getColumnDropResult(
    sourceData,
    location,
    columnDragOriginList.value ?? localColumnList.value,
  )

  if (!result) return

  const comparisonList = columnDragOriginList.value ?? localColumnList.value
  const currentIndex = comparisonList.findIndex((column) => column.id === sourceData.columnId)
  const currentBeforeId = comparisonList[currentIndex + 1]?.id ?? null
  const currentAfterId = comparisonList[currentIndex - 1]?.id ?? null

  if (result.beforeId === currentBeforeId && result.afterId === currentAfterId) return

  localColumnList.value = result.orderedColumns

  moveColumn({
    id: sourceData.columnId,
    beforeId: result.beforeId,
    afterId: result.afterId,
    boardId: activeBoardId.value,
  })
}

function getColumnDropResult(
  sourceData: ColumnDragData,
  location: {
    current: { dropTargets: Array<{ data: Record<string | symbol, unknown> }> }
  },
  baseColumns: IColumnState[],
) {
  if (!activeBoardId.value) return null

  const containerTarget = location.current.dropTargets.find(
    (target) =>
      target.data.kind === COLUMN_CONTAINER_KIND && target.data.boardId === activeBoardId.value,
  )

  if (!containerTarget) return null

  const sourceColumn = baseColumns.find((column) => column.id === sourceData.columnId)

  if (!sourceColumn) return null

  const itemTarget = location.current.dropTargets.find(
    (target) =>
      target.data.kind === COLUMN_ITEM_KIND && target.data.boardId === activeBoardId.value,
  )

  const nextColumns = baseColumns.filter((column) => column.id !== sourceData.columnId)

  let insertIndex = nextColumns.length

  if (itemTarget && typeof itemTarget.data.columnId === 'string') {
    const targetIndex = nextColumns.findIndex((column) => column.id === itemTarget.data.columnId)

    if (targetIndex !== -1) {
      insertIndex = itemTarget.data.position === 'after' ? targetIndex + 1 : targetIndex
    }
  }

  nextColumns.splice(insertIndex, 0, sourceColumn)

  return {
    orderedColumns: nextColumns,
    beforeId: nextColumns[insertIndex + 1]?.id ?? null,
    afterId: nextColumns[insertIndex - 1]?.id ?? null,
  }
}

function syncColumnPreview(location: {
  current: { dropTargets: Array<{ data: Record<string | symbol, unknown> }> }
}) {
  if (!draggingColumnId.value || !columnDragOriginList.value) return

  const result = getColumnDropResult(
    {
      type: 'column',
      columnId: draggingColumnId.value,
      boardId: activeBoardId.value ?? '',
    },
    location,
    columnDragOriginList.value,
  )

  if (!result) {
    localColumnList.value = [...columnDragOriginList.value]
    return
  }

  localColumnList.value = result.orderedColumns
}

watchPostEffect((onCleanup) => {
  if (!columnsRef.value || !activeBoardId.value || areColumnsLoading.value) return

  const cleanups = [
    dropTargetForElements({
      element: columnsRef.value,
      canDrop: ({ source }) =>
        isColumnDragData(source.data) && source.data.boardId === activeBoardId.value,
      getData: () => ({
        kind: COLUMN_CONTAINER_KIND,
        boardId: activeBoardId.value,
      }),
    }),
    monitorForElements({
      canMonitor: ({ source }) =>
        isColumnDragData(source.data) && source.data.boardId === activeBoardId.value,
      onDragStart: ({ source }) => {
        if (!isColumnDragData(source.data)) return

        draggingColumnId.value = source.data.columnId
        columnDragOriginList.value = [...localColumnList.value]
      },
      onDrag: ({ location }) => {
        syncColumnPreview(location)
      },
      onDrop: ({ source, location }) => {
        const originalColumns = columnDragOriginList.value
        draggingColumnId.value = null
        columnDragOriginList.value = null

        if (!isColumnDragData(source.data)) return

        if (originalColumns) {
          localColumnList.value = [...originalColumns]
        }

        handleColumnDrop(source.data, location)
      },
    }),
  ]

  for (const column of localColumnList.value) {
    const element = columnElements.get(column.id)

    if (!element) continue

    cleanups.push(
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          isColumnDragData(source.data) && source.data.boardId === activeBoardId.value,
        getData: ({ input, element: currentElement }) => ({
          kind: COLUMN_ITEM_KIND,
          boardId: activeBoardId.value,
          columnId: column.id,
          position: getHorizontalDropPosition(input, currentElement),
        }),
      }),
    )
  }

  onCleanup(combine(...cleanups))
})
</script>

<template>
  <SidebarInset>
    <header class="flex justify-between h-12 sm:h-16 shrink-0 items-center gap-2 px-4">
      <div class="flex items-center gap-2">
        <SidebarTrigger class="-ml-1" />
        <Separator
          orientation="vertical"
          class="mr-0 data-[orientation=vertical]:h-4"
        />
        <TitleBoard />
      </div>
      <HeaderSearch />
    </header>

    <Separator />

    <div class="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-y-auto">
      <div class="size-full pt-4 pb-2 flex gap-3 overflow-y-hidden custom-scrollbar">
        <template v-if="!isBoardsLoading">
          <div
            v-if="localColumnList.length > 0 && !areColumnsLoading"
            ref="columnsRef"
            class="h-full"
          >
            <TransitionGroup
              name="column-reorder"
              tag="div"
              class="flex gap-x-3 h-full items-start"
            >
              <div
                v-for="element in localColumnList"
                :key="element.id"
                :ref="setColumnElement(element.id)"
                class="relative shrink-0 h-full transition-transform duration-150"
                :class="{
                  'z-20 scale-[1.02] -rotate-1': draggingColumnId === element.id,
                }"
              >
                <Column :column="element" />
              </div>
            </TransitionGroup>
          </div>

          <template v-else-if="areColumnsLoading">
            <ColumnSkeleton
              v-for="n in 3"
              :key="'skeleton' + n"
            />
          </template>

          <CreateColumnForm
            v-if="isColumnFormShown && activeBoardId"
            @close="isColumnFormShown = false"
            :boardId="activeBoardId"
          />

          <div class="h-full flex items-center pr-10">
            <button
              type="button"
              class="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-200 transition-colors focus:outline-hidden"
              @click="isColumnFormShown = true"
            >
              <Plus class="size-6" />
            </button>
          </div>
        </template>

        <template v-else>
          <ColumnSkeleton
            v-for="n in 3"
            :key="'skeleton' + n"
          />
          <div class="h-full flex items-center">
            <div class="size-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </template>
      </div>
    </div>
  </SidebarInset>
</template>

<style lang="css" scoped>
.ghost-class {
  opacity: 0;
}

.drag-class {
  transform: scale(1.02);
  opacity: 1 !important;
  cursor: grabbing;
  z-index: 9999;
}

.column-reorder-move {
  transition:
    transform 180ms ease,
    opacity 180ms ease;
}
</style>
