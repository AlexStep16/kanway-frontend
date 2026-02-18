<script setup lang="ts">
import { Settings, Archive } from 'lucide-vue-next'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem class="cursor-default" title="Архив">
          <SidebarMenuButton @click="uiStore.selectArchive()" as-child>
            <div class="flex gap-x-2">
              <Archive class="size-3" />
              <span>Архив</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem class="cursor-default" title="Настройки">
          <SidebarMenuButton @click="uiStore.openSettingsModal()" as-child>
            <div class="flex gap-x-2">
              <Settings class="size-3" />
              <span>Настройки</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
