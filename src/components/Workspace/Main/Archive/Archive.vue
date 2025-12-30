<script setup lang="ts">
import Header from '@components/Workspace/Header/Header.vue'
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import Task from '@components/Workspace/Main/Task/Task.vue'
import RecoverButtons from '@components/Workspace/Main/Archive/RecoverButtons.vue'

import Tabs from '@/enums/TabsEnum'
import { computed, ref } from 'vue'
import { Archive } from 'lucide-vue-next'

import { useTaskDataStore } from '@stores/taskData'
import { useCategoryDataStore } from '@stores/categoryData'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import ColumnsView from '../ColumnsView.vue'
import TitleWithBadge from '../TitleWithBadge.vue'

const TASK_STORE = useTaskDataStore()
const CATEGORY_STORE = useCategoryDataStore()
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const tasksContainerRef = ref<HTMLElement | null>(null)
const categoryContainerRef = ref<HTMLElement | null>(null)
const boardContainerRef = ref<HTMLElement | null>(null)
const workspaceContainerRef = ref<HTMLElement | null>(null)

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

const isArchiveEmpty = computed(() => {
  return (
    tasks.value.length === 0 &&
    categories.value.length === 0 &&
    boards.value.length === 0 &&
    workspaces.value.length === 0
  )
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
    v-else
  >
    <div class="w-full flex flex-col gap-y-2" ref="tasksContainerRef" v-if="tasks.length > 0">
      <TitleWithBadge title="Задачи" :number="tasks.length">
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadge>

      <ColumnsView :items="tasks" :containerRef="tasksContainerRef">
        <template v-slot:default="slotProps">
          <Task
            v-for="task in slotProps.data"
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
        </template>
      </ColumnsView>
    </div>

    <div
      class="w-full flex flex-col gap-y-2"
      ref="categoryContainerRef"
      v-if="categories.length > 0"
    >
      <TitleWithBadge title="Категории" :number="categories.length">
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadge>

      <ColumnsView :items="categories" :containerRef="categoryContainerRef">
        <template v-slot:default="slotProps">
          <EntityCard
            v-for="category in slotProps.data"
            :key="category.id"
            :name="category.name"
            :parentName="category.boardName"
            :showInfo="true"
            @click="CATEGORY_STORE.openCategoryToEdit(category)"
          >
            <RecoverButtons
              @recover="CATEGORY_STORE.recoverCategory(category)"
              @delete="CATEGORY_STORE.deleteCategory(category)"
            />
          </EntityCard>
        </template>
      </ColumnsView>
    </div>

    <div class="w-full flex flex-col gap-y-2" ref="boardContainerRef" v-if="boards.length > 0">
      <TitleWithBadge title="Доски" :number="boards.length">
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadge>

      <ColumnsView :items="boards" :containerRef="boardContainerRef">
        <template v-slot:default="slotProps">
          <EntityCard
            v-for="board in slotProps.data"
            :key="board.id"
            :name="board.name"
            :parentName="board.workspaceName"
            :showInfo="true"
            @click="BOARD_STORE.openBoardToEdit(board)"
          >
            <RecoverButtons
              @recover="BOARD_STORE.recoverBoard(board)"
              @delete="BOARD_STORE.deleteBoard(board)"
            />
          </EntityCard>
        </template>
      </ColumnsView>
    </div>

    <div
      class="w-full flex flex-col gap-y-2"
      ref="workspaceContainerRef"
      v-if="workspaces.length > 0"
    >
      <TitleWithBadge title="Пространства" :number="workspaces.length">
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadge>

      <ColumnsView :items="workspaces" :containerRef="workspaceContainerRef">
        <template v-slot:default="slotProps">
          <EntityCard
            v-for="workspace in slotProps.data"
            :key="workspace.id"
            :name="workspace.name"
            @click="WORKSPACE_STORE.openWorkspaceToEdit(workspace)"
          >
            <RecoverButtons
              @recover="WORKSPACE_STORE.recoverWorkspace(workspace)"
              @delete="WORKSPACE_STORE.deleteWorkspace(workspace)"
            />
          </EntityCard>
        </template>
      </ColumnsView>
    </div>
  </div>
</template>
