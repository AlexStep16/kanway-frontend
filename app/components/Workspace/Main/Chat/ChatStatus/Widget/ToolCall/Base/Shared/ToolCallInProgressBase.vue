<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  title: string
  stateClasses: Record<string, boolean>
  items?: ITextValue[]
  badge?: string
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

      <Badge
        variant="outline"
        class="min-w-0 text-primary truncate shrink"
        v-if="badge"
      >
        <span class="truncate">{{ badge }}</span>
      </Badge>
    </div>

    <div
      class="ml-5"
      v-if="items && items.length"
    >
      <ToolCallFiltersList :items="items" />
    </div>
  </div>
</template>
