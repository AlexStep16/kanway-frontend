<script setup lang="ts">
import { ChevronLeft, ArrowRightLeft } from 'lucide-vue-next'

// Упрощаем пропсы. Теперь это просто список целей.
defineProps<{
  items?: Array<{ id: string; name: string }>
  isProcessing: boolean
  noItemsText?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', id: string): void
}>()
</script>

<template>
  <div class="flex flex-col shrink-0 w-full p-1 min-w-60 max-w-70">
    <!-- Заголовок с кнопкой Назад -->
    <div class="flex items-center justify-center relative py-2 text-gray-700 px-2">
      <button
        type="button"
        class="absolute left-0 p-1 hover:bg-gray-200 transition-colors rounded-md"
        @click="emit('close')"
      >
        <ChevronLeft class="size-5" />
      </button>
      <span class="text-sm font-bold">Переместить в</span>
    </div>

    <!-- Список элементов -->
    <div class="p-1 space-y-0.5 w-full">
      <template v-if="items && items.length > 0">
        <button
          v-for="target in items"
          :key="target.id"
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 group"
          :disabled="isProcessing"
          @click="emit('select', target.id)"
        >
          <ArrowRightLeft class="size-4 text-gray-400 group-hover:text-blue-500" />
          <span class="truncate">{{ target.name }}</span>
        </button>
      </template>

      <!-- Состояние, когда некуда перемещать -->
      <div v-else class="text-gray-400 w-full text-center py-4 text-sm">
        {{ noItemsText || 'Нет доступных мест' }}
      </div>
    </div>
  </div>
</template>
