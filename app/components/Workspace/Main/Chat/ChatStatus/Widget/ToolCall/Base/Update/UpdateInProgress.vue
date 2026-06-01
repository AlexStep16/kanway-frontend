<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  pluralizedTitle: string
  stateClasses: Record<string, boolean>
  humanReadableUpdates: ITextValue[]
}>()
</script>

<template>
  <ToolCallInProgressBase
    :title="pluralizedTitle"
    :state-classes="stateClasses"
    :items="humanReadableUpdates"
  >
    <template #icon>
      <slot name="icon" />
    </template>
  </ToolCallInProgressBase>
</template>
