<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

const props = defineProps<{
  pluralizedTitle: string
  stateClasses: Record<string, boolean>
  humanReadableUpdates: ITextValue[]
}>()
</script>

<template>
  <div class="flex flex-col gap-y-1 transition-all duration-300 cursor-pointer select-none min-w-0">
    <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
      <slot name="icon" />
      <span
        class="shrink-0"
        :class="props.stateClasses"
      >
        {{ props.pluralizedTitle }}
      </span>
    </div>

    <ul
      v-if="props.humanReadableUpdates.length"
      class="flex flex-col gap-y-1 max-h-48 overflow-auto ml-5"
    >
      <li
        v-for="(update, index) in props.humanReadableUpdates"
        :key="index"
        class="flex items-center gap-x-1 relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
      >
        <span>{{ update.text }}</span>
        <Badge
          variant="outline"
          class="min-w-0 text-primary"
        >
          {{ update.value }}
        </Badge>
      </li>
    </ul>
  </div>
</template>
