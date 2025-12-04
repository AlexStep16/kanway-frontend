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
import { useBoardDataStore } from '@/stores/boardData'
import { useWorkspaceDataStore } from '@/stores/workspaceData'

const UI_STORE = useUIStore()
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const activeWorkspace = computed(() => WORKSPACE_STORE.getActiveWorkspace)
const isArchiveLoading = computed(() => UI_STORE.isArchiveLoading)

const isArchiveTab = computed(() => {
  return UI_STORE.currentTab === Tabs.Archive
})

const isBoardTab = computed(() => {
  return UI_STORE.currentTab === Tabs.Board
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

    <TitleBoardSkeleton v-if="BOARD_STORE.areBoardsLoading(activeWorkspace?.id || '')" />
    <TitleBoard v-else-if="isBoardTab" />
    <TitleArchive v-else-if="isArchiveTab" />

    <div class="flex shrink-0 ms-auto items-stretch gap-x-3">
      <SearchSkeleton
        v-if="BOARD_STORE.areBoardsLoading(activeWorkspace?.id || '') || isArchiveLoading"
      />
      <Search v-else />

      <FilterSkeleton
        v-if="isBoardTab && BOARD_STORE.areBoardsLoading(activeWorkspace?.id || '')"
      />
      <Filter v-else-if="isBoardTab" />
    </div>
  </div>
  <!-- End Header -->
</template>
