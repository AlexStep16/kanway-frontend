<script setup lang="ts">
import SearchResultItem from './SearchResultItem.vue'

defineProps<{
  tasks: any[]
  categories: any[]
  isEmpty: boolean
}>()

defineEmits(['select-task', 'select-category'])
</script>

<template>
  <div class="flex flex-col">
    <!-- Пустое состояние -->
    <div
      v-if="isEmpty"
      class="px-4 py-3 text-sm text-gray-500"
    >
      Ничего не найдено...
    </div>

    <!-- Секция Задачи -->
    <template v-if="tasks.length > 0">
      <div class="px-2.5 pt-2 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Задачи
      </div>
      <SearchResultItem
        v-for="task in tasks"
        :key="task.id"
        :title="task.name"
        :subtitle="task.category?.name"
        @click="$emit('select-task', task)"
      />
    </template>

    <!-- Секция Категории -->
    <template v-if="categories.length > 0">
      <div
        class="px-2.5 pt-4 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider border-t mt-2 first:border-t-0 first:pt-2 first:mt-0"
      >
        Категории
      </div>
      <SearchResultItem
        v-for="category in categories"
        :key="category.id"
        :title="category.name"
        :subtitle="category.board?.name"
        @click="$emit('select-category', category)"
      />
    </template>
  </div>
</template>
