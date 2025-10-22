<script setup lang="ts">
import Spinner from '@components/Loader/Spinner.vue'

defineProps<{
  currentToolStatus: string
}>()
</script>

<template>
  <div class="relative overflow-hidden w-full">
    <TransitionGroup tag="div" name="slide-up">
      <div
        class="flex items-center justify-start gap-x-2"
        v-for="status in [currentToolStatus]"
        :key="status"
      >
        <Spinner class="size-4" />
        <span class="text-sm text-gray-700">{{ currentToolStatus }}...</span>
      </div>
    </TransitionGroup>
  </div>
</template>
