<script setup lang="ts">
import AppSidebar from '@/components/Workspace/Sidebar/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

import Board from '@/components/Workspace/Main/Board/Board.vue'
import Tabs from '@/enums/TabsEnum'
import { useUIStore } from '@/stores/ui'
import Archive from '@components/Workspace/Main/Archive/Archive.vue'
import Start from '@components/Workspace/Main/Start.vue'

/** Stores */
import TitleBoard from '../Header/TitleBoard.vue'
import Search from './Search.vue'
import Chat from '../Main/Chat/Chat.vue'
import { useChatStore } from '@/stores/chat'

const uiStore = useUIStore()
const chatStore = useChatStore()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex justify-between h-16 shrink-0 items-center gap-2 px-4">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-0 data-[orientation=vertical]:h-4" />
          <TitleBoard />
        </div>
        <Search />
      </header>
      <Separator />
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-y-auto">
        <Board v-if="uiStore.currentTab === Tabs.Board" />
        <Archive v-else-if="uiStore.currentTab === Tabs.Archive" />
        <Start v-else />
      </div>
    </SidebarInset>
    <Chat v-if="chatStore.activeChat || uiStore.isChatOpen" />
  </SidebarProvider>
</template>
