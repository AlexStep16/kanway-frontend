<script setup lang="ts">
defineProps<{
  pluralizedTitle: string
}>()
</script>

<template>
  <ToolCallCompletedDropdownBase
    :pluralized-title="pluralizedTitle"
    accordion-item-value="delete-archive-completed"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
  </ToolCallCompletedDropdownBase>
</template>
