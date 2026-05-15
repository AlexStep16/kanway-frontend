<script setup lang="ts">
import SidebarApp from '~/components/Workspace/Sidebar/SidebarApp.vue'
import Board from '~/components/Workspace/Main/Board/Board.vue'

/** Stores */
import Chat from '../Main/Chat/Chat.vue'
import Archive from '../Main/Archive/Archive.vue'

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
    <SidebarApp />
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
      class="transition-[flex] duration-300 min-w-0 overflow-hidden ml-0!"
      :class="{
        'grow lg:flex-[0_0_520px]': showChat && !isMainChat,
        'flex-1': showChat && isMainChat,
        'flex-[0_0_0px] opacity-0 pointer-events-none m-0!': !showChat,
      }"
    />
  </SidebarProvider>
</template>
