<script setup lang="ts">
import RecoverButtons from '@components/Workspace/Main/Archive/RecoverButtons.vue'
import { SquareKanban } from 'lucide-vue-next'

defineProps<{
  name: string
  hideButtons?: boolean
  showInfo?: boolean
}>()
</script>

<template>
  <div
    class="flex flex-col gap-y-2 bg-white border border-gray-200 rounded-md min-w-60 max-w-90 py-2 px-3 overflow-hidden"
  >
    <!-- Info -->
    <div class="flex items-center gap-x-2" v-if="showInfo">
      <div class="flex items-center gap-x-1 text-gray-500">
        <SquareKanban class="size-3" /><span class="text-xs">Личная</span>
      </div>
    </div>
    <span class="text-gray-800 text-sm overflow-hidden shrink-1 break-words">{{ name }}</span>

    <RecoverButtons v-if="!hideButtons" />
  </div>
</template>
