<script setup lang="ts">
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  title: string
  stateClasses: Record<string, boolean>
  items: ITextValue[]
}>()
</script>

<template>
  <div class="flex flex-col gap-y-1 transition-all duration-300 cursor-pointer select-none min-w-0">
    <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
      <slot name="icon" />
      <span
        class="shrink-0"
        :class="stateClasses"
      >
        {{ title }}
      </span>
    </div>

    <div class="ml-5">
      <ul
        v-if="items.length"
        class="flex flex-col gap-y-1 max-h-48 overflow-auto"
      >
        <li
          v-for="(item, index) in items"
          :key="index"
          class="flex items-center gap-x-1 relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
        >
          <span
            class="shrink-0"
            v-if="item.text"
            >{{ item.text }}</span
          >
          <Badge
            variant="outline"
            class="min-w-0 text-primary truncate"
            v-if="item.value"
          >
            <span class="truncate">{{ item.value }}</span>
          </Badge>
        </li>
      </ul>

      <slot name="actions" />
    </div>
  </div>
</template>
