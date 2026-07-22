<script setup lang="ts">
import { Settings, Archive } from 'lucide-vue-next'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar'
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()

const { isMobile, toggleSidebar } = useSidebar()

const handleSelectArchive = () => {
  uiStore.selectArchive()

  if (isMobile.value) {
    toggleSidebar()
  }
}

const handleSelectSettings = () => {
  uiStore.selectSettings()

  if (isMobile.value) {
    toggleSidebar()
  }
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem
          class="cursor-default"
          title="Архив"
        >
          <SidebarMenuButton
            @click="handleSelectArchive"
            :is-active="uiStore.isArchiveTabSelected"
            as-child
          >
            <div class="flex gap-x-2">
              <Archive class="size-3" />
              <span>Архив</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem
          class="cursor-default"
          title="Настройки"
        >
          <SidebarMenuButton
            @click="handleSelectSettings"
            :is-active="uiStore.isSettingsTabSelected"
            as-child
          >
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
