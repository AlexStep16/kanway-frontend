<script setup lang="ts">
import { SquareKanban, Copy, Archive } from 'lucide-vue-next'
import Spinner from '@components/Loader/Spinner.vue'
import { computed } from 'vue'

const props = defineProps<{
  name: string
  isStatic?: boolean
  hasCopy?: boolean
  isCopying?: boolean
  hasDelete?: boolean
  isDeleted?: boolean
  isArchiving?: boolean
  parentName?: string
  showInfo?: boolean
}>()

const isCopyAvailable = computed(() => {
  return props.hasCopy && !props.isDeleted
})

const isDeleteAvailable = computed(() => {
  return props.hasDelete && !props.isDeleted
})
</script>

<template>
  <div
    class="flex flex-col relative group/entity gap-y-2 border border-gray-200 p-3 rounded-md min-w-60 cursor-pointer hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
  >
    <!-- Info -->
    <div class="flex items-center gap-x-2" v-if="showInfo">
      <div class="flex items-center gap-x-1 text-gray-500 min-w-0">
        <SquareKanban class="size-3 shrink-0" /><span class="text-xs truncate">{{
          parentName
        }}</span>
      </div>
    </div>
    <div class="flex items-center min-w-0 pr-14 pointer-fine:pr-0">
      <span class="text-gray-800 text-sm overflow-hidden shrink-1 break-words truncate">{{
        name
      }}</span>
      <div
        class="flex items-center absolute right-2 pointer-fine:opacity-0 transition-all pointer-events-none duration-100 top-2"
        :class="{
          'group-hover/entity:opacity-100 group-hover/entity:bg-white pointer-events-auto!':
            isCopyAvailable || isDeleteAvailable,
        }"
        v-if="!isStatic"
      >
        <button
          type="button"
          class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
          title="Копировать"
          @click.stop="$emit('copy')"
          v-if="isCopyAvailable"
        >
          <Spinner v-if="isCopying" class="size-4" />
          <Copy v-else class="size-4" />
        </button>
        <button
          type="button"
          class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
          title="Архивировать"
          v-if="isDeleteAvailable"
          @click.stop="$emit('archive')"
        >
          <Spinner v-if="isArchiving" class="size-4" />
          <Archive v-else class="size-4" />
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>
