<script setup lang="ts">
import RecoverButtons from '@/components/Workspace/Main/Archive/RecoverButtons.vue'

defineProps<{
  name: string
}>()
</script>

<template>
  <div
    class="flex flex-col gap-y-2 bg-white border border-gray-200 rounded-md min-w-60 max-w-90 py-2 px-3 overflow-hidden"
  >
    <span class="text-gray-800 text-sm overflow-hidden shrink-1 break-words">{{ name }}</span>

    <RecoverButtons />
  </div>
</template>
