<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import WorkspaceSwitcher from '@/components/Workspace/Sidebar/WorkspaceSwitcher.vue'
import NavMain from '@/components/Workspace/Sidebar/NavMain.vue'
import NavSecondary from '@/components/Workspace/Sidebar/NavSecondary.vue'
import NavUser from '@/components/Workspace/Sidebar/NavUser.vue'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import NavUsage from './NavUsage.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
})
</script>

<template>
  <Sidebar class="p-1" v-bind="props">
    <SidebarHeader class="p-3 pb-2">
      <WorkspaceSwitcher />
    </SidebarHeader>
    <SidebarContent>
      <NavMain />
      <NavSecondary class="mt-auto px-3" />
      <NavUsage class="px-3" />
    </SidebarContent>
    <SidebarFooter class="p-3 pt-2">
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
