<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'closeEdit'): void
}>()

function closeEdit() {
  emit('closeEdit')
}
</script>

<template>
  <div class="flex flex-col shrink-0 w-full min-w-75 p-1">
    <div class="flex items-center justify-center relative py-2 text-gray-700 p-2">
      <button
        type="button"
        class="flex items-center absolute left-0 gap-x-1 p-1 hover:bg-gray-200 transition-colors duration-100 rounded-md"
        @click="closeEdit"
      >
        <ChevronLeft class="size-5" />
      </button>

      <span class="text-custom-sm font-bold">{{ title }}</span>
    </div>

    <slot />
  </div>
</template>
