<script setup lang="ts">
import draggable from 'vuedraggable'
import { Plus } from '@lucide/vue'

import type { IColumnState } from '~/stores/interfaces/IColumnState'

import Column from '~/components/Workspace/Main/Column/Column.vue'
import ColumnSkeleton from '~/components/Workspace/Main/Column/ColumnSkeleton.vue'
import CreateColumnForm from '~/components/Forms/CreateColumnForm.vue'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { Separator } from '~/components/ui/separator'
import TitleBoard from '../../Header/TitleBoard.vue'
import HeaderSearch from '../../Header/HeaderSearch.vue'
import HeaderFilter from '../../Header/HeaderFilter.vue'

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const activeBoardId = computed(() => boardStore.activeBoardId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

const { data: board } = useBoard(activeBoardId, activeWorkspaceId)
const { data: workspace } = useWorkspace(activeWorkspaceId)
const { data: columns, isPending: areColumnsPending } = useColumns(activeBoardId)
const { isPending: areBoardsPending } = useBoards(activeWorkspaceId)

const areColumnsLoading = useDelayedLoading(areColumnsPending)
const areBoardsLoading = useDelayedLoading(areBoardsPending)

const { mutate: moveColumn } = useMoveColumnCard()

const localColumnList = ref<IColumnState[]>([])
const isColumnFormShown = ref(false)

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

function draggableChange(event: any) {
  if (!event.moved && !event.added) return

  const movedTask = event.moved ? event.moved.element : event.added.element
  const newIndex = event.moved ? event.moved.newIndex : event.added.newIndex

  const beforeColumn = localColumnList.value[newIndex + 1]
  const afterColumn = localColumnList.value[newIndex - 1]

  const beforeId = beforeColumn ? beforeColumn.id : null
  const afterId = afterColumn ? afterColumn.id : null

  moveColumn({
    id: movedTask.id,
    beforeId,
    afterId,
    boardId: activeBoardId.value,
  })
}
</script>

<template>
  <header class="flex justify-between h-12 sm:h-16 shrink-0 items-center gap-2 px-4">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mr-0 data-[orientation=vertical]:h-4"
      />
      <TitleBoard />
    </div>
    <div class="flex items-center gap-x-2">
      <HeaderFilter />
      <HeaderSearch />
    </div>
  </header>

  <Separator />

  <div class="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-y-auto">
    <div class="size-full pt-4 pb-2 flex gap-3 overflow-y-hidden custom-scrollbar">
      <template v-if="!areBoardsLoading">
        <draggable
          v-model="localColumnList"
          @change="draggableChange"
          itemKey="id"
          class="flex gap-x-3 h-full items-start"
          group="columns"
          :force-fallback="true"
          :fallback-on-body="true"
          :animation="150"
          :delay="300"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          ghost-class="ghost-class"
          drag-class="drag-class"
          chosen-class="chosen-class"
          :prevent-on-filter="false"
          filter=".undraggable"
          v-if="localColumnList.length > 0 && !areColumnsLoading"
        >
          <template #item="{ element }">
            <Column :column="element" />
          </template>
        </draggable>

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
</template>
