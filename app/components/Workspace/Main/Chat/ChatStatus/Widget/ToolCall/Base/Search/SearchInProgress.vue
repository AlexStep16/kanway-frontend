<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  stateClasses: Record<string, boolean>
  humanReadableFilters: ITextValue[]
}>()
</script>

<template>
  <ToolCallInProgressBase
    title="Ищу задачи"
    :state-classes="stateClasses"
    :items="humanReadableFilters"
  >
    <template #icon>
      <slot name="icon" />
    </template>
  </ToolCallInProgressBase>
</template>
