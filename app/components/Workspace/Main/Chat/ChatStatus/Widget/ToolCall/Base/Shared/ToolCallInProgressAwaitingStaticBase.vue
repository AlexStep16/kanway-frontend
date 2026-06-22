<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  title: string
  stateClasses: Record<string, boolean>
  accordionItemValue: string
  items: ITextValue[]
}>()
</script>

<template>
  <div class="flex flex-col gap-y-1 transition-all duration-300 select-none min-w-0">
    <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
      <slot name="icon" />
      <span
        class="shrink-0"
        :class="stateClasses"
      >
        {{ title }}
      </span>
    </div>

    <div class="ml-5 mt-1 flex flex-col gap-y-2">
      <ToolCallFiltersList :items="items" />
      <slot name="actions" />
    </div>
  </div>
</template>
