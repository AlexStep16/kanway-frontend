<script setup lang="ts">
import { SquarePen, SquareKanban } from 'lucide-vue-next'
</script>

<template>
  <div class="flex gap-x-1 items-center text-lg font-semibold text-gray-800 focus:outline-hidden">
    <SquareKanban class="size-5" />

    <button
      type="button"
      class="flex gap-x-2 p-1 items-center rounded-sm hover:bg-gray-100 transition-colors duration-100 group"
    >
      Спорт
      <SquarePen
        class="size-4 text-gray-400 group-hover:text-gray-500 transition-colors duration-100"
      />
    </button>
  </div>
</template>
