<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  text: string
}>()
</script>

<template>
  <div class="w-full flex flex-col justify-start items-end gap-y-1 group/bubble">
    <div class="flex items-end gap-x-2">
      <div class="rounded-lg rounded-br-none bg-blue-100 p-3 max-w-lg">
        <p class="text-sm text-gray-700">
          {{ text }}
        </p>
      </div>
      <div
        class="size-8 rounded-full bg-green-700 flex items-center justify-center font-medium text-white"
      >
        A
      </div>
    </div>
    <div
      class="flex items-center pe-10 justify-start opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-100 gap-x-1"
    >
      <span class="text-xs text-gray-500">18 ноября в 15:00</span>
    </div>
  </div>
</template>
