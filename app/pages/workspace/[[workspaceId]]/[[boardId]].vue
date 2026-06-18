<script setup lang="ts">
const uiStore = useUIStore()
const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const isBoardTabShown = computed(() => uiStore.isBoardTabSelected && activeBoardId.value !== null)
</script>

<template>
  <Board
    class="transition-[flex] duration-300 min-w-0 overflow-hidden"
    :class="{
      grow: isBoardTabShown,
      'grow-0 w-0 m-0! p-0! opacity-0': !isBoardTabShown,
    }"
  />
</template>
