<script setup lang="ts">
defineProps<{
  text: string
  date: string
}>()
</script>

<template>
  <div class="w-full flex flex-col justify-start items-end gap-y-1 group/bubble">
    <div class="flex items-end justify-end gap-x-2 w-full">
      <div class="rounded-lg rounded-br-none bg-primary/20 p-3 max-w-[90%] sm:max-w-lg">
        <p class="text-sm text-foreground">
          {{ text }}
        </p>
      </div>
    </div>
    <div
      class="flex items-center justify-start opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-100 gap-x-1"
    >
      <span class="text-xs text-gray-500">{{ date }}</span>
    </div>
  </div>
</template>
