<script lang="ts" setup>
defineProps<{
  size?: number
}>()

const availableColors = [
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-blue-500',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-gray-400',
]
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-md"
      :class="{
        'size-7': !size,
        [`size-${size}`]: size,
        [color]: true,
      }"
      v-for="color in availableColors"
      :key="color"
    >
      <slot></slot>
    </button>
  </div>
</template>
