<script setup lang="ts">
import Spinner from '@components/Loader/Spinner.vue'

defineProps<{
  isProcessing?: boolean
  text: string
}>()
</script>

<template>
  <button
    type="submit"
    class="w-full py-3 px-4 inline-flex relative justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
    :disabled="isProcessing"
  >
    <Spinner class="size-4 absolute" v-if="isProcessing" />
    <span :class="{ 'opacity-0': isProcessing }">{{ text }}</span>
  </button>
</template>
