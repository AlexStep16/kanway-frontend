<script setup lang="ts">
import Header from '@/components/Workspace/Header/Header.vue'
import EntityCard from '@/components/Workspace/Main/Archive/EntityCard.vue'
import Task from '@/components/Workspace/Main/Task/Task.vue'
import NumberBadge from '@/components/Badges/NumberBadge.vue'
import RecoverButtons from '@/components/Workspace/Main/Archive/RecoverButtons.vue'

import Tabs from '@/enums/TabsEnum'
import { computed, ref } from 'vue'
import { Trash } from 'lucide-vue-next'

const tasks = ref([
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
  {
    id: 5,
    name: 'Задача 3',
    color: '#EEAABB',
    due_date: '2025-09-15T14:14:00',
    is_completed: false,
    tags: ['отчеты', 'встречи'],
  },
  { id: 6, name: 'Задача 1', is_completed: false, tags: ['важно'] },
  { id: 7, name: 'Задача 2', color: '#FFEEAA', is_completed: false },
  {
    id: 8,
    name: 'Задача 4',
    due_date: '2025-09-16T14:14:00',
    is_completed: false,
  },
])

const taskColumns = computed(() => {
  const numCols = 4
  const result: any = Array.from({ length: numCols }, () => [])
  tasks.value.forEach((task, index) => {
    result[index % numCols].push(task)
  })
  return result
})
</script>
<template>
  <Header :tab="Tabs.Archive" />

  <div class="size-full py-3 flex items-center justify-center gap-5 overflow-y-auto" v-if="false">
    <div class="flex flex-col items-center gap-y-2">
      <div class="text-gray-500"><Trash class="size-10" /></div>
      <div class="text-lg text-gray-500 font-medium">Архив пуст</div>
      <div class="text-sm text-gray-400 max-w-xs text-center">
        Здесь будут храниться все архивированные задачи, категории, доски и пространства.
      </div>
    </div>
  </div>

  <div class="size-full py-3 flex flex-col gap-5 overflow-y-auto">
    <div class="w-full">
      <div class="flex items-center text-sm text-gray-500 gap-x-2">
        <span>Задачи</span>
        <NumberBadge :number="12" />
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </div>
      <div class="flex gap-2">
        <div
          v-for="(columnTasks, colIndex) in taskColumns"
          :key="colIndex"
          class="flex flex-col gap-2 mt-2"
        >
          <Task
            v-for="task in columnTasks"
            :key="task.id"
            :task="task"
            :hasBorder="true"
            taskClasses="self-start"
          >
            <RecoverButtons />
          </Task>
        </div>
      </div>
    </div>

    <div class="w-full">
      <div class="flex items-center text-sm text-gray-500 gap-x-2">
        <span>Категории</span>
        <NumberBadge :number="55" />
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </div>
      <div class="flex gap-2 mt-2">
        <EntityCard name="Личное" />
      </div>
    </div>

    <div class="w-full">
      <div class="flex items-center text-sm text-gray-500 gap-x-2">
        <span>Доски</span>
        <NumberBadge :number="24" />
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </div>
      <div class="flex gap-2 mt-2">
        <EntityCard name="Личное" />
      </div>
    </div>

    <div class="w-full">
      <div class="flex items-center text-sm text-gray-500 gap-x-2">
        <span>Пространства</span>
        <NumberBadge :number="1" />
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </div>
      <div class="flex gap-2 mt-2">
        <EntityCard name="Личное" />
      </div>
    </div>
  </div>
</template>
