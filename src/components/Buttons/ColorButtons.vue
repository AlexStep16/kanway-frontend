<script lang="ts" setup>
import { AvailableColors } from '@enums/AvailableColors'

defineProps<{
  color: AvailableColors
  size?: number
}>()

defineEmits<{
  (e: 'selectColor', color: AvailableColors): void
}>()
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <button
      type="button"
      v-for="availableColor in Object.values(AvailableColors)"
      :key="availableColor"
      class="inline-flex items-center justify-center rounded-md"
      :class="{
        'size-7': !size,
        [`size-${size}`]: size,
        'ring-2 ring-offset-1 ring-blue-500': color === availableColor,
      }"
      :style="{ backgroundColor: availableColor }"
      @click="$emit('selectColor', availableColor)"
    >
      <slot></slot>
    </button>
  </div>
</template>
