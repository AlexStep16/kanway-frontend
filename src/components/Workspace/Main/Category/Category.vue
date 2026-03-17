<script setup lang="ts">
import ButtonCreate from '@components/Buttons/ButtonCreate.vue'
import Options from '@components/Options/Options.vue'
import Task from '../Task/Task.vue'
import { ListFilter, SquarePen } from 'lucide-vue-next'
import { computed, nextTick, ref, toValue, watch } from 'vue'
import { Nullable } from '@/types/utils'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import draggable from 'vuedraggable'
import { ITaskState } from '@stores/interfaces/ITaskState'
import _ from 'lodash'
import { useVisibleTasks } from '@/composables/tasks/useVisibleTasks'
import { useUpdateManyTasks } from '@/composables/tasks/mutations/useUpdateManyTasks'
import { useUpdateCategory } from '@/composables/categories/mutations/useUpdateCategory'
import { useCategoryMutationStatus } from '@/composables/categories/mutations/useCategoryMutationStatus'
import { useTaskFilterStore } from '@/stores/taskFilters'
import CreateTaskForm from '@/components/Forms/CreateTaskForm.vue'
import { EntityType } from '@/enums/EntityType'
import TransferForm from '@/components/Options/TransferForm.vue'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { useMoveCategory } from '@/composables/categories/mutations/useMoveCategory'
import { useCloneCategory } from '@/composables/categories/mutations/useCloneCategory'
import { useArchiveCategory } from '@/composables/categories/mutations/useArchiveCategory'
import { useTasks } from '@/composables/tasks/queries/useTasks'
import EntityCardSkeleton from '../EntityCardSkeleton.vue'

const props = defineProps<{
  category: ICategoryState
}>()

const taskFilterStore = useTaskFilterStore()

const { isPending: areTasksLoading } = useTasks(props.category.board.id)

const { tasks } = useVisibleTasks(
  computed(() => props.category.board.id),
  computed(() => props.category.id),
)
const { data: boardsData } = useBoards(computed(() => props.category.workspace.id))

const { mutate: updateTasks } = useUpdateManyTasks()
const { mutate: updateCategory } = useUpdateCategory()
const { mutate: moveCategory } = useMoveCategory()
const { mutate: cloneCategory } = useCloneCategory()
const { mutate: archiveCategory } = useArchiveCategory()

const boards = computed(() => boardsData.value || [])

const status = useCategoryMutationStatus(props.category.id)

const isInputVisible = ref(false)
const inputEditRef = ref<Nullable<HTMLInputElement>>(null)

const localTaskList = ref<ITaskState[]>([])
const isTaskAddFormShown = ref(false)

watch(
  tasks,
  (newList) => {
    localTaskList.value = _.cloneDeep(newList).sort((a, b) => a.order - b.order)
  },
  { deep: true, immediate: true },
)

function sortTasks() {
  let isSortNeeded = false

  localTaskList.value.forEach((task: ITaskState, index: number) => {
    if (task.order !== index + 1 || task.category.id !== props.category.id) {
      isSortNeeded = true
    }

    task.order = index + 1
    task.category.id = props.category.id
    task.category.name = props.category.name
  })

  if (isSortNeeded) {
    const reducedTasks = localTaskList.value.map((task: ITaskState) => {
      return {
        id: task.id,
        order: task.order,
        category: { id: task.category.id, name: task.category.name },
      }
    })

    updateTasks({
      payload: reducedTasks,
    })
  }
}

function showInput() {
  if (toValue(status.isBusy)) return

  isInputVisible.value = true

  nextTick(() => {
    if (inputEditRef.value) {
      inputEditRef.value.focus()
    }
  })
}

function updateCategoryName(event: Event) {
  const target = event.target as HTMLInputElement
  const newName = target.value.trim()

  if (newName) {
    updateCategory({
      payload: {
        id: props.category.id,
        name: newName,
      },
      boardId: props.category.board.id,
    })
  }

  isInputVisible.value = false
}

function handleMove(newBoardId: string) {
  const board = boards.value.find((b) => b.id === newBoardId)

  if (board) {
    moveCategory({
      payload: props.category,
      oldBoardId: props.category.board.id,
      newBoardId: board.id,
      oldWorkspaceId: props.category.workspace.id,
      newWorkspaceId: board.workspace.id,
    })
  }
}

function handleCopy() {
  if (!props.category) return

  cloneCategory({
    id: props.category.id,
  })
}

function handleArchive() {
  if (!props.category) return

  archiveCategory({
    category: props.category,
  })
}

function getRandomTasksNumber() {
  const randomNumber = Math.floor(Math.random() * 4) + 1

  return randomNumber
}

const otherBoards = computed(() => {
  return boards.value.filter((board) => board.id !== props.category.board.id)
})
</script>

<template>
  <div
    class="bg-gray-100 flex flex-col shrink-0 gap-y-3 py-3 px-4 rounded-md h-full w-70 sm:w-75 group/category select-none"
  >
    <!-- Header -->
    <div class="flex w-full justify-between items-center">
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
        <span class="font-semibold group-hover:text-gray-600 truncate">{{ category.name }}</span>
        <SquarePen
          class="size-3.5 shrink-0 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>

      <div class="h-8 grow relative undraggable" v-if="isInputVisible">
        <input
          type="text"
          class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
          :value="category.name"
          @change="updateCategoryName"
          @blur="isInputVisible = false"
          placeholder="Название категории"
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
        :item="category"
        :isAlwaysVisible="true"
        :entityType="EntityType.Category"
        groupName="category"
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
    <div
      class="flex grow flex-col min-h-0 gap-y-2 mb-3"
      :class="{ 'gap-y-1!': localTaskList.length === 0 }"
    >
      <ButtonCreate
        :disabled="toValue(status.isBusy)"
        class="undraggable"
        text="Добавить задачу"
        @click="isTaskAddFormShown = true"
      />
      <draggable
        @change="sortTasks"
        :list="localTaskList"
        :delay="300"
        itemKey="id"
        class="flex flex-col gap-y-2 overflow-y-auto overflow-x-hidden px-0.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        :class="{
          'grow pb-2': !isTaskAddFormShown,
          'grow-0': isTaskAddFormShown,
        }"
        :delayOnTouchOnly="true"
        group="tasks"
        :animation="150"
        ghostClass="ghost-class"
        chosenClass="chosen-class"
        dragClass="drag-class"
        filter=".undraggable"
        :forceFallback="true"
        :fallbackTolerance="2"
        :prevent-on-filter="false"
        :disabled="toValue(status.isBusy)"
        v-if="!areTasksLoading"
      >
        <template #item="{ element }">
          <Task :key="element.id" :task="element" :options="{ hasCopy: true, hasDelete: true }" />
        </template>
      </draggable>

      <template v-else>
        <EntityCardSkeleton
          v-for="number in getRandomTasksNumber()"
          :key="number + '_skeleton_task'"
        />
      </template>

      <CreateTaskForm
        v-if="isTaskAddFormShown"
        :categoryId="category.id"
        :boardId="category.board.id"
        :workspaceId="category.workspace.id"
        @close="isTaskAddFormShown = false"
      />
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
</style>
