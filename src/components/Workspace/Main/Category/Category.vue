<script setup lang="ts">
import ButtonCreate from '@components/Buttons/ButtonCreate.vue'
import Options from '@components/Options/Options.vue'
import Task from '../Task/Task.vue'
import { ListFilter, SquarePen } from 'lucide-vue-next'
import { nextTick, ref, toValue, watch } from 'vue'
import Spinner from '@/components/Loader/Spinner.vue'
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

const props = defineProps<{
  category: ICategoryState
}>()

const taskFilterStore = useTaskFilterStore()

const { tasks } = useVisibleTasks(props.category.board.id)

const { mutate: updateTasks } = useUpdateManyTasks()
const { mutate: updateCategory } = useUpdateCategory()

const { isBusy } = useCategoryMutationStatus(props.category.id)

const isInputVisible = ref(false)
const inputEditRef = ref<Nullable<HTMLInputElement>>(null)

const localTaskList = ref<ITaskState[]>([])
const isTaskAddFormShown = ref(false)

watch(
  tasks,
  (newList) => {
    localTaskList.value = _.cloneDeep(newList)
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
  if (toValue(isBusy)) return

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
    })
  }

  isInputVisible.value = false
}
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
        <div class="flex items-center justify-center" v-if="isBusy">
          <Spinner class="size-3.5 text-gray-600" />
        </div>
        <span class="font-semibold group-hover:text-gray-600 truncate">{{ category.name }}</span>
        <SquarePen
          class="size-3.5 shrink-0 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>

      <div class="h-8 grow-1 relative undraggable" v-if="isInputVisible">
        <input
          type="text"
          class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
          :value="category.name"
          @change="updateCategoryName"
          @blur="isInputVisible = false"
          placeholder="Название категории"
          ref="inputEditRef"
        />
        <div class="shrink-0 absolute -bottom-[2px] w-full left-0">
          <div class="h-[2px] bg-blue-500 w-full animation-grow"></div>
        </div>
      </div>

      <Options
        :options="{
          edit: false,
          copy: true,
          move: true,
          favorite: false,
          archive: true,
        }"
        :status="useCategoryMutationStatus"
        :item="category"
        :isAlwaysVisible="true"
        groupName="category"
        class="text-gray-600 undraggable"
      />
    </div>

    <!-- Tasks -->
    <div class="flex grow-1 flex-col min-h-0 gap-y-2 mb-3">
      <ButtonCreate
        :disabled="isBusy"
        class="undraggable"
        text="Добавить задачу"
        @click="isTaskAddFormShown = true"
      />
      <draggable
        @change="sortTasks"
        :list="localTaskList"
        :delay="300"
        itemKey="id"
        class="flex grow-1 flex-col pb-2 gap-y-2 overflow-y-auto overflow-x-hidden p-0.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        :delayOnTouchOnly="true"
        group="tasks"
        :animation="150"
        ghostClass="ghost-class"
        chosenClass="chosen-class"
        dragClass="drag-class"
        :forceFallback="true"
        :fallbackTolerance="2"
        :prevent-on-filter="false"
        :disabled="isBusy"
      >
        <template #item="{ element }">
          <Task :key="element.id" :task="element" :hasCopy="true" :hasDelete="true" />
        </template>
      </draggable>

      <CreateTaskForm
        :isFormShown="isTaskAddFormShown"
        :categoryId="category.id"
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
