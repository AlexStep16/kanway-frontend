<script setup lang="ts">
defineProps<{
  pluralizedTitle: string
  filterText?: string
}>()
</script>

<template>
  <div
    class="flex items-center gap-x-1 transition-all duration-300 cursor-pointer select-none min-w-0"
  >
    <slot name="icon" />
    <span class="shrink-0"> {{ pluralizedTitle }} </span>
  </div>
</template>
