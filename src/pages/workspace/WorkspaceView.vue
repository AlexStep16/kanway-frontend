<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@/components/Workspace/Sidebars/Sidebar.vue'
import Header from '@/components/Workspace/Main/Header.vue'
import Category from '@/components/Workspace/Main/Category/Category.vue'
import Edit from '@/components/Workspace/Main/Task/Edit.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const WORKSPACE_STORE = useWorkspaceStore()

onMounted(() => {
  window.HSStaticMethods.autoInit()
})
</script>

<template>
  <Sidebar />
  <main
    class="bg-gray-100 transition-all duration-300 fixed inset-0 py-3 px-3"
    :class="{ 'ps-70': WORKSPACE_STORE.isSidebarOpen }"
  >
    <div
      class="h-full overflow-hidden flex flex-col px-5 bg-white border border-gray-200 shadow-xs rounded-md"
    >
      <Header />

      <div class="size-full py-3 flex gap-3 overflow-y-hidden">
        <!-- Categories -->
        <Category
          :category="{
            id: 1,
            name: 'Категория 1',
            tasks: [
              { id: 1, name: 'Задача 1', is_completed: false, tags: ['важно'] },
              { id: 2, name: 'Задача 2', color: '#FFEEAA', is_completed: false },
              {
                id: 3,
                name: 'Задача 3',
                color: '#EEAABB',
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
      </div>
    </div>

    <Teleport to="body">
      <Edit />
    </Teleport>
  </main>
</template>
