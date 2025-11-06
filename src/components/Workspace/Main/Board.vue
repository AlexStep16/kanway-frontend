<script setup lang="ts">
import Header from '@components/Workspace/Header/Header.vue'
import Category from '@components/Workspace/Main/Category/Category.vue'
import AIInput from '@components/Workspace/Main/AIInput.vue'
import { useCategoryDataStore } from '@stores/categoryData'
import { useBoardDataStore } from '@stores/boardData'

import { Plus } from 'lucide-vue-next'
import { nextTick, ref } from 'vue'

const CATEGORY_STORE = useCategoryDataStore()
const BOARD_STORE = useBoardDataStore()

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
    <!-- Categories -->
    <Category
      v-for="category in CATEGORY_STORE.getActiveBoardCategories"
      :key="category.id"
      :category="category"
      @update-task="updateTask"
      @connectInputEditRef="connectInputEditRef"
    />

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
