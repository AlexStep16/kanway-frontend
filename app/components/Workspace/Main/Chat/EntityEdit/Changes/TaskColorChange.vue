<script setup lang="ts">
import { COLOR_NAMES_MAP } from '~/constants/COLOR_NAMES_MAP'
import { TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'

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

const getColorName = (colorName?: (typeof TASK_COLORS_TITLES)[number] | null) => {
  if (!colorName) return 'Без цвета'

  return COLOR_NAMES_MAP[colorName] || colorName
}
</script>

<template>
  <div class="flex flex-wrap gap-1" v-if="hasColorChange">
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
      <span>{{ getColorName(props.before.color.value) }}</span>
    </div>
    <div class="flex flex-wrap text-xs" :class="baseBlockBeforeClasses" v-else>Нет цвета</div>

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
      <span>{{ getColorName(after.color.value) }}</span>
    </div>
    <div class="flex flex-wrap text-xs" :class="baseBlockAfterClasses" v-else>Нет цвета</div>
  </div>
</template>
