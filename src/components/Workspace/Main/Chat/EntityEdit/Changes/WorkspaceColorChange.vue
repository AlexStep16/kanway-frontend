<script setup lang="ts">
import { AvailableColors } from '@/enums/AvailableColors'
import { Nullable } from '@/types/utils'
import { computed } from 'vue'

const props = defineProps<{
  before: {
    color?: Nullable<AvailableColors>
  }
  after: {
    color?: Nullable<AvailableColors>
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasColorChange = computed(() => {
  return props.before.color != props.after.color
})

const getColorName = (color?: Nullable<AvailableColors>) => {
  if (!color) return 'Без цвета'

  if (color === '#ff6467') return 'Красный'
  if (color === '#fdc700') return 'Желтый'
  if (color === '#05df72') return 'Зеленый'
  if (color === '#3b82f6') return 'Синий'
  if (color === '#7c86ff') return 'Фиолетовый'
  if (color === '#cfbbff') return 'Розовый'
  if (color === '#fb64b6') return 'Маджента'
  if (color === '#99a1af') return 'Серый'
}
</script>

<template>
  <div class="flex flex-wrap gap-1" v-if="hasColorChange">
    <div
      class="flex items-center flex-wrap gap-1 text-xs"
      :class="baseBlockBeforeClasses"
      v-if="before.color"
    >
      <div
        class="size-3.5 rounded-full"
        :style="{
          backgroundColor: before.color,
        }"
      ></div>
      <span>{{ getColorName(before.color) }}</span>
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
          backgroundColor: after.color,
        }"
      ></div>
      <span>{{ getColorName(after.color) }}</span>
    </div>
    <div class="flex flex-wrap text-xs" :class="baseBlockAfterClasses" v-else>Нет цвета</div>
  </div>
</template>
