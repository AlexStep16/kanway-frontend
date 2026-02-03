<script setup lang="ts">
import { SquareKanban, Copy, Archive } from 'lucide-vue-next'
import Spinner from '@components/Loader/Spinner.vue'
import { computed } from 'vue'

const props = defineProps<{
  id: string
  name: string
  hasSelected?: boolean
  isSelected?: boolean
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
      <span class="text-gray-800 text-sm overflow-hidden shrink-1 grow-1 break-words truncate">{{
        name
      }}</span>
      <div
        class="flex items-center cursor-pointer relative transition-all"
        @click.stop="$emit('toggle-select', id)"
        v-if="hasSelected"
      >
        <input
          type="checkbox"
          class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-600"
          id="payment-method-card-2"
          :checked="isSelected"
        />
        <span
          class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
      </div>
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
