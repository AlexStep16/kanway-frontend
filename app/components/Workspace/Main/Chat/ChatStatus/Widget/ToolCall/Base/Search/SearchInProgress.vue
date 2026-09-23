<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  stateClasses: Record<string, boolean>
  humanReadableFilters: ITextValue[]
  pluralizedTitle: string
}>()
</script>

<template>
  <ToolCallInProgressBase
    :title="pluralizedTitle"
    :state-classes="stateClasses"
    :items="humanReadableFilters"
  >
    <template #icon>
      <slot name="icon" />
    </template>
  </ToolCallInProgressBase>
</template>
