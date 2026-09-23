<script setup lang="ts">
defineProps<{
  stateClasses: Record<string, boolean>
  pluralizedTitle: string
  badge?: string
}>()
</script>

<template>
  <ToolCallInProgressBase
    :title="pluralizedTitle"
    :state-classes="stateClasses"
    :badge="badge"
  >
    <template #icon>
      <slot name="icon" />
    </template>
  </ToolCallInProgressBase>
</template>
