<script setup lang="ts">
const uiStore = useUIStore()

const isBoardTabShown = computed(() => uiStore.isBoardTabSelected)

definePageMeta({
  authOnly: true,
  middleware: ['workspace'],
})
</script>

<template>
  <Board v-if="isBoardTabShown" />
</template>
