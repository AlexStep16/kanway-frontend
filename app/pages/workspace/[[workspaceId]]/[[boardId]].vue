<script setup lang="ts">
const uiStore = useUIStore()
const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const isBoardTabShown = computed(() => uiStore.isBoardTabSelected && activeBoardId.value !== null)

definePageMeta({
  authOnly: true,
  middleware: ['workspace'],
})
</script>

<template>
  <Board v-if="isBoardTabShown" />
</template>
