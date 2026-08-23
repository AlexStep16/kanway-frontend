<script setup lang="ts">
import Options from '~/components/Options/Options.vue'
import Task from '../Task/Task.vue'
import { Plus, SquarePen } from '@lucide/vue'
import type { IColumnState } from '~/stores/interfaces/IColumnState'
import draggable from 'vuedraggable'
import type { ITaskState } from '~/stores/interfaces/ITaskState'
import _ from 'lodash'
import CreateTaskForm from '~/components/Forms/CreateTaskForm.vue'
import { EntityType } from '~/enums/EntityType'
import TransferForm from '~/components/Options/TransferForm.vue'
import EntityCardSkeleton from '../EntityCardSkeleton.vue'

const props = defineProps<{
  column: IColumnState
}>()

const taskFilterStore = useTaskFilterStore()

const columnId = computed(() => props.column.id)
const columnBoardId = computed(() => props.column.board.id)

const { isPending: areTasksLoading, data: allTasks } = useTasks(columnBoardId)

const totalTaskCount = computed(
  () => allTasks.value?.filter((t) => !t.isDeleted && t.column.id === columnId.value).length ?? 0,
)

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

watch(
  tasks,
  (newList) => {
    localTaskList.value = _.cloneDeep(newList).sort((a, b) => a.rank.localeCompare(b.rank))
  },
  { deep: true, immediate: true },
)

function draggableChange(event: any) {
  if (!event.moved && !event.added) return

  const movedTask = event.moved ? event.moved.element : event.added.element
  const newIndex = event.moved ? event.moved.newIndex : event.added.newIndex

  const beforeTask = localTaskList.value[newIndex + 1]
  const afterTask = localTaskList.value[newIndex - 1]

  const beforeId = beforeTask ? beforeTask.id : null
  const afterId = afterTask ? afterTask.id : null

  moveTaskCard({
    id: movedTask.id,
    beforeId,
    afterId,
    newColumnId: props.column.id,
    boardId: props.column.board.id,
  })
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
</script>

<template>
  <div
    class="bg-gray-100 flex flex-col shrink-0 gap-y-3 py-3 rounded-md h-full w-70 sm:w-75 group/column select-none"
  >
    <!-- Header -->
    <div class="flex w-full px-4 justify-between items-center">
      <div
        class="flex flex-col min-w-0 cursor-pointer transition-colors duration-100 group"
        @click="showInput"
        v-show="!isInputVisible"
      >
        <div class="flex gap-x-2 items-center h-8 text-sm text-gray-800">
          <span class="font-semibold group-hover:text-gray-600 truncate">{{ column.name }}</span>
          <SquarePen
            class="size-3.5 shrink-0 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </div>
        <span
          v-if="taskFilterStore.isFilterActive"
          class="text-xs text-gray-400 leading-none -mt-1"
          >Задач соответствует фильтрам: {{ localTaskList.length }}
        </span>
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

      <div class="flex items-center gap-x-1 pl-1">
        <TooltipProvider
          :disableHoverableContent="true"
          v-if="!taskFilterStore.isFilterActive"
        >
          <Tooltip :delayDuration="300">
            <TooltipTrigger as-child>
              <span
                class="text-sm text-gray-400 tabular-nums hover:text-gray-500 transition-colors duration-100"
                title="Всего задач"
                >{{ totalTaskCount }}</span
              >
            </TooltipTrigger>
            <TooltipContent>
              <p>Всего задач</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
          tooltipEntityType="колонкой"
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
    </div>

    <!-- Tasks -->
    <div class="flex grow flex-col min-h-0 px-3 gap-y-2 mb-3">
      <div class="px-1 undraggable">
        <Button
          variant="primaryMuted"
          class="w-full font-semibold text-xs cursor-pointer"
          @click="isTaskAddFormShown = true"
          :disabled="status.isBusy"
        >
          <Plus class="size-4" />
          Добавить задачу
        </Button>
      </div>
      <div
        class="overflow-y-auto overflow-x-hidden px-1 custom-scrollbar flex flex-col grow gap-y-2 pb-1"
      >
        <draggable
          @change="draggableChange"
          :list="localTaskList"
          :force-fallback="true"
          :fallback-on-body="true"
          :delay="300"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          itemKey="id"
          class="flex flex-col gap-y-2"
          :class="{
            grow: !isTaskAddFormShown,
          }"
          group="tasks"
          :animation="150"
          ghost-class="ghost-class"
          chosen-class="chosen-class"
          drag-class="drag-class"
          filter=".undraggable"
          :prevent-on-filter="false"
          :disabled="status.isBusy"
          v-if="!areTasksLoading && !(isTaskAddFormShown && localTaskList.length === 0)"
        >
          <template #item="{ element }">
            <Task
              :key="element.id"
              :task="element"
              :options="{ hasCopy: true, hasDelete: true, isCompletable: true }"
            />
          </template>
        </draggable>

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

<style>
.ghost-class {
  opacity: 0.45;
}

.drag-class {
  opacity: 0.95 !important;
  cursor: grabbing;
  z-index: 9999;
}
</style>
