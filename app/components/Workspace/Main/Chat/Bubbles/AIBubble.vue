<script setup lang="ts">
defineProps<{
  date?: string
  isContentFullWidth?: boolean
}>()
</script>

<template>
  <div class="w-full flex flex-col justify-start gap-y-2 group/bubble">
    <div class="flex items-end w-full">
      <div
        class="w-full"
        :class="{
          'sm:max-w-lg': !isContentFullWidth,
        }"
      >
        <slot></slot>
      </div>
    </div>

    <slot name="actions"></slot>

    <div
      class="flex items-center justify-start opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-100 gap-x-1"
      v-if="date"
    >
      <span class="text-xs text-zinc-400">{{ date }}</span>
    </div>
  </div>
</template>
