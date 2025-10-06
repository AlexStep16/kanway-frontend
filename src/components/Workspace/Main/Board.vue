<script setup lang="ts">
import Header from '@/components/Workspace/Header/Header.vue'
import Category from '@/components/Workspace/Main/Category/Category.vue'
import AIInput from '@/components/Workspace/Main/AIInput.vue'
import Tabs from '@/enums/TabsEnum'

import { Plus } from 'lucide-vue-next'
</script>

<template>
  <Header :tab="Tabs.Board" />

  <div class="size-full py-1.5 flex gap-3 overflow-y-hidden">
    <!-- Categories -->
    <Category
      :category="{
        id: 1,
        name: 'Категория 1',
        tasks: [
          { id: 1, name: 'Задача 1', is_completed: false, tags: ['важно'] },
          { id: 2, name: 'Задача 2', color: '#ffdf20', is_completed: false },
          {
            id: 3,
            name: 'Задача 3',
            color: '#ff6467',
            due_date: '2025-09-15T14:14:00',
            is_completed: false,
            tags: ['отчеты', 'встречи'],
          },
          {
            id: 4,
            name: 'Задача 4',
            due_date: '2025-09-16T14:14:00',
            is_completed: false,
          },
        ],
      }"
    />
    <Category
      :category="{
        id: 2,
        name: 'Категория 2',
        tasks: [
          {
            id: 5,
            name: 'Задача 5',
            description: 'Описание задачи 5',
            due_date: '2025-09-18T14:14:00',
            is_completed: false,
            tags: ['работа'],
          },
          {
            id: 6,
            name: 'Задача 6',
            due_date: '2025-09-18T14:14:00',
            is_completed: true,
          },
        ],
      }"
    />

    <div class="h-full flex items-center">
      <button
        type="button"
        class="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-200 transition-colors duration-100 focus:outline-hidden"
        title="Добавить категорию"
      >
        <Plus class="size-6" />
      </button>
    </div>
  </div>

  <AIInput />
</template>
