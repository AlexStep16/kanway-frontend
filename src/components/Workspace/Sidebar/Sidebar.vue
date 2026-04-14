<script setup lang="ts">
import AppSidebar from '@/components/Workspace/Sidebar/AppSidebar.vue'
import { SidebarProvider } from '@/components/ui/sidebar'

import Board from '@/components/Workspace/Main/Board/Board.vue'
import { useUIStore } from '@/stores/ui'

/** Stores */
import Chat from '../Main/Chat/Chat.vue'
import Archive from '../Main/Archive/Archive.vue'
import { computed } from 'vue'
import { useBoardStore } from '@/stores/board'

const uiStore = useUIStore()
const boardStore = useBoardStore()

const isMainChat = computed(() => {
  return (
    (boardStore.activeBoardId === null && uiStore.isBoardTabSelected) || uiStore.isChatTabSelected
  )
})
const showChat = computed(() => uiStore.isChatOpen || uiStore.isChatTabSelected)
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <Board
      class="transition-[flex] duration-300 min-w-0 overflow-hidden"
      :class="{
        grow: uiStore.isBoardTabSelected,
        'grow-0 w-0 m-0! p-0! opacity-0': !uiStore.isBoardTabSelected,
      }"
    />
    <Archive
      class="transition-[flex] duration-300 min-w-0 overflow-hidden"
      :class="{
        grow: uiStore.isArchiveTabSelected,
        'grow-0 w-0 m-0! p-0! opacity-0': !uiStore.isArchiveTabSelected,
      }"
    />
    <Chat
      class="transition-[flex] duration-300 min-w-0 overflow-hidden"
      :class="{
        'flex-[0_0_520px]': showChat && !isMainChat,
        'flex-1': showChat && isMainChat,
        'flex-[0_0_0px] opacity-0 pointer-events-none': !showChat,
      }"
    />
  </SidebarProvider>
</template>
