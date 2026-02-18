<script setup lang="ts">
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar'
import NavMainBoardItem from './NavMainBoardItem.vue'
import NavMainChatItem from './NavMainChatItem.vue'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
</script>

<template>
  <ScrollArea class="h-full w-full px-1">
    <SidebarGroup>
      <SidebarMenu>
        <NavMainBoardItem />
        <NavMainChatItem />
      </SidebarMenu>
    </SidebarGroup>
  </ScrollArea>
</template>
