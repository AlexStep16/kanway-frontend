<script setup lang="ts">
defineProps<{
  pluralizedTitle: string
  filterText?: string
}>()
</script>

<template>
  <ToolCallCompletedStaticBase :pluralized-title="pluralizedTitle">
    <template #icon>
      <slot name="icon" />
    </template>
  </ToolCallCompletedStaticBase>
</template>
