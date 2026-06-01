<script setup lang="ts">
defineProps<{
  pluralizedTitle: string
}>()
</script>

<template>
  <ToolCallCompletedDropdownBase
    :pluralized-title="pluralizedTitle"
    accordion-item-value="update-completed"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
  </ToolCallCompletedDropdownBase>
</template>
