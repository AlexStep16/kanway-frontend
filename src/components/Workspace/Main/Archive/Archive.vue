<script setup lang="ts">
import Header from '@components/Workspace/Header/Header.vue'
import EntityCard from '@components/Workspace/Main/Archive/EntityCard.vue'
import Task from '@components/Workspace/Main/Task/Task.vue'
import NumberBadge from '@components/Badges/NumberBadge.vue'
import RecoverButtons from '@components/Workspace/Main/Archive/RecoverButtons.vue'

import Tabs from '@/enums/TabsEnum'
import { computed, onMounted, ref } from 'vue'
import { Archive } from 'lucide-vue-next'
import { useTaskDataStore } from '@/stores/taskData'

const TASK_STORE = useTaskDataStore()

const numCols = ref(3)

function updateTaskColumns() {
  const windowWidth = window.innerWidth

  if (windowWidth < 824) {
    numCols.value = 1
  } else if (windowWidth < 1090) {
    numCols.value = 2
  } else {
    numCols.value = 3
  }
}

const tasks = computed(() => {
  return TASK_STORE.tasks
})

const taskColumns = computed(() => {
  const result: any = Array.from({ length: numCols.value }, () => [])
  tasks.value.forEach((task, index) => {
    result[index % numCols.value].push(task)
  })
  return result
})

onMounted(() => {
  updateTaskColumns()

  window.addEventListener('resize', () => {
    updateTaskColumns()
  })
})
</script>
<template>
  <Header :tab="Tabs.Archive" />

  <div class="size-full py-3 flex items-center justify-center gap-5 overflow-y-auto" v-if="false">
    <div class="flex flex-col items-center gap-y-2">
      <div class="text-gray-500"><Archive class="size-10" /></div>
      <div class="text-lg text-gray-500 font-medium">Архив пуст</div>
      <div class="text-sm text-gray-400 max-w-xs text-center">
        Здесь будут храниться все архивированные задачи, категории, доски и пространства.
      </div>
    </div>
  </div>

  <div
    class="size-full py-3 flex flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
  >
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
