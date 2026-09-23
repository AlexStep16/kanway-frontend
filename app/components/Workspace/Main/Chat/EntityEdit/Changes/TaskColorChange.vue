<script setup lang="ts">
import { TASK_COLORS_MAP, TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'

interface Color {
  value: (typeof TASK_COLORS_TITLES)[number]
  tone: 'light' | 'medium' | 'dark'
}

const props = defineProps<{
  before: {
    color?: Color | null
  }
  after: {
    color?: Color | null
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasColorChange = computed(() => {
  return (
    props.before.color?.value != props.after.color?.value ||
    props.before.color?.tone != props.after.color?.tone
  )
})

const getColorName = (
  colorName?: (typeof TASK_COLORS_TITLES)[number] | null,
  tone?: 'light' | 'medium' | 'dark',
) => {
  if (!colorName) return 'Без цвета'
  const entry = Object.values(TASK_COLORS_MAP).find(
    (c) => c.name === colorName && (!tone || c.tone === tone),
  )
  return entry?.ru || colorName
}
</script>

<template>
  <div
    class="flex flex-wrap gap-1"
    v-if="hasColorChange"
  >
    <div
      class="flex items-center flex-wrap gap-1 text-xs"
      :class="baseBlockBeforeClasses"
      v-if="props.before.color"
    >
      <div
        class="size-3.5 rounded-full"
        :style="{
          backgroundColor: getColorByNameAndTone(props.before.color.value, props.before.color.tone),
        }"
      ></div>
      <span>{{ getColorName(props.before.color.value, props.before.color.tone) }}</span>
    </div>
    <div
      class="flex flex-wrap text-xs"
      :class="baseBlockBeforeClasses"
      v-else
    >
      Нет цвета
    </div>

    <div
      class="flex items-center flex-wrap gap-1 text-xs"
      :class="baseBlockAfterClasses"
      v-if="after.color"
    >
      <div
        class="size-3.5 rounded-full"
        :style="{
          backgroundColor: getColorByNameAndTone(after.color.value, after.color.tone),
        }"
      ></div>
      <span>{{ getColorName(after.color.value, after.color.tone) }}</span>
    </div>
    <div
      class="flex flex-wrap text-xs"
      :class="baseBlockAfterClasses"
      v-else
    >
      Нет цвета
    </div>
  </div>
</template>
