<script setup lang="ts">
import SidebarNavMainBoardItem from './SidebarNavMainBoardItem.vue'
import SidebarNavMainChatItem from './SidebarNavMainChatItem.vue'
</script>

<template>
  <div class="h-full flex flex-col px-1 overflow-hidden">
    <SidebarGroup class="flex-1 flex flex-col min-h-0 py-0">
      <SidebarMenu class="flex-1 flex flex-col min-h-0">
        <div class="max-h-[50%] flex flex-col min-h-0">
          <SidebarNavMainBoardItem />
        </div>
        <div class="flex-1 flex flex-col min-h-0">
          <SidebarNavMainChatItem />
        </div>
      </SidebarMenu>
    </SidebarGroup>
  </div>
</template>
