<script setup lang="ts">
import NumberBadge from '@components/Badges/NumberBadge.vue'

defineProps<{
  title: string
  number: number
}>()
</script>

<template>
  <div class="flex items-center text-sm text-gray-500 gap-x-2">
    <span>{{ title }}</span>
    <NumberBadge :number />
    <slot></slot>
  </div>
</template>
