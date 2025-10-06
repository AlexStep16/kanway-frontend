<script setup lang="ts">
import { useWorkspaceStore } from '@/stores/workspace'
import { useTipsStore } from '@/stores/tips'

const WORKSPACE_STORE = useWorkspaceStore()
const TIPS_STORE = useTipsStore()
</script>

<template>
  <div v-show="TIPS_STORE.currentTip" class="size-full fixed top-0 z-200 left-0 bg-black/50">
    <div
      class="flex flex-col gap-y-3 w-full max-w-80 bg-white shadow-md shadow-gray-400 rounded-md pointer-events-auto p-4 self-start absolute inset-0"
      :ref="(el) => (WORKSPACE_STORE.tipRef = el as HTMLElement)"
    >
      <h3 class="text-lg font-medium text-gray-900">{{ TIPS_STORE.currentTip?.title }}</h3>
      <div class="text-sm text-gray-700">
        <p v-html="TIPS_STORE.currentTip?.description"></p>
      </div>
      <div class="flex justify-between items-center">
        <button
          type="button"
          class="text-white bg-blue-500 px-2.5 py-1.5 flex items-center gap-x-1 text-xs font-medium hover:opacity-90 transition-opacity duration-100 rounded-md"
          @click="TIPS_STORE.nextTip"
        >
          {{ TIPS_STORE.currentTip?.buttonNextText }}
        </button>

        <button
          type="button"
          class="text-blue-500 text-xs font-medium hover:text-blue-600 transition-opacity duration-100"
          @click="TIPS_STORE.skip"
        >
          Пропустить
        </button>
      </div>
    </div>
  </div>
</template>
