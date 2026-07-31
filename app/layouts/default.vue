<script setup lang="ts">
const uiStore = useUIStore()
</script>

<template>
  <LazySupport v-if="uiStore?.isSupportModalOpen" />
  <slot />
</template>
