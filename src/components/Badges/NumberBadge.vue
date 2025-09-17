<script setup lang="ts">
defineProps<{
  // badge number
  number: number
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-x-1.5 py-0.5 px-1.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500"
    >{{ number }}</span
  >
</template>
