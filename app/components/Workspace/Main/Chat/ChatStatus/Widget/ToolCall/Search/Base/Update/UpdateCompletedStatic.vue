<script setup lang="ts">
defineProps<{
  pluralizedTitle: string
}>()
</script>

<template>
  <div
    class="flex items-center gap-x-1 transition-all duration-300 cursor-pointer select-none min-w-0"
  >
    <span class="shrink-0"> {{ pluralizedTitle }} </span>
  </div>
</template>
