<script setup lang="ts">
import Tip from '~/components/Tip/Tip.vue'

const uiStore = useUIStore()
</script>

<template>
  <LazyWorkspaceDialog v-if="uiStore.isWorkspaceDialogOpen" />

  <LazyTaskEdit v-if="uiStore.isEditTaskModalOpen" />
  <Tip />
  <LazyMobileSearch v-if="uiStore.isMobileSearchOpen" />
  <LazySupport v-if="uiStore.isSupportModalOpen" />
  <LazyPlans v-if="uiStore.isPlansModalOpen" />
</template>
