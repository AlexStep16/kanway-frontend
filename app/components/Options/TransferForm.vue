<script setup lang="ts">
import { ChevronLeft, ArrowRightLeft } from '@lucide/vue'

defineProps<{
  items?: Array<{ id: string; name: string }>
  isProcessing: MaybeRefOrGetter<boolean>
  noItemsText?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', id: string): void
}>()
</script>

<template>
  <div class="flex flex-col shrink-0 w-full p-1 min-w-60 max-w-70">
    <div class="flex items-center justify-center relative py-2 text-gray-700 p-2">
      <button
        type="button"
        class="flex items-center absolute left-0 gap-x-1 p-1 hover:bg-gray-200 transition-colors duration-100 rounded-md"
        @click="emit('close')"
      >
        <ChevronLeft class="size-5" />
      </button>

      <span class="text-custom-sm font-bold">Переместить в</span>
    </div>

    <div class="p-1 space-y-0.5 w-full">
      <template v-if="items && items.length > 0">
        <button
          v-for="target in items"
          :key="target.id"
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 group disabled:pointer-events-none"
          :disabled="toValue(isProcessing)"
          @click="emit('select', target.id)"
        >
          <ArrowRightLeft class="size-4 text-gray-400 group-hover:text-blue-500" />
          <span class="truncate">{{ target.name }}</span>
        </button>
      </template>

      <div
        v-else
        class="text-gray-400 w-full text-center py-4 text-sm"
      >
        {{ noItemsText || 'Нет доступных мест' }}
      </div>
    </div>
  </div>
</template>
