<script setup lang="ts">
import ColorButtons from '@/components/Buttons/ColorButtons.vue'

defineProps<{
  color: string
}>()

defineEmits<{
  (e: 'update:color', color: string): void
}>()
</script>

<template>
  <div class="flex flex-col gap-y-1">
    <span class="text-xs font-bold text-gray-500">Цвет</span>
    <ColorButtons :color="color" @selectColor="$emit('update:color', $event)" />
  </div>
</template>
