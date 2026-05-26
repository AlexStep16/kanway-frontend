<script setup lang="ts">
defineProps<{
  filterText?: string
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <div
    :class="[
      'flex items-center gap-x-1 transition-all duration-300 cursor-pointer select-none min-w-0',
      stateClasses,
    ]"
  >
    <span class="shrink-0">Ищу задачи</span>
    <Badge
      variant="outline"
      class="min-w-0 text-primary"
    >
      <span class="truncate">{{ filterText }}</span>
    </Badge>
  </div>
</template>
