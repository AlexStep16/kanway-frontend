<script setup lang="ts">
import Header from '@components/Workspace/Header/Header.vue'
import Category from '@components/Workspace/Main/Category/Category.vue'
import AIInput from '@components/Workspace/Main/AIInput.vue'
import { useCategoryDataStore } from '@stores/categoryData'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import draggable from 'vuedraggable'

import { Plus } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import _ from 'lodash'

const CATEGORY_STORE = useCategoryDataStore()
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const boardCategories = computed(() => CATEGORY_STORE.getActiveBoardCategories)

const localCategoryList = ref()

watch(
  boardCategories,
  (newList) => {
    localCategoryList.value = _.cloneDeep(newList)
  },
  { deep: true, immediate: true },
)

function sortCategories() {
  localCategoryList.value.forEach((category: ICategoryState, index: number) => {
    category.order = index + 1
  })

  CATEGORY_STORE.updateCategories(
    localCategoryList.value,
    WORKSPACE_STORE.getActiveWorkspaceId,
    BOARD_STORE.getActiveBoardId,
    true,
    false,
    false,
  )
}

const newCategoryInputElement = ref<HTMLInputElement | null>(null)

function updateTask(task: any, category: any) {
  const taskToUpdate = category.tasks.find((t: any) => t.id === task.id)
  if (taskToUpdate) Object.assign(taskToUpdate, task)
}

function connectInputEditRef(el: HTMLInputElement) {
  newCategoryInputElement.value = el

  nextTick(() => {
    if (newCategoryInputElement.value) {
      newCategoryInputElement.value.focus()
    }
  })
}
</script>

<template>
  <Header />

  <div
    class="size-full py-1.5 flex gap-3 overflow-y-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
  >
    <draggable
      @change="sortCategories"
      :list="localCategoryList"
      :delay="300"
      class="flex gap-x-3"
      itemKey="id"
      :delayOnTouchOnly="true"
      group="categories"
      :animation="150"
      ghostClass="ghost-class"
      chosenClass="chosen-class"
      dragClass="drag-class"
      filter=".undraggable"
      :forceFallback="true"
      :fallbackTolerance="2"
      :prevent-on-filter="false"
    >
      <template #item="{ element }">
        <Category
          :key="element.id"
          :category="element"
          @update-task="updateTask"
          @connectInputEditRef="connectInputEditRef"
        />
      </template>
    </draggable>

    <div class="h-full flex items-center">
      <button
        type="button"
        class="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
        title="Добавить категорию"
        @click="CATEGORY_STORE.addCategoryToStore(BOARD_STORE.getActiveBoardId)"
      >
        <Plus class="size-6" />
      </button>
    </div>
  </div>

  <AIInput />
</template>

<style scoped>
.ghost-class {
  opacity: 0;
}

.drag-class {
  transform: scale(1.04);
  opacity: 1 !important;
  cursor: grabbing;
  z-index: 9999;
}
</style>
