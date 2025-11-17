<script setup lang="ts">
import Header from '@components/Workspace/Header/Header.vue'
import EntityCard from '@components/Workspace/Main/Archive/EntityCard.vue'
import Task from '@components/Workspace/Main/Task/Task.vue'
import NumberBadge from '@components/Badges/NumberBadge.vue'
import RecoverButtons from '@components/Workspace/Main/Archive/RecoverButtons.vue'

import Tabs from '@/enums/TabsEnum'
import { computed, onMounted, ref, watch } from 'vue'
import { Archive } from 'lucide-vue-next'

import { useTaskDataStore } from '@stores/taskData'
import { useCategoryDataStore } from '@stores/categoryData'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'

const TASK_STORE = useTaskDataStore()
const CATEGORY_STORE = useCategoryDataStore()
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const numCols = ref(3)
const archiveRef = ref<HTMLElement | null>(null)

function updateColumns() {
  if (!archiveRef.value) return

  const width = archiveRef.value.clientWidth

  if (width < 492) {
    numCols.value = 1
  } else if (width < 745) {
    numCols.value = 2
  } else if (width < 993) {
    numCols.value = 3
  } else {
    numCols.value = 4
  }
}

const tasks = computed(() => {
  return TASK_STORE.getArchivedTasks
})

const categories = computed(() => {
  return CATEGORY_STORE.getArchivedCategories
})

const boards = computed(() => {
  return BOARD_STORE.getArchivedBoards
})

const workspaces = computed(() => {
  return WORKSPACE_STORE.getArchivedWorkspaces
})

const taskColumns = computed(() => {
  const result: any = Array.from({ length: numCols.value }, () => [])
  tasks.value.forEach((task, index) => {
    result[index % numCols.value].push(task)
  })
  return result
})

const categoryColumns = computed(() => {
  const result: any = Array.from({ length: numCols.value }, () => [])
  categories.value.forEach((category, index) => {
    result[index % numCols.value].push(category)
  })
  return result
})

const boardColumns = computed(() => {
  const result: any = Array.from({ length: numCols.value }, () => [])
  boards.value.forEach((board, index) => {
    result[index % numCols.value].push(board)
  })
  return result
})

const workspaceColumns = computed(() => {
  const result: any = Array.from({ length: numCols.value }, () => [])
  workspaces.value.forEach((workspace, index) => {
    result[index % numCols.value].push(workspace)
  })
  return result
})

const isArchiveEmpty = computed(() => {
  return (
    tasks.value.length === 0 &&
    categories.value.length === 0 &&
    boards.value.length === 0 &&
    workspaces.value.length === 0
  )
})

watch(archiveRef, () => {
  updateColumns()
})

onMounted(() => {
  window.addEventListener('resize', () => {
    updateColumns()
  })
})
</script>
<template>
  <Header :tab="Tabs.Archive" />

  <div
    class="size-full py-3 flex items-center justify-center gap-5 overflow-y-auto"
    v-if="isArchiveEmpty"
  >
    <div class="flex flex-col items-center gap-y-2">
      <div class="text-gray-500"><Archive class="size-10" /></div>
      <div class="text-lg text-gray-500 font-medium">Архив пуст</div>
      <div class="text-sm text-gray-400 max-w-xs text-center">
        Здесь будут храниться все архивированные задачи, категории, доски и пространства.
      </div>
    </div>
  </div>

  <div
    class="size-full py-2 my-1 px-0.5 flex flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
    ref="archiveRef"
    v-else
  >
    <div class="w-full" v-if="tasks.length > 0">
      <div class="flex items-center text-sm text-gray-500 gap-x-2">
        <span>Задачи</span>
        <NumberBadge :number="tasks.length" />
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </div>
      <div class="flex gap-2">
        <div
          v-for="(columnTasks, colIndex) in taskColumns"
          :key="colIndex + '_tasks'"
          class="flex flex-col gap-2 mt-2"
        >
          <Task
            v-for="task in columnTasks"
            :key="task.id"
            :task="task"
            :hasBorder="true"
            :showInfo="true"
            taskClasses="self-start"
          >
            <RecoverButtons
              @recover="TASK_STORE.recoverTask(task)"
              @delete="TASK_STORE.deleteTask(task)"
            />
          </Task>
        </div>
      </div>
    </div>

    <div class="w-full" v-if="categories.length > 0">
      <div class="flex items-center text-sm text-gray-500 gap-x-2">
        <span>Категории</span>
        <NumberBadge :number="categories.length" />
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </div>
      <div class="flex gap-2 mt-2">
        <div
          v-for="(columnCategories, colIndex) in categoryColumns"
          :key="colIndex + '_categories'"
          class="flex flex-col gap-2 mt-2"
        >
          <EntityCard
            v-for="category in columnCategories"
            :key="category.id"
            :name="category.name"
            :parentName="category.boardName"
            :showInfo="true"
          >
            <RecoverButtons
              @recover="CATEGORY_STORE.recoverCategory(category)"
              @delete="CATEGORY_STORE.deleteCategory(category)"
            />
          </EntityCard>
        </div>
      </div>
    </div>

    <div class="w-full" v-if="boards.length > 0">
      <div class="flex items-center text-sm text-gray-500 gap-x-2">
        <span>Доски</span>
        <NumberBadge :number="boards.length" />
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </div>
      <div class="flex gap-2 mt-2">
        <div
          v-for="(columnBoards, colIndex) in boardColumns"
          :key="colIndex + '_boards'"
          class="flex flex-col gap-2 mt-2"
        >
          <EntityCard
            v-for="board in columnBoards"
            :key="board.id"
            :name="board.name"
            :parentName="board.workspaceName"
            :showInfo="true"
          >
            <RecoverButtons
              @recover="BOARD_STORE.recoverBoard(board)"
              @delete="BOARD_STORE.deleteBoard(board)"
            />
          </EntityCard>
        </div>
      </div>
    </div>

    <div class="w-full" v-if="workspaces.length > 0">
      <div class="flex items-center text-sm text-gray-500 gap-x-2">
        <span>Пространства</span>
        <NumberBadge :number="workspaces.length" />
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </div>
      <div class="flex gap-2 mt-2">
        <div
          v-for="(columnWorkspaces, colIndex) in workspaceColumns"
          :key="colIndex + '_workspaces'"
          class="flex flex-col gap-2 mt-2"
        >
          <EntityCard
            v-for="workspace in columnWorkspaces"
            :key="workspace.id"
            :name="workspace.name"
          >
            <RecoverButtons
              @recover="WORKSPACE_STORE.recoverWorkspace(workspace)"
              @delete="WORKSPACE_STORE.deleteWorkspace(workspace)"
            />
          </EntityCard>
        </div>
      </div>
    </div>
  </div>
</template>
