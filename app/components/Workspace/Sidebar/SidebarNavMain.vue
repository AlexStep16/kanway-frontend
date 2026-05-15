<script setup lang="ts">
import SidebarNavMainBoardItem from './SidebarNavMainBoardItem.vue'
import SidebarNavMainChatItem from './SidebarNavMainChatItem.vue'
</script>

<template>
  <ScrollArea class="h-full w-full px-1">
    <SidebarGroup>
      <SidebarMenu>
        <SidebarNavMainBoardItem />
        <SidebarNavMainChatItem />
      </SidebarMenu>
    </SidebarGroup>
  </ScrollArea>
</template>
