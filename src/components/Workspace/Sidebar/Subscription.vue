<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { Gem } from 'lucide-vue-next'

const uiStore = useUIStore()
</script>

<template>
  <div class="flex flex-col p-3 bg-gray-50 border border-gray-200 shadow-2xs rounded-md">
    <div class="flex flex-auto flex-col justify-center items-center">
      <h3 class="flex items-center gap-x-2 font-semibold text-gray-800">
        <Gem class="size-4" />
        Улучшить аккаунт
      </h3>
      <p class="text-xs text-center mt-2 text-gray-700">
        Используйте максимум возможностей ИИ для управления вашими задачами.
      </p>
      <button
        type="button"
        class="text-xs text-white py-2 mt-2 px-3 w-full items-center gap-x-2 font-medium rounded-md bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] disabled:opacity-50 disabled:pointer-events-none"
        @click="uiStore.openPlansModal()"
      >
        Выбрать план
      </button>
    </div>
  </div>
</template>
