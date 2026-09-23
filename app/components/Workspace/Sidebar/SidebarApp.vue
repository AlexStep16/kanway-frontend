<script setup lang="ts">
import WorkspaceSwitcher from '~/components/Workspace/Sidebar/SidebarWorkspaceSwitcher.vue'
import NavMain from '~/components/Workspace/Sidebar/SidebarNavMain.vue'
import NavSecondary from '~/components/Workspace/Sidebar/SidebarNavSecondary.vue'
import NavUser from '~/components/Workspace/Sidebar/SidebarNavUser.vue'
import NavUsage from '~/components/Workspace/Sidebar/SidebarNavUsage.vue'
import type { SidebarProps } from '~/components/ui/sidebar'

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
