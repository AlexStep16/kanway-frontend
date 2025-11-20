<script setup lang="ts">
import { X } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'connectRef', el: HTMLElement): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <div
    id="delete-user-modal"
    class="hs-overlay hidden size-full fixed top-0 start-0 z-120 overflow-x-hidden overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    :ref="(el: any) => emit('connectRef', el as HTMLElement)"
    aria-labelledby="delete-user-modal-label"
    data-hs-overlay-options='{
      "isClosePrev": false
    }'
  >
    <div
      class="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center"
    >
      <div class="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
        <div
          class="w-full py-2 bg-white cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm"
        >
          <button
            class="transition-colors duration-100 text-gray-400 hover:bg-gray-200 p-1 rounded-full absolute top-2 right-2"
            type="button"
            aria-label="Закрыть"
            data-hs-overlay="#delete-user-modal"
          >
            <X class="size-5" />
          </button>

          <div class="space-y-2 p-2">
            <div class="p-4 space-y-2 text-center dark:text-white">
              <h2 class="text-lg font-bold tracking-tight" id="page-action.heading">
                Удаление аккаунта
              </h2>

              <p class="text-gray-500 text-sm">Вы уверены, что хотите это сделать?</p>
            </div>
          </div>

          <div class="space-y-2">
            <div
              aria-hidden="true"
              class="border-t border-gray-300 dark:border-gray-700 px-2"
            ></div>

            <div class="px-6 py-2">
              <div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                <button
                  type="button"
                  class="py-2 px-3 text-xs self-start font-semibold rounded-md border border-gray-200 bg-gray-100 text-gray-800 transition-colors duration-100 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                  data-hs-overlay="#delete-user-modal"
                >
                  Отмена
                </button>

                <button
                  type="button"
                  class="py-2 px-3 text-xs self-start font-semibold rounded-md border border-transparent bg-red-500 text-white transition-colors duration-100 hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                  @click="$emit('confirm')"
                  data-hs-overlay="#delete-user-modal"
                >
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
