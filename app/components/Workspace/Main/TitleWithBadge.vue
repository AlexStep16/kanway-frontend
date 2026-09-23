<script setup lang="ts">
import NumberBadge from '~/components/Badges/NumberBadge.vue'
import NumberBadgeSkeleton from '~/components/Badges/NumberBadgeSkeleton.vue'

defineProps<{
  title: string
  number: number
  isLoading?: boolean
}>()
</script>

<template>
  <div class="flex items-center text-sm text-gray-500 gap-x-2">
    <span>{{ title }}</span>
    <NumberBadge :number="number" v-if="!isLoading" />
    <NumberBadgeSkeleton v-else />
    <slot></slot>
  </div>
</template>
