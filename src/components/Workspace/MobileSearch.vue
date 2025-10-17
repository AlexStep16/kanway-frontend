<script setup lang="ts">
import { ref } from 'vue'
import SearchBox from './Header/SearchBox.vue'

const showEmptyInputMessage = ref(true)

function onSearchInput(value: string) {
  showEmptyInputMessage.value = value.length === 0
}
</script>

<template>
  <div
    id="hs-mobile-search"
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-90 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-mobile-search-label"
  >
    <div class="size-full flex items-start justify-center p-2 sm:p-4">
      <div class="flex flex-col w-full bg-white min-h-70 p-3 rounded-md pointer-events-auto">
        <div>
          <SearchBox @input="onSearchInput" :isAlwaysVisible="true" />
        </div>

        <div class="size-full flex items-center justify-center grow-1" v-if="showEmptyInputMessage">
          <span class="text-gray-400 text-sm">Введите текст чтобы начать поиск...</span>
        </div>
      </div>
    </div>
  </div>
</template>
