<script setup lang="ts">
import TitleBoard from '@components/Workspace/Header/TitleBoard.vue'
import TitleArchive from '@components/Workspace/Header/TitleArchive.vue'
import Search from '@components/Workspace/Header/Search.vue'
import Filter from '@components/Workspace/Header/Filter.vue'
import Tabs from '@/enums/TabsEnum'
import { PanelLeftOpen } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import { computed } from 'vue'
import TitleBoardSkeleton from '@components/Workspace/Header/TitleBoardSkeleton.vue'
import SearchSkeleton from '@components/Workspace/Header/SearchSkeleton.vue'
import FilterSkeleton from '@components/Workspace/Header/FilterSkeleton.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { useArchivedBoards } from '@/composables/boards/queries/useArchivedBoards'
import { useArchivedWorkspaces } from '@/composables/workspaces/queries/useArchivedWorkspaces'
import { useArchivedCategories } from '@/composables/categories/queries/useArchivedCategories'
import { useArchivedTasks } from '@/composables/tasks/queries/useArchivedTasks'

const UI_STORE = useUIStore()
const WORKSPACE_STORE = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(WORKSPACE_STORE)

const isArchiveTab = computed(() => {
  return UI_STORE.currentTab === Tabs.Archive
})

const isBoardTab = computed(() => {
  return UI_STORE.currentTab === Tabs.Board
})

const { isPending: isBoardsLoading } = useBoards(activeWorkspaceId, isBoardTab)
const { isPending: isArchivedBoardsLoading } = useArchivedBoards(isArchiveTab)
const { isPending: isArchivedWorkspacesLoading } = useArchivedWorkspaces(isArchiveTab)
const { isPending: isArchivedCategoriesLoading } = useArchivedCategories(isArchiveTab)
const { isPending: isArchivedTasksLoading } = useArchivedTasks(isArchiveTab)

const isArchiveLoading = computed(() => {
  return (
    isArchivedBoardsLoading.value ||
    isArchivedWorkspacesLoading.value ||
    isArchivedCategoriesLoading.value ||
    isArchivedTasksLoading.value
  )
})
</script>

<template>
  <!-- Header -->
  <div
    class="flex items-center whitespace-nowrap w-full gap-x-3 h-[3.625rem] shrink-0 border-b border-gray-200"
  >
    <button
      type="button"
      class="inline-flex p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-100"
      @click="UI_STORE.openSidebar()"
      v-if="!UI_STORE.isSidebarOpen"
    >
      <PanelLeftOpen class="size-4" />
    </button>

    <template v-if="isBoardTab">
      <TitleBoardSkeleton v-if="isBoardsLoading" />
      <TitleBoard v-else />
    </template>
    <template v-else-if="isArchiveTab">
      <TitleArchive v-if="!isArchiveLoading" />
    </template>

    <div class="flex shrink-0 ms-auto items-stretch gap-x-3">
      <SearchSkeleton
        v-if="(isBoardsLoading && isBoardTab) || (isArchiveLoading && isArchiveTab)"
      />
      <Search v-else />

      <template v-if="isBoardTab">
        <FilterSkeleton v-if="isBoardsLoading" />
        <Filter v-else />
      </template>
    </div>
  </div>
  <!-- End Header -->
</template>
