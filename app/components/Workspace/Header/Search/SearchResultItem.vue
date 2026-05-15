<template>
  <button
    class="py-2 px-2.5 w-full flex items-center justify-between gap-x-3 hover:bg-gray-100 transition-colors rounded-lg text-left"
    type="button"
  >
    <span class="text-sm text-gray-800 truncate min-w-0 flex-1">
      {{ title }}
    </span>

    <span
      v-if="subtitle"
      class="text-xs text-gray-400 truncate min-w-0 flex-initial max-w-[50%] text-right"
    >
      {{ subtitle }}
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
