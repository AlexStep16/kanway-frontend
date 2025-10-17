<script setup lang="ts">
import TitleBoard from '@/components/Workspace/Header/TitleBoard.vue'
import TitleArchive from '@/components/Workspace/Header/TitleArchive.vue'
import Search from '@/components/Workspace/Header/Search.vue'
import Filter from '@/components/Workspace/Header/Filter.vue'
import Tabs from '@/enums/TabsEnum'
import { PanelLeftOpen } from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'

const WORKSPACE_STORE = useWorkspaceStore()
</script>

<template>
  <!-- Header -->
  <div
    class="flex items-center whitespace-nowrap w-full gap-x-3 h-[3.625rem] shrink-0 border-b border-gray-200"
  >
    <button
      type="button"
      class="inline-flex p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-100"
      @click="WORKSPACE_STORE.openSidebar()"
      v-if="!WORKSPACE_STORE.isSidebarOpen"
    >
      <PanelLeftOpen class="size-4" />
    </button>
    <TitleBoard v-if="WORKSPACE_STORE.currentTab === Tabs.Board" />
    <TitleArchive v-if="WORKSPACE_STORE.currentTab === Tabs.Archive" />

    <div class="flex ms-auto items-stretch gap-x-3">
      <Search />
      <Filter />
    </div>
  </div>
  <!-- End Header -->
</template>
