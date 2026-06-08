<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  pluralizedTitle: string
  stateClasses: Record<string, boolean>
  humanReadableFilters: ITextValue[]
}>()
</script>

<template>
  <ToolCallInProgressAwaitingBase
    :title="pluralizedTitle"
    :state-classes="stateClasses"
    :items="humanReadableFilters"
    accordion-item-value="clone-in-progress-awaiting"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <template #log>
      <slot name="log" />
    </template>
    <template #actions>
      <slot name="actions" />
    </template>
  </ToolCallInProgressAwaitingBase>
</template>
