<script lang="ts" setup>
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'

defineProps<{
  items: ITextValue[]
}>()
</script>

<template>
  <ul
    v-if="items.length"
    class="flex flex-col gap-y-1 max-h-48 overflow-auto custom-scrollbar"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center gap-x-1 text-xs relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
    >
      <span
        class="shrink-0"
        v-if="item.text"
        >{{ item.text }}</span
      >
      <Badge
        variant="outline"
        class="min-w-0 text-primary truncate shrink"
        v-if="item.value"
      >
        <span class="truncate">{{ item.value }}</span>
      </Badge>
    </li>
  </ul>
</template>
