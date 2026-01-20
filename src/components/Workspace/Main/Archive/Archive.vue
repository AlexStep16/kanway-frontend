<script setup lang="ts">
import Header from '@components/Workspace/Header/Header.vue'
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import Task from '@components/Workspace/Main/Task/Task.vue'
import RecoverButtons from '@components/Workspace/Main/Archive/RecoverButtons.vue'

import Tabs from '@/enums/TabsEnum'
import { computed, ref } from 'vue'
import { Archive } from 'lucide-vue-next'

import ColumnsView from '../ColumnsView.vue'
import TitleWithBadge from '../TitleWithBadge.vue'
import TitleWithBadgeSkeleton from '../TitleWithBadgeSkeleton.vue'
import { useArchivedTasks } from '@/composables/tasks/queries/useArchivedTasks'
import { useArchivedCategories } from '@/composables/categories/queries/useArchivedCategories'
import { useArchivedBoards } from '@/composables/boards/queries/useArchivedBoards'
import { useArchivedWorkspaces } from '@/composables/workspaces/queries/useArchivedWorkspaces'
import TaskSkeleton from '../Task/TaskSkeleton.vue'
import { useUIStore } from '@stores/ui'
import { useRecoverTask } from '@/composables/tasks/mutations/useRecoverTask'
import { useDeleteTask } from '@/composables/tasks/mutations/useDeleteTask'
import { useRecoverCategory } from '@/composables/categories/mutations/useRecoverCategory'
import { useDeleteCategory } from '@/composables/categories/mutations/useDeleteCategory'
import { useRecoverBoard } from '@/composables/boards/mutations/useRecoverBoard'
import { useDeleteBoard } from '@/composables/boards/mutations/useDeleteBoard'
import { useRecoverWorkspace } from '@/composables/workspaces/mutations/useRecoverWorkspace'
import { useDeleteWorkspace } from '@/composables/workspaces/mutations/useDeleteWorkspace'

const { data: tasks, isPending: isTasksLoading } = useArchivedTasks()
const { data: categories, isPending: isCategoriesLoading } = useArchivedCategories()
const { data: boards, isPending: isBoardsLoading } = useArchivedBoards()
const { data: workspaces, isPending: isWorkspacesLoading } = useArchivedWorkspaces()

const { mutate: recoverTask } = useRecoverTask()
const { mutate: deleteTask } = useDeleteTask()

const { mutate: recoverCategory } = useRecoverCategory()
const { mutate: deleteCategory } = useDeleteCategory()

const { mutate: recoverBoard } = useRecoverBoard()
const { mutate: deleteBoard } = useDeleteBoard()

const { mutate: recoverWorkspace } = useRecoverWorkspace()
const { mutate: deleteWorkspace } = useDeleteWorkspace()

const uiStore = useUIStore()

const tasksContainerRef = ref<HTMLElement | null>(null)
const categoryContainerRef = ref<HTMLElement | null>(null)
const boardContainerRef = ref<HTMLElement | null>(null)
const workspaceContainerRef = ref<HTMLElement | null>(null)

const isInitialLoading = computed(
  () =>
    isTasksLoading.value ||
    isCategoriesLoading.value ||
    isBoardsLoading.value ||
    isWorkspacesLoading.value,
)

const isArchiveEmpty = computed(() => {
  if (isInitialLoading.value) return false
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
    <div
      class="w-full flex flex-col gap-y-2"
      ref="tasksContainerRef"
      v-if="tasks.length > 0 || isTasksLoading"
    >
      <TitleWithBadge title="Задачи" :number="tasks.length" v-if="!isTasksLoading">
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadge>
      <TitleWithBadgeSkeleton v-else>
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadgeSkeleton>

      <ColumnsView :items="tasks" :containerRef="tasksContainerRef" v-if="!isTasksLoading">
        <template v-slot:default="slotProps">
          <Task
            v-for="task in slotProps.data"
            :key="task.id"
            :task="task"
            :hasBorder="true"
            :showInfo="true"
            taskClasses="self-start"
          >
            <RecoverButtons @recover="recoverTask({ task })" @delete="deleteTask({ task })" />
          </Task>
        </template>
      </ColumnsView>

      <TaskSkeleton v-for="i in 5" :key="`task-skeleton-${i}`" v-else></TaskSkeleton>
    </div>

    <div
      class="w-full flex flex-col gap-y-2"
      ref="categoryContainerRef"
      v-if="categories.length > 0 || isCategoriesLoading"
    >
      <TitleWithBadge title="Категории" :number="categories.length" v-if="!isCategoriesLoading">
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadge>
      <TitleWithBadgeSkeleton v-else>
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadgeSkeleton>

      <ColumnsView
        :items="categories"
        :containerRef="categoryContainerRef"
        v-if="!isCategoriesLoading"
      >
        <template v-slot:default="slotProps">
          <EntityCard
            v-for="category in slotProps.data"
            :key="category.id"
            :name="category.name"
            :parentName="category.board.name"
            :showInfo="true"
            @click="uiStore.openCategoryToEdit(category.id)"
          >
            <RecoverButtons
              @recover="recoverCategory({ category })"
              @delete="deleteCategory({ category })"
            />
          </EntityCard>
        </template>
      </ColumnsView>

      <TaskSkeleton v-for="i in 5" :key="`category-skeleton-${i}`" v-else></TaskSkeleton>
    </div>

    <div
      class="w-full flex flex-col gap-y-2"
      ref="boardContainerRef"
      v-if="boards.length > 0 || isBoardsLoading"
    >
      <TitleWithBadge title="Доски" :number="boards.length" v-if="!isBoardsLoading">
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadge>
      <TitleWithBadgeSkeleton v-else>
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadgeSkeleton>

      <ColumnsView :items="boards" :containerRef="boardContainerRef" v-if="!isBoardsLoading">
        <template v-slot:default="slotProps">
          <EntityCard
            v-for="board in slotProps.data"
            :key="board.id"
            :name="board.name"
            :parentName="board.workspace.name"
            :showInfo="true"
            @click="uiStore.openBoardToEdit(board.id)"
          >
            <RecoverButtons @recover="recoverBoard({ board })" @delete="deleteBoard({ board })" />
          </EntityCard>
        </template>
      </ColumnsView>

      <TaskSkeleton v-for="i in 5" :key="`board-skeleton-${i}`" v-else></TaskSkeleton>
    </div>

    <div
      class="w-full flex flex-col gap-y-2"
      ref="workspaceContainerRef"
      v-if="workspaces.length > 0 || isWorkspacesLoading"
    >
      <TitleWithBadge title="Пространства" :number="workspaces.length" v-if="!isWorkspacesLoading">
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadge>
      <TitleWithBadgeSkeleton v-else>
        <div class="w-full h-[.5px] bg-gray-200"></div>
      </TitleWithBadgeSkeleton>

      <ColumnsView
        :items="workspaces"
        :containerRef="workspaceContainerRef"
        v-if="!isWorkspacesLoading"
      >
        <template v-slot:default="slotProps">
          <EntityCard
            v-for="workspace in slotProps.data"
            :key="workspace.id"
            :name="workspace.name"
            @click="uiStore.openWorkspaceToEdit(workspace.id)"
          >
            <RecoverButtons
              @recover="recoverWorkspace({ workspace })"
              @delete="deleteWorkspace({ workspace })"
            />
          </EntityCard>
        </template>
      </ColumnsView>

      <TaskSkeleton v-for="i in 5" :key="`workspace-skeleton-${i}`" v-else></TaskSkeleton>
    </div>
  </div>
</template>
