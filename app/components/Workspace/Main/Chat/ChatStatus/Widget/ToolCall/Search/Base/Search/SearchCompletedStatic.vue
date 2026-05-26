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
    <span class="shrink-0"> {{ pluralizedTitle }} </span>
    <Badge
      variant="outline"
      class="min-w-0 text-primary"
    >
      <span class="truncate">{{ filterText }}</span>
    </Badge>
  </div>
</template>
