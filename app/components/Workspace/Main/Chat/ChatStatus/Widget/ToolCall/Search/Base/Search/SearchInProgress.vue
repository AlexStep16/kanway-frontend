<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

const props = defineProps<{
  stateClasses: Record<string, boolean>
  humanReadableFilters: ITextValue[]
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
        Ищу задачи
      </span>
    </div>

    <ul
      v-if="props.humanReadableFilters.length"
      class="flex flex-col gap-y-1 max-h-48 overflow-auto ml-5"
    >
      <li
        v-for="(filter, index) in props.humanReadableFilters"
        :key="index"
        class="flex items-center gap-x-1 relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
      >
        <span>{{ filter.text }}</span>
        <Badge
          variant="outline"
          class="min-w-0 text-primary"
        >
          {{ filter.value }}
        </Badge>
      </li>
    </ul>
  </div>
</template>
