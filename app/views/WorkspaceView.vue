<script setup lang="ts">
import Tip from '~/components/Tip/Tip.vue'
import MobileSearch from '~/components/Workspace/MobileSearch.vue'
import Support from '~/components/Workspace/Main/Support/Support.vue'
import Plans from '~/components/Workspace/Main/Subscription/Plans.vue'
import TaskEdit from '~/components/Workspace/Main/Task/Edit/TaskEdit.vue'
import WorkspaceDialog from '~/components/Workspace/WorkspaceDialog.vue'

const uiStore = useUIStore()
</script>

<template>
  <WorkspaceDialog />

  <TaskEdit v-if="uiStore.isEditTaskModalOpen" />
  <Tip />
  <MobileSearch v-if="uiStore.isMobileSearchOpen" />
  <Support v-if="uiStore.isSupportModalOpen" />
  <Plans v-if="uiStore.isPlansModalOpen" />
</template>
