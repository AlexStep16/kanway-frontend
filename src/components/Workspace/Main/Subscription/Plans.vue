<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import PlanCards from './PlanCards.vue'
import { X } from 'lucide-vue-next'

const uiStore = useUIStore()
</script>

<template>
  <div
    id="hs-plans"
    :ref="
      (el) => {
        if (el) uiStore.plansModalRef = el as HTMLElement
      }
    "
    class="hs-overlay [--overlay-backdrop:static] hidden fixed z-90 size-full top-0 start-0 overflow-y-auto pointer-events-none"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="flex relative flex-col items-center w-auto bg-white rounded-md pointer-events-auto shadow-xl py-8 px-10"
      >
        <button
          class="absolute right-4 top-4 transition-colors duration-100 text-gray-400 hover:bg-gray-200 p-1 rounded-full"
          type="button"
          @click="uiStore.closePlansModal()"
        >
          <X class="size-5" />
        </button>
        <h1 class="text-3xl text-gray-800 font-bold">Доступные планы</h1>
        <p class="text-gray-600 text-sm">Выберите подходящий план для ваших нужд.</p>

        <PlanCards :isOneRow="true" :isHeightIncreased="true" class="mt-8" />
      </div>
    </div>
  </div>
</template>
