<script setup lang="ts">
import BoardModel from '@models/BoardModel'
import WorkspaceModel from '@models/WorkspaceModel'
import { Archive, ChevronLeft } from 'lucide-vue-next'
import Spinner from '@components/Loader/Spinner.vue'

defineProps<{
  otherItems: Array<WorkspaceModel | BoardModel>
  isProcessing: boolean
  isItemMoving: boolean
  noItemsText: string
}>()

const emit = defineEmits<{
  (e: 'closeTransfer'): void
  (e: 'moveItem', id: string): void
}>()

function closeTransfer() {
  emit('closeTransfer')
}
</script>

<template>
  <div class="flex flex-col shrink-0 w-full p-1 min-w-60 max-w-70">
    <div class="flex items-center justify-center relative py-2 text-gray-700 p-2">
      <button
        type="button"
        class="flex items-center absolute left-0 gap-x-1 p-1 hover:bg-gray-200 transition-colors duration-100 rounded-md"
        @click="closeTransfer"
      >
        <ChevronLeft class="size-5" />
      </button>

      <span class="text-custom-sm font-bold">Переместить в</span>
    </div>

    <div class="p-1 space-y-0.5 shrink-0 w-full">
      <button
        class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 group disabled:pointer-events-none"
        v-for="item in otherItems"
        :key="item.id"
        :disabled="isProcessing"
        @click="$emit('moveItem', item.id)"
      >
        <div class="absolute size-full flex items-center gap-x-2" v-if="isItemMoving">
          <Spinner class="size-4" />

          Перемещение...
        </div>
        <div
          class="flex items-center gap-x-2 group-disabled:opacity-70"
          :class="{ 'opacity-0!': isItemMoving }"
        >
          <Archive class="size-4" />

          {{ item.name }}
        </div>
      </button>

      <div class="text-gray-500 w-full text-center py-2 text-sm" v-if="otherItems.length === 0">
        {{ noItemsText }}
      </div>
    </div>
  </div>
</template>
