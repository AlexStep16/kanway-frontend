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
        class="rounded-2xl border border-zinc-200/80 rounded-br-none bg-zinc-100/90 px-3.5 py-2 max-w-[90%] shadow-sm text-zinc-900"
      >
        <p class="text-sm leading-6 text-zinc-800">
          {{ text }}
        </p>
      </div>
    </div>
    <div
      class="flex items-center justify-start opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-100 gap-x-1"
    >
      <span class="text-xs text-zinc-400">{{ date }}</span>
    </div>
  </div>
</template>
