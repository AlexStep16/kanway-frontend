<script setup lang="ts">
defineProps<{
  text: string
  date: string
}>()
</script>

<template>
  <div class="w-full flex flex-col justify-start items-end gap-y-1 group/bubble">
    <div class="flex items-end justify-end gap-x-2 w-full">
      <div
        class="rounded-2xl border border-zinc-200/80 rounded-br-none bg-zinc-100/90 p-3.5 max-w-[90%] shadow-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-100"
      >
        <p class="text-sm leading-6 text-zinc-800 dark:text-zinc-100">
          {{ text }}
        </p>
      </div>
    </div>
    <div
      class="flex items-center justify-start opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-100 gap-x-1"
    >
      <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ date }}</span>
    </div>
  </div>
</template>
