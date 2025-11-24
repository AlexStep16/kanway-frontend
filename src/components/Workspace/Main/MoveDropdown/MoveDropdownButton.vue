<script setup lang="ts">
import { Layers } from 'lucide-vue-next'

defineProps<{
  title: string
  disabled?: boolean
}>()
</script>

<template>
  <button
    id="hs-dropdown-move"
    type="button"
    class="min-w-0 py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 hover:bg-gray-200 transition-colors duration-100 text-gray-500 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-label="Dropdown"
    :disabled="disabled"
  >
    <div class="flex items-center gap-x-2 min-w-0">
      <Layers class="size-4 shrink-0" />
      <span class="truncate min-w-0">{{ title }}</span>
    </div>
    <svg
      class="hs-dropdown-open:rotate-180 size-4 transition-transform duration-200 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      v-if="!disabled"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
</template>
