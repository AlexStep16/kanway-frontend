<script setup lang="ts">
defineProps<{
  pluralizedTitle: string
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <ToolCallCompletedDropdownBase
    :pluralized-title="pluralizedTitle"
    accordion-item-value="create-completed"
    :state-classes="stateClasses"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
  </ToolCallCompletedDropdownBase>
</template>
