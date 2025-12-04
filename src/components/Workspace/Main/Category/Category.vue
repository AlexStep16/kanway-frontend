<script setup lang="ts">
import ButtonCreate from '@components/Buttons/ButtonCreate.vue'
import Options from '@components/Options/Options.vue'
import Task from '../Task/Task.vue'
import { useCategoryDataStore } from '@stores/categoryData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useTaskDataStore } from '@stores/taskData'
import { ListFilter, SquarePen } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import Spinner from '@/components/Loader/Spinner.vue'
import { Nullable } from '@/types/utils'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import draggable from 'vuedraggable'
import { ITaskState } from '@stores/interfaces/ITaskState'
import _ from 'lodash'

const props = defineProps<{
  category: ICategoryState
}>()

const emit = defineEmits<{
  (e: 'connectInputEditRef', el: HTMLInputElement): void
}>()

const CATEGORY_STORE = useCategoryDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()
const TASK_STORE = useTaskDataStore()

const activeWorkspace = computed(() => WORKSPACE_STORE.getActiveWorkspace)

const isInputVisible = ref(false)
const inputEditRef = ref<Nullable<HTMLInputElement>>(null)
const inputAddRef = ref<HTMLInputElement | null>(null)
const newTaskInputElement = ref<HTMLInputElement | null>(null)

const categoryTasks = computed(() => TASK_STORE.getVisibleTasksByCategoryId(props.category.id))

const localTaskList = ref()

watch(
  categoryTasks,
  (newList) => {
    localTaskList.value = _.cloneDeep(newList)
  },
  { deep: true, immediate: true },
)

watch(inputAddRef, (newVal) => {
  if (newVal) emit('connectInputEditRef', newVal)
})

function sortTasks() {
  let isSortNeeded = false

  localTaskList.value.forEach((task: ITaskState, index: number) => {
    if (task.order !== index + 1 || task.categoryId !== props.category.id) {
      isSortNeeded = true
    }

    task.order = index + 1
    task.categoryId = props.category.id
    task.categoryName = props.category.name
  })

  if (isSortNeeded) {
    const reducedTasks = localTaskList.value.map((task: ITaskState) => {
      return {
        id: task.id,
        order: task.order,
        categoryId: task.categoryId,
        categoryName: task.categoryName,
      }
    })

    TASK_STORE.updateTasks(reducedTasks, props.category.boardId, true)
  }
}

function showInput() {
  if (isLoading.value) return

  isInputVisible.value = true

  nextTick(() => {
    if (inputEditRef.value) {
      inputEditRef.value.focus()
    }
  })
}

function updateCategoryName(event: Event) {
  if (!activeWorkspace.value) return

  const target = event.target as HTMLInputElement
  const newName = target.value.trim()

  if (newName) {
    CATEGORY_STORE.updateCategory(
      { ...props.category, name: newName },
      props.category.boardId,
      activeWorkspace.value.id,
      true,
    )
  }

  isInputVisible.value = false
}

function connectInputEditRef(el: HTMLInputElement) {
  newTaskInputElement.value = el

  nextTick(() => {
    if (newTaskInputElement.value) {
      newTaskInputElement.value.focus()
    }
  })
}

function createOrSplice(category: ICategoryState, target: HTMLInputElement, isEnterKey = false) {
  if (isLoading.value) return

  CATEGORY_STORE.createOrSplice(category, target)

  if (isEnterKey) {
    nextTick(() => {
      CATEGORY_STORE.addCategoryToStore(category.boardId)
    })
  }
}

const isLoading = computed(() => {
  return CATEGORY_STORE.isCategoryProcessing(props.category.id)
})

const isCategoryAdding = computed(() => {
  return CATEGORY_STORE.isCategoryAdding(props.category.id)
})

const isFilterActive = computed(() => {
  return TASK_STORE.isFilterActive
})
</script>

<template>
  <div
    class="bg-gray-100 flex flex-col shrink-0 gap-y-3 py-3 px-4 rounded-md h-full w-70 sm:w-75 group/category select-none"
    :class="{
      undraggable: category.isNew,
    }"
  >
    <!-- Header -->
    <div class="flex w-full justify-between items-center">
      <template v-if="category.isNew">
        <div
          class="flex gap-x-2 items-center h-8 min-w-0 text-sm text-gray-800 cursor-pointer transition-colors duration-100 group"
        >
          <template v-if="isCategoryAdding">
            <div class="flex items-center justify-center">
              <Spinner class="size-3.5 text-gray-600" />
            </div>
            <span class="font-semibold group-hover:text-gray-600 truncate">{{
              category.name
            }}</span>
          </template>

          <div class="grow-1" v-show="!isCategoryAdding">
            <input
              type="text"
              class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
              :value="category.name"
              @blur="createOrSplice(category, $event.target as HTMLInputElement)"
              @keydown.enter="createOrSplice(category, $event.target as HTMLInputElement, true)"
              :disabled="isCategoryAdding"
              ref="inputAddRef"
              placeholder="Название категории"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="flex gap-x-2 items-center h-8 min-w-0 text-sm text-gray-800 cursor-pointer transition-colors duration-100 group"
          @click="showInput"
          v-show="!isInputVisible"
        >
          <div
            class="flex items-center justify-center"
            v-if="isFilterActive"
            title="Применён фильтр"
          >
            <ListFilter class="size-4 text-blue-500" />
          </div>
          <div class="flex items-center justify-center" v-if="isLoading">
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
      </template>
      <Options
        :options="{
          edit: false,
          copy: true,
          move: true,
          favorite: false,
          archive: true,
        }"
        v-if="!category.isNew"
        :item="category"
        :edit_type="'category'"
        :is_always_visible="true"
        group_name="category"
        class="text-gray-600 undraggable"
      />
    </div>

    <!-- Tasks -->
    <div class="flex grow-1 flex-col min-h-0 gap-y-2 mb-3" v-if="!category.isNew">
      <ButtonCreate
        :disabled="isLoading"
        class="undraggable"
        text="Добавить задачу"
        @click="TASK_STORE.addTaskToStore(category.id)"
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
        :disabled="isLoading"
      >
        <template #item="{ element }">
          <Task
            :key="element.id"
            :task="element"
            @connectInputEditRef="connectInputEditRef"
            :hasCopy="true"
            :hasDelete="true"
          />
        </template>
      </draggable>
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
