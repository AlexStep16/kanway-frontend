<script setup lang="ts">
import TitleBoard from '@components/Workspace/Header/TitleBoard.vue'
import TitleArchive from '@components/Workspace/Header/TitleArchive.vue'
import Search from '@components/Workspace/Header/Search.vue'
import Filter from '@components/Workspace/Header/Filter.vue'
import Tabs from '@/enums/TabsEnum'
import { PanelLeftOpen } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import { computed } from 'vue'

const UI_STORE = useUIStore()

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
    <TitleBoard v-if="isBoardTab" />
    <TitleArchive v-if="isArchiveTab" />

    <div class="flex shrink-0 ms-auto items-stretch gap-x-3">
      <Search />
      <Filter v-if="!isArchiveTab" />
    </div>
  </div>
  <!-- End Header -->
</template>
