<script setup lang="ts">
import AppSidebar from '@/components/Workspace/Sidebar/AppSidebar.vue'
import { SidebarProvider } from '@/components/ui/sidebar'

import Board from '@/components/Workspace/Main/Board/Board.vue'
import { useUIStore } from '@/stores/ui'

/** Stores */
import Chat from '../Main/Chat/Chat.vue'
import Archive from '../Main/Archive/Archive.vue'

const uiStore = useUIStore()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <Board v-if="uiStore.isBoardTabSelected" />
    <Archive v-if="uiStore.isArchiveTabSelected" />
    <Chat v-if="uiStore.isChatOpen || uiStore.isChatTabSelected" />
  </SidebarProvider>
</template>
